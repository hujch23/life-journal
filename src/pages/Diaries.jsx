import { useState, useEffect } from 'react'
import { getData, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../utils/storage'

const moodOptions = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'excited', label: '兴奋', emoji: '🤩' },
  { value: 'sad', label: '难过', emoji: '😢' },
  { value: 'tired', label: '疲惫', emoji: '😴' },
]

const weatherOptions = ['晴', '多云', '阴', '小雨', '大雨', '雪']

export default function Diaries() {
  const [diaries, setDiaries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [expandedDiaries, setExpandedDiaries] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'happy',
    weather: '晴'
  })

  useEffect(() => {
    setDiaries(getData(STORAGE_KEYS.DIARIES) || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editId) {
      // 编辑模式
      const updatedDiary = updateItem(STORAGE_KEYS.DIARIES, editId, formData)
      if (updatedDiary) {
        setDiaries(diaries.map(diary => diary.id === editId ? updatedDiary : diary))
      }
    } else {
      // 添加模式
      const newDiary = addItem(STORAGE_KEYS.DIARIES, formData)
      setDiaries([newDiary, ...diaries])
    }
    
    setShowForm(false)
    setEditId(null)
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      mood: 'happy',
      weather: '晴'
    })
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这篇日记吗？')) {
      const updated = deleteItem(STORAGE_KEYS.DIARIES, id)
      setDiaries(updated)
    }
  }

  const handleEdit = (diary) => {
    setFormData({
      title: diary.title,
      content: diary.content,
      date: diary.date,
      mood: diary.mood,
      weather: diary.weather
    })
    setEditId(diary.id)
    setShowForm(true)
  }

  const toggleExpand = (id) => {
    setExpandedDiaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getMoodEmoji = (mood) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '😊'
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📝 每日日记</h2>
          <p className="text-gray-500 mt-1">记录每一天的心情与感悟</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {showForm ? '取消' : (editId ? '编辑日记' : '+ 写日记')}
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{editId ? '编辑日记' : '写日记'}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">心情</label>
              <select
                value={formData.mood}
                onChange={e => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {moodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">天气</label>
              <select
                value={formData.weather}
                onChange={e => setFormData({ ...formData, weather: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {weatherOptions.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="今天的关键词..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              required
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="今天发生了什么？有什么想记录的..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {/* 日记时间线 */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {diaries.length > 0 ? diaries.map((diary, index) => (
            <div key={diary.id} className="relative pl-16">
              {/* 时间线节点 */}
              <div className="absolute left-4 w-5 h-5 bg-white border-2 border-green-400 rounded-full" />

              {/* 日记卡片 */}
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span>{diary.date}</span>
                      <span>|</span>
                      <span>{getMoodEmoji(diary.mood)}</span>
                      <span>|</span>
                      <span>🌤️ {diary.weather}</span>
                    </div>
                  <h3 className="text-lg font-bold text-gray-800">{diary.title}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(diary)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    🗑️
                  </button>
                </div>
                </div>
                <div className="text-gray-600 whitespace-pre-wrap">
                  {diary.content.length > 200 ? (
                    <>
                      {expandedDiaries[diary.id] ? (
                        <>
                          {diary.content}
                          <button
                            onClick={() => toggleExpand(diary.id)}
                            className="text-green-500 hover:text-green-600 text-sm mt-2 inline-block"
                          >
                            收起
                          </button>
                        </>
                      ) : (
                        <>
                          {diary.content.substring(0, 200)}...
                          <button
                            onClick={() => toggleExpand(diary.id)}
                            className="text-green-500 hover:text-green-600 text-sm mt-2 inline-block"
                          >
                            展开
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    diary.content
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-xl ml-0 pl-0">
              <span className="text-4xl">📔</span>
              <p className="text-gray-500 mt-3">还没有日记，开始记录你的第一天吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
