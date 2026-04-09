import { useState, useEffect } from 'react'
import { getData, addItem, deleteItem, STORAGE_KEYS } from '../utils/storage'

const categories = ['前端开发', '后端开发', '语言学习', '读书笔记', '其他']

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('全部')
  const [formData, setFormData] = useState({
    title: '',
    category: '其他',
    content: '',
    tags: ''
  })

  useEffect(() => {
    setNotes(getData(STORAGE_KEYS.NOTES) || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newNote = addItem(STORAGE_KEYS.NOTES, {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    setNotes([newNote, ...notes])
    setShowForm(false)
    setFormData({ title: '', category: '其他', content: '', tags: '' })
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这条笔记吗？')) {
      const updated = deleteItem(STORAGE_KEYS.NOTES, id)
      setNotes(updated)
    }
  }

  const filteredNotes = filter === '全部' ? notes : notes.filter(n => n.category === filter)

  const allCategories = ['全部', ...new Set(notes.map(n => n.category))]

  const getCategoryColor = (category) => {
    const colors = {
      '前端开发': 'bg-blue-100 text-blue-700',
      '后端开发': 'bg-green-100 text-green-700',
      '语言学习': 'bg-yellow-100 text-yellow-700',
      '读书笔记': 'bg-pink-100 text-pink-700',
      '其他': 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📚 学习总结</h2>
          <p className="text-gray-500 mt-1">记录学习，不断成长</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          {showForm ? '取消' : '+ 添加笔记'}
        </button>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="笔记标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              required
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
              placeholder="记录你的学习内容..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="如：React, JavaScript, 前端"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === cat
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 笔记列表 */}
      <div className="grid gap-4">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <div key={note.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(note.category)}`}>
                  {note.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                🗑️
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
            <p className="text-gray-600 whitespace-pre-wrap mb-3">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <span className="text-4xl">📖</span>
            <p className="text-gray-500 mt-3">还没有学习笔记，开始记录你的学习心得吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}
