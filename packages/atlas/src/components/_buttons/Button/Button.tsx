import { To } from 'history'
import { ButtonHTMLAttributes, ElementType, PropsWithChildren, ReactNode, forwardRef } from 'react'

import { Text, TextVariant } from '@/components/Text'
import { getLinkPropsFromTo } from '@/utils/button'

import { BorderWrapper, ButtonBase, ButtonIconWrapper, ButtonSize, ButtonVariant, IconPlacement } from './Button.styles'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    as?: ElementType
    icon?: ReactNode
    iconPlacement?: IconPlacement
    badge?: boolean | string | number
    fullWidth?: boolean
    size?: ButtonSize
    to?: To
    openLinkInNewTab?: boolean
    type?: 'button' | 'submit'
    variant?: ButtonVariant
    rounded?: boolean
    // internal
    _textOnly?: boolean
    ariaLabel?: string
  }>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 't300-strong',
  medium: 't200-strong',
  small: 't100-strong',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
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
    rounded = false,
    ariaLabel,
    ...baseButtonProps
  } = props

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
      iconOnly={iconOnly}
      textOnly={!!_textOnly}
      size={size}
      data-badge={badge}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      rounded={rounded}
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
          <Text as="span" variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]} color="inherit">
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

export type TextButtonProps = {
  variant?: Subset<ButtonVariant, 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'warning'>
} & Omit<ButtonProps, '_textOnly' | 'variant'>

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>((props, ref) => (
  <Button {...props} _textOnly ref={ref} />
))
TextButton.displayName = 'TextButton'
