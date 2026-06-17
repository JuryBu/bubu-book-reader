import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { chat, aiConfigSummary } from './lib/llm.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 5191)
const DIST_DIR = path.resolve(__dirname, process.env.DIST_DIR || '../dist')

const app = express()
app.use(express.json({ limit: '1mb' }))

// 健康检查（部署排障用）
app.get('/api/health', (req, res) => res.json({ ok: true, ai: aiConfigSummary() }))

// AI 对话：前端传 context(页面感知) + messages
app.post('/api/chat', async (req, res) => {
  try {
    const { context = {}, messages = [] } = req.body || {}
    const sys = buildSystemPrompt(context)
    // 限制历史轮数，控制 token
    const trimmed = Array.isArray(messages) ? messages.slice(-12) : []
    const full = [{ role: 'system', content: sys }, ...trimmed]
    const r = await chat(full)
    res.json(r)
  } catch (e) {
    res.json({ ok: false, content: '请求出错了，请稍后再试～', model: 'error', errors: [String(e)] })
  }
})

// 页面感知 system prompt：让 AI 知道「用户在哪、在读什么」——这是 AI 个性化边栏的核心
function buildSystemPrompt(ctx) {
  const base =
    '你是「整书阅读」儿童整本书阅读平台的 AI 助手，面向小学生和老师。回答简洁、亲切、有鼓励性，不说教、不冗长，必要时一两句到位。'
  const page = ctx.page || ''

  if (page === 'reader' && ctx.book) {
    let s = base + `\n\n【当前位置】用户正在阅读《${ctx.book}》`
    if (ctx.chapter) s += `的「${ctx.chapter}」`
    if (ctx.pageNo) s += `，当前第 ${ctx.pageNo}/${ctx.totalPages || '?'} 页`
    s += '。\n你是 TA 的 AI 学伴：结合当前页内容陪读、提启发式问题、解释难点，引导 TA 自己思考。'
    if (ctx.pageText) s += `\n\n【当前页正文（供你理解 TA 读到哪）】\n${String(ctx.pageText).slice(0, 1500)}`
    if (ctx.selection) s += `\n\n【用户刚选中的文字】「${ctx.selection}」——优先针对这段回应。`
    return s
  }
  if (page === 'library') {
    return (
      base +
      '\n\n【当前位置】用户在书架页。你是找书助手：按年级 / 体裁 / 兴趣推荐书目，引导 TA 挑书并开始阅读。'
    )
  }
  return (
    base +
    `\n\n【当前位置】用户在网站的「${ctx.pageName || '首页'}」页面。你是网站 AI 向导：帮 TA 了解网站、找书、导航到合适的页面。`
  )
}

// serve 前端 dist（SPA：非 /api 路由都回 index.html）
app.use(express.static(DIST_DIR))
app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))

app.listen(PORT, () =>
  console.log(`[book-reader] server on http://127.0.0.1:${PORT}  (AI primary: ${aiConfigSummary().primary})`),
)
