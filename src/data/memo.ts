/** Шпаргалка: усі ключові числа Code de la route в одному місці */
export interface MemoRow {
  fr: string
  uk: string
  value: string
}

export const MEMO: { title_fr: string; title_uk: string; icon: string; rows: MemoRow[] }[] = [
  {
    title_fr: 'Vitesses maximales',
    title_uk: 'Максимальні швидкості',
    icon: '🚦',
    rows: [
      { fr: 'Autoroute (sec / pluie / probatoire)', uk: 'Автомагістраль (сухо / дощ / пробні права)', value: '130 / 110 / 110' },
      { fr: 'Route à chaussées séparées', uk: 'Дорога з розділеними смугами', value: '110 / 100 / 100' },
      { fr: 'Autre route hors agglomération', uk: 'Інша дорога поза містом', value: '80 / 70 / 80' },
      { fr: 'Agglomération', uk: 'Населений пункт', value: '50' },
      { fr: 'Zone 30 · zone de rencontre', uk: 'Зона 30 · зона зустрічі', value: '30 · 20' },
      { fr: 'Visibilité < 50 m', uk: 'Видимість < 50 м', value: '50 partout' },
      { fr: 'Vitesse minimale voie de gauche (autoroute)', uk: 'Мінімум у лівій смузі магістралі', value: '80' },
    ],
  },
  {
    title_fr: 'Distances',
    title_uk: 'Відстані',
    icon: '📏',
    rows: [
      { fr: 'Distance de sécurité', uk: 'Безпечна дистанція', value: '≥ 2 s' },
      { fr: 'Temps de réaction', uk: 'Час реакції', value: '≈ 1 s' },
      { fr: 'Distance en 1 s', uk: 'Відстань за 1 с', value: 'dizaines × 3' },
      { fr: 'Freinage sur sol sec', uk: 'Гальмування на сухому', value: 'dizaines²' },
      { fr: 'Écart pour dépasser un cycliste (ville / hors ville)', uk: 'Інтервал при обгоні велосипедиста (місто / поза)', value: '1 m / 1,5 m' },
      { fr: 'Triangle de présignalisation', uk: 'Знак аварійної зупинки', value: '≥ 30 m' },
      { fr: 'Feux de croisement / de route', uk: 'Ближнє / дальнє світло', value: '30 m / 100 m' },
      { fr: 'Bornes d’appel sur autoroute', uk: 'Колонки виклику на магістралі', value: 'tous les 2 km' },
    ],
  },
  {
    title_fr: 'Alcool',
    title_uk: 'Алкоголь',
    icon: '🍷',
    rows: [
      { fr: 'Taux maximal (sang / air)', uk: 'Максимум (кров / повітря)', value: '0,5 g/l · 0,25 mg/l' },
      { fr: 'Permis probatoire, transports en commun', uk: 'Пробні права, водії автобусів', value: '0,2 g/l · 0,1 mg/l' },
      { fr: 'Délit à partir de', uk: 'Délit від', value: '0,8 g/l' },
      { fr: 'Un verre standard', uk: 'Одна стандартна порція', value: '≈ 0,20–0,25 g/l' },
      { fr: 'Élimination par heure', uk: 'Виведення за годину', value: '≈ 0,10–0,15 g/l' },
    ],
  },
  {
    title_fr: 'Permis et points',
    title_uk: 'Права й бали',
    icon: '🪪',
    rows: [
      { fr: 'Capital maximal', uk: 'Максимум балів', value: '12' },
      { fr: 'Début du permis probatoire', uk: 'Старт пробних прав', value: '6' },
      { fr: 'Gain par an sans infraction (normal / AAC)', uk: 'Приріст за рік без порушень (звич. / AAC)', value: '+2 / +3' },
      { fr: 'Durée probatoire (normal / AAC)', uk: 'Пробний період (звич. / AAC)', value: '3 ans / 2 ans' },
      { fr: 'Stage volontaire', uk: 'Добровільний курс', value: '+4 points, 1×/an' },
      { fr: 'Récupération totale sans infraction', uk: 'Повне відновлення без порушень', value: '2 ans (3 si délit)' },
      { fr: 'Code de la route : réussite / validité', uk: 'Теорія: прохідний бал / дійсність', value: '35/40 · 5 ans' },
      { fr: 'Âge minimum permis B1', uk: 'Мінімальний вік для B1', value: '16 ans' },
    ],
  },
  {
    title_fr: 'Retraits de points',
    title_uk: 'Зняття балів',
    icon: '⚖️',
    rows: [
      { fr: 'Alcool, stupéfiants, délit de fuite, refus de priorité piéton', uk: 'Алкоголь, наркотики, втеча, непропуск пішохода', value: '6' },
      { fr: 'Excès de vitesse ≥ 50 km/h', uk: 'Перевищення ≥ 50 км/год', value: '6' },
      { fr: 'Feu rouge, STOP, sens interdit', uk: 'Червоне, STOP, зустрічна', value: '4' },
      { fr: 'Excès 40–49 / 30–39 / 20–29 / < 20 km/h', uk: 'Перевищення 40–49 / 30–39 / 20–29 / < 20', value: '4 / 3 / 2 / 1' },
      { fr: 'Téléphone en main, ceinture, distance, ligne continue franchie', uk: 'Телефон, пасок, дистанція, перетин суцільної', value: '3' },
      { fr: 'Ligne continue chevauchée', uk: 'Наїзд на суцільну', value: '1' },
    ],
  },
  {
    title_fr: 'Véhicule et secours',
    title_uk: 'Авто й допомога',
    icon: '🔧',
    rows: [
      { fr: 'Profondeur minimale des pneus', uk: 'Мінімальний протектор', value: '1,6 mm' },
      { fr: 'Contrôle technique', uk: 'Техогляд', value: '4 ans puis tous les 2 ans' },
      { fr: 'Contre-visite', uk: 'Повторний огляд', value: '2 mois' },
      { fr: 'Constat amiable à l’assureur', uk: 'Європротокол страховику', value: '5 jours ouvrés' },
      { fr: 'Stationnement abusif', uk: 'Зловживання стоянкою', value: '> 7 jours' },
      { fr: 'Siège enfant obligatoire', uk: 'Автокрісло обов’язкове', value: 'jusqu’à 10 ans' },
      { fr: 'Pause sur long trajet', uk: 'Перерва в дорозі', value: 'toutes les 2 h' },
      { fr: 'SAMU / police / pompiers / européen / SMS', uk: 'SAMU / поліція / пожежники / ЄС / SMS', value: '15 / 17 / 18 / 112 / 114' },
      { fr: 'Massage cardiaque', uk: 'Масаж серця', value: '100–120/min, 5–6 cm' },
      { fr: 'Pneus hiver (loi Montagne)', uk: 'Зимові шини (закон про гори)', value: '1er nov. – 31 mars' },
    ],
  },
]
