import type { Theme } from '../types'

// 10 офіційних тем ETG
export const THEMES: Theme[] = [
  { id: 'circulation', fr: 'Circulation routière', uk: 'Дорожній рух', icon: '🚦' },
  { id: 'conducteur', fr: 'Le conducteur', uk: 'Водій', icon: '🧑‍✈️' },
  { id: 'route', fr: 'La route', uk: 'Дорога', icon: '🛣️' },
  { id: 'usagers', fr: 'Les autres usagers', uk: 'Інші учасники руху', icon: '🚸' },
  { id: 'reglementation', fr: 'Réglementation générale', uk: 'Загальні правила', icon: '📋' },
  { id: 'secours', fr: 'Premiers secours', uk: 'Перша допомога', icon: '⛑️' },
  { id: 'vehicule', fr: 'Prendre et quitter son véhicule', uk: 'Посадка та вихід з авто', icon: '🚪' },
  { id: 'mecanique', fr: 'Mécanique et équipements', uk: 'Механіка та обладнання', icon: '🔧' },
  { id: 'securite', fr: 'Sécurité du passager et du véhicule', uk: 'Безпека пасажира та авто', icon: '🛡️' },
  { id: 'environnement', fr: 'Environnement', uk: 'Довкілля', icon: '🌿' },
]

export const themeById = (id: string) => THEMES.find((t) => t.id === id)
