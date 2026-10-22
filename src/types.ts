export type ThemeId =
  | 'circulation'
  | 'conducteur'
  | 'route'
  | 'usagers'
  | 'reglementation'
  | 'secours'
  | 'vehicule'
  | 'mecanique'
  | 'securite'
  | 'environnement'

export interface Answer {
  id: string
  fr: string
  uk: string
}

export type Side = 'N' | 'S' | 'E' | 'W'

/** Схема ситуації (вид зверху) — замість фото, як у платних застосунках */
export interface Scene {
  road: 'cross' | 'T'
  vehicles: {
    label: string
    from: Side
    to: Side
    kind?: 'car' | 'bus' | 'bike' | 'police'
  }[]
  signs?: { at: Side; code: string }[]
  lights?: { at: Side; color: 'red' | 'orange' | 'green' }[]
  pedestrians?: { at: Side }[]
}

export interface Question {
  id: string
  theme: ThemeId
  image?: string | null
  scene?: Scene
  question_fr: string
  question_uk: string
  answers: Answer[]
  correct: string[]
  explanation_fr: string
  explanation_uk: string
  /** 1 — легке, 2 — середнє, 3 — складне */
  difficulty?: 1 | 2 | 3
  tags?: string[]
  /** посилання на правило (стаття Code de la route тощо) */
  source?: string
}

export interface Theme {
  id: ThemeId
  fr: string
  uk: string
  icon: string
}
