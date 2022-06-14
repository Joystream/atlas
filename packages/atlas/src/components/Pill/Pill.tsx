import { FC } from 'react'

import { StyledLabel, StyledPill } from '@/components/Pill/Pill.styles'

import { PillProps } from './types'

export const Pill: FC<PillProps> = ({ label, icon, iconPlacement = 'left', ...props }) => {
  return (
    <StyledPill {...props} hasLabel={!!label} iconPlacement={iconPlacement}>
      {icon && iconPlacement === 'left' && icon}
      {label && <StyledLabel variant="t100">{label}</StyledLabel>}
      {icon && iconPlacement === 'right' && icon}
    </StyledPill>
  )
}
