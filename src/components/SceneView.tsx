import { localSignUrl, signByCode } from '../data/signs'
import type { Scene, Side } from '../types'

// Поле 300×300, дороги шириною 100 з двома смугами (правосторонній рух)
const C = 150
const LANE = 25
const ENTRY: Record<Side, [number, number]> = {
  S: [C + LANE, 228],
  N: [C - LANE, 72],
  E: [228, C - LANE],
  W: [72, C + LANE],
}
const EXIT: Record<Side, [number, number]> = {
  N: [C + LANE, 12],
  S: [C - LANE, 288],
  E: [288, C + LANE],
  W: [12, C - LANE],
}
const ROT: Record<Side, number> = { S: 0, N: 180, E: 270, W: 90 }
const SIGN_POS: Record<Side, [number, number]> = { S: [208, 218], N: [62, 52], E: [218, 62], W: [52, 208] }
const COLORS: Record<string, string> = { A: '#dc2626', B: '#16a34a', C: '#ea580c', D: '#7c3aed', Moi: '#1d4ed8' }

const vertical = (s: Side) => s === 'N' || s === 'S'

function path(from: Side, to: Side) {
  const [x1, y1] = ENTRY[from]
  const [x2, y2] = EXIT[to]
  if (vertical(from) === vertical(to)) return `M${x1},${y1} L${x2},${y2}`
  const cx = vertical(from) ? x1 : x2
  const cy = vertical(from) ? y2 : y1
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`
}

/** Центр машини трохи позаду від точки в'їзду */
function carCenter(from: Side, len: number): [number, number] {
  const [x, y] = ENTRY[from]
  const d = len / 2 + 2
  return from === 'S' ? [x, y + d] : from === 'N' ? [x, y - d] : from === 'E' ? [x + d, y] : [x - d, y]
}

export function SceneView({ scene }: { scene: Scene }) {
  const hasNorth = scene.road === 'cross'
  return (
    <svg className="scene" viewBox="0 0 300 300" role="img" aria-label="Schéma de la situation">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="scene-arrowhead" />
        </marker>
      </defs>
      <rect width="300" height="300" className="scene-grass" />
      {/* дороги */}
      <rect x="0" y={C - 50} width="300" height="100" className="scene-road" />
      <rect x={C - 50} y={hasNorth ? 0 : C - 50} width="100" height={hasNorth ? 300 : 200} className="scene-road" />
      {/* осьова розмітка */}
      <line x1="0" y1={C} x2={C - 50} y2={C} className="scene-line" />
      <line x1={C + 50} y1={C} x2="300" y2={C} className="scene-line" />
      <line x1={C} y1={C + 50} x2={C} y2="300" className="scene-line" />
      {hasNorth && <line x1={C} y1="0" x2={C} y2={C - 50} className="scene-line" />}
      {/* пішохідні переходи на в'їздах, де є пішоходи */}
      {scene.pedestrians?.map((p, i) => {
        const stripes = Array.from({ length: 6 }, (_, k) => k)
        const horiz = vertical(p.at)
        const base = p.at === 'S' ? C + 58 : p.at === 'N' ? C - 72 : p.at === 'E' ? C + 58 : C - 72
        return (
          <g key={i}>
            {stripes.map((k) =>
              horiz ? (
                <rect key={k} x={C - 48 + k * 17} y={base} width="10" height="14" className="scene-zebra" />
              ) : (
                <rect key={k} x={base} y={C - 48 + k * 17} width="14" height="10" className="scene-zebra" />
              ),
            )}
            <g transform={`translate(${horiz ? C + 40 : base + 7}, ${horiz ? base + 7 : C - 40})`}>
              <circle r="8" className="scene-ped" />
              <text y="4" textAnchor="middle" className="scene-ped-text">
                🚶
              </text>
            </g>
          </g>
        )
      })}
      {/* маршрути */}
      {scene.vehicles.map((v) => (
        <path
          key={`p-${v.label}`}
          d={path(v.from, v.to)}
          className="scene-path"
          style={{ stroke: COLORS[v.label] ?? '#334155' }}
          markerEnd="url(#arrow)"
        />
      ))}
      {/* транспорт */}
      {scene.vehicles.map((v) => {
        const len = v.kind === 'bus' ? 58 : v.kind === 'bike' ? 26 : 40
        const w = v.kind === 'bike' ? 10 : 24
        const [x, y] = carCenter(v.from, len)
        const fill = v.kind === 'police' ? '#f8fafc' : v.kind === 'bus' ? '#facc15' : (COLORS[v.label] ?? '#334155')
        return (
          <g key={v.label} transform={`translate(${x},${y})`}>
            <g transform={`rotate(${ROT[v.from]})`}>
              <rect x={-w / 2} y={-len / 2} width={w} height={len} rx="5" fill={fill} className="scene-car" />
              {v.kind !== 'bike' && <rect x={-w / 2 + 3} y={-len / 2 + 6} width={w - 6} height="8" rx="2" className="scene-glass" />}
              {v.kind === 'police' && <rect x={-w / 2 + 3} y={-2} width={w - 6} height="5" fill="#2563eb" />}
            </g>
            <circle r="10" cx={vertical(v.from) ? 22 : 0} cy={vertical(v.from) ? 0 : -22} className="scene-label-bg" />
            <text x={vertical(v.from) ? 22 : 0} y={vertical(v.from) ? 4 : -18} textAnchor="middle" className="scene-label">
              {v.label}
            </text>
          </g>
        )
      })}
      {/* знаки */}
      {scene.signs?.map((s, i) => {
        const sign = signByCode(s.code)
        if (!sign) return null
        const [x, y] = SIGN_POS[s.at]
        return <image key={i} href={localSignUrl(sign)} x={x - 15} y={y - 15} width="30" height="30" />
      })}
      {/* світлофори */}
      {scene.lights?.map((l, i) => {
        const [x, y] = SIGN_POS[l.at]
        const cy = { red: -12, orange: 0, green: 12 }[l.color]
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-9" y="-20" width="18" height="40" rx="4" className="scene-light" />
            {[-12, 0, 12].map((yy) => (
              <circle key={yy} cy={yy} r="5" fill={yy === cy ? { red: '#ef4444', orange: '#f59e0b', green: '#22c55e' }[l.color] : '#374151'} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}
