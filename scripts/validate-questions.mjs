// Перевіряє JSON-файли питань: унікальні id, правильна тема, коректні відповіді.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const THEMES = ['circulation', 'conducteur', 'route', 'usagers', 'reglementation', 'secours', 'vehicule', 'mecanique', 'securite', 'environnement']
const dir = new URL('../src/data/questions/', import.meta.url).pathname
const signCodes = new Set(
  JSON.parse(readFileSync(new URL('../src/data/signs.json', import.meta.url), 'utf8')).map((s) => s.code),
)
const ids = new Set()
const errors = []
const perTheme = {}

for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const list = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  for (const q of list) {
    const where = `${file}:${q.id}`
    if (ids.has(q.id)) errors.push(`${where} — повторюваний id`)
    ids.add(q.id)
    if (!THEMES.includes(q.theme)) errors.push(`${where} — невідома тема ${q.theme}`)
    for (const k of ['question_fr', 'question_uk', 'explanation_fr', 'explanation_uk'])
      if (!q[k]?.trim()) errors.push(`${where} — порожнє поле ${k}`)
    const answerIds = q.answers.map((a) => a.id)
    if (q.answers.length < 2) errors.push(`${where} — менше 2 відповідей`)
    if (!q.correct.length) errors.push(`${where} — немає правильної відповіді`)
    for (const c of q.correct) if (!answerIds.includes(c)) errors.push(`${where} — correct "${c}" не існує`)
    for (const a of q.answers) if (!a.fr?.trim() || !a.uk?.trim()) errors.push(`${where} — відповідь ${a.id} без тексту`)
    const sign = q.image?.match(/^signs\/(.+)\.svg$/)?.[1]
    if (sign && !signCodes.has(sign)) errors.push(`${where} — знака ${sign} немає в signs.json`)
    perTheme[q.theme] = (perTheme[q.theme] ?? 0) + 1
  }
}

console.log(`Питань: ${ids.size}`, perTheme)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
