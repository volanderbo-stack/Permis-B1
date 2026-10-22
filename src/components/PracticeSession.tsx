import { useState } from 'react'
import { MASTERY_STREAK, recordAnswer, useProgress } from '../lib/storage'
import type { Question } from '../types'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'

export function StreakDots({ streak }: { streak: number }) {
  return (
    <span className="dots" aria-label={`${streak}/${MASTERY_STREAK}`}>
      {Array.from({ length: MASTERY_STREAK }, (_, i) => (
        <span key={i} className={`dot ${i < streak ? 'on' : ''}`} />
      ))}
    </span>
  )
}

interface Props {
  title: string
  questions: Question[]
  onExit: () => void
  /** показувати прогрес до засвоєння (●●○) */
  showStreak?: boolean
}

/** Серія питань з поясненням після кожної відповіді та підсумком у кінці */
export function PracticeSession({ title, questions, onExit, showStreak }: Props) {
  const progress = useProgress()
  const [index, setIndex] = useState(0)
  const [ok, setOk] = useState(0)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  // для «ще раз помилки» — новий список без перезапуску компонента
  const [list, setList] = useState(questions)

  if (list.length === 0) {
    return (
      <div className="card center stack-sm">
        <p>Aucune question ici pour l’instant.</p>
        <p className="uk">Тут поки немає питань.</p>
        <button type="button" className="btn" onClick={onExit}>
          ← Retour
        </button>
      </div>
    )
  }

  if (index >= list.length) {
    const pct = Math.round((ok / list.length) * 100)
    return (
      <div className="stack">
        <div className={`card center result ${pct >= 85 ? 'ok' : 'ko'}`}>
          <div className="result-emoji">{pct >= 85 ? '🎉' : '💪'}</div>
          <div className="big">
            {ok}/{list.length}
          </div>
          <p className="muted">
            {title} · {pct}%
          </p>
        </div>
        {wrongIds.length > 0 && (
          <button
            type="button"
            className="btn primary big-btn"
            onClick={() => {
              setList(list.filter((q) => wrongIds.includes(q.id)))
              setIndex(0)
              setOk(0)
              setWrongIds([])
            }}
          >
            ↻ Refaire mes {wrongIds.length} erreur(s)
          </button>
        )}
        <button type="button" className="btn" onClick={onExit}>
          ← Retour
        </button>
      </div>
    )
  }

  const q = list[index]
  const stat = progress.questions[q.id]
  return (
    <div className="stack">
      <div className="study-head">
        <button type="button" className="back" aria-label="Retour" onClick={onExit}>
          ←
        </button>
        <div className="theme-main">
          <span className="theme-name">{title}</span>
          <ProgressBar value={(index / list.length) * 100} />
        </div>
      </div>
      <QuestionCard
        key={`${q.id}-${index}`}
        question={q}
        counter={`${index + 1} / ${list.length}`}
        badge={showStreak ? <StreakDots streak={stat?.streak ?? 0} /> : undefined}
        onAnswered={(correct) => {
          recordAnswer(q.id, correct)
          if (correct) setOk((n) => n + 1)
          else setWrongIds((w) => [...w, q.id])
        }}
        onNext={() => setIndex(index + 1)}
        nextLabel={index === list.length - 1 ? 'Terminer' : undefined}
      />
    </div>
  )
}
