// AI 边栏共用对话引擎：管理 messages 状态 + 调 askAI 真后端。
// 视觉/气泡样式仍由各边栏自己渲染，这里只负责状态与发送逻辑。
import { useState, useCallback, useRef } from 'react'
import { askAI } from './ai.js'

// messages 内部统一用后端约定字段：{ role:'user'|'assistant', content }
// initial: 初始消息数组（一般一条 assistant 欢迎语）
// getContext: () => context 对象，发送时实时取（保证拿到最新页面/选区上下文）
export function useAIChat({ initial = [], getContext } = {}) {
  const [messages, setMessages] = useState(initial)
  const [loading, setLoading] = useState(false)
  // 用 ref 同步持有最新消息列表：避免在 async 里依赖 setState updater 取历史（会拿到空/旧值）
  const messagesRef = useRef(initial)
  const loadingRef = useRef(false)

  const send = useCallback(
    async (rawText) => {
      const text = (rawText || '').trim()
      if (!text || loadingRef.current) return
      loadingRef.current = true
      setLoading(true)

      const userMsg = { role: 'user', content: text }
      // 含本次 user 消息的完整历史（从 ref 取，保证是最新的）
      const history = [...messagesRef.current, userMsg]
      messagesRef.current = history
      setMessages(history)

      const context = typeof getContext === 'function' ? getContext() : {}
      // 只发后端约定的 role/content（剥离 kind 等 UI 专用字段）
      const wire = history.map((m) => ({ role: m.role, content: m.content }))
      const res = await askAI({ context, messages: wire })
      const reply = {
        role: 'assistant',
        content: (res && res.content) || '我这会儿没接上，稍后再问问我吧～',
      }
      const next = [...messagesRef.current, reply]
      messagesRef.current = next
      setMessages(next)

      loadingRef.current = false
      setLoading(false)
    },
    [getContext],
  )

  return { messages, loading, send }
}
