import { Link } from 'react-router-dom'
import { getData, STORAGE_KEYS } from '../utils/storage'
import { useEffect, useState } from 'react'

export default function Home() {
  const [stats, setStats] = useState({
    travels: 0,
    diaries: 0,
    exercises: 0,
    notes: 0
  })
  const [recentDiaries, setRecentDiaries] = useState([])
  const [recentExercises, setRecentExercises] = useState([])

  useEffect(() => {
    const travels = getData(STORAGE_KEYS.TRAVELS) || []
    const diaries = getData(STORAGE_KEYS.DIARIES) || []
    const exercises = getData(STORAGE_KEYS.EXERCISES) || []
    const notes = getData(STORAGE_KEYS.NOTES) || []

    setStats({
      travels: travels.length,
      diaries: diaries.length,
      exercises: exercises.length,
      notes: notes.length
    })

    setRecentDiaries(diaries.slice(0, 3))
    setRecentExercises(exercises.slice(0, 5))
  }, [])

  const quickLinks = [
    { path: '/travels', label: '旅游记录', icon: '✈️', count: stats.travels, color: 'bg-blue-500' },
    { path: '/diaries', label: '每日日记', icon: '📝', count: stats.diaries, color: 'bg-green-500' },
    { path: '/exercises', label: '运动健康', icon: '🏃', count: stats.exercises, color: 'bg-orange-500' },
    { path: '/notes', label: '学习总结', icon: '📚', count: stats.notes, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">欢迎回来！</h2>
        <p className="opacity-90">记录生活的点点滴滴，让每一天都值得回味</p>
        <div className="mt-4 text-sm opacity-80">
          {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
              {link.icon}
            </div>
            <h3 className="font-medium text-gray-800">{link.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{link.count} 条记录</p>
          </Link>
        ))}
      </div>

      {/* 最近动态 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 最近日记 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">最近日记</h3>
            <Link to="/diaries" className="text-sm text-primary-600 hover:underline">查看全部</Link>
          </div>
          <div className="space-y-3">
            {recentDiaries.length > 0 ? recentDiaries.map(diary => (
              <div key={diary.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{diary.title}</h4>
                  <span className="text-xs text-gray-400">{diary.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{diary.content}</p>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">暂无日记</p>
            )}
          </div>
        </div>

        {/* 最近运动 */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">最近运动</h3>
            <Link to="/exercises" className="text-sm text-primary-600 hover:underline">查看全部</Link>
          </div>
          <div className="space-y-2">
            {recentExercises.length > 0 ? recentExercises.map(ex => (
              <div key={ex.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ex.type === '跑步' ? '🏃' : ex.type === '游泳' ? '🏊' : ex.type === '骑行' ? '🚴' : '💪'}</span>
                  <div>
                    <span className="font-medium text-gray-800">{ex.type}</span>
                    <span className="text-xs text-gray-400 ml-2">{ex.date}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {ex.duration}分钟 | {ex.calories}卡
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">暂无运动记录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
