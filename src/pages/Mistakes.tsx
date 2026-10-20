import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { QUESTIONS } from '../data/questions'
import { themeById } from '../data/themes'
import { isMistake, MASTERY_STREAK, recordAnswer, useProgress } from '../lib/storage'
import type { Question } from '../types'

function StreakDots({ streak }: { streak: number }) {
  return (
    <span className="dots" aria-label={`${streak}/${MASTERY_STREAK}`}>
      {Array.from({ length: MASTERY_STREAK }, (_, i) => (
        <span key={i} className={`dot ${i < streak ? 'on' : ''}`} />
      ))}
    </span>
  )
}

export function Mistakes() {
  const progress = useProgress()
  // Список фіксується на початку сесії, щоб питання не зникало посеред відповіді
  const [session, setSession] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [cleared, setCleared] = useState(0)

  const mistakes = QUESTIONS.filter((q) => isMistake(progress.questions[q.id])).sort(
    (a, b) => (progress.questions[b.id]?.lastAt ?? 0) - (progress.questions[a.id]?.lastAt ?? 0),
  )

  if (session && index < session.length) {
    const q = session[index]
    const stat = progress.questions[q.id]
    return (
      <div className="stack">
        <div className="study-head">
          <button type="button" className="back" aria-label="Retour" onClick={() => setSession(null)}>
            ←
          </button>
          <div className="theme-main">
            <span className="theme-name">❗ Mes erreurs</span>
            <ProgressBar value={(index / session.length) * 100} />
          </div>
        </div>
        <QuestionCard
          key={`${q.id}-${index}`}
          question={q}
          counter={`${index + 1} / ${session.length}`}
          badge={<StreakDots streak={stat?.streak ?? 0} />}
          onAnswered={(ok) => {
            recordAnswer(q.id, ok)
            if (ok && (stat?.streak ?? 0) + 1 >= MASTERY_STREAK) setCleared((c) => c + 1)
          }}
          onNext={() => setIndex(index + 1)}
          nextLabel={index === session.length - 1 ? 'Terminer' : undefined}
        />
      </div>
    )
  }

  const startSession = () => {
    setSession(mistakes)
    setIndex(0)
    setCleared(0)
  }

  return (
    <div className="stack">
      <h1 className="page-title">Mes erreurs</h1>
      <p className="uk" style={{ marginTop: -8 }}>
        Питання зникає зі списку, коли ти відповіси правильно {MASTERY_STREAK} рази поспіль.
      </p>

      {session && (
        <div className="card center">
          <strong>Série terminée</strong>
          <p className="muted">
            {cleared} question(s) maîtrisée(s) · засвоєно {cleared}
          </p>
        </div>
      )}

      {mistakes.length === 0 ? (
        <div className="card center">
          <div className="result-emoji">🎉</div>
          <p>Aucune erreur à revoir.</p>
          <p className="uk">Помилок немає. Потренуйся за темами або пройди пробний іспит.</p>
          <Link to="/themes" className="btn">
            📚 Thèmes
          </Link>
        </div>
      ) : (
        <>
          <button type="button" className="btn primary big-btn" onClick={startSession}>
            ▶ Réviser {mistakes.length} question{mistakes.length > 1 ? 's' : ''}
          </button>
          <div className="stack-sm">
            {mistakes.map((q) => {
              const stat = progress.questions[q.id]!
              return (
                <div key={q.id} className="card mistake-row">
                  <div className="muted small">
                    {themeById(q.theme)?.icon} {themeById(q.theme)?.fr} · {stat.wrong} erreur(s)
                  </div>
                  <div>{q.question_fr}</div>
                  <StreakDots streak={stat.streak} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
