import { useEffect, useRef, useState } from 'react'
import type { Question } from '../types'
import { toggleIn } from '../lib/list'
import { AnswerList } from './AnswerList'
import { QuestionImage } from './QuestionImage'
import { TranslateButton } from './TranslateButton'

interface Props {
  question: Question
  seconds: number
  onSubmit: (selected: string[]) => void
}

/** Питання іспиту: без пояснень, з таймером. Коли час виходить — відповідь зараховується як є. */
export function ExamQuestion({ question, seconds, onSubmit }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [left, setLeft] = useState(seconds)
  const [showUk, setShowUk] = useState(false)
  const selectedRef = useRef(selected)
  const submitted = useRef(false)
  selectedRef.current = selected

  const submit = (answer: string[]) => {
    if (submitted.current) return
    submitted.current = true
    onSubmit(answer)
  }

  useEffect(() => {
    const started = Date.now()
    const timer = setInterval(() => {
      const remaining = seconds - Math.floor((Date.now() - started) / 1000)
      setLeft(Math.max(0, remaining))
      if (remaining <= 0) {
        clearInterval(timer)
        submit(selectedRef.current)
      }
    }, 250)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = (left / seconds) * 100

  return (
    <article className="qcard">
      <div className="timer" aria-label={`${left} secondes`}>
        <div
          className={`timer-fill ${left <= 5 ? 'low' : ''}`}
          style={{ width: `${pct}%` }}
        />
        <span className="timer-text">{left} s</span>
      </div>

      <div className="qcard-top">
        <span className="muted small">Une ou plusieurs réponses</span>
        <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
      </div>

      {question.image && <QuestionImage src={question.image} />}

      <h2 className="qtext">{question.question_fr}</h2>
      {showUk && <p className="uk">{question.question_uk}</p>}

      <AnswerList
        answers={question.answers}
        selected={selected}
        correct={question.correct}
        revealed={false}
        showUk={showUk}
        onToggle={(id) => setSelected((s) => toggleIn(s, id))}
      />

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => submit(selected)}
          disabled={selected.length === 0}
        >
          Valider
        </button>
      </div>
    </article>
  )
}
