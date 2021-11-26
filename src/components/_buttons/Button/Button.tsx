import React from 'react'

import { TextVariant } from '@/components/Text'

import { Badge, ButtonIconWrapper, IconPlacement, StyledButtonBase, StyledText } from './Button.styles'

import { ButtonBaseProps, ButtonSize } from '../ButtonBase'

export type ButtonProps = {
  icon?: React.ReactNode
  iconPlacement?: IconPlacement
  children?: React.ReactNode
  badge?: boolean | string | number
} & Omit<ButtonBaseProps, 'children'>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 't300-strong',
  medium: 't200-strong',
  small: 't100-strong',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, children, size = 'medium', iconPlacement = 'left', variant, textOnly, badge, ...baseButtonProps }, ref) => {
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
        {!!badge && <Badge dot={badge === true}>{badge !== true && badge}</Badge>}
      </StyledButtonBase>
    )
  }
)
Button.displayName = 'Button'
