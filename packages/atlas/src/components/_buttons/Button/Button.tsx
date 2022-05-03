import { To } from 'history'
import React from 'react'

import { Text, TextVariant } from '@/components/Text'
import { getLinkPropsFromTo } from '@/utils/button'

import {
  BorderWrapper,
  ButtonBase,
  ButtonBaseStyleProps,
  ButtonIconWrapper,
  ButtonSize,
  IconPlacement,
} from './Button.styles'

export type ButtonBaseProps = {
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAnimationEnd?: (e: React.AnimationEvent<HTMLButtonElement>) => void
  to?: To
  newTab?: boolean
  type?: 'button' | 'submit'
  children?: React.ReactNode
  className?: string
  tabIndex?: number
  iconOnly?: boolean
  textOnly?: boolean
  size?: ButtonSize
} & Partial<Pick<ButtonBaseStyleProps, 'variant' | 'fullWidth'>>

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
  (
    {
      icon,
      children,
      onClick,
      to,
      disabled,
      type = 'button',
      newTab,
      size = 'medium',
      iconPlacement = 'left',
      variant = 'primary',
      textOnly,
      tabIndex,
      badge,
      ...baseButtonProps
    },
    ref
  ) => {
    const iconOnly = !children
    const linkProps = getLinkPropsFromTo(to, newTab)
    return (
      <ButtonBase
        ref={ref}
        tabIndex={tabIndex}
        type={to ? undefined : type}
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        variant={variant}
        data-size={size}
        data-icon-only={!!iconOnly}
        data-text-only={!!textOnly}
        data-badge={badge}
        {...linkProps}
        {...baseButtonProps}
      >
        <BorderWrapper data-icon-only={!!iconOnly} data-text-only={!!textOnly}>
          {icon && iconPlacement === 'left' && (
            <ButtonIconWrapper size={size} iconOnly={iconOnly} iconPlacement={iconPlacement}>
              {icon}
            </ButtonIconWrapper>
          )}
          {children && (
            <Text variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]} color="inherit">
              {children}
            </Text>
          )}
          {icon && iconPlacement === 'right' && (
            <ButtonIconWrapper size={size} iconOnly={iconOnly} iconPlacement={iconPlacement}>
              {icon}
            </ButtonIconWrapper>
          )}
        </BorderWrapper>
      </ButtonBase>
    )
  }
)
Button.displayName = 'Button'
