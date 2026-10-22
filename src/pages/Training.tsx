import { useMemo, useState } from 'react'
import { PracticeSession } from '../components/PracticeSession'
import { QUESTIONS } from '../data/questions'
import { TAGS } from '../data/tags'
import { THEMES } from '../data/themes'
import { shuffle } from '../lib/list'
import { useProgress } from '../lib/storage'
import type { Question, ThemeId } from '../types'

type Kind = 'all' | 'unseen' | 'failed' | 'hard'

const KINDS: { id: Kind; fr: string; uk: string }[] = [
  { id: 'all', fr: 'Toutes', uk: 'Усі' },
  { id: 'unseen', fr: 'Jamais vues', uk: 'Нові' },
  { id: 'failed', fr: 'Déjà ratées', uk: 'З помилками' },
  { id: 'hard', fr: 'Difficiles', uk: 'Складні' },
]
const COUNTS = [10, 20, 40]

/** Тренування за фільтрами: тема, тип, тег, кількість — як «séries» у платних застосунках */
export function Training() {
  const progress = useProgress()
  const [theme, setTheme] = useState<ThemeId | 'all'>('all')
  const [kind, setKind] = useState<Kind>('all')
  const [tag, setTag] = useState<string | null>(null)
  const [count, setCount] = useState(20)
  const [session, setSession] = useState<Question[] | null>(null)

  const pool = useMemo(
    () =>
      QUESTIONS.filter((q) => {
        const s = progress.questions[q.id]
        if (theme !== 'all' && q.theme !== theme) return false
        if (tag && !q.tags?.includes(tag)) return false
        if (kind === 'unseen') return !s
        if (kind === 'failed') return !!s && s.wrong > 0
        if (kind === 'hard') return q.difficulty === 3
        return true
      }),
    [progress, theme, kind, tag],
  )

  // теги, для яких є питання з урахуванням обраної теми
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const q of QUESTIONS) {
      if (theme !== 'all' && q.theme !== theme) continue
      for (const t of q.tags ?? []) counts[t] = (counts[t] ?? 0) + 1
    }
    return counts
  }, [theme])

  if (session) {
    return <PracticeSession title="🎯 Entraînement" questions={session} onExit={() => setSession(null)} />
  }

  return (
    <div className="stack">
      <h1 className="page-title">Entraînement</h1>
      <p className="uk" style={{ marginTop: -8 }}>
        Збери власну серію: тема, тип питань, конкретне правило.
      </p>

      <section className="stack-sm">
        <h2 className="section-title">Thème</h2>
        <div className="chips-wrap">
          <button type="button" className={`chip ${theme === 'all' ? 'chip-on' : ''}`} onClick={() => setTheme('all')}>
            Tous les thèmes
          </button>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip ${theme === t.id ? 'chip-on' : ''}`}
              onClick={() => {
                setTheme(t.id)
                setTag(null)
              }}
            >
              {t.icon} {t.fr}
            </button>
          ))}
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="section-title">Questions</h2>
        <div className="chips-wrap">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className={`chip ${kind === k.id ? 'chip-on' : ''}`} onClick={() => setKind(k.id)}>
              {k.fr} · {k.uk}
            </button>
          ))}
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="section-title">Règle précise (facultatif)</h2>
        <div className="chips-wrap">
          <button type="button" className={`chip ${tag === null ? 'chip-on' : ''}`} onClick={() => setTag(null)}>
            Toutes
          </button>
          {Object.entries(TAGS)
            .filter(([id]) => tagCounts[id])
            .map(([id, t]) => (
              <button
                key={id}
                type="button"
                className={`chip ${tag === id ? 'chip-on' : ''}`}
                onClick={() => setTag(tag === id ? null : id)}
                title={t.uk}
              >
                {t.fr} ({tagCounts[id]})
              </button>
            ))}
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="section-title">Nombre</h2>
        <div className="segmented three">
          {COUNTS.map((n) => (
            <button key={n} type="button" aria-selected={count === n} onClick={() => setCount(n)}>
              {n}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="btn primary big-btn"
        disabled={pool.length === 0}
        onClick={() => setSession(shuffle(pool).slice(0, count))}
      >
        ▶ Commencer ({Math.min(count, pool.length)} / {pool.length} disponibles)
      </button>
    </div>
  )
}
