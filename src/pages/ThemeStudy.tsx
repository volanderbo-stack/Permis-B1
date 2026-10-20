import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { questionsByTheme } from '../data/questions'
import { themeById } from '../data/themes'
import { recordAnswer, setLastTheme, useProgress } from '../lib/storage'

export function ThemeStudy() {
  const { themeId = '' } = useParams()
  // key — щоб при переході на іншу тему стан сесії скидався
  return <ThemeSession key={themeId} themeId={themeId} />
}

function ThemeSession({ themeId }: { themeId: string }) {
  const theme = themeById(themeId)
  const progress = useProgress()
  const questions = useMemo(() => (theme ? questionsByTheme(theme.id) : []), [theme])

  // Починаємо з першого питання, яке ще не засвоєне (остання відповідь не правильна)
  const [index, setIndex] = useState(() => {
    const i = questions.findIndex((q) => !progress.questions[q.id]?.lastCorrect)
    return i === -1 ? 0 : i
  })
  const [sessionScore, setSessionScore] = useState({ ok: 0, total: 0 })
  const [finished, setFinished] = useState(false)

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

  if (questions.length === 0) {
    return (
      <div className="stack">
        <h1 className="page-title">
          {theme.icon} {theme.fr}
        </h1>
        <div className="card">
          <p>Les questions de ce thème arrivent bientôt.</p>
          <p className="uk">Питання для цієї теми скоро з’являться.</p>
        </div>
        <Link to="/themes" className="btn">
          ← Thèmes
        </Link>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((sessionScore.ok / Math.max(1, sessionScore.total)) * 100)
    return (
      <div className="stack">
        <h1 className="page-title">
          {theme.icon} {theme.fr}
        </h1>
        <div className="card center">
          <div className="big">
            {sessionScore.ok}/{sessionScore.total}
          </div>
          <p className="muted">bonnes réponses · правильних відповідей</p>
          <ProgressBar value={pct} />
        </div>
        <button
          type="button"
          className="btn primary big-btn"
          onClick={() => {
            setIndex(0)
            setSessionScore({ ok: 0, total: 0 })
            setFinished(false)
          }}
        >
          ↻ Recommencer le thème
        </button>
        <Link to="/themes" className="btn">
          ← Thèmes
        </Link>
      </div>
    )
  }

  const q = questions[index]
  const isLast = index === questions.length - 1

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
          <ProgressBar value={Math.round((index / questions.length) * 100)} />
        </div>
      </div>
      <QuestionCard
        key={q.id}
        question={q}
        counter={`Question ${index + 1} / ${questions.length}`}
        onAnswered={(ok) => {
          recordAnswer(q.id, ok)
          setSessionScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }))
        }}
        onNext={() => (isLast ? setFinished(true) : setIndex(index + 1))}
        nextLabel={isLast ? 'Terminer' : undefined}
      />
    </div>
  )
}
