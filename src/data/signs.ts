import data from './signs.json'

export type SignCategory = 'danger' | 'intersection' | 'interdiction' | 'obligation' | 'fin' | 'zone' | 'indication'

export interface Sign {
  code: string
  /** назва файлу на Wikimedia Commons */
  file: string
  category: SignCategory
  fr: string
  uk: string
}

export const SIGNS = data as Sign[]

export const SIGN_CATEGORIES: { id: SignCategory; fr: string; uk: string }[] = [
  { id: 'danger', fr: 'Danger', uk: 'Попереджувальні' },
  { id: 'intersection', fr: 'Intersection et priorité', uk: 'Перехрестя і пріоритет' },
  { id: 'interdiction', fr: 'Interdiction', uk: 'Заборонні' },
  { id: 'obligation', fr: 'Obligation', uk: 'Наказові' },
  { id: 'fin', fr: 'Fin d’interdiction', uk: 'Кінець заборони' },
  { id: 'zone', fr: 'Zones', uk: 'Зони' },
  { id: 'indication', fr: 'Indication', uk: 'Інформаційні' },
]

export const signByCode = (code: string) => SIGNS.find((s) => s.code === code)

/** Локальна копія (завантажується скриптом fetch-signs під час збірки) */
export const localSignUrl = (s: Sign) => `${import.meta.env.BASE_URL}signs/${s.code}.svg`

/** Запасний варіант — пряме посилання на Wikimedia Commons */
export const remoteSignUrl = (s: Sign) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(s.file.replaceAll(' ', '_'))}`
