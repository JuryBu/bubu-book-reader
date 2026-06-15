import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react'
import { Icon, Eyebrow, SectionHead, PrimaryButton, GhostButton, cx } from '../components/ui.jsx'
import { evalDims, evalPhases, teacherProgram } from '../data/site.js'

// 五维成长评估的图标 / 配色补充（仅用 token 色，accent 克制点睛）
const dimMeta = [
  { icon: 'Activity', color: '#3B66F5', soft: '#EEF2FF', metrics: ['阅读频率', '持续时长', '坚持度'] },
  { icon: 'BrainCircuit', color: '#2E51DB', soft: '#DBE3FF', metrics: ['文本理解', '推理判断', '语言表达'] },
  { icon: 'Flame', color: '#FF9D42', soft: '#FFF1E2', metrics: ['阅读兴趣', '自我效能', '内在动机'] },
  { icon: 'HeartPulse', color: '#12B886', soft: '#E7F8F1', metrics: ['注意专注', '情绪状态', '心理韧性'] },
  { icon: 'Sparkles', color: '#7A5BFF', soft: '#F0ECFF', metrics: ['创造想象', '审美感受', '社会责任'] },
]

// 三段时间轴的视觉补充
const phaseMeta = [
  { icon: 'PlayCircle', tag: '建立基线', tools: ['趣味任务测评', '兴趣画像', '个性化书单'] },
  { icon: 'Gauge', tag: '过程追踪', tools: ['行为日志', '章节小问答', 'AI 学伴记录'] },
  { icon: 'FileBarChart', tag: '成长复盘', tools: ['分层理解测验', '动机量表', '读书笔记量规'] },
]

// 三级成长报告（页面内局部数据，对齐方案口径）
const reports = [
  {
    key: 'child',
    icon: 'UserRound',
    name: '儿童个体成长画像',
    audience: '面向 · 家长 / 班主任',
    color: '#3B66F5',
    soft: '#EEF2FF',
    desc: '以五维雷达呈现单个孩子从前测到后测的成长轨迹，标注阅读高光时刻与可关注信号，配套个性化书单与陪读建议。',
    points: ['五维成长雷达', '阅读轨迹时间线', '个性化进阶书单'],
    stat: { value: '5', unit: '维', label: '成长维度全景' },
  },
  {
    key: 'class',
    icon: 'Users',
    name: '班级阅读画像',
    audience: '面向 · 任课教师',
    color: '#12B886',
    soft: '#E7F8F1',
    desc: '汇聚全班阅读行为与理解分布，定位共性薄弱点与高潜学生，输出可直接落地的下一阶段教学调整建议。',
    points: ['班级能力分布', '薄弱点热力图', '教学调整建议'],
    stat: { value: '周', unit: '报', label: '过程数据节律' },
  },
  {
    key: 'school',
    icon: 'Building2',
    name: '学校阅读画像',
    audience: '面向 · 校级管理者',
    color: '#7A5BFF',
    soft: '#F0ECFF',
    desc: '跨年级、跨班级的阅读素养总览，呈现年级梯度与学期趋势，为校本阅读课程与资源配置提供数据决策依据。',
    points: ['年级梯度对比', '学期趋势曲线', '校本课程依据'],
    stat: { value: '1–6', unit: '年级', label: '全学段覆盖' },
  },
]

// 教师五阶段循环的描述补充
const cycleMeta = [
  { icon: 'Rocket', desc: '激活已有经验与阅读期待，搭建进入文本的「脚手架」。' },
  { icon: 'PenLine', desc: '边读边批注、边读边提问，把无形的思维过程显性化。' },
  { icon: 'MessagesSquare', desc: '围绕核心议题组织共读讨论，碰撞观点、深化理解。' },
  { icon: 'Presentation', desc: '以表达、创作或表演输出，把阅读所得迁移为能力。' },
  { icon: 'ClipboardCheck', desc: '回看成长数据复盘教与学，闭环优化下一轮设计。' },
]

function HeroOrbit() {
  const n = dimMeta.length
  const C = 210 // SVG 画布中心
  const angles = dimMeta.map((_, i) => (i / n) * Math.PI * 2 - Math.PI / 2)
  // 雷达网格多边形顶点（多层）
  const ring = (radius) =>
    angles.map((a) => `${C + Math.cos(a) * radius},${C + Math.sin(a) * radius}`).join(' ')
  // 一条「样本」成长数据多边形（视觉示意）
  const sample = [0.92, 0.74, 0.86, 0.68, 0.8]
  const dataPoly = angles
    .map((a, i) => `${C + Math.cos(a) * 150 * sample[i]},${C + Math.sin(a) * 150 * sample[i]}`)
    .join(' ')

  return (
    <div className="relative h-[420px] hidden lg:block animate-fade-in">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px]">
        {/* 雷达盘 SVG */}
        <svg viewBox="0 0 420 420" className="absolute inset-0 w-full h-full">
          {/* 网格环 */}
          {[150, 112, 74, 36].map((r) => (
            <polygon key={r} points={ring(r)} fill="none" stroke="#BBCBFF" strokeOpacity="0.45" strokeWidth="1" />
          ))}
          {/* 辐条 */}
          {angles.map((a, i) => (
            <line
              key={i}
              x1={C}
              y1={C}
              x2={C + Math.cos(a) * 150}
              y2={C + Math.sin(a) * 150}
              stroke="#BBCBFF"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
          ))}
          {/* 成长数据多边形 */}
          <polygon points={dataPoly} fill="#3B66F5" fillOpacity="0.12" stroke="#3B66F5" strokeWidth="2" strokeLinejoin="round" />
          {angles.map((a, i) => (
            <circle key={i} cx={C + Math.cos(a) * 150 * sample[i]} cy={C + Math.sin(a) * 150 * sample[i]} r="4" fill="#3B66F5" />
          ))}
        </svg>

        {/* 中心徽标 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-brand-grad shadow-e4 grid place-items-center">
          <div className="absolute inset-0 bg-hero-sheen rounded-full opacity-70" />
          <div className="relative text-center text-white">
            <div className="font-serif text-display font-bold leading-none">5</div>
            <div className="text-micro mt-1 tracking-widest opacity-90">维评估</div>
          </div>
        </div>

        {/* 五维标签（落在各顶点外侧） */}
        {dimMeta.map((d, i) => {
          const a = angles[i]
          const x = Math.cos(a) * 190
          const y = Math.sin(a) * 190
          return (
            <div
              key={d.icon}
              className="absolute left-1/2 top-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface shadow-e3 border border-hair animate-float whitespace-nowrap"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, animationDelay: `${i * 0.4}s` }}
            >
              <span className="grid place-items-center w-6 h-6 rounded-full shrink-0" style={{ background: d.soft, color: d.color }}>
                <Icon name={d.icon} className="w-3.5 h-3.5" />
              </span>
              <span className="text-caption font-semibold text-ink-700">{evalDims[i].title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Resources() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-page-glow">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-caption font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 资源与评估
            </span>
            <h1 className="font-serif text-display sm:text-display-lg lg:text-display-xl font-bold text-ink-900 mt-5 tracking-tightish leading-[1.14]">
              看见成长，<br />让阅读<span className="text-brand-600">可被衡量</span>
            </h1>
            <p className="text-ink-500 text-title sm:text-h3 mt-6 leading-relaxed max-w-xl">
              以脑科学与心理测量为底座，把阅读过程沉淀为可观察、可评估的成长数据——五维评估、三段测评、三级报告与教师赋能，构成完整的成长支持体系。
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <PrimaryButton to="/about">了解评估体系 <ArrowRight className="w-4.5 h-4.5" /></PrimaryButton>
              <GhostButton to="/library">查看书架</GhostButton>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-12 max-w-lg">
              {[
                { value: '5', label: '成长评估维度' },
                { value: '3', label: '段式测评节律' },
                { value: '3', label: '级成长报告' },
                { value: '3', label: '阶教师认证' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-h1 font-bold text-ink-900">{s.value}</div>
                  <div className="text-caption text-ink-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroOrbit />
        </div>
      </section>

      {/* 五维成长评估 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="五维成长评估"
          title="不止于分数，看见完整的成长"
          desc="从阅读行为到综合素质，五个维度交叉描画一个孩子的真实成长，让评估服务于发展而非排名。"
          center
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-12">
          {evalDims.map((d, i) => {
            const m = dimMeta[i]
            return (
              <div
                key={d.key}
                className="group rounded-2xl bg-surface border border-hair p-6 shadow-e1 transition hover:shadow-e3 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl shadow-e1" style={{ background: m.soft, color: m.color }}>
                    <Icon name={m.icon} className="w-6 h-6" />
                  </span>
                  <span className="font-serif text-display font-bold leading-none" style={{ color: m.color, opacity: 0.16 }}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-serif text-h3 font-bold text-ink-900 mt-5">{d.title}</h3>
                <p className="text-caption text-ink-500 mt-2 leading-relaxed">{d.desc}</p>
                <div className="mt-4 pt-4 border-t border-hair flex flex-wrap gap-1.5">
                  {m.metrics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-micro font-medium" style={{ background: m.soft, color: m.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 前中后测时间轴 */}
      <section className="bg-surface-soft border-y border-hair">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="前测 · 中测 · 后测"
            title="贯穿全程的三段式测评"
            desc="不是一次性的期末考，而是伴随阅读全过程的连续测量——每一段都对应清晰的目标与工具。"
            center
          />
          <div className="relative mt-14">
            {/* 连接线（两端内缩、对齐节点圆心） */}
            <div className="hidden md:block absolute left-[16.66%] right-[16.66%] top-7 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {evalPhases.map((p, i) => {
                const m = phaseMeta[i]
                return (
                  <div key={p.key} className="relative">
                    {/* 序号节点 */}
                    <div className="flex md:justify-center">
                      <span className="relative z-10 grid place-items-center w-14 h-14 rounded-full bg-brand-grad text-white font-serif text-h2 font-bold shadow-glow ring-4 ring-surface-soft">
                        {i + 1}
                      </span>
                    </div>
                    <div className="mt-6 md:mt-7 rounded-2xl bg-surface border border-hair p-7 shadow-e1 transition hover:shadow-e3 h-full">
                      <div className="flex items-center gap-2.5">
                        <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-600">
                          <Icon name={m.icon} className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="font-serif text-h2 font-bold text-ink-900 leading-tight">{p.name}</h3>
                          <span className="text-micro font-semibold text-brand-600">{m.tag}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full bg-ink-50 text-caption text-ink-500">
                        <Icon name="Clock" className="w-3.5 h-3.5" /> {p.when}
                      </div>
                      <p className="text-sm text-ink-600 mt-3 leading-relaxed">{p.desc}</p>
                      <div className="mt-5 pt-4 border-t border-hair space-y-2">
                        {m.tools.map((t) => (
                          <div key={t} className="flex items-center gap-2 text-caption text-ink-600">
                            <Icon name="Check" className="w-4 h-4 text-success-500 shrink-0" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 三级成长报告 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="三级成长报告"
          title="从一个孩子，到一所学校"
          desc="同一套评估数据，按个体、班级、学校三个层级自动生成对应报告，让不同角色各取所需。"
          center
        />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {reports.map((r) => (
            <div
              key={r.key}
              className="group relative rounded-3xl bg-surface border border-hair p-8 shadow-e1 transition hover:shadow-e3 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90"
                style={{ background: r.soft }}
              />
              <div className="relative flex items-center justify-between">
                <span className="grid place-items-center w-14 h-14 rounded-2xl text-white shadow-e2" style={{ backgroundColor: r.color }}>
                  <Icon name={r.icon} className="w-7 h-7" />
                </span>
                <span className="text-micro font-semibold px-2.5 py-1 rounded-full" style={{ background: r.soft, color: r.color }}>
                  {r.audience}
                </span>
              </div>
              <h3 className="relative font-serif text-h2 font-bold text-ink-900 mt-6">{r.name}</h3>
              <p className="relative text-sm text-ink-500 mt-3 leading-relaxed">{r.desc}</p>
              <ul className="relative mt-5 space-y-2.5">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <span className="grid place-items-center w-5 h-5 rounded-full shrink-0" style={{ background: r.soft, color: r.color }}>
                      <Icon name="Check" className="w-3 h-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto pt-6">
                <div className="flex items-end gap-2 pt-5 border-t border-hair">
                  <span className="font-serif text-display font-bold leading-none" style={{ color: r.color }}>{r.stat.value}</span>
                  <span className="font-serif text-h3 font-bold mb-0.5" style={{ color: r.color }}>{r.stat.unit}</span>
                  <span className="text-caption text-ink-400 mb-1 ml-1">{r.stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 教师赋能体系 */}
      <section className="bg-surface-soft border-y border-hair">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead eyebrow="教师赋能体系" title={teacherProgram.title} desc={teacherProgram.desc} center />

          {/* 三级认证 */}
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {teacherProgram.certs.map((c, i) => (
              <div
                key={c}
                className={cx(
                  'relative rounded-2xl p-7 shadow-e1 border transition hover:shadow-e3 hover:-translate-y-0.5 overflow-hidden',
                  i === 1 ? 'bg-brand-grad text-white border-transparent' : 'bg-surface border-hair',
                )}
              >
                {i === 1 && <div className="absolute inset-0 bg-hero-sheen opacity-70" />}
                <div className="relative flex items-center justify-between">
                  <span
                    className={cx(
                      'grid place-items-center w-12 h-12 rounded-2xl',
                      i === 1 ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-600',
                    )}
                  >
                    {i === 2 ? <GraduationCap className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </span>
                  <span className={cx('eyebrow', i === 1 ? 'text-white/70' : 'text-ink-300')}>L{i + 1}</span>
                </div>
                <h3 className={cx('relative font-serif text-h2 font-bold mt-5', i === 1 ? 'text-white' : 'text-ink-900')}>{c}</h3>
                <p className={cx('relative text-sm mt-2.5 leading-relaxed', i === 1 ? 'text-white/85' : 'text-ink-500')}>
                  {['掌握整书阅读基础课型，独立组织班级共读与基础测评。',
                    '能设计单元化阅读方案，引导深度讨论与多元表达评价。',
                    '主导校本教研与课程开发，带教培养新一批指导师。'][i]}
                </p>
              </div>
            ))}
          </div>

          {/* 五阶段循环流程线 */}
          <div className="mt-14 rounded-3xl bg-surface border border-hair p-8 sm:p-10 shadow-e1">
            <div className="flex items-center gap-2 justify-center">
              <Icon name="RefreshCw" className="w-4 h-4 text-brand-500" />
              <Eyebrow>五阶段教学循环</Eyebrow>
            </div>
            <p className="text-center text-ink-500 text-sm mt-2 max-w-xl mx-auto leading-relaxed">
              一条可复用的课堂流程，从激活到反思形成闭环，让「怎么教、怎么评」落到每一节阅读课。
            </p>
            <div className="relative mt-12">
              {/* 流程连接线（内缩对齐首尾节点圆心） */}
              <div className="hidden lg:block absolute left-[10%] right-[10%] top-7 h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-accent-300" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
                {teacherProgram.cycle.map((step, i) => {
                  const m = cycleMeta[i]
                  const isLast = i === teacherProgram.cycle.length - 1
                  return (
                    <div key={step} className="relative text-center">
                      <div className="flex justify-center">
                        <span
                          className={cx(
                            'relative z-10 grid place-items-center w-14 h-14 rounded-2xl text-white shadow-glow ring-4 ring-surface',
                            isLast ? 'bg-accent-grad' : 'bg-brand-grad',
                          )}
                        >
                          <Icon name={m.icon} className="w-6 h-6" />
                        </span>
                      </div>
                      <div className="mt-4">
                        <span className="text-micro font-bold text-brand-400">STEP {i + 1}</span>
                        <h4 className="font-serif text-h3 font-bold text-ink-900 mt-1">{step}</h4>
                        <p className="text-caption text-ink-500 mt-2 leading-relaxed px-1">{m.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 收尾 CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-ink-900 p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-page-glow" />
          <div className="relative">
            <h2 className="font-serif text-display font-bold text-white">让每一次阅读都被看见</h2>
            <p className="text-ink-300 mt-4 max-w-xl mx-auto leading-relaxed">
              用科学的评估与扎实的教师支持，把阅读的成长写进数据，也写进每个孩子的成长故事里。
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <PrimaryButton to="/library">进入书架 <ArrowRight className="w-4.5 h-4.5" /></PrimaryButton>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white text-title font-semibold border border-white/15 transition hover:bg-white/15"
              >
                了解项目
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
