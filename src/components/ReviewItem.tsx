import { useState } from 'react'
import { isAnswerCorrect } from '../data/questions'
import { themeById } from '../data/themes'
import type { Question } from '../types'
import { AnswerList } from './AnswerList'
import { QuestionMedia } from './QuestionMedia'
import { Explanation } from './QuestionCard'
import { TranslateButton } from './TranslateButton'

/** Розбір одного питання після іспиту */
export function ReviewItem({ n, question, selected }: { n: number; question: Question; selected: string[] }) {
  const [open, setOpen] = useState(false)
  const [showUk, setShowUk] = useState(false)
  const ok = isAnswerCorrect(question, selected)
  return (
    <div className={`review ${ok ? 'ok' : 'ko'}`}>
      <button type="button" className="review-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="review-mark">{ok ? '✓' : '✗'}</span>
        <span className="review-title">
          <span className="muted small">
            {n}. {themeById(question.theme)?.fr}
            {selected.length === 0 && ' · sans réponse'}
          </span>
          <span>{question.question_fr}</span>
        </span>
        <span aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="review-body">
          <div className="qcard-top">
            <span />
            <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
          </div>
          <QuestionMedia question={question} />
          {showUk && <p className="uk">{question.question_uk}</p>}
          <AnswerList answers={question.answers} selected={selected} correct={question.correct} revealed showUk={showUk} />
          <Explanation question={question} correct={ok} showUk={showUk} />
        </div>
      )}
    </div>
  )
}
