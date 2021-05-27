import React, { ReactNode } from 'react'
import { ButtonBaseProps } from '../ButtonBase'
import { StyledButtonBase } from './IconButton.style'

export type IconButtonProps = ButtonBaseProps & {
  children: ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'primary', children, ...buttonBaseProps }, ref) => {
    return (
      <StyledButtonBase ref={ref} variant={variant} {...buttonBaseProps}>
        {children}
      </StyledButtonBase>
    )
  }
)
IconButton.displayName = 'IconButton'

export default IconButton
