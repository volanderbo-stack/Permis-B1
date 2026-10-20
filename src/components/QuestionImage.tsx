import { signByCode } from '../data/signs'
import { SignImage } from './SignImage'

/** Зображення до питання. Шлях виду "signs/AB4.svg" — це дорожній знак з бази знаків. */
export function QuestionImage({ src }: { src: string }) {
  const code = src.match(/^signs\/(.+)\.svg$/)?.[1]
  const sign = code ? signByCode(code) : undefined
  if (sign) return <SignImage sign={sign} className="qimg qimg-sign" />
  return <img className="qimg" src={src} alt="" loading="lazy" />
}
