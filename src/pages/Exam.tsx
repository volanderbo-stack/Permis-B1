import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExamQuestion } from '../components/ExamQuestion'
import { ProgressBar } from '../components/ProgressBar'
import { ReviewItem } from '../components/ReviewItem'
import { isAnswerCorrect } from '../data/questions'
import { buildExam, EXAM_PASS, EXAM_SIZE, SECONDS_PER_QUESTION } from '../lib/exam'
import { recordAnswer, saveExam, updateSettings, useProgress, type ExamResult } from '../lib/storage'
import type { Question, ThemeId } from '../types'

type Phase = 'intro' | 'running' | 'done'

export function Exam() {
  const progress = useProgress()
  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<string[][]>([])
  const [onlyErrors, setOnlyErrors] = useState(false)
  const startedAt = useRef(0)

  const start = () => {
    const recent = new Set(progress.exams.slice(-5).flatMap((e) => e.questionIds ?? []))
    setQuestions(buildExam(recent))
    setAnswers([])
    setOnlyErrors(false)
    startedAt.current = Date.now()
    setPhase('running')
  }

  const finish = (all: string[][]) => {
    const themes: ExamResult['themes'] = {}
    let score = 0
    questions.forEach((q, i) => {
      const ok = isAnswerCorrect(q, all[i])
      recordAnswer(q.id, ok)
      if (ok) score++
      const [o, t] = themes[q.theme as ThemeId] ?? [0, 0]
      themes[q.theme as ThemeId] = [o + (ok ? 1 : 0), t + 1]
    })
    saveExam({
      date: Date.now(),
      score,
      total: questions.length,
      durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      themes,
      questionIds: questions.map((q) => q.id),
    })
    setPhase('done')
  }

  if (phase === 'intro') {
    const last = progress.exams.at(-1)
    return (
      <div className="stack">
        <h1 className="page-title">Examen blanc</h1>
        <div className="card stack-sm">
          <p>
            <strong>{EXAM_SIZE} questions</strong> · {SECONDS_PER_QUESTION} secondes par question ·
            réussite à partir de <strong>{EXAM_PASS}/{EXAM_SIZE}</strong>.
          </p>
          <p className="uk">
            {EXAM_SIZE} питань, {SECONDS_PER_QUESTION} секунд на кожне. Щоб скласти, треба щонайменше{' '}
            {EXAM_PASS} правильних. Пояснення — лише в кінці. Повернутися до попереднього питання не можна,
            як і на справжньому іспиті.
          </p>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={progress.settings.examAudio}
              onChange={(e) => updateSettings({ examAudio: e.target.checked })}
            />
            <span>
              🔊 Lecture audio des questions (comme à l’examen)
              <span className="uk">Озвучувати питання вголос</span>
            </span>
          </label>
          {last && (
            <p className="muted small">
              Dernier résultat : {last.score}/{last.total} {last.score >= EXAM_PASS ? '✅' : '❌'}
            </p>
          )}
        </div>
        <button type="button" className="btn primary big-btn" onClick={start}>
          ▶ Commencer l’examen
        </button>
      </div>
    )
  }

  if (phase === 'running') {
    const i = answers.length
    const q = questions[i]
    return (
      <div className="stack">
        <div className="study-head">
          <button
            type="button"
            className="back"
            aria-label="Abandonner"
            onClick={() => {
              if (confirm('Abandonner l’examen ? / Перервати іспит?')) setPhase('intro')
            }}
          >
            ✕
          </button>
          <div className="theme-main">
            <span className="theme-name">
              Question {i + 1} / {questions.length}
            </span>
            <ProgressBar value={(i / questions.length) * 100} />
          </div>
        </div>
        <ExamQuestion
          key={i}
          question={q}
          seconds={SECONDS_PER_QUESTION}
          audio={progress.settings.examAudio}
          onSubmit={(sel) => {
            const next = [...answers, sel]
            setAnswers(next)
            if (next.length === questions.length) finish(next)
          }}
        />
      </div>
    )
  }

  const score = questions.filter((q, i) => isAnswerCorrect(q, answers[i])).length
  const passed = score >= EXAM_PASS
  const items = questions
    .map((q, i) => ({ q, sel: answers[i], n: i + 1 }))
    .filter(({ q, sel }) => !onlyErrors || !isAnswerCorrect(q, sel))

  return (
    <div className="stack">
      <div className={`card center result ${passed ? 'ok' : 'ko'}`}>
        <div className="result-emoji">{passed ? '🎉' : '😕'}</div>
        <div className="big">
          {score}/{questions.length}
        </div>
        <strong>{passed ? 'Examen réussi !' : 'Examen non réussi'}</strong>
        <p className="uk">
          {passed
            ? 'Вітаю, іспит складено!'
            : `Не вистачило ${EXAM_PASS - score} правильних відповідей до ${EXAM_PASS}.`}
        </p>
      </div>
      <div className="row">
        <button type="button" className="btn primary grow" onClick={start}>
          ↻ Nouvel examen
        </button>
        <Link to="/stats" className="btn grow">
          📈 Stats
        </Link>
      </div>

      <div className="row space">
        <h2 className="section-title">Correction</h2>
        <button
          type="button"
          className={`chip ${onlyErrors ? 'chip-on' : ''}`}
          onClick={() => setOnlyErrors((v) => !v)}
        >
          Erreurs seulement
        </button>
      </div>
      <div className="stack-sm">
        {items.map(({ q, sel, n }) => (
          <ReviewItem key={q.id} n={n} question={q} selected={sel} />
        ))}
      </div>
    </div>
  )
}
