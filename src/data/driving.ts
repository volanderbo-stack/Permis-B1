import type { Bi, Block } from './courses'
import data from './driving.json'

export interface DrivingContent {
  icon: string
  fr: string
  uk: string
  blocks: Block[]
}

export interface DrivingCard {
  cat: 'interieur' | 'exterieur' | 'secours'
  q_fr: string
  q_uk: string
  a_fr: string
  a_uk: string
}

export interface SkillGroup extends Bi {
  id: string
  items: (Bi & { id: string })[]
}

export const DRIVING_CONTENT = data.content as unknown as Record<string, DrivingContent>
export const DRIVING_CARDS = data.cards as DrivingCard[]
export const SKILLS = data.skills as SkillGroup[]
export const JOUR_J = data.jourj as (Bi & { id: string })[]

export const SKILL_LEVELS = [
  { fr: 'Pas vu', uk: 'Не вивчав' },
  { fr: 'En cours', uk: 'Вчуся' },
  { fr: 'Acquis', uk: 'Вмію' },
  { fr: 'Maîtrisé', uk: 'Впевнено' },
]

export const CARD_CATS: Record<DrivingCard['cat'], Bi> = {
  interieur: { fr: 'Vérifications intérieures', uk: 'Перевірки в салоні' },
  exterieur: { fr: 'Vérifications extérieures', uk: 'Перевірки зовні' },
  secours: { fr: 'Premiers secours', uk: 'Перша допомога' },
}

/** Розділи сторінки «Conduite» */
export const DRIVING_TOPICS: { id: string; icon: string; fr: string; uk: string }[] = [
  { id: 'examen', icon: '📋', fr: 'L’examen pratique', uk: 'Як проходить іспит з водіння' },
  { id: 'questions', icon: '🃏', fr: 'Vérifications et questions', uk: 'Перевірки й питання іспиту' },
  { id: 'manoeuvres', icon: '🅿️', fr: 'Les manœuvres', uk: 'Маневри крок за кроком' },
  { id: 'situations', icon: '🛣️', fr: 'Situations de conduite', uk: 'Ситуації в русі' },
  { id: 'competences', icon: '📊', fr: 'Mes compétences', uk: 'Самооцінка навичок' },
  { id: 'journal', icon: '📓', fr: 'Journal de conduite', uk: 'Щоденник занять' },
  { id: 'jour-j', icon: '✅', fr: 'Le jour de l’examen', uk: 'Чекліст на день іспиту' },
]
