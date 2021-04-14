import React from 'react'
import { ButtonBaseProps } from '../ButtonBase'
import { StyledButtonBase } from './IconButton.style'
import Icon from '../Icon'
import { IconType } from '../../icons'

export type IconButtonProps = ButtonBaseProps & {
  icon: IconType
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'primary', ...buttonBaseProps }, ref) => {
    return (
      <StyledButtonBase ref={ref} variant={variant} {...buttonBaseProps}>
        <Icon name={icon} />
      </StyledButtonBase>
    )
  }
)
IconButton.displayName = 'IconButton'

export default IconButton
