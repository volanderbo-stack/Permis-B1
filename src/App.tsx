import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Exam } from './pages/Exam'
import { Home } from './pages/Home'
import { Mistakes } from './pages/Mistakes'
import { Signs } from './pages/Signs'
import { Stats } from './pages/Stats'
import { Themes } from './pages/Themes'
import { ThemeStudy } from './pages/ThemeStudy'

// HashRouter — бо GitHub Pages не вміє віддавати index.html для довільних шляхів
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="themes" element={<Themes />} />
          <Route path="themes/:themeId" element={<ThemeStudy />} />
          <Route path="examen" element={<Exam />} />
          <Route path="erreurs" element={<Mistakes />} />
          <Route path="stats" element={<Stats />} />
          <Route path="panneaux" element={<Signs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
