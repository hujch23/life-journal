import { useState, useEffect } from 'react'
import { getData, addItem, deleteItem, STORAGE_KEYS } from '../utils/storage'

export default function Travels() {
  const [travels, setTravels] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    date: '',
    duration: '',
    description: '',
    highlights: ''
  })

  useEffect(() => {
    setTravels(getData(STORAGE_KEYS.TRAVELS) || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newTravel = addItem(STORAGE_KEYS.TRAVELS, {
      ...formData,
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(Boolean)
    })
    setTravels([newTravel, ...travels])
    setShowForm(false)
    setFormData({ title: '', destination: '', date: '', duration: '', description: '', highlights: '' })
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这条旅游记录吗？')) {
      const updated = deleteItem(STORAGE_KEYS.TRAVELS, id)
      setTravels(updated)
    }
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">✈️ 旅游记录</h2>
          <p className="text-gray-500 mt-1">记录每一次难忘的旅程</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {showForm ? '取消' : '+ 添加旅行'}
        </button>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">旅行标题</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：杭州西湖之旅"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目的地</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：浙江杭州"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">出发日期</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">行程天数</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：3天"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">旅行描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="记录这次旅行的感受和经历..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">精彩亮点（用逗号分隔）</label>
            <input
              type="text"
              value={formData.highlights}
              onChange={e => setFormData({ ...formData, highlights: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="如：西湖, 灵隐寺, 宋城"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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

      {/* 旅游列表 */}
      <div className="grid gap-4">
        {travels.length > 0 ? travels.map(travel => (
          <div key={travel.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-lg font-bold text-gray-800">{travel.title}</h3>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <span>🗺️ {travel.destination}</span>
                  <span>📅 {travel.date}</span>
                  <span>⏱️ {travel.duration}</span>
                </div>
                <p className="text-gray-600 mb-3">{travel.description}</p>
                {travel.highlights && travel.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {travel.highlights.map((h, i) => (
                      <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(travel.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
              >
                🗑️
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <span className="text-4xl">🌍</span>
            <p className="text-gray-500 mt-3">还没有旅行记录，开始记录你的第一次旅程吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}
