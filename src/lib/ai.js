// 整书阅读 AI 边栏前端调用：POST /api/chat，带「页面感知」context。
// dev 经 vite proxy /api → 本地后端(5191)；生产由后端同源 serve，相对 /api 直达。
const API_BASE = import.meta.env.VITE_AI_BASE || ''

// context: { page, pageName, book, chapter, pageNo, totalPages, pageText, selection }
// messages: [{ role:'user'|'assistant', content }]
export async function askAI({ context = {}, messages = [] }) {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, messages }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json() // { ok, content, model }
  } catch (e) {
    return { ok: false, content: '网络好像不太通，待会儿再问问我吧～', model: 'neterror', errors: [String(e)] }
  }
}
