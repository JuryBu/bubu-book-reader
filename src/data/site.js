// 站点文案中枢——内容从《电子屏幕整书阅读项目方案》提炼。
// 后续真实素材由组员提供后在此替换即可，页面无需改结构。

export const site = {
  name: '整书阅读',
  enName: 'Whole-Book Reading',
  slogan: '让每个孩子，读完一本好书',
  tagline: '基于脑科学与心理测量的儿童阅读发展平台',
  badge: '电子屏幕整书阅读 · 北京培新小学试点',
}

export const nav = [
  { to: '/', label: '首页' },
  { to: '/library', label: '书架' },
  { to: '/resources', label: '资源' },
  { to: '/about', label: '关于' },
  { to: '/blog', label: '动态' },
]

export const heroIntro =
  '从「打卡式阅读」走向「读完一本、读懂一本」。我们以整书阅读为核心，融合 AI 学伴陪读与多维成长评估，陪伴孩子在屏幕时代养成深度阅读的习惯——让阅读素养、心理健康与综合素质一起生长。'

export const heroStats = [
  { value: '120+', label: '精选分级书目' },
  { value: '5', label: '多模态呈现形式' },
  { value: '5', label: '维成长评估' },
  { value: '1–6', label: '年级全覆盖' },
]

// 核心理念（方案 二·核心理念）
export const ideas = [
  {
    key: 'grow',
    title: '阅读即成长',
    desc: '阅读不只是识字，更是认知、情感与人格的发展过程。每一本读完的书，都是一次完整的成长。',
  },
  {
    key: 'ai',
    title: 'AI + 阅读 + 心理发展',
    desc: '用 AI 学伴做慢节奏、深度引导式的陪读，把阅读过程沉淀为可观察、可评估的成长数据。',
  },
]

// 三大阅读内容板块（方案 五·三大阅读内容板块）
export const boards = [
  {
    key: 'whole',
    icon: 'BookOpen',
    name: '整书阅读',
    en: 'Whole-book Reading',
    desc: '以整本好书为单位的深度阅读，配合 AI 学伴的章节引导与批注，培养阅读耐力与深度理解。',
    color: '#3B66F5',
  },
  {
    key: 'video',
    icon: 'Film',
    name: '视频阅读',
    en: 'Thematic Video',
    desc: '与整书主题联动的主题视频，搭配读后反思提问，作为低互动的「阅读休息段」，严控时长。',
    color: '#12B886',
  },
  {
    key: 'l2',
    icon: 'Languages',
    name: '二语阅读',
    en: 'Bilingual Reading',
    desc: '分级英文读物，对接国际阅读分级体系，在中高年级引入，发展跨文化理解与语言素养。',
    color: '#7A5BFF',
  },
]

// 五大多模态呈现形式（方案 五·多模态呈现形式）
export const modes = [
  { key: 'classic', icon: 'BookText', name: '传统阅读', desc: '阅读耐力 · 深度理解' },
  { key: 'drama', icon: 'Drama', name: '剧本式阅读', desc: '角色理解 · 同理心 · 表达' },
  { key: 'picture', icon: 'Image', name: '绘本与图像', desc: '视觉理解 · 审美启蒙' },
  { key: 'music', icon: 'Music', name: '音乐融合阅读', desc: '情绪感知 · 艺术体验' },
  { key: 'aibuddy', icon: 'Sparkles', name: 'AI 学伴', desc: '激活 · 引导 · 反思 · 追踪' },
]

// 五大核心使命（方案 二·核心使命）
export const missions = [
  { key: 'literacy', icon: 'BookOpen', title: '阅读素养', desc: '从识读到深度理解、批判性思考与表达迁移。' },
  { key: 'mental', icon: 'HeartPulse', title: '心理健康', desc: '在阅读中观察情绪与注意力，关照儿童心理发展。' },
  { key: 'cognition', icon: 'Brain', title: '认知能力', desc: '促进语言网络、工作记忆、执行功能与推理发展。' },
  { key: 'aesthetic', icon: 'Palette', title: '审美能力', desc: '通过绘本、音乐与文学体验，培育美的感受力。' },
  { key: 'social', icon: 'Users', title: '社会责任感', desc: '在共读与讨论中建立同理心与社会认知。' },
]

// 五维成长评估（方案 六·五维度评估体系，前测-中测-后测）
export const evalDims = [
  { key: 'behavior', title: '阅读行为', desc: '阅读频率、持续时长、坚持度' },
  { key: 'literacy', title: '阅读能力', desc: '理解、推理、表达' },
  { key: 'motivation', title: '学习动力', desc: '阅读兴趣、效能感、内在动机' },
  { key: 'mental', title: '心理健康', desc: '注意力、情绪状态、学习动机' },
  { key: 'whole', title: '综合素质', desc: '创造力、审美、社会责任感' },
]

export const evalPhases = [
  { key: 'pre', name: '前测', when: '单元/学期开始', desc: '任务式趣味测评 + 兴趣画像，生成个性化推荐书单与基线数据。' },
  { key: 'mid', name: '中测', when: '阅读过程中（每周）', desc: '平台行为日志 + 章节小问答 + AI 学伴记录，输出数据周报与教学调整建议。' },
  { key: 'post', name: '后测', when: '单元/学期结束', desc: '分层理解测验 + 动机量表 + 读书笔记量规，生成个人成长报告与班级画像。' },
]

// 教师赋能（方案 七）
export const teacherProgram = {
  title: '教师赋能体系',
  desc: '为教师提供整本书阅读的方法论与认证路径，把「不知道怎么教、怎么评」变成可落地的课堂流程。',
  certs: ['整书阅读实施者', '整书阅读指导师', '整书阅读教研导师'],
  cycle: ['书前激活', '边读边想', '深度讨论', '综合表达', '评估反思'],
}

export const footer = {
  about: '电子屏幕整书阅读项目 · 致力于用科学的方式陪伴儿童完整地读完一本好书，促进综合素质发展。',
  cols: [
    { title: '探索', links: ['首页', '书架', '资源', '关于'] },
    { title: '内容板块', links: ['整书阅读', '视频阅读', '二语阅读'] },
    { title: '面向', links: ['学校', '教师', '家庭', '教育主管部门'] },
  ],
  copyright: '© 2026 整书阅读 · 北京培新小学试点版（演示原型）',
}
