import { Link } from 'react-router-dom'
import { ExamChart } from '../components/ExamChart'
import { QUESTIONS } from '../data/questions'
import { THEMES } from '../data/themes'
import { EXAM_PASS } from '../lib/exam'
import { themeAccuracy } from '../lib/readiness'
import { recentDays, useProgress } from '../lib/storage'
import { TAGS } from '../data/tags'

export function Stats() {
  const progress = useProgress()
  const stats = Object.values(progress.questions)
  const attempts = stats.reduce((n, s) => n + s.attempts, 0)
  const correct = stats.reduce((n, s) => n + s.correct, 0)
  const exams = progress.exams
  const passed = exams.filter((e) => e.score >= EXAM_PASS).length
  const avg = exams.length ? (exams.reduce((n, e) => n + e.score, 0) / exams.length).toFixed(1) : '—'

  // точність за тегами (правилами), лише де є хоча б 3 спроби
  const tagStats: Record<string, [number, number]> = {}
  for (const q of QUESTIONS) {
    const st = progress.questions[q.id]
    if (!st) continue
    for (const t of q.tags ?? []) {
      const [o, n] = tagStats[t] ?? [0, 0]
      tagStats[t] = [o + st.correct, n + st.attempts]
    }
  }
  const weakTags = Object.entries(tagStats)
    .filter(([, [, n]]) => n >= 3)
    .map(([id, [o, n]]) => ({ id, pct: Math.round((o / n) * 100), o, n }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6)

  // активність за останні 35 днів (5 тижнів)
  const days = recentDays(progress.daily, 35)
  const maxDay = Math.max(1, ...days.map((d) => d.n))
  const goal = progress.settings.dailyGoal

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
        <h2 className="section-title">Activité · 5 dernières semaines</h2>
        <div className="heatmap" role="img" aria-label="Activité par jour">
          {days.map((d) => (
            <span
              key={d.key}
              className={`heat ${d.n >= goal ? 'goal' : ''}`}
              style={{ opacity: d.n ? 0.25 + 0.75 * (d.n / maxDay) : 1 }}
              data-empty={d.n === 0}
              title={`${d.key} : ${d.n} réponse(s)`}
            />
          ))}
        </div>
        <p className="muted small" style={{ margin: 0 }}>
          Кожна клітинка — день; ✓ — денну мету ({goal}) виконано.
        </p>
      </section>

      {weakTags.length > 0 && (
        <section className="card stack-sm">
          <h2 className="section-title">Règles à retravailler</h2>
          <p className="uk" style={{ margin: 0 }}>
            Правила, де найбільше помилок
          </p>
          {weakTags.map((t) => (
            <Link key={t.id} to="/entrainement" className="hbar-row">
              <span className="hbar-label">{TAGS[t.id]?.fr ?? t.id}</span>
              <span className="hbar-track">
                <span className="hbar-fill" style={{ width: `${t.pct}%` }} />
              </span>
              <span className="hbar-value">
                {t.pct}% <span className="muted small">({t.o}/{t.n})</span>
              </span>
            </Link>
          ))}
        </section>
      )}

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

    </div>
  )
}
