import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useParams, Link } from 'react-router-dom'
import HTMLFlipBook from 'react-pageflip'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clock, FileText, Sparkles, Bookmark, X, Send, Lightbulb, Highlighter, Trash2 } from 'lucide-react'
import { getBook } from '../data/books.js'
import { GenreTag, cx } from '../components/ui.jsx'
import { useAIChat } from '../lib/useAIChat.js'
import { usePaginate } from '../hooks/usePaginate.js'
import { useTextSelection } from '../hooks/useTextSelection.js'
import { SelectionToolbar, HighlightedParagraph } from '../components/Annotate.jsx'

// 各书章节目录（重点书给真实篇目；其它书用通用结构）
const chaptersByBook = {
  andersen: ['丑小鸭', '海的女儿', '拇指姑娘', '夜莺', '坚定的锡兵', '野天鹅', '皇帝的新装', '雪人'],
  'xiyouji-shaoer': ['猴王出世', '大闹天宫', '三打白骨精', '车迟国斗法', '女儿国奇遇', '真假美猴王', '火焰山', '取得真经'],
  daocaoren: ['稻草人', '小白船', '芳儿的梦', '一粒种子', '画眉', '玫瑰和金鱼', '富翁', '快乐的人'],
  'gelin-tonghua': ['白雪公主', '灰姑娘', '小红帽', '青蛙王子', '糖果屋', '不来梅的音乐家', '渔夫和他的妻子', '勇敢的小裁缝'],
}
function getChapters(book) {
  return (
    chaptersByBook[book.id] || ['第一章 · 启程', '第二章 · 相遇', '第三章 · 风浪', '第四章 · 抉择', '第五章 · 归来']
  )
}

// 样章正文（节选自《安徒生童话·丑小鸭》开头，公版、温和）
const sampleParagraphs = [
  '乡下真是非常美丽。这正是夏天！麦子是金黄的，燕麦是绿油油的。干草堆在绿色的草地上，鹳鸟迈着又长又红的腿子在散步，嘴里讲着埃及话——这是它从妈妈那儿学来的语言。',
  '田野和草地的四周有些大森林，森林里有些很深的池塘。是的，乡下的确很美。太阳光下，一座古老的庄园被几条很深的小河环绕着；从墙脚一直到水边，长满了牛蒡的大叶子。最大的叶子长得非常高，小孩子简直可以直着腰站在下面。',
  '在这块最荒凉的地方，有一只母鸭正坐在窝里，孵着她的小鸭。她已经坐得有些不耐烦了，因为小家伙们出生得太慢，而且很少有客人来看她。',
  '终于，一个蛋壳裂开了，接着是第二个、第三个。"唧！唧！"蛋里的小生命一个接一个地探出头来。',
  '"嘎！嘎！"母鸭说。小鸭们也就跟着叫起来，一边尽量地东张西望，看着四周绿色的大叶子。母鸭让它们尽情地看，因为绿色对眼睛是有好处的。',
  '"这个世界真够大呀！"这些年轻的小家伙说。的确，比起在蛋壳里的时候，它们现在能活动的空间，要大得多了。',
  '"你们以为这就是整个世界吗？"母鸭说，"它一直伸展到花园的另一边，一直伸展到牧师的田里去呢，远得连我自己都没有去过。"',
]

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-ink-100">
      {[
        { k: 'detail', label: '简介' },
        { k: 'read', label: '正文' },
      ].map((t) => (
        <button
          key={t.k}
          onClick={() => setMode(t.k)}
          className={cx(
            'px-4 py-1.5 rounded-full text-sm font-semibold transition',
            mode === t.k ? 'bg-surface text-brand-600 shadow-e1' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// AI 学伴陪读侧栏（可收起）
// chapterTitle: 当前章标题；pageNo/totalPages: 真实当前页码；pageText: 「当前翻到那一页」的纯文本
function AISidebar({ book, chapterTitle, pageNo, totalPages, pageText, command, onClose }) {
  const chips = ['这一章讲了什么', '为什么这样写', '读完想一想']

  // 监听阅读区选中的文字（发送时实时读取，没有就不传）
  const selectionRef = useRef('')
  useEffect(() => {
    const onSel = () => {
      const s = (window.getSelection?.()?.toString() || '').trim()
      // 只保留正文里选的内容（忽略边栏自身选区），简单按长度限幅
      selectionRef.current = s.slice(0, 400)
    }
    document.addEventListener('selectionchange', onSel)
    return () => document.removeEventListener('selectionchange', onSel)
  }, [])

  const { messages, loading, send } = useAIChat({
    initial: [
      {
        role: 'assistant',
        content: `嗨！我是你的 AI 学伴 ✨ 准备读《${book.title}》了吗？读到打动你的句子、或者不太明白的地方，随时问我，我会结合正文陪你一起想。`,
      },
    ],
    getContext: () => {
      const ctx = { page: 'reader', book: book.title }
      if (chapterTitle) ctx.chapter = chapterTitle
      if (pageNo) ctx.pageNo = pageNo
      if (totalPages) ctx.totalPages = totalPages
      if (pageText) ctx.pageText = pageText
      const sel = selectionRef.current
      if (sel) ctx.selection = sel
      return ctx
    },
  })

  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const submit = () => {
    if (!input.trim() || loading) return
    const t = input
    setInput('')
    send(t)
  }

  // 选中文本「解释一下 / 问 AI」指令：父级 nonce 变化时自动发送一条带选区的提问。
  // 用 ref 记录已处理的 nonce，避免重复发送；选区已写入 selectionRef，后端能拿到上下文。
  const sendRef = useRef(send)
  sendRef.current = send
  const lastNonceRef = useRef(0)
  useEffect(() => {
    if (!command || command.nonce === lastNonceRef.current) return
    lastNonceRef.current = command.nonce
    selectionRef.current = command.text.slice(0, 400) // 确保上下文含本次选区
    const prompt =
      command.kind === 'explain'
        ? `请解释这段话的意思：「${command.text}」`
        : `关于这段话，我想问问你：「${command.text}」`
    sendRef.current(prompt)
  }, [command])

  return (
    <aside className="hidden xl:flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] rounded-3xl bg-surface border border-hair shadow-e2 overflow-hidden animate-fade-in">
      {/* 标题栏 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-hair bg-brand-grad-soft">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-grad text-white shadow-glow shrink-0">
          <Sparkles className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-bold text-ink-900 text-sm leading-tight">AI 学伴</p>
          <p className="text-[11px] text-ink-500 truncate">正在陪读《{book.title}》</p>
        </div>
        <button
          onClick={onClose}
          className="grid place-items-center w-7 h-7 rounded-lg text-ink-400 hover:bg-white/70 hover:text-ink-700 transition"
          title="收起"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* 对话区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-50 text-ink-400 text-[11px]">
          <Lightbulb className="w-3 h-3" /> 已结合本章内容为你引导
        </div>
        {messages.map((m, i) =>
          m.role === 'assistant' ? (
            <div key={i} className="flex gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="rounded-2xl rounded-tl-md bg-surface-soft border border-hair px-3.5 py-2.5 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="rounded-2xl rounded-tr-md bg-brand-grad text-white px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-glow whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ),
        )}
        {/* 思考中 loading 态 */}
        {loading && (
          <div className="flex gap-2.5">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="rounded-2xl rounded-tl-md bg-surface-soft border border-hair px-3.5 py-2.5 text-sm text-ink-500 leading-relaxed">
              <span className="inline-flex gap-1 items-center">
                思考中
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
      {/* 输入区 */}
      <div className="border-t border-hair p-3 bg-surface">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-ink-50 text-ink-600 text-[11px] font-medium hover:bg-brand-50 hover:text-brand-600 transition disabled:opacity-50"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-ink-150 bg-surface-soft px-3 py-2 focus-within:border-brand-300 transition">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault()
                submit()
              }
            }}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-ink-700 placeholder:text-ink-400 outline-none disabled:opacity-60"
            placeholder={loading ? '思考中…' : '问问 AI 学伴…'}
          />
          <button
            onClick={submit}
            disabled={loading || !input.trim()}
            className="grid place-items-center w-8 h-8 rounded-xl bg-brand-grad text-white shadow-glow shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

// 书页内边距（px）：要和 usePaginate 测量、以及真实书页渲染保持一致
const PAGE_PAD_X = 34
const PAGE_PAD_Y = 40
// 书页宽高比（高/宽）：贴近真实开本，桌面双页时两页并排
const PAGE_RATIO = 1.36

// 单张书页（HTMLFlipBook 子节点需 forwardRef）。正文用 .prose-reader 保持可读性。
// marks: 本页生效的标注文本数组 → 段落里命中的文本套暖黄高亮（翻页回来仍按文本重新高亮）。
const FlipPage = forwardRef(function FlipPage({ paras, pageNo, totalPages, marks }, ref) {
  return (
    <div className="flip-page" ref={ref} data-density="soft">
      <div className="flip-page-inner" style={{ padding: `${PAGE_PAD_Y}px ${PAGE_PAD_X}px` }}>
        <div className="prose-reader flip-page-body">
          {paras.map((p, i) => (
            <HighlightedParagraph key={i} text={p} marks={marks} />
          ))}
        </div>
        <div className="flip-page-foot">
          {pageNo} / {totalPages}
        </div>
      </div>
    </div>
  )
})

// 3D 翻页书阅读器：HTML 文本动态分页 + react-pageflip 翻页 + 页码追踪喂 AI。
// onPageChange(pageNo, totalPages, pageText) —— pageText 为「当前翻到那一页」纯文本。
// annotations: 当前章的标注列表（{ pageNo, text, ... }）；命中页按文本高亮。
// onExplain/onAsk/onAnnotate(text): 选中浮层三个动作的回调（解释/问AI/标注）。
// ref.goToPage(pageNo): 标注列表点击跳转用。
const FlipReader = forwardRef(function FlipReader(
  { book, chapterIndex, chapterTitle, paragraphs, onPageChange, annotations = [], onExplain, onAsk, onAnnotate },
  ref,
) {
  const stageRef = useRef(null)
  const flipRef = useRef(null)
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 })
  // 当前左页索引（onFlip 给的 e.data）；切章后归零
  const [leafIndex, setLeafIndex] = useState(0)

  // 窄屏（< 640px 可用宽）走单页，否则桌面双页（两页并排，呈现真实翻书）
  const portrait = stageSize.w > 0 && stageSize.w < 640

  // 测量可用舞台尺寸
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return undefined
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        setStageSize((prev) =>
          Math.abs(prev.w - cr.width) > 1 || Math.abs(prev.h - cr.height) > 1
            ? { w: cr.width, h: cr.height }
            : prev,
        )
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 由舞台尺寸算单页宽高：高度优先，双页时宽度不能超过舞台一半
  const { pageW, pageH } = useMemo(() => {
    const availW = stageSize.w
    const availH = stageSize.h
    if (availW <= 0 || availH <= 0) return { pageW: 0, pageH: 0 }
    let h = availH
    let w = h / PAGE_RATIO
    const maxWPerPage = portrait ? availW : availW / 2
    if (w > maxWPerPage) {
      w = maxWPerPage
      h = w * PAGE_RATIO
    }
    return { pageW: Math.floor(w), pageH: Math.floor(h) }
  }, [stageSize, portrait])

  // 动态分页：每页 = string[]（该页段落原文）
  const { pages } = usePaginate(paragraphs, {
    pageW,
    pageH,
    padX: PAGE_PAD_X,
    padY: PAGE_PAD_Y,
  })
  const totalPages = Math.max(1, pages.length)

  const sizeKey = `${pageW}x${pageH}`
  // 页数 / 尺寸 / 章节变化都要给 HTMLFlipBook 换 key，否则库内部状态错乱
  const flipKey = `flip-${book.id}-${chapterIndex}-${sizeKey}-${totalPages}`

  // 切章 / 重新分页后回到第 1 页
  useEffect(() => {
    setLeafIndex(0)
  }, [chapterIndex, flipKey])

  // 当前页码（从 1）：单页 = leafIndex+1；双页用左页 +1 作为代表页
  const pageNo = Math.min(totalPages, leafIndex + 1)
  // 当前页纯文本：双页时把左右两页都给 AI（TA 同屏看到的就是两页）
  const currentPageText = useMemo(() => {
    if (!pages.length) return ''
    const idxs = portrait ? [leafIndex] : [leafIndex, leafIndex + 1]
    return idxs
      .filter((i) => i >= 0 && i < pages.length)
      .map((i) => (pages[i] || []).join('\n'))
      .join('\n')
      .trim()
  }, [pages, leafIndex, portrait])

  // 上报页码 + 当前页文本给父级（喂 AI）
  useEffect(() => {
    onPageChange?.(pageNo, totalPages, currentPageText)
  }, [pageNo, totalPages, currentPageText, onPageChange])

  const handleFlip = useCallback((e) => {
    setLeafIndex(e?.data ?? 0)
  }, [])

  const goPrev = useCallback(() => {
    flipRef.current?.pageFlip?.()?.flipPrev()
  }, [])
  const goNext = useCallback(() => {
    flipRef.current?.pageFlip?.()?.flipNext()
  }, [])

  const canPrev = leafIndex > 0
  const canNext = portrait ? leafIndex < totalPages - 1 : leafIndex + 2 < totalPages

  // 跳到指定页码（1 基）：双页时落到该页所在的左页对（偶数 leaf）。供「我的标注」跳转。
  const goToPage = useCallback(
    (targetNo) => {
      const flip = flipRef.current?.pageFlip?.()
      if (!flip) return
      const idx = Math.max(0, Math.min(totalPages - 1, (targetNo || 1) - 1))
      const leaf = portrait ? idx : idx - (idx % 2)
      flip.flip(leaf)
    },
    [portrait, totalPages],
  )
  useImperativeHandle(ref, () => ({ goToPage }), [goToPage])

  // ===== Ctrl 拖动 = 选中文字（不翻页）=====
  // react-pageflip 底层（page-flip）把拖拽翻页的 mousedown 绑在书内部的 .stf__block 上，
  // 其 onMouseDown 会立刻 preventDefault()，把浏览器原生选区也一并掐断 → 无法拖选。
  // 方案：在 stage 容器上用「捕获阶段」原生监听 mousedown，按住 Ctrl 时 stopPropagation()，
  // 事件就到不了书内部那个冒泡监听器 → 它的 preventDefault 不执行 → 原生选区正常工作。
  // 全程不改 props / 不换 key，所以「绝不跳回第 1 页」。松开 Ctrl 自动恢复正常翻页。
  const [ctrlSelecting, setCtrlSelecting] = useState(false)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    // 捕获阶段拦截：Ctrl 按下时阻止事件冒泡到 page-flip 的 mousedown，放行浏览器原生选区
    const onDownCapture = (e) => {
      if (e.ctrlKey) {
        e.stopPropagation()
        setCtrlSelecting(true)
      }
    }
    // 跟踪 Ctrl 修饰键状态（用 e.ctrlKey 反映实时按压，敲组合键也准确），
    // 仅切换光标/提示高亮，不影响翻页本身。窗口失焦时兜底复位。
    const onKey = (e) => setCtrlSelecting(e.ctrlKey === true)
    const onBlur = () => setCtrlSelecting(false)
    stage.addEventListener('mousedown', onDownCapture, true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    window.addEventListener('blur', onBlur)
    return () => {
      stage.removeEventListener('mousedown', onDownCapture, true)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  // 选区监听（仅 stage 容器内）；翻页/切章/重分页时收起浮层
  const { selection, clear: clearSelection } = useTextSelection(stageRef, {
    maxLen: 400,
    deps: [leafIndex, chapterIndex, flipKey],
  })

  // 浮层定位：选区上方居中；贴近视口顶部时翻到下方
  const toolbarStyle = useMemo(() => {
    if (!selection) return null
    const { rect } = selection
    const cx2 = rect.left + rect.width / 2
    const above = rect.top > 60
    return above
      ? { left: cx2, top: rect.top - 10, transform: 'translate(-50%, -100%)' }
      : { left: cx2, top: rect.bottom + 10, transform: 'translate(-50%, 0)' }
  }, [selection])

  // 本章全部标注文本（按文本匹配高亮，翻到哪页只要该页含此文本就会亮）。
  // 直接全量喂给每页：splitByMarks 按 indexOf 命中，不在本页的文本自然匹配不到，安全。
  const markTexts = useMemo(
    () => annotations.map((a) => a?.text).filter(Boolean),
    [annotations],
  )

  const handleToolbar = useCallback(
    (action) => {
      const text = selection?.text
      clearSelection()
      if (!text) return
      if (action === 'explain') onExplain?.(text)
      else if (action === 'ask') onAsk?.(text)
      else if (action === 'annotate') onAnnotate?.(text, pageNo)
    },
    [selection, clearSelection, onExplain, onAsk, onAnnotate, pageNo],
  )

  return (
    <div className="flex flex-col">
      <div ref={stageRef} className={cx('flip-stage', ctrlSelecting && 'flip-stage--selecting')}>
        {/* 常驻轻提示：告诉读者按住 Ctrl 拖动可选中文字 → 标注 / 问 AI。
            Ctrl 按下时高亮放大，提示「正在选字」。 */}
        <div className={cx('flip-hint', ctrlSelecting && 'flip-hint--active')} aria-hidden="true">
          <Highlighter className="w-3.5 h-3.5 shrink-0" />
          {ctrlSelecting ? '松开鼠标即可标注 / 问 AI' : '按住 Ctrl 拖动可选中文字 → 标注 / 问 AI'}
        </div>
        {/* shell 钉死书的总宽高：StPageFlip 在 fixed 模式仍用 width:100% 撑满父容器，
            用精确宽度的 shell 包住，避免它按被侧栏挤压后的父宽误算高度而溢出。 */}
        {pageW > 0 && (
          <div
            className="flip-book-shell"
            style={{ width: portrait ? pageW : pageW * 2, height: pageH }}
          >
          <HTMLFlipBook
            key={flipKey}
            ref={flipRef}
            className="flip-book"
            width={pageW}
            height={pageH}
            size="fixed"
            minWidth={120}
            maxWidth={2000}
            minHeight={160}
            maxHeight={2600}
            maxShadowOpacity={0.45}
            drawShadow
            flippingTime={650}
            usePortrait={portrait}
            mobileScrollSupport={false}
            clickEventForward={false}
            useMouseEvents
            showCover={false}
            showPageCorners
            startPage={0}
            onFlip={handleFlip}
          >
            {pages.map((paras, i) => (
              <FlipPage key={i} paras={paras} pageNo={i + 1} totalPages={totalPages} marks={markTexts} />
            ))}
          </HTMLFlipBook>
          </div>
        )}

        {/* 选中浮层：解释一下 / 问 AI / 标注。fixed 定位，z-index 高于翻页书 */}
        {selection && toolbarStyle && (
          <SelectionToolbar
            style={toolbarStyle}
            onExplain={() => handleToolbar('explain')}
            onAsk={() => handleToolbar('ask')}
            onAnnotate={() => handleToolbar('annotate')}
          />
        )}
      </div>

      {/* 翻页 + 切章控制条 */}
      <div className="flex items-center justify-between gap-3 mt-6 px-1">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap text-ink-600 border border-ink-150 bg-surface transition hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" /> 上一页
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap text-white bg-brand-grad shadow-glow transition hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一页 <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
        <span className="text-caption text-ink-400 truncate text-right">
          《{book.title}》· {chapterTitle} · 第 {pageNo} / {totalPages} 页
        </span>
      </div>
    </div>
  )
})

export default function Reader() {
  const { bookId } = useParams()
  const book = getBook(bookId)
  const chapters = getChapters(book)
  const [c1, c2] = book.cover || ['#4C7DFF', '#3B66F5']
  const coverSrc = `${import.meta.env.BASE_URL}covers/${book.id}.jpg`
  const [mode, setMode] = useState('detail')
  const [chapter, setChapter] = useState(0)
  const [aiOpen, setAiOpen] = useState(true)
  // 真实页码追踪：由 FlipReader 翻页时上报，喂 AI + 顶栏显示
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, totalPages: 1, pageText: '' })
  const handlePageChange = useCallback((pageNo, totalPages, pageText) => {
    setPageInfo((prev) =>
      prev.pageNo === pageNo && prev.totalPages === totalPages && prev.pageText === pageText
        ? prev
        : { pageNo, totalPages, pageText },
    )
  }, [])

  // ===== 我的标注：按「章」分组的多条标注列表（{ id, text, pageNo, time }）=====
  // 支持连续多次 Ctrl 选不同段落，每条独立保存、各自高亮、各自可跳转。
  const [annotationsByChapter, setAnnotationsByChapter] = useState({})
  const currentAnnotations = annotationsByChapter[chapter] || []
  const flipRef = useRef(null)

  const handleAnnotate = useCallback(
    (text, pageNo) => {
      const t = (text || '').trim()
      if (!t) return
      setAnnotationsByChapter((prev) => {
        const list = prev[chapter] || []
        // 去重：同一章里完全相同的标注文本不重复加
        if (list.some((a) => a.text === t)) return prev
        const next = [...list, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: t, pageNo, time: Date.now() }]
        return { ...prev, [chapter]: next }
      })
    },
    [chapter],
  )

  const handleRemoveAnnotation = useCallback(
    (id) => {
      setAnnotationsByChapter((prev) => {
        const list = prev[chapter] || []
        return { ...prev, [chapter]: list.filter((a) => a.id !== id) }
      })
    },
    [chapter],
  )

  // ===== AI 指令通道：解释一下 / 问 AI 把选中文字塞给侧栏自动发送 =====
  // nonce 自增触发 AISidebar 的副作用，避免重复发送同一条
  const [aiCommand, setAiCommand] = useState(null)
  const fireAICommand = useCallback((text, kind) => {
    const t = (text || '').trim()
    if (!t) return
    setAiOpen(true) // 确保侧栏展开
    setAiCommand({ text: t, kind, nonce: Date.now() })
  }, [])
  const handleExplain = useCallback((text) => fireAICommand(text, 'explain'), [fireAICommand])
  const handleAsk = useCallback((text) => fireAICommand(text, 'ask'), [fireAICommand])

  // 标注列表点击 → 跳转到该标注所在页
  const handleJumpTo = useCallback((pageNo) => {
    flipRef.current?.goToPage?.(pageNo)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40">
        <div className="brand-hairline" />
        <div className="bg-surface/90 backdrop-blur-md border-b border-hair">
          <div className="mx-auto max-w-[1400px] px-5 h-14 flex items-center gap-4">
            <Link to="/library" className="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-600 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> 书架
            </Link>
            <span className="w-px h-5 bg-hair" />
            <span className="font-serif text-title font-bold text-ink-900 truncate">{book.title}</span>
            <GenreTag genre={book.genre} className="hidden sm:inline-flex" />
            <div className="ml-auto flex items-center gap-3">
              {mode === 'read' && (
                <span className="hidden sm:inline text-caption text-ink-500">
                  第 {chapter + 1} / {chapters.length} 章 · 第 {pageInfo.pageNo} / {pageInfo.totalPages} 页
                </span>
              )}
              <ModeToggle mode={mode} setMode={setMode} />
              <button
                onClick={() => setAiOpen((v) => !v)}
                className={cx(
                  'hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition',
                  aiOpen ? 'bg-brand-50 text-brand-600' : 'bg-brand-grad text-white shadow-glow',
                )}
              >
                <Sparkles className="w-4 h-4" /> AI 学伴
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-[1400px] w-full px-5 py-6">
        <div className={cx('grid gap-6 items-start', aiOpen ? 'lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)_360px]' : 'lg:grid-cols-[256px_minmax(0,1fr)]')}>
          {/* 左侧目录侧栏 */}
          <aside className="hidden lg:flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] gap-4">
            <div className="rounded-2xl bg-surface border border-hair p-4 shadow-e1 shrink-0">
              <div className="flex gap-3.5">
                <div
                  className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-e2 shrink-0"
                  style={{ backgroundImage: `linear-gradient(150deg, ${c1}, ${c2})` }}
                >
                  <div className="absolute inset-0 bg-hero-sheen opacity-70" />
                  <div className="absolute left-0 inset-y-0 w-1 bg-white/25" />
                  <img
                    key={book.id}
                    src={coverSrc}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-title font-bold text-ink-900 leading-snug">{book.title}</h2>
                  <p className="text-caption text-ink-500 mt-1">{book.author}</p>
                  <p className="text-caption text-ink-500 mt-0.5">{book.grade}</p>
                  <div className="mt-2"><GenreTag genre={book.genre} /></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="rounded-xl bg-ink-50 py-2.5">
                  <div className="inline-flex items-center gap-1 text-ink-700 font-semibold text-sm"><FileText className="w-3.5 h-3.5" />{chapters.length} 章</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">全书篇目</div>
                </div>
                <div className="rounded-xl bg-ink-50 py-2.5">
                  <div className="inline-flex items-center gap-1 text-ink-700 font-semibold text-sm"><Clock className="w-3.5 h-3.5" />约 2 时</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">预计时长</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-surface border border-hair p-2 shadow-e1 flex flex-col min-h-0 flex-1">
              <p className="eyebrow text-ink-400 px-3 pt-2 pb-1 shrink-0">目录</p>
              <nav className="overflow-y-auto">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setChapter(i)
                      setMode('read')
                    }}
                    className={cx(
                      'w-full text-left px-3 py-2.5 rounded-xl text-sm transition flex items-center gap-2.5',
                      mode === 'read' && chapter === i ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink-600 hover:bg-ink-50',
                    )}
                  >
                    <span className={cx('grid place-items-center w-6 h-6 rounded-md text-[11px] font-bold shrink-0', mode === 'read' && chapter === i ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500')}>
                      {i + 1}
                    </span>
                    <span className="truncate">{ch}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 我的标注：本章已标注的多条片段，各自可跳转 / 删除 */}
            {mode === 'read' && (
              <div className="rounded-2xl bg-surface border border-hair p-2 shadow-e1 shrink-0">
                <div className="flex items-center justify-between px-3 pt-2 pb-1">
                  <p className="eyebrow text-ink-400 inline-flex items-center gap-1.5">
                    <Highlighter className="w-3.5 h-3.5 text-accent-500" /> 我的标注
                  </p>
                  {currentAnnotations.length > 0 && (
                    <span className="text-[11px] font-semibold text-ink-400">{currentAnnotations.length} 条</span>
                  )}
                </div>
                {currentAnnotations.length === 0 ? (
                  <p className="px-3 py-2 text-[12px] leading-relaxed text-ink-400">
                    按住 Ctrl 拖选正文文字，点「标注」即可收藏到这里。
                  </p>
                ) : (
                  <div className="max-h-[34vh] overflow-y-auto space-y-1.5 px-1 pb-1">
                    {currentAnnotations.map((a) => (
                      <div
                        key={a.id}
                        className="group rounded-xl bg-ink-50 hover:bg-brand-50 transition px-2.5 py-2 flex items-start gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleJumpTo(a.pageNo)}
                          className="flex-1 min-w-0 text-left"
                          title="跳转到该标注所在页"
                        >
                          <span className="block text-[11px] font-semibold text-accent-600 mb-0.5">第 {a.pageNo} 页</span>
                          <span className="block text-[12px] leading-snug text-ink-700 line-clamp-2">{a.text}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAnnotation(a.id)}
                          className="shrink-0 grid place-items-center w-6 h-6 rounded-lg text-ink-300 hover:text-rose-500 hover:bg-white/70 transition opacity-0 group-hover:opacity-100"
                          title="删除这条标注"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* 中间主阅读区 */}
          <div className="min-w-0">
            {mode === 'detail' ? (
              <div className="rounded-3xl bg-surface border border-hair shadow-e2 overflow-hidden animate-fade-up">
                <div className="grid sm:grid-cols-[200px_1fr] gap-7 p-7 sm:p-9">
                  <div
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-e3"
                    style={{ backgroundImage: `linear-gradient(150deg, ${c1}, ${c2})` }}
                  >
                    <div className="absolute inset-0 bg-hero-sheen opacity-70" />
                    <div className="absolute left-0 inset-y-0 w-1.5 bg-white/25" />
                    <div className="absolute inset-0 p-4 flex flex-col">
                      <span className="text-[11px] font-semibold text-white/90 tracking-widest">{book.genre}</span>
                      <div className="mt-auto">
                        <h3 className="font-serif text-white text-xl font-bold leading-tight drop-shadow-sm">{book.title}</h3>
                        <p className="text-white/85 text-xs mt-1.5">{book.author}</p>
                      </div>
                    </div>
                    <img
                      key={book.id}
                      src={coverSrc}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="eyebrow text-brand-600">{book.grade} · 整本书阅读</span>
                    <h1 className="font-serif text-h1 sm:text-display font-bold text-ink-900 mt-2 tracking-tightish">{book.title}</h1>
                    <p className="text-ink-500 mt-1">{book.author}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {book.tags?.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-ink-50 text-ink-600 text-micro font-medium">{t}</span>
                      ))}
                    </div>
                    <p className="text-ink-600 mt-5 leading-relaxed text-base">{book.summary}</p>
                    <button
                      onClick={() => setMode('read')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-6 self-start rounded-xl bg-accent-grad text-white text-title font-semibold shadow-glow-accent transition hover:brightness-105 active:scale-[0.98]"
                    >
                      <BookOpen className="w-5 h-5" /> 开始阅读
                    </button>
                  </div>
                </div>
                <div className="border-t border-hair bg-surface-soft p-7 sm:p-9">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <h3 className="font-serif text-h3 font-bold text-ink-900">阅读指导</h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 mt-5">
                    {[
                      { t: '读前激活', d: '从书名与封面出发，猜一猜故事会发生什么，建立阅读期待。' },
                      { t: '边读边想', d: '遇到打动你的句子就停下来批注，记录人物的选择与你的疑问。' },
                      { t: '读后回味', d: '合上书想一想：如果是你，你会怎么做？把感受写成一段读后感。' },
                    ].map((g) => (
                      <div key={g.t} className="rounded-2xl bg-surface border border-hair p-5 shadow-e1">
                        <h4 className="font-semibold text-ink-900">{g.t}</h4>
                        <p className="text-caption text-ink-500 mt-2 leading-relaxed">{g.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* 章标题头（书外，避免干扰翻页书分页测量） */}
                <div className="text-center mb-5">
                  <span className="eyebrow text-brand-500">第 {chapter + 1} 章</span>
                  <h1 className="font-serif text-h1 sm:text-display font-bold text-ink-900 mt-2">{chapters[chapter]}</h1>
                  <div className="inline-flex items-center gap-2 mt-3 text-caption text-ink-400">
                    <Bookmark className="w-3.5 h-3.5" /> 选自《{book.title}》· 样章节选
                  </div>
                </div>

                {/* 3D 翻页书正文（HTML 动态分页 + react-pageflip） */}
                <FlipReader
                  ref={flipRef}
                  book={book}
                  chapterIndex={chapter}
                  chapterTitle={chapters[chapter]}
                  paragraphs={sampleParagraphs}
                  onPageChange={handlePageChange}
                  annotations={currentAnnotations}
                  onExplain={handleExplain}
                  onAsk={handleAsk}
                  onAnnotate={handleAnnotate}
                />

                {/* 上一章 / 下一章 */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-hair">
                  <button
                    onClick={() => setChapter((c) => Math.max(0, c - 1))}
                    disabled={chapter === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-600 border border-ink-150 bg-surface transition hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> 上一章
                  </button>
                  <span className="text-caption text-ink-400">{chapter + 1} / {chapters.length} 章</span>
                  <button
                    onClick={() => setChapter((c) => Math.min(chapters.length - 1, c + 1))}
                    disabled={chapter === chapters.length - 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-grad shadow-glow transition hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    下一章 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右侧 AI 学伴 sider */}
          {aiOpen && (
            <AISidebar
              book={book}
              chapterTitle={chapters[chapter]}
              pageNo={mode === 'read' ? pageInfo.pageNo : undefined}
              totalPages={mode === 'read' ? pageInfo.totalPages : undefined}
              pageText={mode === 'read' ? pageInfo.pageText : ''}
              command={aiCommand}
              onClose={() => setAiOpen(false)}
            />
          )}
        </div>
      </div>

      {/* 收起后的悬浮唤起按钮 */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="hidden xl:inline-flex items-center gap-2 fixed right-6 bottom-6 z-40 px-5 py-3 rounded-full bg-brand-grad text-white text-title font-semibold shadow-glow animate-float"
        >
          <Sparkles className="w-5 h-5" /> AI 学伴
        </button>
      )}
    </div>
  )
}
