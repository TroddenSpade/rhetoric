import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Write from './pages/Write.jsx'
import Structures from './pages/Structures.jsx'
import Wordbook from './pages/Wordbook.jsx'
import Practice from './pages/Practice.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="write" element={<Write />} />
        <Route path="structures" element={<Structures />} />
        <Route path="wordbook" element={<Wordbook />} />
        <Route path="practice" element={<Practice />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
