import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/travels', label: '旅游', icon: '✈️' },
  { path: '/diaries', label: '日记', icon: '📝' },
  { path: '/exercises', label: '运动', icon: '🏃' },
  { path: '/notes', label: '学习', icon: '📚' },
]

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-primary-600">我的生活记录</h1>
            <nav className="flex gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-1">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* 底部 */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>记录生活，珍惜每一天 ✨</p>
      </footer>
    </div>
  )
}
