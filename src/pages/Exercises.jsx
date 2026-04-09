import { useState, useEffect } from 'react'
import { getData, addItem, deleteItem, STORAGE_KEYS } from '../utils/storage'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const exerciseTypes = ['跑步', '游泳', '骑行', '健身', '瑜伽', '其他']

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '跑步',
    duration: '',
    distance: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    setExercises(getData(STORAGE_KEYS.EXERCISES) || [])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newExercise = addItem(STORAGE_KEYS.EXERCISES, {
      ...formData,
      duration: Number(formData.duration),
      distance: Number(formData.distance),
      calories: Number(formData.calories)
    })
    setExercises([newExercise, ...exercises])
    setShowForm(false)
    setFormData({
      type: '跑步',
      duration: '',
      distance: '',
      calories: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这条运动记录吗？')) {
      const updated = deleteItem(STORAGE_KEYS.EXERCISES, id)
      setExercises(updated)
    }
  }

  // 统计数据
  const stats = {
    totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
    totalCalories: exercises.reduce((sum, ex) => sum + ex.calories, 0),
    totalDistance: exercises.reduce((sum, ex) => sum + ex.distance, 0),
    count: exercises.length
  }

  // 按类型统计
  const typeStats = exerciseTypes.map(type => ({
    type,
    count: exercises.filter(ex => ex.type === type).length
  })).filter(t => t.count > 0)

  // 最近7天数据
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const weeklyData = last7Days.map(date => {
    const dayExercises = exercises.filter(ex => ex.date === date)
    return {
      date: date.slice(5),
      duration: dayExercises.reduce((sum, ex) => sum + ex.duration, 0),
      calories: dayExercises.reduce((sum, ex) => sum + ex.calories, 0)
    }
  })

  const barChartData = {
    labels: weeklyData.map(d => d.date),
    datasets: [{
      label: '运动时长(分钟)',
      data: weeklyData.map(d => d.duration),
      backgroundColor: 'rgba(249, 115, 22, 0.8)',
      borderRadius: 6
    }]
  }

  const doughnutData = {
    labels: typeStats.map(t => t.type),
    datasets: [{
      data: typeStats.map(t => t.count),
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6b7280']
    }]
  }

  const getExerciseIcon = (type) => {
    const icons = { '跑步': '🏃', '游泳': '🏊', '骑行': '🚴', '健身': '💪', '瑜伽': '🧘', '其他': '🏅' }
    return icons[type] || '🏅'
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🏃 运动健康</h2>
          <p className="text-gray-500 mt-1">坚持运动，保持健康</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {showForm ? '取消' : '+ 记录运动'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-500">{stats.count}</div>
          <div className="text-sm text-gray-500">运动次数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-500">{stats.totalDuration}</div>
          <div className="text-sm text-gray-500">总时长(分钟)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.totalDistance.toFixed(1)}</div>
          <div className="text-sm text-gray-500">总里程(公里)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-500">{stats.totalCalories}</div>
          <div className="text-sm text-gray-500">消耗热量(卡)</div>
        </div>
      </div>

      {/* 图表 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">近7天运动时长</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">运动类型分布</h3>
          <div className="max-w-xs mx-auto">
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">运动类型</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {exerciseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">时长(分钟)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="如：30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">距离(公里)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={e => setFormData({ ...formData, distance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="如：5.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">消耗热量(卡路里)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="如：300"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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

      {/* 运动列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">运动记录</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {exercises.length > 0 ? exercises.map(ex => (
            <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getExerciseIcon(ex.type)}</span>
                <div>
                  <div className="font-medium text-gray-800">{ex.type}</div>
                  <div className="text-sm text-gray-500">{ex.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-600">⏱️ {ex.duration}分钟</span>
                {ex.distance > 0 && <span className="text-gray-600">📍 {ex.distance}km</span>}
                <span className="text-gray-600">🔥 {ex.calories}卡</span>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <span className="text-4xl">🏃‍♂️</span>
              <p className="text-gray-500 mt-3">还没有运动记录，开始你的第一次运动吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
