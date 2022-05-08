import { To } from 'history'
import React from 'react'

import { Text, TextVariant } from '@/components/Text'
import { getLinkPropsFromTo } from '@/utils/button'

import { BorderWrapper, ButtonBase, ButtonIconWrapper, ButtonSize, ButtonVariant, IconPlacement } from './Button.styles'

export type ButtonProps = {
  icon?: React.ReactNode
  iconPlacement?: IconPlacement
  badge?: boolean | string | number
  fullWidth?: boolean
  size?: ButtonSize
  to?: To
  openLinkInNewTab?: boolean
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  tabIndex?: number
  children?: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAnimationEnd?: (e: React.AnimationEvent<HTMLButtonElement>) => void
  // internal
  _textOnly?: boolean
}

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 't300-strong',
  medium: 't200-strong',
  small: 't100-strong',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    icon,
    children,
    onClick,
    disabled,
    type = 'button',
    to,
    openLinkInNewTab,
    size = 'medium',
    iconPlacement = 'left',
    tabIndex,
    badge,
    _textOnly,
    variant = 'primary',
    ...baseButtonProps
  } = props

  // const variant = (textOnly ? props.textOnlyVariant : props?.variant) ?? 'primary'
  const iconOnly = !children && !!icon
  const linkProps = getLinkPropsFromTo(to, openLinkInNewTab)
  return (
    <ButtonBase
      ref={ref}
      tabIndex={tabIndex}
      type={to ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      variant={variant}
      iconOnly={!!iconOnly}
      textOnly={!!_textOnly}
      size={size}
      data-badge={badge}
      {...linkProps}
      {...baseButtonProps}
    >
      <BorderWrapper textOnly={!!_textOnly}>
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
})
Button.displayName = 'Button'

export type TextButton = {
  variant: Subset<ButtonVariant, 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'warning'>
} & Omit<ButtonProps, 'textOnly' | 'variant'>

export const TextButton = React.forwardRef<HTMLButtonElement>((props, ref) => <Button {...props} _textOnly ref={ref} />)
TextButton.displayName = 'TextButton'
