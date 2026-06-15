import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Quote, ShieldCheck } from 'lucide-react'
import { Icon, Eyebrow, SectionHead, PrimaryButton, GhostButton, cx } from '../components/ui.jsx'
import { site, missions, ideas } from '../data/site.js'

// —— 页面局部数据（合理虚构，贴合项目方案） ——

// 项目关键数字（hero 下方支撑条）
const aboutStats = [
  { value: '50', label: '首批试点学生' },
  { value: '1', label: '所示范小学' },
  { value: '5', label: '维成长评估' },
  { value: '2026', label: '试点启动年' },
]

// 政策背景（4 条政策方向）
const policies = [
  {
    key: 'reading',
    icon: 'BookMarked',
    title: '全民阅读与书香校园',
    org: '《全民阅读“十四五”规划》',
    desc: '深入推进青少年阅读，将“爱读书、读好书、善读书”融入校园日常，为整本书阅读提供国家级政策牵引。',
    color: '#3B66F5',
  },
  {
    key: 'mental',
    icon: 'HeartPulse',
    title: '学生心理健康专项',
    org: '《全面加强和改进新时代学生心理健康工作专项行动计划》',
    desc: '把心理健康教育贯穿育人全过程，倡导以美育、阅读等方式预防干预，与本项目“在阅读中关照心理”同向同行。',
    color: '#F2553D',
  },
  {
    key: 'digital',
    icon: 'MonitorSmartphone',
    title: '教育数字化战略',
    org: '国家教育数字化战略行动',
    desc: '推动优质资源数字化、规范电子屏幕使用，为“电子屏幕整书阅读”确立健康、可持续的产品基线。',
    color: '#12B886',
  },
  {
    key: 'ai',
    icon: 'Cpu',
    title: 'AI 赋能教育',
    org: '《教育部关于人工智能赋能教育的指导意见》',
    desc: '鼓励以人工智能助力个性化学习与教学评价改革，为 AI 学伴陪读与多维成长评估提供清晰的应用场景。',
    color: '#7A5BFF',
  },
]

// 脑科学依据（4 条）
const brainEvidence = [
  {
    key: 'language',
    icon: 'MessagesSquare',
    title: '激活语言网络',
    metric: '语言加工',
    desc: '持续的整本书阅读会反复调用左侧颞叶—额叶语言回路，强化词汇通达与句法解析，奠定语言素养的神经基础。',
  },
  {
    key: 'memory',
    icon: 'Brain',
    title: '锻炼工作记忆',
    metric: '信息保持',
    desc: '跨章节追踪人物、情节与伏笔，要求大脑在前额叶持续保持并更新信息，长期阅读与工作记忆容量正相关。',
  },
  {
    key: 'executive',
    icon: 'Target',
    title: '发展执行功能',
    metric: '专注调控',
    desc: '沉浸式深度阅读需要抑制干扰、维持注意与自我监控，正是前额叶执行功能的高质量训练场。',
  },
  {
    key: 'reasoning',
    icon: 'Network',
    title: '促进推理发展',
    metric: '高阶思维',
    desc: '推断动机、预测走向、整合主旨，调动默认模式网络与心智理论，推动从“读懂字面”走向“理解世界”。',
  },
]

// hero 装饰：核心使命浮签
function HeroArt() {
  const tags = [
    { icon: 'BookOpen', text: '阅读素养', cls: '-rotate-3 left-0 top-6', delay: '0s' },
    { icon: 'HeartPulse', text: '心理健康', cls: 'rotate-2 left-6 bottom-8', delay: '1.2s' },
    { icon: 'Brain', text: '认知能力', cls: 'rotate-1 right-1 bottom-24', delay: '0.6s' },
  ]
  return (
    <div className="relative h-[440px] hidden lg:block animate-fade-in">
      {/* 主卡：理念短句 */}
      <div className="absolute right-0 top-0 w-[330px] rounded-3xl bg-brand-grad p-8 text-white shadow-e4 rotate-2 animate-float">
        <div className="absolute inset-0 bg-hero-sheen rounded-3xl" />
        <div className="relative">
          <Quote className="w-8 h-8 text-white/65" />
          <p className="font-serif text-h1 font-bold leading-snug mt-4">
            读完一本，<br />遇见更大的世界
          </p>
          <p className="text-white/80 text-sm mt-5 leading-relaxed">
            以脑科学与心理测量为底座，让每一次阅读都被看见、被陪伴。
          </p>
        </div>
      </div>
      {/* 浮签——错落于主卡左下，互不遮挡 */}
      {tags.map((t) => (
        <div
          key={t.text}
          className={cx(
            'absolute inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-surface shadow-e3 border border-hair animate-float',
            t.cls,
          )}
          style={{ animationDelay: t.delay }}
        >
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600">
            <Icon name={t.icon} className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold text-ink-700">{t.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-page-glow">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid lg:grid-cols-[1.06fr_0.94fr] gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-caption font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 关于项目
            </span>
            <h1 className="font-serif text-display sm:text-display-lg lg:text-display-xl font-bold text-ink-900 mt-5 tracking-tightish leading-[1.14]">
              从阅读产品，<br />到<span className="text-brand-600">儿童阅读发展平台</span>
            </h1>
            <p className="text-ink-500 text-title sm:text-h3 mt-6 leading-relaxed max-w-xl">
              「{site.name}」是一个面向电子屏幕的整本书阅读平台。我们正从单纯的阅读工具，升级为以
              <span className="text-ink-700 font-semibold">脑科学</span>与
              <span className="text-ink-700 font-semibold">心理测量</span>为底座的儿童阅读发展平台——
              首批在北京培新小学落地 50 人试点，陪伴孩子在屏幕时代依然完整地读完一本好书。
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <PrimaryButton to="/library">进入书架 <ArrowRight className="w-4.5 h-4.5" /></PrimaryButton>
              <GhostButton to="/resources">查看资源体系</GhostButton>
            </div>
          </div>
          <HeroArt />
        </div>

        {/* 关键数字支撑条 */}
        <div className="mx-auto max-w-6xl px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {aboutStats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-surface border border-hair p-6 shadow-e1 text-center">
                <div className="font-serif text-display font-bold text-brand-600">{s.value}</div>
                <div className="text-caption text-ink-500 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心使命 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHead
          eyebrow="核心使命"
          title="阅读，连接五种成长"
          desc="我们相信，一本被完整读完的书，能同时滋养孩子的素养、心理、认知、审美与社会性。这是平台一切设计的出发点。"
          center
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {missions.map((m, i) => (
            <div
              key={m.key}
              className={cx(
                'group rounded-2xl bg-surface border border-hair p-7 shadow-e1 transition hover:shadow-e3 hover:-translate-y-0.5',
                // 第 5 张（社会责任感）在 lg 下补位居中，避免末行落单
                i === 4 && 'lg:col-start-2',
              )}
            >
              <div className="flex items-center gap-4">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 shrink-0 transition group-hover:bg-brand-grad group-hover:text-white">
                  <Icon name={m.icon} className="w-6 h-6" />
                </span>
                <div>
                  <span className="font-serif text-display font-bold text-brand-500/15 leading-none">0{i + 1}</span>
                  <h3 className="font-serif text-h2 font-bold text-ink-900 -mt-1">{m.title}</h3>
                </div>
              </div>
              <p className="text-ink-500 mt-4 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 核心理念 —— 深色 reverse 卡 */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="rounded-3xl bg-brand-grad p-10 sm:p-14 text-white shadow-e3 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-sheen" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <Eyebrow className="text-white/80">核心理念</Eyebrow>
            </div>
            <h2 className="font-serif text-h1 sm:text-display font-bold mt-3 max-w-2xl tracking-tightish">
              让阅读成为可被看见、可被陪伴的成长
            </h2>
            <div className="grid md:grid-cols-2 gap-10 mt-9">
              {ideas.map((idea, i) => (
                <div key={idea.key} className="relative">
                  <span className="font-serif text-display-lg font-bold text-white/15 leading-none">0{i + 1}</span>
                  <h3 className="font-serif text-h2 font-bold mt-1">{idea.title}</h3>
                  <p className="text-white/85 mt-3 leading-relaxed">{idea.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 政策背景 */}
      <section className="bg-surface-soft border-y border-hair mt-10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHead
            eyebrow="政策背景"
            title="站在国家教育方向的延长线上"
            desc="项目并非孤立的产品创新，而是对四条国家级教育政策方向的具体回应与落地实践。"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {policies.map((p) => (
              <div
                key={p.key}
                className="group relative rounded-2xl bg-surface border border-hair p-7 shadow-e1 overflow-hidden transition hover:shadow-e3 hover:-translate-y-0.5"
              >
                {/* 左侧色条 */}
                <span
                  className="absolute left-0 inset-y-0 w-1.5 transition-all group-hover:w-2"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex items-start gap-4 pl-2">
                  <span
                    className="grid place-items-center w-12 h-12 rounded-xl text-white shadow-e2 shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    <Icon name={p.icon} className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-serif text-h2 font-bold text-ink-900">{p.title}</h3>
                    <p className="text-caption text-ink-400 mt-1.5 leading-snug">{p.org}</p>
                  </div>
                </div>
                <p className="text-ink-500 mt-4 leading-relaxed pl-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 脑科学依据 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid lg:grid-cols-[0.86fr_1.14fr] gap-12 items-start">
          {/* 左：说明 */}
          <div className="lg:sticky lg:top-24">
            <Eyebrow>脑科学依据</Eyebrow>
            <h2 className="font-serif text-h1 sm:text-display font-bold text-ink-900 mt-3 tracking-tightish">
              为什么是<br />「整本书阅读」？
            </h2>
            <p className="text-ink-500 text-base sm:text-title mt-4 leading-relaxed">
              碎片化的浅阅读难以触发深层的神经塑造。认知神经科学研究表明，持续、沉浸的整本书阅读，会在四个维度上重塑发展中的大脑——这正是我们坚持「读完一本」的科学理由。
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-brand-grad-soft border border-brand-100">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-500 text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-sm text-ink-600 leading-snug">
                评估指标与神经机制对齐，<br className="hidden sm:block" />让成长数据有据可依。
              </span>
            </div>
          </div>

          {/* 右：四条依据 */}
          <div className="space-y-4">
            {brainEvidence.map((e, i) => (
              <div
                key={e.key}
                className="group flex items-start gap-5 rounded-2xl bg-surface border border-hair p-6 shadow-e1 transition hover:shadow-e3 hover:border-brand-200"
              >
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 shrink-0 transition group-hover:bg-brand-grad group-hover:text-white">
                  <Icon name={e.icon} className="w-7 h-7" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-serif text-h2 font-bold text-ink-900">{e.title}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 text-micro font-bold">{e.metric}</span>
                  </div>
                  <p className="text-ink-500 mt-2 leading-relaxed">{e.desc}</p>
                </div>
                <span className="font-serif text-display font-bold text-ink-100 leading-none hidden sm:block ml-auto shrink-0">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 收尾 CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-4">
        <div className="rounded-3xl bg-ink-900 p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-page-glow" />
          <div className="relative">
            <Eyebrow className="text-brand-300">{site.tagline}</Eyebrow>
            <h2 className="font-serif text-display font-bold text-white mt-3">一起，让阅读真正发生</h2>
            <p className="text-ink-300 mt-4 max-w-xl mx-auto leading-relaxed">
              从北京培新小学的 50 人试点出发，我们希望把「读完一本好书」的完整体验，带给更多屏幕时代的孩子。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PrimaryButton to="/library">进入书架 <ArrowRight className="w-4.5 h-4.5" /></PrimaryButton>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white text-title font-semibold border border-white/15 transition hover:bg-white/15"
              >
                了解评估体系
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
