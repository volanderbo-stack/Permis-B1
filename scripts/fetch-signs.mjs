// Завантажує SVG дорожніх знаків з Wikimedia Commons у public/signs/.
// Використання: node scripts/fetch-signs.mjs [--strict]
// --strict: завершитися з помилкою, якщо якийсь знак не вдалося завантажити.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const UA = 'PermisB1-StudyApp/1.0 (https://github.com/volanderbo-stack/permis-b1)'
const strict = process.argv.includes('--strict')
const signs = JSON.parse(readFileSync(new URL('../src/data/signs.json', import.meta.url), 'utf8'))
const outDir = new URL('../public/signs/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function suggest(code) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=5&format=json&srsearch=${encodeURIComponent(`France road sign ${code}`)}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    const json = await res.json()
    return json.query.search.map((s) => s.title).join(' | ')
  } catch {
    return '(пошук недоступний)'
  }
}

/** Завантаження з повторними спробами: Wikimedia відповідає 429, якщо запитів забагато */
async function download(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.status === 429 && attempt < 5) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** attempt
      await sleep(wait)
      continue
    }
    const body = await res.text()
    if (!res.ok || !body.includes('<svg')) throw new Error(`HTTP ${res.status}`)
    return body
  }
}

const failed = []
for (const s of signs) {
  const target = new URL(`${s.code}.svg`, outDir)
  if (existsSync(target)) continue
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(s.file.replaceAll(' ', '_'))}`
  try {
    writeFileSync(target, await download(url))
    console.log(`✓ ${s.code}`)
  } catch (e) {
    failed.push(s.code)
    console.warn(`✗ ${s.code} (${s.file}): ${e.message}. Можливі назви: ${await suggest(s.code)}`)
  }
  await sleep(700)
}

console.log(`Готово: ${signs.length - failed.length}/${signs.length}`)
if (failed.length && strict) process.exit(1)
