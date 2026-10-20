import { QUESTIONS } from '../data/questions'
import { THEMES } from '../data/themes'
import type { Question } from '../types'
import { shuffle } from './list'

export const EXAM_SIZE = 40
export const EXAM_PASS = 35
export const SECONDS_PER_QUESTION = 20

/** 40 питань: порівну з кожної теми (по 4), решту — випадково */
export function buildExam(): Question[] {
  const perTheme = Math.floor(EXAM_SIZE / THEMES.length)
  const picked: Question[] = []
  for (const t of THEMES) {
    picked.push(...shuffle(QUESTIONS.filter((q) => q.theme === t.id)).slice(0, perTheme))
  }
  const rest = shuffle(QUESTIONS.filter((q) => !picked.includes(q)))
  picked.push(...rest.slice(0, EXAM_SIZE - picked.length))
  return shuffle(picked)
}
