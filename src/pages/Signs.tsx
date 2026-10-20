import { useMemo, useState } from 'react'
import { SignImage } from '../components/SignImage'
import { SIGN_CATEGORIES, SIGNS, type Sign, type SignCategory } from '../data/signs'
import { shuffle } from '../lib/list'

type Tab = 'cards' | 'test'
const TEST_SIZE = 10

function FlipCard({ sign }: { sign: Sign }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      className={`flip ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped((v) => !v)}
      aria-label={flipped ? sign.fr : 'Afficher la signification'}
    >
      <span className="flip-inner">
        <span className="flip-face">
          <SignImage sign={sign} className="sign-img" />
        </span>
        <span className="flip-face flip-back">
          <strong>{sign.fr}</strong>
          <span className="uk">{sign.uk}</span>
          <span className="muted small">{sign.code}</span>
        </span>
      </span>
    </button>
  )
}

interface TestItem {
  sign: Sign
  options: Sign[]
}

function buildTest(pool: Sign[]): TestItem[] {
  return shuffle(pool)
    .slice(0, TEST_SIZE)
    .map((sign) => {
      // Неправильні варіанти — переважно з тієї ж категорії, щоб було не надто легко
      const same = shuffle(SIGNS.filter((s) => s !== sign && s.category === sign.category))
      const other = shuffle(SIGNS.filter((s) => s !== sign && s.category !== sign.category))
      return { sign, options: shuffle([sign, ...[...same, ...other].slice(0, 3)]) }
    })
}

function SignTest({ pool, onExit }: { pool: Sign[]; onExit: () => void }) {
  const [items, setItems] = useState(() => buildTest(pool))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<Sign | null>(null)
  const [score, setScore] = useState(0)
  const [showUk, setShowUk] = useState(false)

  if (index >= items.length) {
    return (
      <div className="stack">
        <div className="card center">
          <div className="result-emoji">{score >= items.length * 0.8 ? '🎉' : '💪'}</div>
          <div className="big">
            {score}/{items.length}
          </div>
          <p className="muted">bonnes réponses · правильних відповідей</p>
        </div>
        <button
          type="button"
          className="btn primary big-btn"
          onClick={() => {
            setItems(buildTest(pool))
            setIndex(0)
            setScore(0)
            setPicked(null)
          }}
        >
          ↻ Recommencer
        </button>
        <button type="button" className="btn" onClick={onExit}>
          ← Cartes
        </button>
      </div>
    )
  }

  const { sign, options } = items[index]
  const state = (o: Sign) => {
    if (!picked) return ''
    if (o === sign) return 'right'
    if (o === picked) return 'wrong'
    return 'dim'
  }

  return (
    <div className="qcard">
      <div className="qcard-top">
        <span className="muted">
          {index + 1} / {items.length}
        </span>
        <button type="button" className={`chip ${showUk ? 'chip-on' : ''}`} onClick={() => setShowUk((v) => !v)}>
          🇺🇦 Переклад
        </button>
      </div>
      <SignImage key={sign.code} sign={sign} className="sign-test-img" />
      <h2 className="qtext center">Que signifie ce panneau ?</h2>
      <div className="answers">
        {options.map((o, i) => (
          <button
            key={o.code}
            type="button"
            className={`answer ${state(o)}`}
            disabled={!!picked}
            onClick={() => {
              setPicked(o)
              if (o === sign) setScore((s) => s + 1)
            }}
          >
            <span className="letter">{'ABCD'[i]}</span>
            <span className="answer-text">
              {o.fr}
              {showUk && <span className="uk">{o.uk}</span>}
            </span>
          </button>
        ))}
      </div>
      {picked && (
        <div className="actions">
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setPicked(null)
              setIndex(index + 1)
            }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

export function Signs() {
  const [tab, setTab] = useState<Tab>('cards')
  const [category, setCategory] = useState<SignCategory | 'all'>('all')
  const pool = useMemo(
    () => (category === 'all' ? SIGNS : SIGNS.filter((s) => s.category === category)),
    [category],
  )

  return (
    <div className="stack">
      <h1 className="page-title">Panneaux</h1>
      <div className="segmented" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'cards'} onClick={() => setTab('cards')}>
          🃏 Cartes
        </button>
        <button type="button" role="tab" aria-selected={tab === 'test'} onClick={() => setTab('test')}>
          ✍️ Test
        </button>
      </div>

      <div className="chips-row">
        <button type="button" className={`chip ${category === 'all' ? 'chip-on' : ''}`} onClick={() => setCategory('all')}>
          Tous ({SIGNS.length})
        </button>
        {SIGN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip ${category === c.id ? 'chip-on' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.fr}
          </button>
        ))}
      </div>

      {tab === 'cards' ? (
        <>
          <p className="muted small" style={{ margin: 0 }}>
            Touchez une carte pour voir la signification · Торкнись картки, щоб побачити значення
          </p>
          <div className="sign-grid">
            {pool.map((s) => (
              <FlipCard key={s.code} sign={s} />
            ))}
          </div>
          <p className="muted small">
            Images : Wikimedia Commons (domaine public). Знаки взято з Wikimedia Commons.
          </p>
        </>
      ) : (
        <SignTest key={category} pool={pool} onExit={() => setTab('cards')} />
      )}
    </div>
  )
}
