import React from 'react'

import { StyledPill } from '@/components/Pill/Pill.styles'
import { Text } from '@/components/Text'

import { PillProps } from './types'

export const Pill: React.FC<PillProps> = ({ label, icon, iconPlacement = 'left', ...props }) => {
  return (
    <StyledPill {...props} hasLabel={!!(label && label.length)} iconPlacement={iconPlacement}>
      {icon && iconPlacement === 'left' && icon}
      {label && <Text variant="t100">{label}</Text>}
      {icon && iconPlacement === 'right' && icon}
    </StyledPill>
  )
}
