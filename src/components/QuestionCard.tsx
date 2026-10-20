import { useState } from 'react'
import { isAnswerCorrect } from '../data/questions'
import type { Question } from '../types'

interface Props {
  question: Question
  /** номер питання для заголовка, напр. «3 / 15» */
  counter?: string
  /** викликається один раз, коли користувач підтвердив відповідь */
  onAnswered: (correct: boolean, selected: string[]) => void
  onNext: () => void
  nextLabel?: string
}

export function QuestionCard({ question, counter, onAnswered, onNext, nextLabel }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [validated, setValidated] = useState(false)
  const [showUk, setShowUk] = useState(false)

  const toggle = (id: string) => {
    if (validated) return
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].sort()))
  }

  const validate = () => {
    if (selected.length === 0 || validated) return
    setValidated(true)
    onAnswered(isAnswerCorrect(question, selected), selected)
  }

  const correct = validated && isAnswerCorrect(question, selected)

  const answerState = (id: string) => {
    if (!validated) return selected.includes(id) ? 'selected' : ''
    const isRight = question.correct.includes(id)
    const picked = selected.includes(id)
    if (isRight && picked) return 'right'
    if (isRight) return 'missed'
    if (picked) return 'wrong'
    return 'dim'
  }

  return (
    <article className="qcard">
      <div className="qcard-top">
        {counter && <span className="muted">{counter}</span>}
        <button
          type="button"
          className={`chip ${showUk ? 'chip-on' : ''}`}
          onClick={() => setShowUk((v) => !v)}
          aria-pressed={showUk}
        >
          🇺🇦 Переклад
        </button>
      </div>

      {question.image && (
        <img className="qimg" src={question.image} alt="" loading="lazy" />
      )}

      <h2 className="qtext">{question.question_fr}</h2>
      {showUk && <p className="uk">{question.question_uk}</p>}
      <p className="muted small">Une ou plusieurs réponses</p>

      <div className="answers">
        {question.answers.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`answer ${answerState(a.id)}`}
            onClick={() => toggle(a.id)}
            aria-pressed={selected.includes(a.id)}
            disabled={validated}
          >
            <span className="letter">{a.id}</span>
            <span className="answer-text">
              {a.fr}
              {showUk && <span className="uk">{a.uk}</span>}
            </span>
          </button>
        ))}
      </div>

      {validated && (
        <div className={`feedback ${correct ? 'ok' : 'ko'}`}>
          <strong>
            {correct ? '✓ Bonne réponse' : `✗ Mauvaise réponse — bonne réponse : ${question.correct.join(', ')}`}
          </strong>
          <p>{question.explanation_fr}</p>
          {showUk && <p className="uk">{question.explanation_uk}</p>}
        </div>
      )}

      <div className="actions">
        {validated ? (
          <button type="button" className="btn primary" onClick={onNext}>
            {nextLabel ?? 'Suivant →'}
          </button>
        ) : (
          <button
            type="button"
            className="btn primary"
            onClick={validate}
            disabled={selected.length === 0}
          >
            Valider
          </button>
        )}
      </div>
    </article>
  )
}
