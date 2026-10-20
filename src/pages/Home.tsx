import { Link, useNavigate } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { QUESTIONS } from '../data/questions'
import { THEMES } from '../data/themes'
import { EXAM_PASS } from '../lib/exam'
import { useInstallPrompt } from '../lib/install'
import { dayStreak, isMistake, useProgress } from '../lib/storage'
import { themePercent } from '../lib/themeProgress'

export function Home() {
  const progress = useProgress()
  const navigate = useNavigate()
  const streak = dayStreak(progress.activeDays)
  const answered = Object.keys(progress.questions).length
  const continueTheme = progress.lastTheme ?? THEMES[0].id
  const mistakes = Object.values(progress.questions).filter(isMistake).length
  const lastExam = progress.exams.at(-1)
  const { available: canInstall, install } = useInstallPrompt()

  return (
    <div className="stack">
      <section className="card hero">
        <div>
          <div className="streak">🔥 {streak}</div>
          <div className="muted small">
            {streak === 1 ? 'jour d’affilée' : 'jours d’affilée'} · днів поспіль
          </div>
        </div>
        <div className="hero-right">
          <div className="big">
            {answered}/{QUESTIONS.length}
          </div>
          <div className="muted small">questions vues</div>
        </div>
      </section>

      <button
        type="button"
        className="btn primary big-btn"
        onClick={() => navigate(`/themes/${continueTheme}`)}
      >
        ▶ Continuer
      </button>

      <div className="tiles">
        <Link to="/examen" className="tile">
          <div className="tile-value">
            {lastExam ? `${lastExam.score}/${lastExam.total}` : '—'}
            {lastExam && (lastExam.score >= EXAM_PASS ? ' ✅' : ' ❌')}
          </div>
          <div className="muted small">⏱️ Examen blanc</div>
        </Link>
        <Link to="/erreurs" className="tile">
          <div className="tile-value">{mistakes}</div>
          <div className="muted small">❗ Erreurs à revoir</div>
        </Link>
      </div>

      {canInstall && (
        <button type="button" className="btn install" onClick={install}>
          📲 Installer l’application · Встановити на телефон
        </button>
      )}

      <section className="stack-sm">
        <h2 className="section-title">Progression par thème</h2>
        {THEMES.map((t) => {
          const pct = themePercent(progress, t.id)
          return (
            <Link key={t.id} to={`/themes/${t.id}`} className="theme-row">
              <span className="theme-icon" aria-hidden>
                {t.icon}
              </span>
              <span className="theme-main">
                <span className="theme-name">{t.fr}</span>
                <ProgressBar value={pct} />
              </span>
              <span className="pct">{pct}%</span>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
