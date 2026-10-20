export function ComingSoon({ title, stage }: { title: string; stage: number }) {
  return (
    <div className="stack">
      <h1 className="page-title">{title}</h1>
      <div className="card">
        <p>Bientôt disponible.</p>
        <p className="uk">Цей розділ з’явиться на етапі {stage}.</p>
      </div>
    </div>
  )
}
