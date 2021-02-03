import React from 'react'
import { SerializedStyles } from '@emotion/react'
import { NavButtonStyleProps, StyledButton } from './NavButton.style'
import Icon from '../Icon'

export type NavButtonProps = {
  direction: 'right' | 'left'
  outerCss: SerializedStyles | (SerializedStyles | undefined)[]
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
} & NavButtonStyleProps

const NavButton: React.FC<Partial<NavButtonProps>> = ({
  direction = 'right',
  onClick,
  outerCss,
  variant = 'primary',
}) => {
  return (
    <StyledButton css={outerCss} onClick={onClick} variant={variant}>
      <Icon name={direction === 'right' ? 'chevron-right' : 'chevron-left'} />
    </StyledButton>
  )
}

export default NavButton
