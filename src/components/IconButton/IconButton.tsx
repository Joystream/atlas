import React, { ReactNode } from 'react'

import { StyledButtonBase } from './IconButton.styles'

import { ButtonBaseProps } from '../ButtonBase'

export type IconButtonProps = Omit<ButtonBaseProps, 'textOnly'> & {
  children: ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'primary', children, ...buttonBaseProps }, ref) => {
    return (
      <StyledButtonBase ref={ref} variant={variant} {...buttonBaseProps}>
        {children}
      </StyledButtonBase>
    )
  }
)
IconButton.displayName = 'IconButton'
