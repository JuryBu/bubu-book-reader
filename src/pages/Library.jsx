import { useMemo, useState } from 'react'
import { Sparkles, GraduationCap, Layers, Library as LibraryIcon, ArrowDown } from 'lucide-react'
import { Icon, Eyebrow, GenreTag, BookCard, cx } from '../components/ui.jsx'
import { books, genreMeta, stages, stageOf } from '../data/books.js'

const slugForStage = (key) => `stage-${key}`

// —— 顶部统计 —— 由真实书库派生，像真站一样有数据支撑
function useLibraryStats() {
  return useMemo(() => {
    const genres = new Set(books.map((b) => b.genre))
    const coveredStages = stages.filter((s) => books.some((b) => stageOf(b.grade).key === s.key))
    return [
      { value: books.length, label: '精选书目' },
      { value: `${coveredStages.length}`, label: '覆盖学段', suffix: ' 个' },
      { value: genres.size, label: '阅读体裁' },
    ]
  }, [])
}

// —— 体裁筛选胶囊（纯前端高亮）——
function GenrePill({ name, active, count, onClick }) {
  const m = genreMeta[name] || { color: '#3B66F5', soft: '#EEF2FF' }
  return (
    <button
      onClick={onClick}
      className={cx(
        'group inline-flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-220',
        active
          ? 'text-white border-transparent shadow-e2 -translate-y-0.5'
          : 'bg-surface text-ink-600 border-hair hover:border-brand-200 hover:text-ink-900 hover:shadow-e1',
      )}
      style={active ? { backgroundColor: m.color } : undefined}
    >
      <span
        className="w-2.5 h-2.5 rounded-full ring-2 ring-white/40 shrink-0"
        style={{ backgroundColor: active ? 'rgba(255,255,255,0.9)' : m.color }}
      />
      {name}
      <span className={cx('text-micro font-bold px-1.5 py-0.5 rounded-full', active ? 'bg-white/20 text-white' : 'bg-ink-50 text-ink-400')}>
        {count}
      </span>
    </button>
  )
}

export default function Library() {
  const stats = useLibraryStats()
  const [activeStage, setActiveStage] = useState(null) // 仅用于侧栏视觉高亮
  const [activeGenre, setActiveGenre] = useState(null) // null = 全部体裁

  // 体裁 → 数量
  const genreCounts = useMemo(() => {
    const map = {}
    Object.keys(genreMeta).forEach((g) => (map[g] = 0))
    books.forEach((b) => (map[b.genre] = (map[b.genre] || 0) + 1))
    return map
  }, [])

  // 每个学段的书目总数（不受体裁筛选影响，用于侧栏计数）
  const stageCounts = useMemo(() => {
    const map = {}
    stages.forEach((s) => (map[s.key] = 0))
    books.forEach((b) => (map[stageOf(b.grade).key] += 1))
    return map
  }, [])

  // 按学段分组（低 / 中 / 高），并应用体裁筛选
  const groups = useMemo(() => {
    return stages
      .map((s) => ({
        meta: s,
        items: books.filter((b) => stageOf(b.grade).key === s.key && (!activeGenre || b.genre === activeGenre)),
      }))
      .filter((grp) => grp.items.length > 0)
  }, [activeGenre])

  const matchedCount = groups.reduce((n, g) => n + g.items.length, 0)

  // 平滑滚动到学段锚点
  const scrollToStage = (key) => {
    setActiveStage(key)
    const el = document.getElementById(slugForStage(key))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* —— 紧凑 Hero —— */}
      <section className="relative overflow-hidden bg-page-glow border-b border-hair">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-caption font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 精选书架
            </span>
            <h1 className="font-serif text-display sm:text-display-lg font-bold text-ink-900 mt-5 tracking-tightish leading-[1.14]">
              读一本好书，<span className="text-brand-600">遇见更大的世界</span>
            </h1>
            <p className="text-ink-500 text-base sm:text-title mt-5 leading-relaxed max-w-2xl">
              覆盖 1–6 年级的「快乐读书吧」分级书目与中外经典名著，按学段拾级而上、依体裁各得其所——为每个孩子找到此刻最该读的那一本。
            </p>
          </div>
          {/* 统计条 */}
          <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-5">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-10">
                <div>
                  <div className="font-serif text-display font-bold text-ink-900 leading-none">
                    {s.value}
                    {s.suffix && <span className="text-h3 text-ink-400 font-sans font-semibold ml-1">{s.suffix}</span>}
                  </div>
                  <div className="text-caption text-ink-500 mt-1.5 tracking-wide">{s.label}</div>
                </div>
                {i < stats.length - 1 && <span className="hidden sm:block w-px h-10 bg-hair" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— 主体两栏 —— */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-14">
        <div className="grid lg:grid-cols-[248px_1fr] gap-8 lg:gap-12 items-start">
          {/* 左侧 sticky 筛选侧栏 */}
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto space-y-7 animate-fade-up pr-1">
            {/* 学段导航 */}
            <div className="rounded-2xl bg-surface border border-hair shadow-e1 p-5">
              <div className="flex items-center gap-2 text-ink-400">
                <GraduationCap className="w-4 h-4" />
                <Eyebrow>按学段浏览</Eyebrow>
              </div>
              <nav className="mt-4 space-y-1">
                {stages.map((s) => {
                  const count = stageCounts[s.key]
                  const active = activeStage === s.key
                  return (
                    <button
                      key={s.key}
                      onClick={() => scrollToStage(s.key)}
                      className={cx(
                        'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-220',
                        active ? 'bg-brand-50 shadow-inner-hi' : 'hover:bg-ink-50',
                      )}
                    >
                      <span
                        className={cx(
                          'grid place-items-center w-8 h-8 rounded-lg shrink-0 transition-colors',
                          active ? 'text-white shadow-e1' : 'text-ink-400 bg-ink-50 group-hover:text-ink-600',
                        )}
                        style={active ? { backgroundColor: s.accent } : undefined}
                      >
                        <Icon name={s.icon} className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx('block text-sm font-semibold transition-colors', active ? 'text-brand-700' : 'text-ink-700 group-hover:text-ink-900')}>
                          {s.label}
                        </span>
                        <span className="block text-micro text-ink-400">{s.range} · {s.stage}</span>
                      </span>
                      <span className={cx('text-micro font-bold tabular-nums', active ? 'text-brand-500' : 'text-ink-300')}>{count}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* 体裁筛选 */}
            <div className="rounded-2xl bg-surface border border-hair shadow-e1 p-5">
              <div className="flex items-center gap-2 text-ink-400">
                <Layers className="w-4 h-4" />
                <Eyebrow>按体裁筛选</Eyebrow>
              </div>
              <div className="mt-4 space-y-1">
                <button
                  onClick={() => setActiveGenre(null)}
                  className={cx(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
                    activeGenre === null ? 'bg-brand-grad text-white shadow-glow' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                  )}
                >
                  全部体裁
                  <span className={cx('text-micro font-bold px-1.5 py-0.5 rounded-full', activeGenre === null ? 'bg-white/20' : 'bg-ink-50 text-ink-400')}>
                    {books.length}
                  </span>
                </button>
                {Object.keys(genreMeta).map((name) => {
                  const m = genreMeta[name]
                  const active = activeGenre === name
                  return (
                    <button
                      key={name}
                      onClick={() => setActiveGenre(active ? null : name)}
                      className={cx(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        active ? 'font-semibold shadow-e1' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                      )}
                      style={active ? { color: m.color, background: m.soft } : undefined}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {name}
                      </span>
                      <span className="text-micro font-bold text-ink-400">{genreCounts[name]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 侧栏底部小贴士卡 */}
            <div className="rounded-2xl bg-brand-grad-soft border border-brand-100 p-5">
              <span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-surface text-brand-600 shadow-e1">
                <Sparkles className="w-4.5 h-4.5" />
              </span>
              <p className="text-sm font-semibold text-ink-800 mt-3 leading-snug">读不下去？让 AI 学伴陪你</p>
              <p className="text-caption text-ink-500 mt-1.5 leading-relaxed">
                每本书都配有章节引导与读后提问，慢节奏陪读，读完一本不再难。
              </p>
            </div>
          </aside>

          {/* 右侧书目区 */}
          <div className="min-w-0">
            {/* 顶部体裁标签快筛行 */}
            <div className="flex flex-wrap items-center gap-2.5 pb-7 border-b border-hair">
              <GenrePill name="全部" active={activeGenre === null} count={books.length} onClick={() => setActiveGenre(null)} />
              {Object.keys(genreMeta).map((name) => (
                <GenrePill
                  key={name}
                  name={name}
                  count={genreCounts[name]}
                  active={activeGenre === name}
                  onClick={() => setActiveGenre(activeGenre === name ? null : name)}
                />
              ))}
              <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-caption text-ink-400">
                <LibraryIcon className="w-4 h-4" />
                共 <strong className="text-ink-700 font-bold tabular-nums">{matchedCount}</strong> 本
              </span>
            </div>

            {/* 当前筛选态提示（仅筛选时出现，避免空感） */}
            {activeGenre && (
              <div className="mt-6 flex items-center gap-3 animate-fade-in">
                <span className="text-sm text-ink-500">
                  正在浏览 <GenreTag genre={activeGenre} className="mx-0.5" /> 类，共 {matchedCount} 本
                </span>
                <button onClick={() => setActiveGenre(null)} className="text-caption font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  清除筛选
                </button>
              </div>
            )}

            {/* 按学段分组 */}
            <div className="mt-8 space-y-14">
              {groups.map((grp, gi) => (
                <section key={grp.meta.key} id={slugForStage(grp.meta.key)} className="scroll-mt-24 animate-fade-up" style={{ animationDelay: `${gi * 60}ms` }}>
                  {/* 分组小标题 */}
                  <div className="flex items-center gap-4">
                    <span
                      className="grid place-items-center w-12 h-12 rounded-2xl text-white shadow-e2 shrink-0"
                      style={{ backgroundColor: grp.meta.accent }}
                    >
                      <Icon name={grp.meta.icon} className="w-6 h-6" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-serif text-h1 font-bold text-ink-900 tracking-tightish">{grp.meta.label}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-ink-50 text-micro font-semibold text-ink-500">{grp.meta.range} · {grp.meta.stage}</span>
                        <span className="text-micro text-ink-400 tabular-nums">{grp.items.length} 本</span>
                      </div>
                      <p className="text-caption sm:text-sm text-ink-500 mt-0.5 leading-snug">{grp.meta.blurb}</p>
                    </div>
                  </div>

                  {/* 书卡网格 */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7">
                    {grp.items.map((b) => (
                      <BookCard key={b.id} book={b} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* 收尾彩蛋条 —— 让长列表底部不空 */}
            <div className="mt-16 rounded-3xl bg-ink-900 px-8 py-10 sm:px-12 sm:py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-page-glow opacity-80" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:justify-between">
                <div>
                  <Eyebrow className="text-brand-300">读完一本，再读一本</Eyebrow>
                  <h3 className="font-serif text-h1 sm:text-display font-bold text-white mt-2.5 tracking-tightish">
                    {books.length} 本书，等一个慢慢翻完的孩子
                  </h3>
                  <p className="text-ink-300 mt-3 max-w-md leading-relaxed text-sm">
                    书目持续扩充中，更多分级读物与二语阅读即将上架。挑一本喜欢的，从今天开始读起。
                  </p>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface text-ink-800 text-title font-semibold shadow-e2 transition hover:brightness-105 active:scale-[0.98] shrink-0"
                >
                  <ArrowDown className="w-4.5 h-4.5 rotate-180" /> 回到顶部
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
