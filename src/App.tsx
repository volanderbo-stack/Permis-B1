import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ComingSoon } from './pages/ComingSoon'
import { Home } from './pages/Home'
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
          <Route path="examen" element={<ComingSoon title="Examen blanc" stage={2} />} />
          <Route path="erreurs" element={<ComingSoon title="Mes erreurs" stage={3} />} />
          <Route path="stats" element={<ComingSoon title="Statistiques" stage={3} />} />
          <Route path="panneaux" element={<ComingSoon title="Panneaux" stage={4} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
