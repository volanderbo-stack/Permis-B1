import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

// Подію треба зловити якомога раніше, ще до того, як відкриється головна
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e as BeforeInstallPromptEvent
  listeners.forEach((l) => l())
})
window.addEventListener('appinstalled', () => {
  deferred = null
  listeners.forEach((l) => l())
})

/** Кнопка «Встановити застосунок» (Chrome/Android). На iOS — через «Поділитися → На початковий екран». */
export function useInstallPrompt() {
  const [available, setAvailable] = useState(!!deferred)
  useEffect(() => {
    const l = () => setAvailable(!!deferred)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    deferred = null
    setAvailable(false)
  }
  return { available, install }
}
