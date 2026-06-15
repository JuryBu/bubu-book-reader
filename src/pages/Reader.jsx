import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clock, FileText, Sparkles, Bookmark, X, Send, Lightbulb } from 'lucide-react'
import { getBook } from '../data/books.js'
import { GenreTag, cx } from '../components/ui.jsx'

// 各书章节目录（默认书《安徒生童话》给真实篇目；其它书用通用结构）
const chaptersByBook = {
  andesen: ['丑小鸭', '海的女儿', '拇指姑娘', '夜莺', '坚定的锡兵', '野天鹅', '皇帝的新装', '雪人'],
  xiyou: ['猴王出世', '大闹天宫', '三打白骨精', '车迟国斗法', '女儿国奇遇', '真假美猴王', '火焰山', '取得真经'],
  daocaoren: ['稻草人', '小白船', '芳儿的梦', '一粒种子', '画眉', '玫瑰和金鱼', '富翁', '快乐的人'],
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
function AISidebar({ book, onClose }) {
  const msgs = [
    { role: 'ai', text: `嗨！我是你的 AI 学伴 ✨ 准备读《${book.title}》了吗？读之前先热个身——你最想在这本书里看到什么呢？` },
    { role: 'user', text: '想看看主角会遇到什么。' },
    { role: 'ai', text: '好奇心是最好的开始！读的过程中，遇到打动你的句子、或者不太明白的地方，随时问我。我会陪着你，一章一章慢慢把它读完。' },
  ]
  const chips = ['这一章讲了什么', '为什么这样写', '读完想一想']
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-50 text-ink-400 text-[11px]">
          <Lightbulb className="w-3 h-3" /> 已结合本章内容为你引导
        </div>
        {msgs.map((m, i) =>
          m.role === 'ai' ? (
            <div key={i} className="flex gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="rounded-2xl rounded-tl-md bg-surface-soft border border-hair px-3.5 py-2.5 text-sm text-ink-700 leading-relaxed">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="rounded-2xl rounded-tr-md bg-brand-grad text-white px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-glow">
                {m.text}
              </div>
            </div>
          ),
        )}
      </div>
      {/* 输入区 */}
      <div className="border-t border-hair p-3 bg-surface">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {chips.map((c) => (
            <button
              key={c}
              className="px-2.5 py-1 rounded-full bg-ink-50 text-ink-600 text-[11px] font-medium hover:bg-brand-50 hover:text-brand-600 transition"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-ink-150 bg-surface-soft px-3 py-2 focus-within:border-brand-300 transition">
          <input
            className="flex-1 bg-transparent text-sm text-ink-700 placeholder:text-ink-400 outline-none"
            placeholder="问问 AI 学伴…"
          />
          <button className="grid place-items-center w-8 h-8 rounded-xl bg-brand-grad text-white shadow-glow shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function Reader() {
  const { bookId } = useParams()
  const book = getBook(bookId)
  const chapters = getChapters(book)
  const [c1, c2] = book.cover || ['#4C7DFF', '#3B66F5']
  const [mode, setMode] = useState('detail')
  const [chapter, setChapter] = useState(0)
  const [aiOpen, setAiOpen] = useState(true)

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
                <span className="hidden sm:inline text-caption text-ink-500">第 {chapter + 1} / {chapters.length} 章</span>
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
              <article className="rounded-3xl bg-paper border border-hair shadow-e2 animate-fade-in">
                <div className="mx-auto max-w-[68ch] px-6 sm:px-10 py-10 sm:py-14">
                  <div className="text-center">
                    <span className="eyebrow text-brand-500">第 {chapter + 1} 章</span>
                    <h1 className="font-serif text-h1 sm:text-display font-bold text-ink-900 mt-3">{chapters[chapter]}</h1>
                    <div className="inline-flex items-center gap-2 mt-4 text-caption text-ink-400">
                      <Bookmark className="w-3.5 h-3.5" /> 选自《{book.title}》· 样章节选
                    </div>
                    <div className="w-12 h-0.5 bg-brand-200 mx-auto mt-6" />
                  </div>
                  <div className="prose-reader mt-8">
                    {sampleParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    <p className="text-center text-ink-300 mt-8">· · ·</p>
                  </div>
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-hair">
                    <button
                      onClick={() => setChapter((c) => Math.max(0, c - 1))}
                      disabled={chapter === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-600 border border-ink-150 bg-surface transition hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" /> 上一章
                    </button>
                    <span className="text-caption text-ink-400">{chapter + 1} / {chapters.length}</span>
                    <button
                      onClick={() => setChapter((c) => Math.min(chapters.length - 1, c + 1))}
                      disabled={chapter === chapters.length - 1}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-grad shadow-glow transition hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      下一章 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* 右侧 AI 学伴 sider */}
          {aiOpen && <AISidebar book={book} onClose={() => setAiOpen(false)} />}
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
