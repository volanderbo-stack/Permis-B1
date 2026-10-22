import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PracticeSession, StreakDots } from '../components/PracticeSession'
import { QuestionPreview } from '../components/QuestionPreview'
import { QUESTIONS } from '../data/questions'
import { shuffle } from '../lib/list'
import { isDue, isMistake, MASTERY_STREAK, useProgress } from '../lib/storage'
import type { Question } from '../types'

type Tab = 'due' | 'mistakes' | 'favorites'

const TABS: { id: Tab; fr: string; uk: string; icon: string }[] = [
  { id: 'due', fr: 'À revoir', uk: 'На сьогодні', icon: '🔁' },
  { id: 'mistakes', fr: 'Erreurs', uk: 'Помилки', icon: '❗' },
  { id: 'favorites', fr: 'Favoris', uk: 'Обране', icon: '★' },
]

const MAX_SESSION = 40

export function Revision() {
  const progress = useProgress()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'due'
  // Список фіксується на початку сесії, щоб питання не зникало посеред відповіді
  const [session, setSession] = useState<Question[] | null>(null)

  const lists: Record<Tab, Question[]> = {
    due: QUESTIONS.filter((q) => isDue(progress.questions[q.id])).sort(
      (a, b) => progress.questions[a.id]!.due - progress.questions[b.id]!.due,
    ),
    mistakes: QUESTIONS.filter((q) => isMistake(progress.questions[q.id])).sort(
      (a, b) => (progress.questions[b.id]?.lastAt ?? 0) - (progress.questions[a.id]?.lastAt ?? 0),
    ),
    favorites: QUESTIONS.filter((q) => progress.favorites.includes(q.id)),
  }
  const list = lists[tab]
  const current = TABS.find((t) => t.id === tab)!

  if (session) {
    return (
      <PracticeSession
        title={`${current.icon} ${current.fr}`}
        questions={session}
        showStreak={tab === 'mistakes'}
        onExit={() => setSession(null)}
      />
    )
  }

  const hint: Record<Tab, string> = {
    due:
      'Інтервальне повторення: кожне питання повертається через 1, 2, 4, 8, 16, 32 дні після правильної відповіді. Помилка — і питання знову на сьогодні.',
    mistakes: `Питання з помилками. Зникає після ${MASTERY_STREAK} правильних відповідей поспіль.`,
    favorites: 'Питання, позначені зірочкою ☆, — щоб повторити перед іспитом.',
  }

  return (
    <div className="stack">
      <h1 className="page-title">Révision</h1>
      <div className="segmented three" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams({ tab: t.id }, { replace: true })}
          >
            {t.icon} {t.fr} <span className="count">{lists[t.id].length}</span>
          </button>
        ))}
      </div>
      <p className="uk" style={{ margin: 0 }}>
        {hint[tab]}
      </p>

      {list.length === 0 ? (
        <div className="card center stack-sm">
          <div className="result-emoji">{tab === 'favorites' ? '☆' : '🎉'}</div>
          <p>{tab === 'favorites' ? 'Aucun favori.' : 'Rien à revoir pour le moment.'}</p>
          <Link to="/entrainement" className="btn">
            🎯 S’entraîner
          </Link>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="btn primary big-btn"
            onClick={() => setSession(tab === 'favorites' ? shuffle(list) : list.slice(0, MAX_SESSION))}
          >
            ▶ Réviser {Math.min(list.length, tab === 'favorites' ? list.length : MAX_SESSION)} question(s)
          </button>
          <div className="stack-sm">
            {list.map((q) => {
              const stat = progress.questions[q.id]
              return (
                <QuestionPreview
                  key={q.id}
                  question={q}
                  extra={
                    tab === 'mistakes' && stat ? (
                      <>
                        · {stat.wrong} erreur(s) <StreakDots streak={stat.streak} />
                      </>
                    ) : undefined
                  }
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

