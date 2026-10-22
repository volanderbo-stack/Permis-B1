import { useState } from 'react'
import { TranslateButton } from '../components/TranslateButton'
import { MEMO } from '../data/memo'

export function Memo() {
  const [showUk, setShowUk] = useState(true)
  return (
    <div className="stack">
      <div className="row space">
        <h1 className="page-title">Chiffres à retenir</h1>
        <TranslateButton on={showUk} onToggle={() => setShowUk((v) => !v)} />
      </div>
      <p className="uk" style={{ marginTop: -8 }}>
        Усі числа, які найчастіше трапляються на іспиті, — на одній сторінці.
      </p>
      {MEMO.map((s) => (
        <section key={s.title_fr} className="card stack-sm">
          <h2 className="section-title">
            {s.icon} {s.title_fr}
            {showUk && <span className="uk">{s.title_uk}</span>}
          </h2>
          <dl className="memo">
            {s.rows.map((r) => (
              <div key={r.fr} className="memo-row">
                <dt>
                  {r.fr}
                  {showUk && <span className="uk">{r.uk}</span>}
                </dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
