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

export interface Question {
  id: string
  theme: ThemeId
  image?: string | null
  question_fr: string
  question_uk: string
  answers: Answer[]
  correct: string[]
  explanation_fr: string
  explanation_uk: string
}

export interface Theme {
  id: ThemeId
  fr: string
  uk: string
  icon: string
}
