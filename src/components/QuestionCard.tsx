import { useState } from 'react'
import { isAnswerCorrect } from '../data/questions'
import type { Question } from '../types'
import { toggleIn } from '../lib/list'
import { AnswerList } from './AnswerList'
import { QuestionImage } from './QuestionImage'
import { TranslateButton } from './TranslateButton'

interface Props {
  question: Question
  /** номер питання для заголовка, напр. «3 / 15» */
  counter?: string
  /** додаткова інформація під лічильником (напр. серія для «Мої помилки») */
  badge?: React.ReactNode
  /** викликається один раз, коли користувач підтвердив відповідь */
  onAnswered: (correct: boolean, selected: string[]) => void
  onNext: () => void
  nextLabel?: string
}

export function QuestionCard({ question, counter, badge, onAnswered, onNext, nextLabel }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [validated, setValidated] = useState(false)
  const [showUk, setShowUk] = useState(false)

  const validate = () => {
    if (selected.length === 0 || validated) return
    setValidated(true)
    onAnswered(isAnswerCorrect(question, selected), selected)
  }

  const correct = validated && isAnswerCorrect(question, selected)

  return (
    <article className="qcard">
      <div className="qcard-top">
        <span className="muted">
          {counter} {badge}
        </span>
        <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
      </div>

      {question.image && <QuestionImage src={question.image} />}

      <h2 className="qtext">{question.question_fr}</h2>
      {showUk && <p className="uk">{question.question_uk}</p>}
      <p className="muted small">Une ou plusieurs réponses</p>

      <AnswerList
        answers={question.answers}
        selected={selected}
        correct={question.correct}
        revealed={validated}
        showUk={showUk}
        onToggle={(id) => setSelected((s) => toggleIn(s, id))}
      />

      {validated && (
        <Explanation question={question} correct={correct} showUk={showUk} />
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

export function Explanation({
  question,
  correct,
  showUk,
}: {
  question: Question
  correct: boolean
  showUk: boolean
}) {
  return (
    <div className={`feedback ${correct ? 'ok' : 'ko'}`}>
      <strong>
        {correct
          ? '✓ Bonne réponse'
          : `✗ Mauvaise réponse — bonne réponse : ${question.correct.join(', ')}`}
      </strong>
      <p>{question.explanation_fr}</p>
      {showUk && <p className="uk">{question.explanation_uk}</p>}
    </div>
  )
}
