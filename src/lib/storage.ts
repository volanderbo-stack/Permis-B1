import { useSyncExternalStore } from 'react'
import type { ThemeId } from '../types'

export interface QuestionStat {
  attempts: number
  correct: number
  wrong: number
  /** правильні відповіді поспіль (для «Мої помилки») */
  streak: number
  lastCorrect: boolean
  lastAt: number
}

export interface ExamResult {
  date: number
  score: number
  total: number
  durationSec: number
  /** результат по темах: [правильно, всього] */
  themes: Partial<Record<ThemeId, [number, number]>>
}

export interface Progress {
  version: 1
  questions: Record<string, QuestionStat>
  /** дні, коли користувач тренувався (YYYY-MM-DD) */
  activeDays: string[]
  lastTheme?: ThemeId
  exams: ExamResult[]
}

const KEY = 'permis-b1:progress'

const empty = (): Progress => ({ version: 1, questions: {}, activeDays: [], exams: [] })

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const data = JSON.parse(raw) as Progress
    return { ...empty(), ...data }
  } catch {
    return empty()
  }
}

let state: Progress = load()
const listeners = new Set<() => void>()

function save(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // localStorage може бути недоступний (приватний режим) — працюємо в пам'яті
  }
  listeners.forEach((l) => l())
}

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function recordAnswer(questionId: string, isCorrect: boolean) {
  const prev = state.questions[questionId] ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    lastCorrect: false,
    lastAt: 0,
  }
  const stat: QuestionStat = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
    wrong: prev.wrong + (isCorrect ? 0 : 1),
    streak: isCorrect ? prev.streak + 1 : 0,
    lastCorrect: isCorrect,
    lastAt: Date.now(),
  }
  const today = todayKey()
  const activeDays = state.activeDays.includes(today)
    ? state.activeDays
    : [...state.activeDays, today]
  save({ ...state, questions: { ...state.questions, [questionId]: stat }, activeDays })
}

export function saveExam(result: ExamResult) {
  save({ ...state, exams: [...state.exams, result] })
}

/** Питання, де користувач помилявся і ще не дав 3 правильні відповіді поспіль */
export const MASTERY_STREAK = 3
export const isMistake = (stat?: QuestionStat) => !!stat && stat.wrong > 0 && stat.streak < MASTERY_STREAK

export function setLastTheme(theme: ThemeId) {
  if (state.lastTheme !== theme) save({ ...state, lastTheme: theme })
}

export function resetProgress() {
  save(empty())
}

/** Скільки днів поспіль (до сьогодні або вчора включно) користувач тренувався */
export function dayStreak(activeDays: string[]): number {
  const days = new Set(activeDays)
  const d = new Date()
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1)
  let count = 0
  while (days.has(todayKey(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useProgress = () => useSyncExternalStore(subscribe, () => state)
