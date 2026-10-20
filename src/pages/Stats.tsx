import { Link } from 'react-router-dom'
import { ExamChart } from '../components/ExamChart'
import { QUESTIONS, questionsByTheme } from '../data/questions'
import { THEMES } from '../data/themes'
import { EXAM_PASS } from '../lib/exam'
import { resetProgress, useProgress, type Progress } from '../lib/storage'
import type { ThemeId } from '../types'

/** Точність по темі: правильні / всі спроби (з навчання, іспитів і помилок) */
function themeAccuracy(progress: Progress, theme: ThemeId) {
  let ok = 0
  let total = 0
  for (const q of questionsByTheme(theme)) {
    const s = progress.questions[q.id]
    if (!s) continue
    ok += s.correct
    total += s.attempts
  }
  return { ok, total, pct: total ? Math.round((ok / total) * 100) : null }
}

export function Stats() {
  const progress = useProgress()
  const stats = Object.values(progress.questions)
  const attempts = stats.reduce((n, s) => n + s.attempts, 0)
  const correct = stats.reduce((n, s) => n + s.correct, 0)
  const exams = progress.exams
  const passed = exams.filter((e) => e.score >= EXAM_PASS).length
  const avg = exams.length ? (exams.reduce((n, e) => n + e.score, 0) / exams.length).toFixed(1) : '—'

  const themes = THEMES.map((t) => ({ theme: t, ...themeAccuracy(progress, t.id) }))
  const ranked = themes
    .filter((t) => t.pct !== null)
    .sort((a, b) => a.pct! - b.pct!)

  return (
    <div className="stack">
      <h1 className="page-title">Statistiques</h1>

      <div className="tiles">
        <div className="tile">
          <div className="tile-value">{exams.length}</div>
          <div className="muted small">examens · іспитів</div>
        </div>
        <div className="tile">
          <div className="tile-value">{passed}</div>
          <div className="muted small">réussis · складено</div>
        </div>
        <div className="tile">
          <div className="tile-value">{avg}</div>
          <div className="muted small">moyenne /40</div>
        </div>
        <div className="tile">
          <div className="tile-value">{attempts ? Math.round((correct / attempts) * 100) : 0}%</div>
          <div className="muted small">
            réponses justes · {stats.length}/{QUESTIONS.length} vues
          </div>
        </div>
      </div>

      <section className="card stack-sm">
        <h2 className="section-title">Examens blancs</h2>
        {exams.length ? (
          <ExamChart exams={exams} />
        ) : (
          <p className="muted">
            Pas encore d’examen. <Link to="/examen" className="link">Passer un examen →</Link>
          </p>
        )}
      </section>

      <section className="card stack-sm">
        <h2 className="section-title">Thèmes les plus faibles</h2>
        <p className="uk" style={{ margin: 0 }}>
          Найслабші теми — за часткою правильних відповідей
        </p>
        {ranked.length === 0 && <p className="muted">Réponds à quelques questions pour voir tes points faibles.</p>}
        {ranked.map(({ theme, pct, ok, total }, i) => (
          <Link key={theme.id} to={`/themes/${theme.id}`} className="hbar-row">
            <span className="hbar-label">
              {i < 3 && pct! < 100 ? '⚠️ ' : ''}
              {theme.icon} {theme.fr}
            </span>
            <span className="hbar-track">
              <span className="hbar-fill" style={{ width: `${pct}%` }} />
            </span>
            <span className="hbar-value">
              {pct}% <span className="muted small">({ok}/{total})</span>
            </span>
          </Link>
        ))}
      </section>

      <button
        type="button"
        className="btn danger"
        onClick={() => {
          if (confirm('Effacer toute la progression ? / Стерти весь прогрес?')) resetProgress()
        }}
      >
        Réinitialiser la progression
      </button>
    </div>
  )
}
