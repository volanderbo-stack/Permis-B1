// Друкує опис кожного знака з Wikimedia Commons — щоб звірити код і значення.
// Використання: node scripts/describe-signs.mjs
import { readFileSync } from 'node:fs'

const UA = 'PermisB1-StudyApp/1.0 (https://github.com/volanderbo-stack/permis-b1)'
const signs = JSON.parse(readFileSync(new URL('../src/data/signs.json', import.meta.url), 'utf8'))
const strip = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

for (let i = 0; i < signs.length; i += 40) {
  const batch = signs.slice(i, i + 40)
  const titles = batch.map((s) => `File:${s.file}`).join('|')
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=ImageDescription|ObjectName&titles=${encodeURIComponent(titles)}`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  const json = await res.json()
  const byTitle = {}
  for (const p of Object.values(json.query.pages)) byTitle[p.title.replace(/_/g, ' ')] = p
  const norm = Object.fromEntries((json.query.normalized ?? []).map((n) => [n.from, n.to]))
  for (const s of batch) {
    const t = `File:${s.file}`
    const page = byTitle[norm[t] ?? t]
    if (!page || page.missing !== undefined) {
      console.log(`MISSING ${s.code} | ${s.fr}`)
      continue
    }
    const meta = page.imageinfo?.[0]?.extmetadata ?? {}
    console.log(`${s.code} | ${s.fr} || ${strip(meta.ImageDescription?.value).slice(0, 220)}`)
  }
  await sleep(1000)
}
