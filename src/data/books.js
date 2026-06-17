// 整书阅读书架数据 · Codex 产出真实书目版（21 本）
// 来源：bubu-book-reader_材料/原始要求/分级书单(1).docx → Codex 核对补全 → books.frontend-ready.js
// 书单 5 大类：故事 / 经典名著 / 科普 / 国学·传统 / 红色·人物
// grade 形如 "1-2" / "1" / "3" / "5-6"；学段按 grade 中出现的数字归到 低/中/高 三段。

// —— 体裁主色 → 渐变书封（与 genreMeta 主色对齐）——
const covers = {
  故事: ['#FFB45A', '#FF8A3D'],
  经典名著: ['#3B66F5', '#2641B0'],
  科普: ['#19C0CC', '#127E9B'],
  '国学·传统': ['#B56BFF', '#6E44D8'],
  '红色·人物': ['#F2553D', '#C92D1F'],
}

// —— 书名 → 稳定 slug（作为路由 id）——
const slugMap = {
  小布头奇遇记: 'xiaobutou',
  没头脑和不高兴: 'meitounao',
  读读童谣和儿歌: 'tongyao',
  孤独的小螃蟹: 'gudu-xiaopangxie',
  爷爷一定有办法: 'yeye-yiding-you-banfa',
  七色花: 'qisehua',
  神笔马良: 'shenbi-maliang',
  三字经: 'sanzijing',
  弟子规: 'dizigui',
  稻草人: 'daocaoren',
  格林童话: 'gelin-tonghua',
  安徒生童话: 'andersen',
  中国古代寓言: 'zhongguo-gudai-yuyan',
  十万个为什么: 'shiwange-weishenme',
  细菌世界历险记: 'xijun-shijie',
  '西游记（少儿版）': 'xiyouji-shaoer',
  '汤姆·索亚历险记': 'tom-sawyer',
  草房子: 'caofangzi',
  青铜葵花: 'qingtong-kuihua',
  中华传统美德故事: 'zhonghua-meide',
  少年英雄故事: 'shaonian-yingxiong',
}

const baseBooks = [
  { title: '小布头奇遇记', author: '孙幼军', type: '故事', grade: '1-2', blurb: '小布娃娃离家出走，开启奇妙冒险。' },
  { title: '没头脑和不高兴', author: '任溶溶', type: '故事', grade: '1-2', blurb: '两个淘气孩子长大后闯出大麻烦。' },
  { title: '读读童谣和儿歌', author: '选编', type: '故事', grade: '1', blurb: '跟着童谣拍手唱，读出文字节奏。' },
  { title: '孤独的小螃蟹', author: '冰波', type: '故事', grade: '2', blurb: '小螃蟹踏上寻找朋友的暖心旅程。' },
  { title: '爷爷一定有办法', author: '〔加〕菲比·吉尔曼', type: '故事', grade: '1-2', blurb: '一块旧毯子变出新花样，藏着亲情。' },
  { title: '七色花', author: '〔苏〕瓦·卡达耶夫', type: '故事', grade: '2', blurb: '七片花瓣实现愿望，最珍贵的是善良。' },
  { title: '神笔马良', author: '洪汛涛', type: '故事', grade: '2', blurb: '马良用神奇画笔帮助穷人、惩罚恶人。' },
  { title: '三字经', author: '〔宋〕王应麟（传）', type: '国学·传统', grade: '1-2', blurb: '三个字一句，读出古老故事和道理。' },
  { title: '弟子规', author: '〔清〕李毓秀', type: '国学·传统', grade: '1-2', blurb: '用短句认识古人的待人做事之道。' },
  { title: '稻草人', author: '叶圣陶', type: '故事', grade: '3', blurb: '站在田里的稻草人，看见人间悲欢。' },
  { title: '格林童话', author: '〔德〕格林兄弟', type: '故事', grade: '3', blurb: '走进镜子、糖果屋和魔法森林。' },
  { title: '安徒生童话', author: '〔丹麦〕安徒生', type: '故事', grade: '3', blurb: '在童话里遇见温柔、勇气与眼泪。' },
  { title: '中国古代寓言', author: '选编', type: '故事', grade: '3', blurb: '短短寓言故事，藏着长久道理。' },
  { title: '十万个为什么', author: '〔苏〕米·伊林', type: '科普', grade: '4', blurb: '从日常问题出发，点亮科学好奇心。' },
  { title: '细菌世界历险记', author: '高士其', type: '科普', grade: '4', blurb: '钻进微生物世界，认识细菌朋友。' },
  { title: '西游记（少儿版）', author: '〔明〕吴承恩', type: '经典名著', grade: '5', blurb: '跟着孙悟空西行闯关，降妖除魔。' },
  { title: '汤姆·索亚历险记', author: '〔美〕马克·吐温', type: '经典名著', grade: '6', blurb: '调皮少年逃学探险，闯进成长世界。' },
  { title: '草房子', author: '曹文轩', type: '故事', grade: '5-6', blurb: '在金黄草房子里，记住童年的光。' },
  { title: '青铜葵花', author: '曹文轩', type: '故事', grade: '5-6', blurb: '无声男孩和城里女孩结成亲密兄妹。' },
  { title: '中华传统美德故事', author: '选编', type: '国学·传统', grade: '5-6', blurb: '在真实故事里读懂中国人的美德。' },
  { title: '少年英雄故事', author: '选编', type: '红色·人物', grade: '5-6', blurb: '认识少年英雄，读见勇敢与担当。' },
]

// —— 体裁元信息（5 大类）：color 主色 + soft 浅色底（与 covers 主色对齐）——
export const genreMeta = {
  故事: { color: '#FF8A3D', soft: '#FFF1E6' },
  经典名著: { color: '#3B66F5', soft: '#EEF2FF' },
  科普: { color: '#19C0CC', soft: '#E4F8FA' },
  '国学·传统': { color: '#B56BFF', soft: '#F4ECFF' },
  '红色·人物': { color: '#F2553D', soft: '#FDEBE8' },
}

// —— 学段分组（低/中/高 3 段）——
// 归属规则：grade 中出现 1 或 2 → 低年级；出现 3 或 4 → 中年级；出现 5 或 6 → 高年级。
// （现书单每本 grade 不跨段，规则简单稳妥；若将来出现跨段 grade，按最高优先归一段。）
function gradeDigits(grade) {
  return String(grade)
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number)
}

export const stages = [
  {
    key: 'low',
    label: '低年级',
    range: '1–2 年级',
    stage: '低段 · 启蒙',
    blurb: '从韵律、图画与短故事走进文字，点燃最初的阅读兴趣。',
    icon: 'Sprout',
    accent: '#FF9D42',
    match: (grade) => gradeDigits(grade).some((d) => d <= 2),
  },
  {
    key: 'mid',
    label: '中年级',
    range: '3–4 年级',
    stage: '中段 · 进阶',
    blurb: '中外经典童话、寓言与科普并行，体会人物、情节与求知之乐。',
    icon: 'BookOpen',
    accent: '#3B66F5',
    match: (grade) => gradeDigits(grade).some((d) => d === 3 || d === 4),
  },
  {
    key: 'high',
    label: '高年级',
    range: '5–6 年级',
    stage: '高段 · 深读',
    blurb: '挑战长篇名著与传统美德、红色人物，培养阅读耐力与思考判断。',
    icon: 'Mountain',
    accent: '#2E51DB',
    match: (grade) => gradeDigits(grade).some((d) => d >= 5),
  },
]

// 取某本书所属学段（取首个命中的段，避免跨段重复计数）
export function stageOf(grade) {
  return stages.find((s) => s.match(grade)) || stages[0]
}

export const books = baseBooks.map((book) => ({
  id: slugMap[book.title],
  title: book.title,
  author: book.author,
  grade: book.grade,
  genre: book.type,
  type: book.type,
  cover: covers[book.type],
  summary: book.blurb,
  blurb: book.blurb,
  tags: [book.type, `${book.grade} 年级`],
}))

export function getBook(id) {
  return books.find((book) => book.id === id) || books[0]
}
