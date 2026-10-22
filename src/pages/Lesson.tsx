import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LessonBlocks } from '../components/LessonBlocks'
import { PracticeSession } from '../components/PracticeSession'
import { TranslateButton } from '../components/TranslateButton'
import { lessonById, lessonsByTheme } from '../data/courses'
import { questionsByTheme } from '../data/questions'
import { themeById } from '../data/themes'
import { shuffle } from '../lib/list'
import { markLessonRead, useProgress } from '../lib/storage'
import type { Question } from '../types'

const MINI_TEST = 10

export function Lesson() {
  const { lessonId = '' } = useParams()
  return <LessonView key={lessonId} lessonId={lessonId} />
}

function LessonView({ lessonId }: { lessonId: string }) {
  const lesson = lessonById(lessonId)
  const progress = useProgress()
  const [showUk, setShowUk] = useState(false)
  const [test, setTest] = useState<Question[] | null>(null)

  if (!lesson) {
    return (
      <div className="card">
        <p>Cours introuvable.</p>
        <Link to="/themes">← Thèmes</Link>
      </div>
    )
  }
  const theme = themeById(lesson.theme)!
  const siblings = lessonsByTheme(lesson.theme)
  const next = siblings[siblings.indexOf(lesson) + 1]
  const read = progress.lessonsRead.includes(lesson.id)

  if (test) {
    return <PracticeSession title={`📝 ${lesson.title_fr}`} questions={test} onExit={() => setTest(null)} />
  }

  const startTest = () => {
    const all = questionsByTheme(lesson.theme)
    // спершу питання з тегами уроку, далі — інші питання теми
    const related = all.filter((q) => q.tags?.some((t) => lesson.tags.includes(t)))
    const others = all.filter((q) => !related.includes(q))
    setTest([...shuffle(related), ...shuffle(others)].slice(0, MINI_TEST))
    markLessonRead(lesson.id)
  }

  return (
    <div className="stack">
      <div className="study-head">
        <Link to={`/themes/${lesson.theme}`} className="back" aria-label="Retour">
          ←
        </Link>
        <div className="theme-main">
          <span className="muted small">
            {theme.icon} {theme.fr} · {lesson.minutes} min
          </span>
          <span className="theme-name">{lesson.title_fr}</span>
        </div>
      </div>
      <div className="row space">
        <span className="uk">{lesson.title_uk}</span>
        <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
      </div>

      <article className="card">
        <LessonBlocks blocks={lesson.blocks} showUk={showUk} />
      </article>

      {lesson.retenir.length > 0 && (
        <section className="card retenir">
          <h2 className="section-title">📌 À retenir</h2>
          <ul>
            {lesson.retenir.map((r, i) => (
              <li key={i}>
                {r.fr}
                {showUk && <span className="uk">{r.uk}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <button type="button" className="btn primary big-btn" onClick={startTest}>
        📝 Mini-test ({MINI_TEST} questions)
      </button>
      <button type="button" className="btn" onClick={() => markLessonRead(lesson.id, !read)}>
        {read ? '✅ Lu · Прочитано' : '☐ Marquer comme lu'}
      </button>
      {next && (
        <Link to={`/cours/${next.id}`} className="btn">
          Cours suivant : {next.title_fr} →
        </Link>
      )}
    </div>
  )
}
