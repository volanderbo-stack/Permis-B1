import { useMemo, useState } from 'react'
import data from '../data/glossary.json'
import { canSpeak, speak } from '../lib/speech'

interface Term {
  cat: string
  fr: string
  uk: string
}

const TERMS = data as Term[]
const CATS = [...new Set(TERMS.map((t) => t.cat))]
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function Glossary() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<string | null>(null)
  const list = useMemo(() => {
    const q = norm(query.trim())
    return TERMS.filter((t) => (!cat || t.cat === cat) && (!q || norm(`${t.fr} ${t.uk}`).includes(q)))
  }, [query, cat])

  return (
    <div className="stack">
      <h1 className="page-title">Glossaire FR → UK</h1>
      <p className="uk" style={{ marginTop: -8 }}>
        {TERMS.length} термінів, які трапляються в питаннях. Натисни 🔊, щоб почути вимову.
      </p>
      <input
        className="input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="chaussée, обгін…"
      />
      <div className="chips-row">
        <button type="button" className={`chip ${cat === null ? 'chip-on' : ''}`} onClick={() => setCat(null)}>
          Tout
        </button>
        {CATS.map((c) => (
          <button key={c} type="button" className={`chip ${cat === c ? 'chip-on' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="card glossary">
        {list.map((t) => (
          <div key={t.fr} className="gloss-row">
            <span className="gloss-fr">{t.fr}</span>
            <span className="gloss-uk">{t.uk}</span>
            {canSpeak() && (
              <button type="button" className="tool" aria-label={`Écouter ${t.fr}`} onClick={() => speak(t.fr)}>
                🔊
              </button>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="muted">Aucun terme.</p>}
      </div>
    </div>
  )
}
