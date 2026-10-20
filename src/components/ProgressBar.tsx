export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-fill" style={{ width: `${value}%` }} />
    </div>
  )
}
