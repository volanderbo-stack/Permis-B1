import { useState } from 'react'
import { EXAM_PASS, EXAM_SIZE } from '../lib/exam'
import type { ExamResult } from '../lib/storage'

const W = 340
const H = 180
const PAD = { top: 12, right: 8, bottom: 20, left: 26 }
const MAX_BARS = 20

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })

/** Стовпчики — результати останніх іспитів, пунктир — прохідний бал */
export function ExamChart({ exams }: { exams: ExamResult[] }) {
  const data = exams.slice(-MAX_BARS)
  const [active, setActive] = useState<number | null>(null)
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const y = (v: number) => PAD.top + innerH - (v / EXAM_SIZE) * innerH
  const slot = innerW / MAX_BARS
  const barW = Math.max(6, slot - 4)
  const shown = active ?? data.length - 1
  const cur = data[shown]

  return (
    <figure className="chart">
      <div className="chart-tip" aria-live="polite">
        {cur && (
          <>
            <strong>
              {cur.score}/{cur.total}
            </strong>{' '}
            {cur.score >= EXAM_PASS ? '✅ réussi' : '❌ non réussi'}
            <span className="muted"> · {fmtDate(cur.date)}</span>
          </>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Résultats des examens blancs">
        {[0, 10, 20, 30, 40].map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} />
            <text className="axis" x={PAD.left - 6} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {data.map((e, i) => {
          const x = PAD.left + i * slot + (slot - barW) / 2
          const top = y(e.score)
          const h = PAD.top + innerH - top
          const r = Math.min(4, barW / 2, h)
          return (
            <g
              key={e.date}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`bar-g ${i === shown ? 'active' : ''}`}
            >
              {/* невидима велика зона для дотику пальцем */}
              <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={innerH} fill="transparent" />
              <path
                className="bar-mark"
                d={`M${x},${PAD.top + innerH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${PAD.top + innerH} Z`}
              />
            </g>
          )
        })}
        <line className="pass-line" x1={PAD.left} x2={W - PAD.right} y1={y(EXAM_PASS)} y2={y(EXAM_PASS)} />
        <text className="axis pass-label" x={W - PAD.right} y={y(EXAM_PASS) - 4} textAnchor="end">
          seuil {EXAM_PASS}
        </text>
        <line className="baseline" x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} />
      </svg>
      <figcaption className="muted small">
        {data.length} dernier(s) examen(s) · touchez une barre pour le détail
      </figcaption>
    </figure>
  )
}
