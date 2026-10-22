import { QUESTIONS, questionsByTheme } from '../data/questions'
import { THEMES } from '../data/themes'
import type { ThemeId } from '../types'
import { EXAM_PASS } from './exam'
import type { Progress } from './storage'

export const READY_EXAMS = 5
export const READY_THEME_PCT = 85

/** Точність по темі: правильні / всі спроби (з навчання, іспитів і помилок) */
export function themeAccuracy(progress: Progress, theme: ThemeId) {
  let ok = 0
  let total = 0
  for (const q of questionsByTheme(theme)) {
    const s = progress.questions[q.id]
    if (!s) continue
    ok += s.correct
    total += s.attempts
  }
  return { ok, total, pct: total ? Math.round((ok / total) * 100) : null }
}

/**
 * Готовність до іспиту (0–100) з трьох складових:
 * покриття бази, точність по темах, останні пробні іспити.
 */
export function readiness(progress: Progress) {
  const seen = QUESTIONS.filter((q) => progress.questions[q.id]).length
  const coverage = seen / Math.max(1, QUESTIONS.length)
  const accs = THEMES.map((t) => themeAccuracy(progress, t.id).pct ?? 0)
  const accuracy = accs.reduce((a, b) => a + b, 0) / accs.length / 100
  const recent = progress.exams.slice(-READY_EXAMS)
  const passed = recent.filter((e) => e.score >= EXAM_PASS).length
  const exams = passed / READY_EXAMS
  const score = Math.round((coverage * 0.25 + accuracy * 0.35 + exams * 0.4) * 100)
  const ready = passed === READY_EXAMS && accs.every((a) => a >= READY_THEME_PCT)
  return { score, ready, coverage, seen, passed, weakThemes: THEMES.filter((_, i) => accs[i] < READY_THEME_PCT) }
}
