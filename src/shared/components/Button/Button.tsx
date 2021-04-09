import React from 'react'
import { StyledButtonBase, StyledText, StyledIcon } from './Button.style'
import type { IconType } from '../Icon'
import { TextVariant } from '../Text'
import { ButtonBaseProps, ButtonSize } from '../ButtonBase'

export type ButtonProps = {
  icon?: IconType
} & ButtonBaseProps &
  Required<Pick<ButtonBaseProps, 'children'>>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 'button1',
  medium: 'button2',
  small: 'button3',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, children, size = 'medium', ...baseButtonProps }, ref) => {
    return (
      <StyledButtonBase ref={ref} size={size} {...baseButtonProps}>
        {icon && <StyledIcon name={icon} />}
        {children && (
          <StyledText variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]} size={size}>
            {children}
          </StyledText>
        )}
      </StyledButtonBase>
    )
  }
)
Button.displayName = 'Button'

export default Button
