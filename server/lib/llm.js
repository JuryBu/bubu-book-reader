// OpenAI 兼容 LLM 调用：模型 fallback 链 + 每级 retry，全失败友好兜底（绝不抛错阻断前端）。
// 思路对齐步步 model_router：有序尝试链 + 自动降级 + 不阻断。
import 'dotenv/config'

const BASE = (process.env.AI_BASE_URL || '').replace(/\/$/, '')
const KEY = process.env.AI_API_KEY || ''
const PRIMARY = process.env.AI_MODEL || 'gpt-5.4-mini'
const FALLBACKS = (process.env.AI_FALLBACK_MODELS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const MAX_RETRIES = Number(process.env.AI_MAX_RETRIES || 2)
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000)

const MODEL_CHAIN = [PRIMARY, ...FALLBACKS]

async function callOnce(model, messages) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.7, stream: false }),
      signal: ctrl.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${text.slice(0, 160)}`)
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) throw new Error('empty content')
    return { content, model: data.model || model, usage: data.usage }
  } finally {
    clearTimeout(timer)
  }
}

// 主入口：按模型链 + retry 尝试，全失败返回兜底（不抛错）
export async function chat(messages) {
  const errors = []
  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const r = await callOnce(model, messages)
        return { ok: true, content: r.content, model: r.model, usage: r.usage }
      } catch (e) {
        errors.push(`${model}#${attempt}: ${e.message}`)
      }
    }
  }
  // 全链路失败 —— 友好兜底，绝不阻断前端边栏
  return {
    ok: false,
    content: '抱歉，AI 小助手这会儿不太在状态，过一会儿再问问我吧～',
    model: 'fallback',
    errors,
  }
}

export function aiConfigSummary() {
  return { base: BASE, primary: PRIMARY, fallbacks: FALLBACKS, hasKey: !!KEY }
}
