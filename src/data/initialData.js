// 初始示例数据
import { STORAGE_KEYS, setData, getData } from '../utils/storage'

const initialTravels = [
  {
    id: '1',
    title: '杭州西湖之旅',
    destination: '浙江杭州',
    date: '2024-03-15',
    duration: '3天',
    description: '春日游览西湖，苏堤春晓，断桥残雪，美不胜收。',
    photos: [],
    highlights: ['西湖', '灵隐寺', '宋城'],
    createdAt: '2024-03-18T10:00:00.000Z'
  },
  {
    id: '2',
    title: '北京故宫游',
    destination: '北京',
    date: '2024-01-20',
    duration: '5天',
    description: '参观故宫博物院，感受明清皇家建筑的宏伟壮观。',
    photos: [],
    highlights: ['故宫', '天安门', '颐和园', '长城'],
    createdAt: '2024-01-25T10:00:00.000Z'
  }
]

const initialDiaries = [
  {
    id: '1',
    date: '2024-04-01',
    title: '新的一月开始',
    content: '四月的第一天，阳光明媚。今天完成了一个重要的项目，感到很有成就感。晚上和家人一起吃了火锅，生活美好。',
    mood: 'happy',
    weather: '晴',
    createdAt: '2024-04-01T20:00:00.000Z'
  },
  {
    id: '2',
    date: '2024-03-31',
    title: '三月最后一天',
    content: '回顾这个月，完成了很多事情。学会了新技能，认识了一些新朋友。期待四月的到来。',
    mood: 'calm',
    weather: '多云',
    createdAt: '2024-03-31T21:00:00.000Z'
  }
]

const initialExercises = [
  { id: '1', type: '跑步', duration: 30, distance: 5, calories: 300, date: '2024-04-01', createdAt: '2024-04-01T07:00:00.000Z' },
  { id: '2', type: '游泳', duration: 45, distance: 1.5, calories: 400, date: '2024-03-31', createdAt: '2024-03-31T18:00:00.000Z' },
  { id: '3', type: '跑步', duration: 40, distance: 6, calories: 350, date: '2024-03-30', createdAt: '2024-03-30T07:00:00.000Z' },
  { id: '4', type: '骑行', duration: 60, distance: 20, calories: 450, date: '2024-03-29', createdAt: '2024-03-29T09:00:00.000Z' },
  { id: '5', type: '跑步', duration: 35, distance: 5.5, calories: 320, date: '2024-03-28', createdAt: '2024-03-28T07:00:00.000Z' },
  { id: '6', type: '健身', duration: 50, distance: 0, calories: 280, date: '2024-03-27', createdAt: '2024-03-27T19:00:00.000Z' },
  { id: '7', type: '跑步', duration: 30, distance: 4.5, calories: 280, date: '2024-03-26', createdAt: '2024-03-26T07:00:00.000Z' },
]

const initialNotes = [
  {
    id: '1',
    title: 'React Hooks 学习笔记',
    category: '前端开发',
    content: 'useState 用于状态管理，useEffect 用于副作用处理。自定义 Hook 可以复用逻辑。',
    tags: ['React', 'JavaScript'],
    createdAt: '2024-03-28T15:00:00.000Z'
  },
  {
    id: '2',
    title: '英语单词积累',
    category: '语言学习',
    content: 'serendipity - 意外发现美好事物的能力\nephemeral - 短暂的，转瞬即逝的',
    tags: ['英语', '单词'],
    createdAt: '2024-03-25T10:00:00.000Z'
  }
]

// 初始化数据
export function initializeData() {
  if (!getData(STORAGE_KEYS.TRAVELS)) {
    setData(STORAGE_KEYS.TRAVELS, initialTravels)
  }
  if (!getData(STORAGE_KEYS.DIARIES)) {
    setData(STORAGE_KEYS.DIARIES, initialDiaries)
  }
  if (!getData(STORAGE_KEYS.EXERCISES)) {
    setData(STORAGE_KEYS.EXERCISES, initialExercises)
  }
  if (!getData(STORAGE_KEYS.NOTES)) {
    setData(STORAGE_KEYS.NOTES, initialNotes)
  }
}
