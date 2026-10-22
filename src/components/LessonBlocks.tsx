import type { Bi, Block } from '../data/courses'
import { signByCode } from '../data/signs'
import { SignImage } from './SignImage'

/** **жирний** у тексті уроку */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p))}</>
}

function Uk({ bi, show }: { bi: Bi; show: boolean }) {
  return show ? (
    <span className="uk">
      <Rich text={bi.uk} />
    </span>
  ) : null
}

export function LessonBlocks({ blocks, showUk }: { blocks: Block[]; showUk: boolean }) {
  return (
    <div className="lesson">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return (
              <h3 key={i}>
                <Rich text={b.fr} />
                <Uk bi={b} show={showUk} />
              </h3>
            )
          case 'p':
            return (
              <p key={i}>
                <Rich text={b.fr} />
                <Uk bi={b} show={showUk} />
              </p>
            )
          case 'tip':
          case 'warn':
            return (
              <div key={i} className={`callout ${b.t}`}>
                <strong>{b.t === 'tip' ? '💡 Astuce' : '⚠️ Attention'}</strong>
                <p>
                  <Rich text={b.fr} />
                  <Uk bi={b} show={showUk} />
                </p>
              </div>
            )
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Rich text={it.fr} />
                    <Uk bi={it} show={showUk} />
                  </li>
                ))}
              </ul>
            )
          case 'signs':
            return (
              <div key={i} className="lesson-signs">
                {b.codes.map((c) => {
                  const s = signByCode(c)
                  if (!s) return null
                  return (
                    <figure key={c}>
                      <SignImage sign={s} className="lesson-sign" />
                      <figcaption>
                        {s.fr}
                        {showUk && <span className="uk">{s.uk}</span>}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            )
          case 'table':
            return (
              <div key={i} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j}>
                          {h.fr}
                          {showUk && <span className="uk">{h.uk}</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>
                            <Rich text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      })}
    </div>
  )
}
