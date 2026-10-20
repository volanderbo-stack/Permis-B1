import { questionsByTheme } from '../data/questions'
import type { ThemeId } from '../types'
import type { Progress } from './storage'

/** Відсоток питань теми, на які остання відповідь була правильною */
export function themePercent(progress: Progress, theme: ThemeId) {
  const qs = questionsByTheme(theme)
  if (qs.length === 0) return 0
  const ok = qs.filter((q) => progress.questions[q.id]?.lastCorrect).length
  return Math.round((ok / qs.length) * 100)
}
