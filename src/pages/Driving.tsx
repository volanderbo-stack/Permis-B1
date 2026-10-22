import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { DRIVING_TOPICS, SKILLS } from '../data/driving'
import { useProgress } from '../lib/storage'

export function Driving() {
  const progress = useProgress()
  const minutes = progress.driving.reduce((n, l) => n + l.minutes, 0)
  const items = SKILLS.flatMap((g) => g.items)
  const skillPct = Math.round(
    (items.reduce((n, it) => n + (progress.skills[it.id] ?? 0), 0) / (items.length * 3)) * 100,
  )

  return (
    <div className="stack">
      <h1 className="page-title">Conduite</h1>
      <p className="uk" style={{ marginTop: -8 }}>
        Підготовка до практичного іспиту: маневри, перевірки, самооцінка й щоденник занять.
      </p>
      <div className="tiles">
        <Link to="/conduite/journal" className="tile">
          <div className="tile-value">
            {Math.floor(minutes / 60)} h {String(minutes % 60).padStart(2, '0')}
          </div>
          <div className="muted small">
            📓 {progress.driving.length} leçon(s) · заняття
          </div>
        </Link>
        <Link to="/conduite/competences" className="tile">
          <div className="tile-value">{skillPct}%</div>
          <div className="muted small">📊 Compétences · навички</div>
          <ProgressBar value={skillPct} />
        </Link>
      </div>
      <div className="stack-sm">
        {DRIVING_TOPICS.map((t) => (
          <Link key={t.id} to={`/conduite/${t.id}`} className="theme-row">
            <span className="theme-icon" aria-hidden>
              {t.icon}
            </span>
            <span className="theme-main">
              <span className="theme-name">{t.fr}</span>
              <span className="muted small">{t.uk}</span>
            </span>
            <span aria-hidden>›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
