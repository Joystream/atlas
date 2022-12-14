import { FC } from 'react'

import { StyledLabel, StyledPill } from '@/components/Pill/Pill.styles'
import { Tooltip } from '@/components/Tooltip'

import { PillProps } from './types'

export const Pill: FC<PillProps> = ({ label, icon, iconPlacement = 'left', withTooltip, ...props }) => {
  const getPillElement = () => (
    <StyledPill
      {...props}
      title={withTooltip ? undefined : props.title}
      hasLabel={!!label}
      iconPlacement={iconPlacement}
    >
      {icon && iconPlacement === 'left' && icon}
      {label && (
        <StyledLabel as="span" variant="t100">
          {label}
        </StyledLabel>
      )}
      {icon && iconPlacement === 'right' && icon}
    </StyledPill>
  )
  return withTooltip ? <Tooltip text={props.title}>{getPillElement()}</Tooltip> : getPillElement()
}
