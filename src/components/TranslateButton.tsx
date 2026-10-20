export function TranslateButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`chip ${on ? 'chip-on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
    >
      🇺🇦 Переклад
    </button>
  )
}
