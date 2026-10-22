import type { ThemeId } from '../types'

export interface Bi {
  fr: string
  uk: string
}

export type Block =
  | ({ t: 'p' } & Bi)
  | ({ t: 'h' } & Bi)
  | ({ t: 'tip' } & Bi)
  | ({ t: 'warn' } & Bi)
  | { t: 'ul'; items: Bi[] }
  | { t: 'signs'; codes: string[] }
  | { t: 'table'; head: Bi[]; rows: string[][] }

export interface LessonData {
  id: string
  theme: ThemeId
  order: number
  title_fr: string
  title_uk: string
  minutes: number
  tags: string[]
  blocks: Block[]
  retenir: Bi[]
}

// Кожна тема — окремий JSON-файл у ./courses/
const modules = import.meta.glob<LessonData[]>('./courses/*.json', { eager: true, import: 'default' })

export const LESSONS: LessonData[] = Object.values(modules)
  .flat()
  .sort((a, b) => a.theme.localeCompare(b.theme) || a.order - b.order)

export const lessonsByTheme = (theme: ThemeId) =>
  LESSONS.filter((l) => l.theme === theme).sort((a, b) => a.order - b.order)

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)
