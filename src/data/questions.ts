import type { Question, ThemeId } from '../types'

// Кожна тема — окремий JSON-файл у ./questions/
const modules = import.meta.glob<Question[]>('./questions/*.json', {
  eager: true,
  import: 'default',
})

export const QUESTIONS: Question[] = Object.values(modules).flat()

export const questionsByTheme = (theme: ThemeId) =>
  QUESTIONS.filter((q) => q.theme === theme)

export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id)

export const isAnswerCorrect = (q: Question, selected: string[]) =>
  selected.length === q.correct.length && q.correct.every((c) => selected.includes(c))
