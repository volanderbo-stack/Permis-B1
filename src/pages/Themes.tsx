import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { lessonsByTheme } from '../data/courses'
import { questionsByTheme } from '../data/questions'
import { THEMES } from '../data/themes'
import { useProgress } from '../lib/storage'
import { themePercent } from '../lib/themeProgress'

export function Themes() {
  const progress = useProgress()
  return (
    <div className="stack-sm">
      <h1 className="page-title">Code de la route</h1>
      <p className="uk" style={{ marginTop: -4 }}>
        10 офіційних тем іспиту ETG: у кожній — короткі уроки й питання.
      </p>
      <div className="row">
        <Link to="/entrainement" className="btn grow">
          🎯 Entraînement
        </Link>
        <Link to="/memo" className="btn grow">
          🔢 Chiffres clés
        </Link>
      </div>
      {THEMES.map((t) => {
        const count = questionsByTheme(t.id).length
        const lessons = lessonsByTheme(t.id).length
        const pct = themePercent(progress, t.id)
        return (
          <Link key={t.id} to={`/themes/${t.id}`} className="theme-row">
            <span className="theme-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="theme-main">
              <span className="theme-name">{t.fr}</span>
              <span className="muted small">
                {t.uk} · {lessons} cours · {count} questions
              </span>
              <ProgressBar value={pct} />
            </span>
            <span className="pct">{pct}%</span>
          </Link>
        )
      })}
    </div>
  )
}
