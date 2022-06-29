import { FC, useMemo } from 'react'

import { polkadotIcon } from './utils'

type PolkadotIdenticonProps = {
  className?: string
  id: string
}

export const PolkadotIdenticon: FC<PolkadotIdenticonProps> = ({ className, id }) => {
  const dots = useMemo(() => polkadotIcon(id), [id])
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} className={className}>
      {dots.map((dot, idx) => (
        <circle key={idx} {...dot} />
      ))}
    </svg>
  )
}
