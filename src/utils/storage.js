// 本地存储工具函数

const STORAGE_KEYS = {
  TRAVELS: 'life-journal-travels',
  DIARIES: 'life-journal-diaries',
  EXERCISES: 'life-journal-exercises',
  NOTES: 'life-journal-notes',
}

// 获取数据
export function getData(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// 保存数据
export function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// 添加项目
export function addItem(key, item) {
  const items = getData(key) || []
  const newItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  items.unshift(newItem)
  setData(key, items)
  return newItem
}

// 更新项目
export function updateItem(key, id, updates) {
  const items = getData(key) || []
  const index = items.findIndex(item => item.id === id)
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
    setData(key, items)
    return items[index]
  }
  return null
}

// 删除项目
export function deleteItem(key, id) {
  const items = getData(key) || []
  const filtered = items.filter(item => item.id !== id)
  setData(key, filtered)
  return filtered
}

export { STORAGE_KEYS }
