import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LessonBlocks } from '../components/LessonBlocks'
import { TranslateButton } from '../components/TranslateButton'
import {
  CARD_CATS,
  DRIVING_CARDS,
  DRIVING_CONTENT,
  DRIVING_TOPICS,
  JOUR_J,
  SKILL_LEVELS,
  SKILLS,
  type DrivingCard,
} from '../data/driving'
import { shuffle } from '../lib/list'
import { canSpeak, speak } from '../lib/speech'
import { deleteDrivingLesson, saveDrivingLesson, setSkill, toggleCheck, useProgress, type DrivingLesson } from '../lib/storage'

export function DrivingTopic() {
  const { topicId = '' } = useParams()
  const topic = DRIVING_TOPICS.find((t) => t.id === topicId)
  const [showUk, setShowUk] = useState(false)
  if (!topic) {
    return (
      <div className="card">
        <p>Rubrique introuvable.</p>
        <Link to="/conduite">← Conduite</Link>
      </div>
    )
  }
  const content = DRIVING_CONTENT[topic.id]
  return (
    <div className="stack">
      <div className="study-head">
        <Link to="/conduite" className="back" aria-label="Retour">
          ←
        </Link>
        <div className="theme-main">
          <span className="theme-name">
            {topic.icon} {topic.fr}
          </span>
          <span className="muted small">{topic.uk}</span>
        </div>
        <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
      </div>
      {content && (
        <article className="card">
          <LessonBlocks blocks={content.blocks} showUk={showUk} />
        </article>
      )}
      {topic.id === 'questions' && <QuestionCards showUk={showUk} />}
      {topic.id === 'competences' && <Skills showUk={showUk} />}
      {topic.id === 'journal' && <Journal />}
      {topic.id === 'jour-j' && <Checklist showUk={showUk} />}
    </div>
  )
}

/** Картки «питання → відповідь» для перевірок і першої допомоги */
function QuestionCards({ showUk }: { showUk: boolean }) {
  const progress = useProgress()
  const [cat, setCat] = useState<DrivingCard['cat'] | 'all'>('all')
  const [quiz, setQuiz] = useState<DrivingCard[] | null>(null)
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const list = DRIVING_CARDS.filter((c) => cat === 'all' || c.cat === cat)
  const key = (c: DrivingCard) => `card:${c.q_fr}`
  const known = list.filter((c) => progress.checks[key(c)]).length

  if (quiz) {
    if (i >= quiz.length) {
      return (
        <div className="card center stack-sm">
          <div className="result-emoji">🎉</div>
          <p>Série terminée · Серію завершено</p>
          <button type="button" className="btn" onClick={() => setQuiz(null)}>
            ← Liste
          </button>
        </div>
      )
    }
    const c = quiz[i]
    const next = (knew: boolean) => {
      if (knew !== !!progress.checks[key(c)]) toggleCheck(key(c))
      setRevealed(false)
      setI(i + 1)
    }
    return (
      <div className="stack">
        <p className="muted small" style={{ margin: 0 }}>
          {i + 1} / {quiz.length} · {CARD_CATS[c.cat].fr}
        </p>
        <div className="card stack-sm">
          <div className="row space">
            <strong>{c.q_fr}</strong>
            {canSpeak() && (
              <button type="button" className="tool" aria-label="Écouter" onClick={() => speak(c.q_fr)}>
                🔊
              </button>
            )}
          </div>
          {showUk && <span className="uk">{c.q_uk}</span>}
          {revealed ? (
            <div className="feedback ok">
              <LessonBlocks blocks={[{ t: 'p', fr: c.a_fr, uk: c.a_uk }]} showUk={showUk} />
            </div>
          ) : (
            <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
              Voir la réponse · Показати відповідь
            </button>
          )}
        </div>
        {revealed && (
          <div className="row">
            <button type="button" className="btn grow" onClick={() => next(false)}>
              🔁 À revoir
            </button>
            <button type="button" className="btn primary grow" onClick={() => next(true)}>
              ✅ Je savais
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="stack-sm">
      <div className="chips-row">
        <button type="button" className={`chip ${cat === 'all' ? 'chip-on' : ''}`} onClick={() => setCat('all')}>
          Toutes ({DRIVING_CARDS.length})
        </button>
        {(Object.keys(CARD_CATS) as DrivingCard['cat'][]).map((k) => (
          <button key={k} type="button" className={`chip ${cat === k ? 'chip-on' : ''}`} onClick={() => setCat(k)}>
            {CARD_CATS[k].fr}
          </button>
        ))}
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        ✅ {known}/{list.length} connues · Знаю
      </p>
      <button
        type="button"
        className="btn primary big-btn"
        onClick={() => {
          setQuiz(shuffle(list))
          setI(0)
          setRevealed(false)
        }}
      >
        🃏 S’entraîner ({list.length} cartes)
      </button>
      {list.map((c) => (
        <details key={c.q_fr} className="card qa">
          <summary>
            {progress.checks[key(c)] ? '✅ ' : ''}
            {c.q_fr}
            {showUk && <span className="uk">{c.q_uk}</span>}
          </summary>
          <LessonBlocks blocks={[{ t: 'p', fr: c.a_fr, uk: c.a_uk }]} showUk={showUk} />
        </details>
      ))}
    </section>
  )
}

function Skills({ showUk }: { showUk: boolean }) {
  const progress = useProgress()
  return (
    <section className="stack">
      <p className="uk" style={{ margin: 0 }}>
        Після кожного заняття оцінюй себе: так видно, що ще треба відпрацювати з інструктором.
      </p>
      {SKILLS.map((g) => (
        <div key={g.id} className="card stack-sm">
          <h2 className="section-title">
            {g.fr}
            {showUk && <span className="uk">{g.uk}</span>}
          </h2>
          {g.items.map((it) => {
            const level = progress.skills[it.id] ?? 0
            return (
              <div key={it.id} className="skill">
                <span>
                  {it.fr}
                  {showUk && <span className="uk">{it.uk}</span>}
                </span>
                <div className="skill-levels" role="radiogroup" aria-label={it.fr}>
                  {SKILL_LEVELS.map((l, n) => (
                    <button
                      key={l.fr}
                      type="button"
                      role="radio"
                      aria-checked={level === n}
                      className={`lvl lvl-${n} ${level === n ? 'on' : ''}`}
                      onClick={() => setSkill(it.id, n)}
                      title={l.uk}
                    >
                      {l.fr}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </section>
  )
}

const today = () => new Date().toISOString().slice(0, 10)

function Journal() {
  const progress = useProgress()
  const blank = (): DrivingLesson => ({ id: '', date: today(), minutes: 60, topics: '', note: '', rating: 3 })
  const [form, setForm] = useState<DrivingLesson | null>(null)
  const total = progress.driving.reduce((n, l) => n + l.minutes, 0)

  if (form) {
    return (
      <form
        className="card stack-sm"
        onSubmit={(e) => {
          e.preventDefault()
          saveDrivingLesson({ ...form, id: form.id || String(Date.now()) })
          setForm(null)
        }}
      >
        <label className="field">
          Date
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </label>
        <label className="field">
          Durée (minutes) · Тривалість
          <input
            className="input"
            type="number"
            min={15}
            step={15}
            value={form.minutes}
            onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })}
            required
          />
        </label>
        <label className="field">
          Travaillé · Що відпрацьовували
          <input
            className="input"
            value={form.topics}
            onChange={(e) => setForm({ ...form, topics: e.target.value })}
            placeholder="créneau, giratoires, autoroute…"
          />
        </label>
        <label className="field">
          Remarques du moniteur · Зауваження
          <textarea className="input" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <div className="field">
          Ressenti · Самопочуття
          <div className="row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`chip ${form.rating >= n ? 'chip-on' : ''}`}
                onClick={() => setForm({ ...form, rating: n })}
                aria-label={`${n}/5`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <button type="button" className="btn grow" onClick={() => setForm(null)}>
            Annuler
          </button>
          <button type="submit" className="btn primary grow">
            Enregistrer
          </button>
        </div>
      </form>
    )
  }

  return (
    <section className="stack-sm">
      <div className="card row space">
        <span>
          <strong>
            {Math.floor(total / 60)} h {String(total % 60).padStart(2, '0')}
          </strong>{' '}
          de conduite · {progress.driving.length} leçon(s)
        </span>
      </div>
      <button type="button" className="btn primary big-btn" onClick={() => setForm(blank())}>
        ➕ Ajouter une leçon · Додати заняття
      </button>
      {progress.driving.map((l) => (
        <div key={l.id} className="card stack-sm">
          <div className="row space">
            <strong>
              {new Date(l.date).toLocaleDateString('fr-FR')} · {l.minutes} min
            </strong>
            <span>{'★'.repeat(l.rating)}</span>
          </div>
          {l.topics && <span>{l.topics}</span>}
          {l.note && <span className="muted small">{l.note}</span>}
          <div className="row">
            <button type="button" className="chip" onClick={() => setForm(l)}>
              ✎ Modifier
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => {
                if (confirm('Supprimer cette leçon ? / Видалити заняття?')) deleteDrivingLesson(l.id)
              }}
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

function Checklist({ showUk }: { showUk: boolean }) {
  const progress = useProgress()
  return (
    <section className="card stack-sm">
      {JOUR_J.map((c) => (
        <label key={c.id} className="switch-row">
          <input type="checkbox" checked={!!progress.checks[`jourj:${c.id}`]} onChange={() => toggleCheck(`jourj:${c.id}`)} />
          <span>
            {c.fr}
            {showUk && <span className="uk">{c.uk}</span>}
          </span>
        </label>
      ))}
    </section>
  )
}
