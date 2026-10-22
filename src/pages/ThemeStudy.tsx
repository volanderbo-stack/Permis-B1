import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PracticeSession } from '../components/PracticeSession'
import { ProgressBar } from '../components/ProgressBar'
import { lessonsByTheme } from '../data/courses'
import { questionsByTheme } from '../data/questions'
import { themeById } from '../data/themes'
import { shuffle } from '../lib/list'
import { setLastTheme, useProgress } from '../lib/storage'
import { themePercent } from '../lib/themeProgress'
import type { Question } from '../types'

export function ThemeStudy() {
  const { themeId = '' } = useParams()
  // key — щоб при переході на іншу тему стан сесії скидався
  return <ThemeSession key={themeId} themeId={themeId} />
}

function ThemeSession({ themeId }: { themeId: string }) {
  const theme = themeById(themeId)
  const progress = useProgress()
  const questions = useMemo(() => (theme ? questionsByTheme(theme.id) : []), [theme])
  const lessons = theme ? lessonsByTheme(theme.id) : []
  const [session, setSession] = useState<{ title: string; list: Question[] } | null>(null)

  useEffect(() => {
    if (theme) setLastTheme(theme.id)
  }, [theme])

  if (!theme) {
    return (
      <div className="card">
        <p>Thème introuvable.</p>
        <Link to="/themes">← Retour</Link>
      </div>
    )
  }

  if (session) {
    return <PracticeSession title={session.title} questions={session.list} onExit={() => setSession(null)} />
  }

  const stat = (q: Question) => progress.questions[q.id]
  // «Продовжити»: спершу ще не засвоєні (остання відповідь не правильна), у порядку бази
  const notMastered = questions.filter((q) => !stat(q)?.lastCorrect)
  const unseen = questions.filter((q) => !stat(q))
  const failed = questions.filter((q) => (stat(q)?.wrong ?? 0) > 0)
  const pct = themePercent(progress, theme.id)
  const readCount = lessons.filter((l) => progress.lessonsRead.includes(l.id)).length

  const modes = [
    { label: '▶ Continuer', sub: `${notMastered.length} à maîtriser`, list: notMastered, primary: true },
    { label: '🔀 Série aléatoire (20)', sub: 'випадкові 20', list: shuffle(questions).slice(0, 20) },
    { label: '🆕 Jamais vues', sub: `${unseen.length} нових`, list: shuffle(unseen) },
    { label: '❗ Déjà ratées', sub: `${failed.length} з помилками`, list: shuffle(failed) },
    { label: '📋 Toutes dans l’ordre', sub: `${questions.length}`, list: questions },
  ]

  return (
    <div className="stack">
      <div className="study-head">
        <Link to="/themes" className="back" aria-label="Retour">
          ←
        </Link>
        <div className="theme-main">
          <span className="theme-name">
            {theme.icon} {theme.fr}
          </span>
          <span className="muted small">{theme.uk}</span>
        </div>
        <span className="pct">{pct}%</span>
      </div>
      <ProgressBar value={pct} />

      {lessons.length > 0 && (
        <section className="stack-sm">
          <h2 className="section-title">
            📖 Cours · {readCount}/{lessons.length} lus
          </h2>
          {lessons.map((l) => (
            <Link key={l.id} to={`/cours/${l.id}`} className="theme-row">
              <span className="theme-icon" aria-hidden>
                {progress.lessonsRead.includes(l.id) ? '✅' : '📄'}
              </span>
              <span className="theme-main">
                <span className="theme-name">{l.title_fr}</span>
                <span className="muted small">
                  {l.title_uk} · {l.minutes} min
                </span>
              </span>
              <span aria-hidden>›</span>
            </Link>
          ))}
        </section>
      )}

      <section className="stack-sm">
        <h2 className="section-title">✍️ Questions · {questions.length}</h2>
        {modes.map((m) => (
          <button
            key={m.label}
            type="button"
            className={`btn mode-btn ${m.primary ? 'primary' : ''}`}
            disabled={m.list.length === 0}
            onClick={() => setSession({ title: `${theme.icon} ${theme.fr}`, list: m.list })}
          >
            <span>{m.label}</span>
            <span className="small mode-sub">{m.sub}</span>
          </button>
        ))}
      </section>
    </div>
  )
}
