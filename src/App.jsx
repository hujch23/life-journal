import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initializeData } from './data/initialData'
import Layout from './components/Layout'
import Home from './pages/Home'
import Travels from './pages/Travels'
import Diaries from './pages/Diaries'
import Exercises from './pages/Exercises'
import Notes from './pages/Notes'

function App() {
  useEffect(() => {
    initializeData()
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/travels" element={<Travels />} />
        <Route path="/diaries" element={<Diaries />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Layout>
  )
}

export default App
