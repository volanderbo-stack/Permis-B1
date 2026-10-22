import { useState } from 'react'
import { canSpeak, questionSpeech, speak } from '../lib/speech'
import { setNote, toggleFavorite, useProgress } from '../lib/storage'
import type { Question } from '../types'

/** Кнопки біля питання: озвучити, в обране, нотатка */
export function QuestionTools({ question, withNote = true }: { question: Question; withNote?: boolean }) {
  const progress = useProgress()
  const fav = progress.favorites.includes(question.id)
  const note = progress.notes[question.id] ?? ''
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)

  return (
    <>
      <span className="tools">
        {canSpeak() && (
          <button type="button" className="tool" aria-label="Écouter" onClick={() => speak(questionSpeech(question))}>
            🔊
          </button>
        )}
        <button
          type="button"
          className={`tool ${fav ? 'on' : ''}`}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={fav}
          onClick={() => toggleFavorite(question.id)}
        >
          {fav ? '★' : '☆'}
        </button>
        {withNote && (
          <button
            type="button"
            className={`tool ${note ? 'on' : ''}`}
            aria-label="Note"
            onClick={() => {
              setDraft(note)
              setEditing((v) => !v)
            }}
          >
            ✎
          </button>
        )}
      </span>
      {editing && (
        <div className="note-edit">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ma note… · Моя нотатка…"
            rows={3}
          />
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setNote(question.id, draft)
              setEditing(false)
            }}
          >
            OK
          </button>
        </div>
      )}
      {!editing && note && <p className="note">✎ {note}</p>}
    </>
  )
}
