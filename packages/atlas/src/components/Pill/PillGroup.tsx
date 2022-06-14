import { FC } from 'react'

import { Pill } from './Pill'
import { PillGroupWrapper } from './Pill.styles'
import { PillProps, Sizes } from './types'

type PillGroupProps = {
  size?: Sizes
  items: PillProps[]
}

export const PillGroup: FC<PillGroupProps> = ({ items, size = 'medium' }) => {
  return (
    <PillGroupWrapper size={size}>
      {items.map((item, idx) => (
        <Pill key={`pill-${idx}`} size={size} {...item} />
      ))}
    </PillGroupWrapper>
  )
}
