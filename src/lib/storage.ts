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
  /** коробка Лейтнера 0–6 для інтервального повторення */
  box: number
  /** коли питання знову треба повторити (мс) */
  due: number
}

export interface ExamResult {
  date: number
  score: number
  total: number
  durationSec: number
  /** результат по темах: [правильно, всього] */
  themes: Partial<Record<ThemeId, [number, number]>>
  /** які питання були в іспиті — щоб не повторювати їх у наступних */
  questionIds?: string[]
}

export interface DrivingLesson {
  id: string
  date: string
  minutes: number
  topics: string
  note: string
  rating: number
}

export interface Settings {
  /** скільки відповідей на день — денна мета */
  dailyGoal: number
  /** автоматично озвучувати питання в іспиті */
  examAudio: boolean
}

export interface Progress {
  version: 2
  questions: Record<string, QuestionStat>
  /** дні, коли користувач тренувався (YYYY-MM-DD) */
  activeDays: string[]
  /** кількість відповідей по днях */
  daily: Record<string, number>
  lastTheme?: ThemeId
  exams: ExamResult[]
  favorites: string[]
  notes: Record<string, string>
  lessonsRead: string[]
  driving: DrivingLesson[]
  /** самооцінка навичок водіння 0–3 */
  skills: Record<string, number>
  /** відмічені пункти чеклістів */
  checks: Record<string, boolean>
  settings: Settings
}

const KEY = 'permis-b1:progress'
const DAY = 24 * 60 * 60 * 1000

/** Інтервали Лейтнера в днях для коробок 0–6 */
export const BOX_INTERVALS = [0, 1, 2, 4, 8, 16, 32]
export const MAX_BOX = BOX_INTERVALS.length - 1

const empty = (): Progress => ({
  version: 2,
  questions: {},
  activeDays: [],
  daily: {},
  exams: [],
  favorites: [],
  notes: {},
  lessonsRead: [],
  driving: [],
  skills: {},
  checks: {},
  settings: { dailyGoal: 30, examAudio: false },
})

/** Приводить збережені дані (будь-якої версії) до поточного формату */
export function normalize(data: Partial<Progress> | null | undefined): Progress {
  const base = empty()
  if (!data || typeof data !== 'object') return base
  const merged: Progress = {
    ...base,
    ...data,
    version: 2,
    settings: { ...base.settings, ...(data.settings ?? {}) },
  }
  // v1 не мав коробок Лейтнера: виводимо їх із серії правильних відповідей
  for (const [id, s] of Object.entries(merged.questions)) {
    if (s.box === undefined || s.due === undefined) {
      const box = Math.min(s.streak ?? 0, MAX_BOX)
      merged.questions[id] = { ...s, box, due: (s.lastAt ?? 0) + BOX_INTERVALS[box] * DAY }
    }
  }
  return merged
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return normalize(raw ? JSON.parse(raw) : null)
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

const update = (patch: Partial<Progress>) => save({ ...state, ...patch })

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Початок дня (опівніч) через n днів від сьогодні */
const startOfDayIn = (days: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime() + days * DAY
}

export function recordAnswer(questionId: string, isCorrect: boolean) {
  const prev: QuestionStat = state.questions[questionId] ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    lastCorrect: false,
    lastAt: 0,
    box: 0,
    due: 0,
  }
  const box = isCorrect ? Math.min(prev.box + 1, MAX_BOX) : 0
  const stat: QuestionStat = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
    wrong: prev.wrong + (isCorrect ? 0 : 1),
    streak: isCorrect ? prev.streak + 1 : 0,
    lastCorrect: isCorrect,
    lastAt: Date.now(),
    box,
    // помилку повторюємо сьогодні ж, правильну — через інтервал коробки
    due: isCorrect ? startOfDayIn(BOX_INTERVALS[box]) : Date.now(),
  }
  const today = todayKey()
  const activeDays = state.activeDays.includes(today)
    ? state.activeDays
    : [...state.activeDays, today]
  update({
    questions: { ...state.questions, [questionId]: stat },
    activeDays,
    daily: { ...state.daily, [today]: (state.daily[today] ?? 0) + 1 },
  })
}

/** Питання, які пора повторити сьогодні (інтервальне повторення) */
export const isDue = (stat?: QuestionStat) => !!stat && stat.due <= startOfDayIn(1)

export function saveExam(result: ExamResult) {
  update({ exams: [...state.exams, result] })
}

/** Питання, де користувач помилявся і ще не дав 3 правильні відповіді поспіль */
export const MASTERY_STREAK = 3
export const isMistake = (stat?: QuestionStat) => !!stat && stat.wrong > 0 && stat.streak < MASTERY_STREAK

export function setLastTheme(theme: ThemeId) {
  if (state.lastTheme !== theme) update({ lastTheme: theme })
}

export function toggleFavorite(id: string) {
  const favorites = state.favorites.includes(id)
    ? state.favorites.filter((f) => f !== id)
    : [...state.favorites, id]
  update({ favorites })
}

export function setNote(id: string, text: string) {
  const notes = { ...state.notes }
  if (text.trim()) notes[id] = text
  else delete notes[id]
  update({ notes })
}

export function markLessonRead(id: string, read = true) {
  const has = state.lessonsRead.includes(id)
  if (read && !has) update({ lessonsRead: [...state.lessonsRead, id] })
  if (!read && has) update({ lessonsRead: state.lessonsRead.filter((l) => l !== id) })
}

export function updateSettings(patch: Partial<Settings>) {
  update({ settings: { ...state.settings, ...patch } })
}

export function saveDrivingLesson(lesson: DrivingLesson) {
  const others = state.driving.filter((l) => l.id !== lesson.id)
  update({ driving: [...others, lesson].sort((a, b) => b.date.localeCompare(a.date)) })
}

export function deleteDrivingLesson(id: string) {
  update({ driving: state.driving.filter((l) => l.id !== id) })
}

export function setSkill(id: string, level: number) {
  update({ skills: { ...state.skills, [id]: level } })
}

export function toggleCheck(id: string) {
  update({ checks: { ...state.checks, [id]: !state.checks[id] } })
}

export function resetProgress() {
  save(empty())
}

/** Резервна копія: увесь прогрес як JSON-рядок */
export const exportProgress = () => JSON.stringify(state, null, 2)

/** Відновлення з резервної копії; кидає помилку, якщо файл не той */
export function importProgress(json: string) {
  const data = JSON.parse(json)
  if (!data || typeof data !== 'object' || !data.questions || !data.version) {
    throw new Error('Format invalide')
  }
  save(normalize(data))
}

/** Кількість відповідей за останні n днів (від найстаршого до сьогодні) */
export function recentDays(daily: Record<string, number>, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    const key = todayKey(d)
    return { key, n: daily[key] ?? 0 }
  })
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
