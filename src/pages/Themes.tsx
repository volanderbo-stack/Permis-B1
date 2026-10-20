import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { questionsByTheme } from '../data/questions'
import { THEMES } from '../data/themes'
import { useProgress } from '../lib/storage'
import { themePercent } from '../lib/themeProgress'

export function Themes() {
  const progress = useProgress()
  return (
    <div className="stack-sm">
      <h1 className="page-title">Les 10 thèmes</h1>
      {THEMES.map((t) => {
        const count = questionsByTheme(t.id).length
        const pct = themePercent(progress, t.id)
        return (
          <Link key={t.id} to={`/themes/${t.id}`} className="theme-row">
            <span className="theme-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="theme-main">
              <span className="theme-name">{t.fr}</span>
              <span className="muted small">
                {t.uk} · {count} questions
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
