import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Driving } from './pages/Driving'
import { DrivingTopic } from './pages/DrivingTopic'
import { Exam } from './pages/Exam'
import { Glossary } from './pages/Glossary'
import { Home } from './pages/Home'
import { Lesson } from './pages/Lesson'
import { Memo } from './pages/Memo'
import { More } from './pages/More'
import { Revision } from './pages/Revision'
import { Search } from './pages/Search'
import { Signs } from './pages/Signs'
import { Stats } from './pages/Stats'
import { Themes } from './pages/Themes'
import { ThemeStudy } from './pages/ThemeStudy'
import { Training } from './pages/Training'

// HashRouter — бо GitHub Pages не вміє віддавати index.html для довільних шляхів
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="themes" element={<Themes />} />
          <Route path="themes/:themeId" element={<ThemeStudy />} />
          <Route path="cours/:lessonId" element={<Lesson />} />
          <Route path="examen" element={<Exam />} />
          <Route path="revision" element={<Revision />} />
          <Route path="erreurs" element={<Navigate to="/revision?tab=mistakes" replace />} />
          <Route path="entrainement" element={<Training />} />
          <Route path="recherche" element={<Search />} />
          <Route path="conduite" element={<Driving />} />
          <Route path="conduite/:topicId" element={<DrivingTopic />} />
          <Route path="plus" element={<More />} />
          <Route path="stats" element={<Stats />} />
          <Route path="panneaux" element={<Signs />} />
          <Route path="memo" element={<Memo />} />
          <Route path="glossaire" element={<Glossary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
