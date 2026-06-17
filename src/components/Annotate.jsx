// 标注相关 UI：选中浮层工具条 + 段落高亮渲染。
// 高亮以「文本 + 页码 + 章」记录在 state（见 Reader），翻页书重渲染时按文本匹配重新高亮，
// 所以翻页回来标注还在（不依赖一次性的 DOM 操作）。
import { Sparkles, MessageCircle, Highlighter } from 'lucide-react'

// 把一段段落文本，按「该页生效的标注文本数组」切成普通文本 + <mark> 高亮片段。
// 多条标注命中同一段时，从最长的先匹配，避免短串吃掉长串边界。
function splitByMarks(text, marks) {
  if (!marks || marks.length === 0) return [{ t: text, hl: false }]
  // 收集所有命中区间 [start, end)
  const ranges = []
  const ordered = [...new Set(marks)].filter(Boolean).sort((a, b) => b.length - a.length)
  for (const m of ordered) {
    let from = 0
    while (from <= text.length) {
      const idx = text.indexOf(m, from)
      if (idx === -1) break
      ranges.push([idx, idx + m.length])
      from = idx + m.length
    }
  }
  if (ranges.length === 0) return [{ t: text, hl: false }]
  // 合并重叠区间
  ranges.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([...r])
  }
  // 拼出片段序列
  const out = []
  let cursor = 0
  for (const [s, e] of merged) {
    if (s > cursor) out.push({ t: text.slice(cursor, s), hl: false })
    out.push({ t: text.slice(s, e), hl: true })
    cursor = e
  }
  if (cursor < text.length) out.push({ t: text.slice(cursor), hl: false })
  return out
}

// 渲染单个段落，命中的标注文本套暖黄高亮 <mark>
export function HighlightedParagraph({ text, marks }) {
  const parts = splitByMarks(text, marks)
  if (parts.length === 1 && !parts[0].hl) return <p>{text}</p>
  return (
    <p>
      {parts.map((p, i) =>
        p.hl ? (
          <mark key={i} className="annot-mark">
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </p>
  )
}

// 选中浮层工具条：解释一下 / 问 AI / 标注。fixed 定位在选区上方，z-index 高于翻页书。
// style 由父级算好（top/left + transform 居中），按钮回调由父级注入。
export function SelectionToolbar({ style, onExplain, onAsk, onAnnotate }) {
  return (
    <div className="selection-toolbar" style={style} role="toolbar" aria-label="选中文本操作">
      <button type="button" className="selection-toolbar-btn" onMouseDown={(e) => e.preventDefault()} onClick={onExplain}>
        <Sparkles className="w-3.5 h-3.5" /> 解释一下
      </button>
      <span className="selection-toolbar-sep" />
      <button type="button" className="selection-toolbar-btn" onMouseDown={(e) => e.preventDefault()} onClick={onAsk}>
        <MessageCircle className="w-3.5 h-3.5" /> 问 AI
      </button>
      <span className="selection-toolbar-sep" />
      <button type="button" className="selection-toolbar-btn" onMouseDown={(e) => e.preventDefault()} onClick={onAnnotate}>
        <Highlighter className="w-3.5 h-3.5" /> 标注
      </button>
    </div>
  )
}

export default SelectionToolbar
