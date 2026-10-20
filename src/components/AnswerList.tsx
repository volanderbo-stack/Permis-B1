import type { Answer } from '../types'

interface Props {
  answers: Answer[]
  selected: string[]
  correct: string[]
  /** показати правильні/неправильні */
  revealed: boolean
  showUk: boolean
  onToggle?: (id: string) => void
}

function mark(id: string, selected: string[], correct: string[], revealed: boolean) {
  const picked = selected.includes(id)
  if (!revealed) return picked ? 'selected' : ''
  const isRight = correct.includes(id)
  if (isRight && picked) return 'right'
  if (isRight) return 'missed'
  if (picked) return 'wrong'
  return 'dim'
}

export function AnswerList({ answers, selected, correct, revealed, showUk, onToggle }: Props) {
  return (
    <div className="answers">
      {answers.map((a) => (
        <button
          key={a.id}
          type="button"
          className={`answer ${mark(a.id, selected, correct, revealed)}`}
          onClick={() => onToggle?.(a.id)}
          aria-pressed={selected.includes(a.id)}
          disabled={revealed || !onToggle}
        >
          <span className="letter">{a.id}</span>
          <span className="answer-text">
            {a.fr}
            {showUk && <span className="uk">{a.uk}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}
