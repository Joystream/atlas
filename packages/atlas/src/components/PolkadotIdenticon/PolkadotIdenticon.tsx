import styled from '@emotion/styled'
import { FC, useMemo } from 'react'

import { cVar } from '@/styles'

import { polkadotIcon } from './utils'

type PolkadotIdenticonProps = {
  className?: string
  id: string
}

export const PolkadotIdenticon: FC<PolkadotIdenticonProps> = ({ className, id }) => {
  const dots = useMemo(() => polkadotIcon(id), [id])
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 40 40" width={40} height={40}>
        {dots.map((dot, idx) => (
          <circle key={idx} {...dot} />
        ))}
      </svg>
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${cVar('colorCoreNeutral500')};
`
