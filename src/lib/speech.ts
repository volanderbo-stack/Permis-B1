/** Озвучка французькою через Web Speech API (працює офлайн, якщо в системі є французький голос) */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

function frenchVoice() {
  const voices = window.speechSynthesis.getVoices()
  return voices.find((v) => v.lang === 'fr-FR') ?? voices.find((v) => v.lang.startsWith('fr'))
}

export function speak(text: string, lang = 'fr-FR') {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = 0.95
  const voice = lang.startsWith('fr') ? frenchVoice() : undefined
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

/** Текст питання для озвучки: питання + варіанти з літерами */
export const questionSpeech = (q: { question_fr: string; answers: { id: string; fr: string }[] }) =>
  [q.question_fr, ...q.answers.map((a) => `Réponse ${a.id} : ${a.fr}`)].join('. ')
