import { useState } from 'react'
import { localSignUrl, remoteSignUrl, type Sign } from '../data/signs'

/** Знак з локальної копії; якщо її немає — з Wikimedia Commons */
export function SignImage({ sign, className }: { sign: Sign; className?: string }) {
  const [src, setSrc] = useState(() => localSignUrl(sign))
  return (
    <img
      className={className}
      src={src}
      alt={sign.fr}
      loading="lazy"
      onError={() => {
        const remote = remoteSignUrl(sign)
        if (src !== remote) setSrc(remote)
      }}
    />
  )
}
