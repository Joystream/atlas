import React from 'react'

import { ButtonIconWrapper, IconPlacement, Indicator, StyledButtonBase, StyledText } from './Button.style'

import { ButtonBaseProps, ButtonSize } from '../ButtonBase'
import { TextVariant } from '../Text'

export type ButtonProps = {
  icon?: React.ReactNode
  iconPlacement?: IconPlacement
  children: React.ReactNode
  indicator?: boolean | string | number
} & Omit<ButtonBaseProps, 'children'>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 'button1',
  medium: 'button2',
  small: 'button3',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { icon, children, size = 'medium', iconPlacement = 'left', variant, textOnly, indicator, ...baseButtonProps },
    ref
  ) => {
    const iconOnly = !children
    return (
      <StyledButtonBase
        ref={ref}
        size={size}
        {...baseButtonProps}
        textOnly={textOnly}
        variant={variant}
        iconOnly={iconOnly}
      >
        {icon && iconPlacement === 'left' && (
          <ButtonIconWrapper iconOnly={iconOnly} iconPlacement={iconPlacement}>
            {icon}
          </ButtonIconWrapper>
        )}
        {children && (
          <StyledText
            variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]}
            textColorVariant={variant || 'primary'}
            textOnly={textOnly}
            size={size}
          >
            {children}
          </StyledText>
        )}
        {icon && iconPlacement === 'right' && (
          <ButtonIconWrapper iconOnly={iconOnly} iconPlacement={iconPlacement}>
            {icon}
          </ButtonIconWrapper>
        )}
        {indicator && <Indicator dot={indicator === true}>{indicator !== true && indicator}</Indicator>}
      </StyledButtonBase>
    )
  }
)
Button.displayName = 'Button'
