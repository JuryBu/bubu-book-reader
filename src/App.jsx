import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Reader from './pages/Reader.jsx'
import About from './pages/About.jsx'
import Resources from './pages/Resources.jsx'
import Blog from './pages/Blog.jsx'

export default function App() {
  return (
    <Routes>
      {/* 主站页面共用顶栏 + 页脚 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
      </Route>
      {/* 阅读页独立全屏两栏布局，不套主站 Layout */}
      <Route path="/reader" element={<Reader />} />
      <Route path="/reader/:bookId" element={<Reader />} />
    </Routes>
  )
}
