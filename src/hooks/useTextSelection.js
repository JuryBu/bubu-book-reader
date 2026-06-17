// 书页正文选区监听 hook：监听 window 选区，只在「正文容器内」选中时给出浮层定位信息。
//
// 返回 { selection, clear }：
//   selection: null | { text, rect }  rect 为视口坐标（getBoundingClientRect），供浮层 fixed 定位
//   clear(): 主动清空（点完浮层按钮后收起；不强制清 DOM 选区，避免影响 selectionchange 给 AI 喂选区）
//
// 设计要点：
//  - 只认 containerRef 内部的选区（忽略边栏/目录自身选中），避免浮层乱飘。
//  - 翻页书翻页/切章会重渲染 DOM，选区自然失效 → 这里靠 scroll/翻页时清空 + 选区为空时清空兜底。
//  - 用 selectionchange 实时跟踪，但 rect 在「选区稳定」时取（mouseup/keyup 后），避免拖选过程中抖动。
import { useState, useEffect, useRef, useCallback } from 'react'

export function useTextSelection(containerRef, { maxLen = 400, deps = [] } = {}) {
  const [selection, setSelection] = useState(null)
  const rafRef = useRef(0)

  const clear = useCallback(() => {
    setSelection(null)
  }, [])

  // 读取当前选区，若落在容器内且非空，算出 rect
  const readSelection = useCallback(() => {
    const sel = window.getSelection?.()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setSelection(null)
      return
    }
    const text = (sel.toString() || '').trim()
    if (!text) {
      setSelection(null)
      return
    }
    const container = containerRef.current
    if (!container) {
      setSelection(null)
      return
    }
    // 选区锚点/焦点至少有一端落在容器内，才认为是「正文选区」
    const within =
      (sel.anchorNode && container.contains(sel.anchorNode)) ||
      (sel.focusNode && container.contains(sel.focusNode))
    if (!within) {
      setSelection(null)
      return
    }
    let rect
    try {
      rect = sel.getRangeAt(0).getBoundingClientRect()
    } catch {
      setSelection(null)
      return
    }
    // rect 全 0（隐藏/异常）时不弹
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      setSelection(null)
      return
    }
    setSelection({
      text: text.slice(0, maxLen),
      rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
    })
  }, [containerRef, maxLen])

  useEffect(() => {
    // 选区稳定后（鼠标/键盘抬起）再算 rect，避免拖选途中频繁定位
    const onSettle = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(readSelection)
    }
    // 选区被清空（点别处）时即时收起浮层
    const onSelectionChange = () => {
      const sel = window.getSelection?.()
      if (!sel || sel.isCollapsed || !(sel.toString() || '').trim()) {
        setSelection(null)
      }
    }
    // 翻页/滚动/失焦：浮层定位会失真，直接收起
    const onDismiss = () => setSelection(null)

    document.addEventListener('mouseup', onSettle)
    document.addEventListener('keyup', onSettle)
    document.addEventListener('selectionchange', onSelectionChange)
    window.addEventListener('scroll', onDismiss, true)
    window.addEventListener('resize', onDismiss)
    window.addEventListener('blur', onDismiss)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mouseup', onSettle)
      document.removeEventListener('keyup', onSettle)
      document.removeEventListener('selectionchange', onSelectionChange)
      window.removeEventListener('scroll', onDismiss, true)
      window.removeEventListener('resize', onDismiss)
      window.removeEventListener('blur', onDismiss)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readSelection])

  // 外部依赖（翻页/切章/页码）变化时收起浮层
  useEffect(() => {
    setSelection(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { selection, clear }
}

export default useTextSelection
