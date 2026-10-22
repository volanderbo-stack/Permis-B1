import { Link, useNavigate } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { QUESTIONS } from '../data/questions'
import { THEMES } from '../data/themes'
import { EXAM_PASS } from '../lib/exam'
import { useInstallPrompt } from '../lib/install'
import { READY_EXAMS, readiness } from '../lib/readiness'
import { dayStreak, isDue, isMistake, todayKey, useProgress } from '../lib/storage'
import { themePercent } from '../lib/themeProgress'

function Ring({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" strokeWidth="7" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="ring-fg"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, value))}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

export function Home() {
  const progress = useProgress()
  const navigate = useNavigate()
  const streak = dayStreak(progress.activeDays)
  const stats = Object.values(progress.questions)
  const answered = stats.length
  const continueTheme = progress.lastTheme ?? THEMES[0].id
  const mistakes = stats.filter(isMistake).length
  const due = stats.filter(isDue).length
  const lastExam = progress.exams.at(-1)
  const today = progress.daily[todayKey()] ?? 0
  const goal = progress.settings.dailyGoal
  const ready = readiness(progress)
  const { available: canInstall, install } = useInstallPrompt()

  return (
    <div className="stack">
      <section className="card hero">
        <div className="goal">
          <div className="goal-ring">
            <Ring value={today / goal} />
            <span className="goal-text">
              {today}
              <small>/{goal}</small>
            </span>
          </div>
          <div>
            <strong>{today >= goal ? 'Objectif atteint ✅' : 'Objectif du jour'}</strong>
            <div className="muted small">денна мета · 🔥 {streak} дн. поспіль</div>
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
        onClick={() => navigate(due > 0 ? '/revision' : `/themes/${continueTheme}`)}
      >
        {due > 0 ? `🔁 Réviser ${due} question${due > 1 ? 's' : ''} du jour` : '▶ Continuer'}
      </button>

      <div className="tiles">
        <Link to="/examen" className="tile">
          <div className="tile-value">
            {lastExam ? `${lastExam.score}/${lastExam.total}` : '—'}
            {lastExam && (lastExam.score >= EXAM_PASS ? ' ✅' : ' ❌')}
          </div>
          <div className="muted small">⏱️ Examen blanc</div>
        </Link>
        <Link to="/revision?tab=mistakes" className="tile">
          <div className="tile-value">{mistakes}</div>
          <div className="muted small">❗ Erreurs à revoir</div>
        </Link>
        <Link to="/entrainement" className="tile">
          <div className="tile-value">🎯</div>
          <div className="muted small">Entraînement ciblé</div>
        </Link>
        <Link to="/conduite" className="tile">
          <div className="tile-value">🚗</div>
          <div className="muted small">Préparer la conduite</div>
        </Link>
      </div>

      <Link to="/stats" className={`card readiness ${ready.ready ? 'ok' : ''}`}>
        <div className="row space">
          <strong>{ready.ready ? '🎓 Prêt pour l’examen !' : 'Préparation à l’examen'}</strong>
          <span className="pct">{ready.score}%</span>
        </div>
        <ProgressBar value={ready.score} />
        <span className="muted small">
          {ready.ready
            ? 'Готовий: 5 іспитів поспіль складено, усі теми ≥ 85 %.'
            : `Іспити: ${ready.passed}/${READY_EXAMS} останніх складено · база: ${Math.round(ready.coverage * 100)} % · слабкі теми: ${ready.weakThemes.length}`}
        </span>
      </Link>

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
