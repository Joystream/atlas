import React, { useState } from 'react'

import { Text } from '@/shared/components'

import { StyledToggleButton } from './ToggleButton.styles'

import type { ButtonProps } from '../Button/Button'

export type ToggleButtonProps = {
  controlled?: boolean
  toggled?: boolean
} & Omit<ButtonProps, 'variant'>

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  onClick,
  controlled = false,
  toggled: externalToggled = false,
  children,
  ...buttonProps
}) => {
  const [toggled, setToggled] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
    }
    if (!controlled) {
      setToggled(!toggled)
    }
  }

  return (
    <StyledToggleButton
      onClick={handleClick}
      toggled={controlled ? externalToggled : toggled}
      {...buttonProps}
      variant="secondary"
    >
      <Text variant="button1">{children}</Text>
    </StyledToggleButton>
  )
}
