import { useEffect, useState } from 'react'

export type ColorScheme = 'light' | 'dark'

const KEY = 'permis-b1:theme'

function initial(): ColorScheme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // ignore
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(initial)
  useEffect(() => {
    document.documentElement.dataset.theme = scheme
    try {
      localStorage.setItem(KEY, scheme)
    } catch {
      // ignore
    }
  }, [scheme])
  return [scheme, () => setScheme((s) => (s === 'dark' ? 'light' : 'dark'))] as const
}
