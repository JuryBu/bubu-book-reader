// 占位书目——小学语文「快乐读书吧」经典书单 + 名著，覆盖 1–6 年级与多种体裁。
// 真实书库数据由组员后续提供后替换；封面暂用渐变色卡（无图也美观）。

export const genreMeta = {
  童话: { color: '#7A5BFF', soft: '#F0ECFF' },
  寓言: { color: '#FF9D42', soft: '#FFF1E2' },
  神话: { color: '#F2553D', soft: '#FDEBE7' },
  科普: { color: '#12B886', soft: '#E7F8F1' },
  民间故事: { color: '#15B8C4', soft: '#E3F7F9' },
  小说: { color: '#3B66F5', soft: '#EEF2FF' },
  诗歌: { color: '#F5A524', soft: '#FFF6E0' },
}

export const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']

export const books = [
  { id: 'tongyao', title: '读读童谣和儿歌', author: '快乐读书吧', grade: '一年级', genre: '诗歌', cover: ['#FFB45A', '#FF9D42'], summary: '一年级孩子的第一套阅读启蒙，朗朗上口的童谣与儿歌，在韵律中爱上文字。', tags: ['启蒙', '韵律'] },
  { id: 'xiaopangxie', title: '孤独的小螃蟹', author: '冰波', grade: '二年级', genre: '童话', cover: ['#8E72FF', '#7A5BFF'], summary: '小螃蟹与小青蟹的友谊故事，在温柔的童话里读懂陪伴与牵挂。', tags: ['友谊', '成长'] },
  { id: 'andesen', title: '安徒生童话', author: '安徒生', grade: '三年级', genre: '童话', cover: ['#6585FB', '#3B66F5'], summary: '卖火柴的小女孩、丑小鸭、海的女儿……世界童话的不朽经典，照见善良与勇气。', tags: ['经典', '世界童话'] },
  { id: 'daocaoren', title: '稻草人', author: '叶圣陶', grade: '三年级', genre: '童话', cover: ['#12B886', '#0E9E73'], summary: '中国现代童话的奠基之作，稻草人静静看着田野上的悲欢，写尽悲悯之心。', tags: ['中国童话', '名家'] },
  { id: 'yuyan', title: '中国古代寓言', author: '快乐读书吧', grade: '三年级', genre: '寓言', cover: ['#FFAE54', '#F2851E'], summary: '刻舟求剑、守株待兔、揠苗助长……短小故事里藏着先人的大智慧。', tags: ['智慧', '传统'] },
  { id: 'shenhua', title: '中国古代神话', author: '快乐读书吧', grade: '四年级', genre: '神话', cover: ['#F2553D', '#D63E29'], summary: '盘古开天、女娲补天、精卫填海，从神话里读懂中华民族的精神源头。', tags: ['传统文化', '想象'] },
  { id: 'shiwange', title: '十万个为什么', author: '米·伊林', grade: '四年级', genre: '科普', cover: ['#15B8C4', '#0E9E9E'], summary: '一次厨房里的科学旅行，把身边的「为什么」讲得妙趣横生。', tags: ['科学', '好奇心'] },
  { id: 'xijun', title: '细菌世界历险记', author: '高士其', grade: '四年级', genre: '科普', cover: ['#12B886', '#15B8C4'], summary: '跟随细菌的视角认识微观世界，老一辈科学家写给孩子的科学童话。', tags: ['科学', '微观世界'] },
  { id: 'minjian', title: '中国民间故事', author: '快乐读书吧', grade: '五年级', genre: '民间故事', cover: ['#19C0CC', '#15B8C4'], summary: '牛郎织女、孟姜女、梁山伯与祝英台，流传千年的民间智慧与深情。', tags: ['传统', '民间'] },
  { id: 'feizhou', title: '非洲民间故事', author: '快乐读书吧', grade: '五年级', genre: '民间故事', cover: ['#FF9D42', '#F2553D'], summary: '来自遥远大陆的奇异故事，在不同文化里看见共通的善与勇敢。', tags: ['世界', '跨文化'] },
  { id: 'liena', title: '列那狐的故事', author: '玛·阿希·季诺', grade: '五年级', genre: '童话', cover: ['#7A5BFF', '#6585FB'], summary: '机智狡黠的列那狐周旋于动物王国，幽默背后是对世态的辛辣观察。', tags: ['幽默', '世界童话'] },
  { id: 'lubinxun', title: '鲁滨逊漂流记', author: '笛福', grade: '六年级', genre: '小说', cover: ['#3B66F5', '#2641B0'], summary: '荒岛求生二十八年，一个人与命运较量的勇气之书。', tags: ['冒险', '经典名著'] },
  { id: 'qiae', title: '骑鹅旅行记', author: '塞尔玛·拉格洛夫', grade: '六年级', genre: '小说', cover: ['#6585FB', '#5B5BF0'], summary: '骑着白鹅飞越瑞典的奇幻旅程，调皮男孩在旅途中学会善良与责任。', tags: ['奇幻', '成长'] },
  { id: 'tangmu', title: '汤姆·索亚历险记', author: '马克·吐温', grade: '六年级', genre: '小说', cover: ['#2E51DB', '#3B66F5'], summary: '顽皮少年汤姆的冒险与正义，一部写满童年自由气息的美国经典。', tags: ['冒险', '童年'] },
  { id: 'xiyou', title: '西游记', author: '吴承恩', grade: '六年级', genre: '小说', cover: ['#F2553D', '#B22F1E'], summary: '九九八十一难，师徒四人西天取经，中国古典四大名著之一。', tags: ['四大名著', '神魔'] },
  { id: 'xialuo', title: '夏洛的网', author: 'E.B. 怀特', grade: '三年级', genre: '小说', cover: ['#12B886', '#3B66F5'], summary: '蜘蛛夏洛用蛛网上的字守护小猪威尔伯，一曲关于友谊与生命的赞歌。', tags: ['友谊', '温暖'] },
]

export function getBook(id) {
  return books.find((b) => b.id === id) || books[0]
}
