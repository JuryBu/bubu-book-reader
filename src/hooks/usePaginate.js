// 动态分页 hook：把「段落数组」按给定页宽/页高切成若干页，供 3D 翻页书逐页渲染。
//
// 原理：在屏幕外放一个与「书页正文区」等尺寸、同排版（.prose-reader + 内边距）的隐藏测量容器，
// 逐段把段落塞进去、累加测 scrollHeight；一旦超过页高就「另起一页」，从当前段重新开始累计。
// 单段就超高时（超长段落）也独占一页（不再硬切句，保证可读、且不丢内容）。
//
// 要点：
//  - 等字体 ready（document.fonts.ready）再测，避免回退字体测出的高度不准导致分页漂移。
//  - 输入（内容 + 尺寸 + 内边距）变化才重算；用 cacheKey 缓存，避免同样的入参重复测量。
//  - 页宽/页高为 0（尺寸还没算出来）时返回「整段单页」兜底，不报错。
import { useEffect, useRef, useState } from 'react'

// 测量容器只设「定位 + 隐藏 + 盒模型 + 宽度」，字体/字号/行高/段距全靠 .prose-reader 真实 CSS 继承，
// 这样测出来的高度和书页真实渲染完全一致，不会因字体栈写偏而分页漂移。
const BOX_STYLE = {
  position: 'fixed',
  left: '-99999px',
  top: '0',
  visibility: 'hidden',
  pointerEvents: 'none',
  boxSizing: 'border-box',
}

// 把一段文本转义成安全 HTML（防止内容里有 < & 之类破坏结构）
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 核心：纯 DOM 测量，把 paragraphs 切成 pages（每页是 string[] —— 该页包含的段落原文）
function computePages(paragraphs, pageW, pageH, padX, padY) {
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return []
  if (!pageW || !pageH || pageW <= 0 || pageH <= 0) return [paragraphs.slice()]

  const innerW = Math.max(1, pageW - padX * 2)
  const innerH = Math.max(1, pageH - padY * 2)

  const box = document.createElement('div')
  // 复用 .prose-reader 真实排版（字体/字号/行高/段距/首行缩进都来自 index.css）
  box.className = 'prose-reader'
  Object.assign(box.style, BOX_STYLE, { width: `${innerW}px` })
  document.body.appendChild(box)

  const pages = []
  let current = [] // 当前页累计的段落

  const setBoxHtml = (paras) => {
    box.innerHTML = paras.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
  }

  try {
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i]
      const trial = [...current, para]
      setBoxHtml(trial)
      const fits = box.scrollHeight <= innerH

      if (fits) {
        current = trial
      } else if (current.length === 0) {
        // 单段就超高：让它独占一页（不硬切，保内容完整 + 可读）
        pages.push([para])
        current = []
      } else {
        // 放不下 → 当前页定稿，这一段挪到下一页起头
        pages.push(current)
        current = [para]
      }
    }
    if (current.length > 0) pages.push(current)
  } finally {
    document.body.removeChild(box)
  }

  return pages.length > 0 ? pages : [paragraphs.slice()]
}

// usePaginate(paragraphs, { pageW, pageH, padX, padY })
//  返回 { pages, ready }
//   pages: string[][]  每页一个段落数组（页内段落原文，便于渲染 + 抽纯文本喂 AI）
//   ready: 字体已 ready 且已完成至少一次测量
export function usePaginate(paragraphs, { pageW, pageH, padX = 0, padY = 0 } = {}) {
  const [pages, setPages] = useState(() =>
    Array.isArray(paragraphs) && paragraphs.length ? [paragraphs.slice()] : [],
  )
  const [ready, setReady] = useState(false)

  // 按「内容 + 尺寸 + 内边距」做缓存键；命中相同键则跳过重算
  const cacheRef = useRef({ key: '', pages: null })
  const debounceRef = useRef(null)
  const fontsReadyRef = useRef(false)

  // 字体 ready 标记（只等一次）
  useEffect(() => {
    let cancelled = false
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fontsReadyRef.current = true
      })
    } else {
      fontsReadyRef.current = true
    }
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const contentKey = Array.isArray(paragraphs) ? paragraphs.join('') : ''
    const sizeKey = `${Math.round(pageW || 0)}x${Math.round(pageH || 0)}|${Math.round(padX)}|${Math.round(padY)}`
    const key = `${sizeKey}::${contentKey}`

    // 缓存命中：直接复用，不重测
    if (cacheRef.current.key === key && cacheRef.current.pages) {
      setPages(cacheRef.current.pages)
      setReady(true)
      return
    }

    const run = () => {
      const result = computePages(paragraphs, pageW, pageH, padX, padY)
      cacheRef.current = { key, pages: result }
      setPages(result)
      setReady(true)
    }

    // 防抖：尺寸抖动（拖窗）时合并重算
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const schedule = () => {
      debounceRef.current = setTimeout(run, 120)
    }

    // 等字体 ready 再测；已 ready 直接排程
    if (fontsReadyRef.current) {
      schedule()
    } else if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fontsReadyRef.current = true
        schedule()
      })
    } else {
      schedule()
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // 仅在内容/尺寸真正变化时重算
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(paragraphs) ? paragraphs.join('') : '', pageW, pageH, padX, padY])

  return { pages, ready }
}

export default usePaginate
