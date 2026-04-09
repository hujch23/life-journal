import { useState } from 'react'
import { getData, setData, STORAGE_KEYS } from '../utils/storage'

export default function Settings() {
  const [importStatus, setImportStatus] = useState(null)

  // 导出所有数据
  const handleExport = () => {
    const allData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      travels: getData(STORAGE_KEYS.TRAVELS) || [],
      diaries: getData(STORAGE_KEYS.DIARIES) || [],
      exercises: getData(STORAGE_KEYS.EXERCISES) || [],
      notes: getData(STORAGE_KEYS.NOTES) || []
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-journal-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入数据
  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)

        // 验证数据格式
        if (!data.version || !data.exportDate) {
          throw new Error('无效的备份文件格式')
        }

        // 导入各模块数据
        if (data.travels) setData(STORAGE_KEYS.TRAVELS, data.travels)
        if (data.diaries) setData(STORAGE_KEYS.DIARIES, data.diaries)
        if (data.exercises) setData(STORAGE_KEYS.EXERCISES, data.exercises)
        if (data.notes) setData(STORAGE_KEYS.NOTES, data.notes)

        setImportStatus({ success: true, message: '数据导入成功！页面将刷新...' })
        setTimeout(() => window.location.reload(), 1500)
      } catch (err) {
        setImportStatus({ success: false, message: '导入失败：' + err.message })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // 清除所有数据
  const handleClearAll = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！建议先导出备份。')) {
      localStorage.removeItem(STORAGE_KEYS.TRAVELS)
      localStorage.removeItem(STORAGE_KEYS.DIARIES)
      localStorage.removeItem(STORAGE_KEYS.EXERCISES)
      localStorage.removeItem(STORAGE_KEYS.NOTES)
      window.location.reload()
    }
  }

  // 统计信息
  const stats = {
    travels: (getData(STORAGE_KEYS.TRAVELS) || []).length,
    diaries: (getData(STORAGE_KEYS.DIARIES) || []).length,
    exercises: (getData(STORAGE_KEYS.EXERCISES) || []).length,
    notes: (getData(STORAGE_KEYS.NOTES) || []).length
  }
  const totalRecords = stats.travels + stats.diaries + stats.exercises + stats.notes

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">⚙️ 数据管理</h2>
        <p className="text-gray-500 mt-1">备份、恢复和管理你的数据</p>
      </div>

      {/* 数据统计 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">数据统计</h3>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{stats.travels}</div>
            <div className="text-xs text-gray-500">旅游</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{stats.diaries}</div>
            <div className="text-xs text-gray-500">日记</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{stats.exercises}</div>
            <div className="text-xs text-gray-500">运动</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{stats.notes}</div>
            <div className="text-xs text-gray-500">学习</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-600">{totalRecords}</div>
            <div className="text-xs text-gray-500">总计</div>
          </div>
        </div>
      </div>

      {/* 导出数据 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">导出备份</h3>
        <p className="text-gray-500 text-sm mb-4">
          将所有数据导出为 JSON 文件，保存到本地。换电脑时可以导入恢复。
        </p>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <span>📥</span> 导出数据备份
        </button>
      </div>

      {/* 导入数据 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2">导入备份</h3>
        <p className="text-gray-500 text-sm mb-4">
          从之前导出的 JSON 文件恢复数据。注意：导入会覆盖现有数据。
        </p>
        <label className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer inline-flex items-center gap-2">
          <span>📤</span> 选择备份文件
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        {importStatus && (
          <div className={`mt-4 p-3 rounded-lg ${importStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {importStatus.message}
          </div>
        )}
      </div>

      {/* 清除数据 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200">
        <h3 className="font-bold text-red-600 mb-2">危险操作</h3>
        <p className="text-gray-500 text-sm mb-4">
          清除所有本地数据。此操作不可恢复，请谨慎操作！
        </p>
        <button
          onClick={handleClearAll}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          🗑️ 清除所有数据
        </button>
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">💡 使用提示</h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li>• 定期导出备份，防止数据丢失</li>
          <li>• 换电脑后，先打开网站，再导入备份文件</li>
          <li>• 备份文件是普通 JSON 文件，可以用文本编辑器查看</li>
          <li>• 建议将备份文件保存到云盘（如 OneDrive、百度网盘）</li>
        </ul>
      </div>
    </div>
  )
}
