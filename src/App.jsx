import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Write from './pages/Write.jsx'
import Structures from './pages/Structures.jsx'
import Wordbook from './pages/Wordbook.jsx'
import Practice from './pages/Practice.jsx'
import Account from './pages/Account.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'
import { AccountProvider } from './lib/account.jsx'

export default function App() {
  return (
    <AccountProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="write" element={<Write />} />
          <Route path="structures" element={<Structures />} />
          <Route path="wordbook" element={<Wordbook />} />
          <Route path="practice" element={<Practice />} />
          <Route path="account" element={<Account />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AccountProvider>
  )
}
