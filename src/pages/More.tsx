import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { canSpeak } from '../lib/speech'
import { exportProgress, importProgress, resetProgress, updateSettings, useProgress } from '../lib/storage'

const LINKS = [
  { to: '/entrainement', icon: '🎯', fr: 'Entraînement ciblé', uk: 'Тренування за фільтрами' },
  { to: '/revision', icon: '🔁', fr: 'Révision et erreurs', uk: 'Повторення й помилки' },
  { to: '/panneaux', icon: '🛑', fr: 'Panneaux', uk: 'Дорожні знаки' },
  { to: '/memo', icon: '🔢', fr: 'Les chiffres à retenir', uk: 'Числа, які треба знати' },
  { to: '/glossaire', icon: '📖', fr: 'Glossaire FR → UK', uk: 'Словник термінів' },
  { to: '/recherche', icon: '🔍', fr: 'Recherche', uk: 'Пошук питань' },
  { to: '/stats', icon: '📈', fr: 'Statistiques', uk: 'Статистика' },
]

const GOALS = [10, 20, 30, 50, 80]

export function More() {
  const progress = useProgress()
  const file = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `permis-b1-progression-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const upload = async (f: File) => {
    try {
      importProgress(await f.text())
      setMessage('✅ Progression restaurée · Прогрес відновлено')
    } catch {
      setMessage('❌ Fichier invalide · Невірний файл')
    }
  }

  return (
    <div className="stack">
      <h1 className="page-title">Plus</h1>
      <div className="stack-sm">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="theme-row">
            <span className="theme-icon" aria-hidden>
              {l.icon}
            </span>
            <span className="theme-main">
              <span className="theme-name">{l.fr}</span>
              <span className="muted small">{l.uk}</span>
            </span>
            <span aria-hidden>›</span>
          </Link>
        ))}
      </div>

      <section className="card stack-sm">
        <h2 className="section-title">Objectif quotidien</h2>
        <p className="uk" style={{ margin: 0 }}>
          Скільки питань на день хочеш проходити
        </p>
        <div className="chips-wrap">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              className={`chip ${progress.settings.dailyGoal === g ? 'chip-on' : ''}`}
              onClick={() => updateSettings({ dailyGoal: g })}
            >
              {g} questions
            </button>
          ))}
        </div>
        {canSpeak() && (
          <label className="switch-row">
            <input
              type="checkbox"
              checked={progress.settings.examAudio}
              onChange={(e) => updateSettings({ examAudio: e.target.checked })}
            />
            <span>
              🔊 Lecture audio à l’examen blanc
              <span className="uk">Озвучувати питання в пробному іспиті</span>
            </span>
          </label>
        )}
      </section>

      <section className="card stack-sm">
        <h2 className="section-title">Sauvegarde</h2>
        <p className="uk" style={{ margin: 0 }}>
          Прогрес зберігається лише в цьому браузері. Зроби резервну копію, щоб перенести його на інший телефон.
        </p>
        <button type="button" className="btn" onClick={download}>
          ⬇️ Exporter ma progression
        </button>
        <button type="button" className="btn" onClick={() => file.current?.click()}>
          ⬆️ Importer une sauvegarde
        </button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void upload(f)
            e.target.value = ''
          }}
        />
        {message && <p className="small">{message}</p>}
      </section>

      <button
        type="button"
        className="btn danger"
        onClick={() => {
          if (confirm('Effacer toute la progression ? / Стерти весь прогрес?')) resetProgress()
        }}
      >
        Réinitialiser la progression
      </button>

      <p className="muted small center">
        Questions et cours rédigés d’après le Code de la route. Panneaux : Wikimedia Commons (domaine public).
        Application non officielle — vérifiez les règles récentes sur securite-routiere.gouv.fr.
      </p>
    </div>
  )
}
