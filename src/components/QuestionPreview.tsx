import { useState } from 'react'
import { themeById } from '../data/themes'
import type { Question } from '../types'
import { AnswerList } from './AnswerList'
import { QuestionMedia } from './QuestionMedia'
import { QuestionTools } from './QuestionTools'
import { TranslateButton } from './TranslateButton'

/** Згорнуте питання у списку; розгортається з правильною відповіддю та поясненням */
export function QuestionPreview({ question, extra }: { question: Question; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [showUk, setShowUk] = useState(false)
  const theme = themeById(question.theme)
  return (
    <div className="review">
      <button type="button" className="review-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="review-title">
          <span className="muted small">
            {theme?.icon} {theme?.fr} {extra}
          </span>
          <span>{question.question_fr}</span>
        </span>
        <span aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="review-body">
          <div className="qcard-top">
            <QuestionTools question={question} />
            <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
          </div>
          <QuestionMedia question={question} />
          {showUk && <p className="uk">{question.question_uk}</p>}
          <AnswerList answers={question.answers} selected={question.correct} correct={question.correct} revealed showUk={showUk} />
          <div className="feedback ok">
            <strong>Bonne réponse : {question.correct.join(', ')}</strong>
            <p>{question.explanation_fr}</p>
            {showUk && <p className="uk">{question.explanation_uk}</p>}
            {question.source && <p className="muted small">📖 {question.source}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
