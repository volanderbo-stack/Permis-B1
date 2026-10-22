import { useDeferredValue, useMemo, useState } from 'react'
import { QuestionPreview } from '../components/QuestionPreview'
import { QUESTIONS } from '../data/questions'

/** Прибирає наголоси й регістр, щоб «priorite» знаходило «priorité» */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const index = QUESTIONS.map((q) => ({
  q,
  text: norm(
    [q.question_fr, q.question_uk, q.explanation_fr, q.explanation_uk, ...q.answers.flatMap((a) => [a.fr, a.uk])].join(' '),
  ),
}))

const MAX_RESULTS = 50

export function Search() {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const results = useMemo(() => {
    const words = norm(deferred).split(/\s+/).filter((w) => w.length > 1)
    if (words.length === 0) return []
    return index.filter(({ text }) => words.every((w) => text.includes(w))).map(({ q }) => q)
  }, [deferred])

  return (
    <div className="stack">
      <h1 className="page-title">Recherche</h1>
      <input
        className="input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ex. : giratoire, alcool, brouillard, обгін…"
        autoFocus
      />
      {deferred.trim().length > 1 && (
        <p className="muted small" style={{ margin: 0 }}>
          {results.length} résultat(s)
          {results.length > MAX_RESULTS && ` · ${MAX_RESULTS} premiers affichés`}
        </p>
      )}
      <div className="stack-sm">
        {results.slice(0, MAX_RESULTS).map((q) => (
          <QuestionPreview key={q.id} question={q} />
        ))}
      </div>
    </div>
  )
}
