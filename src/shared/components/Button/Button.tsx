import React from 'react'
import { SerializedStyles } from '@emotion/react'
import { ButtonSize, ButtonStyleProps, StyledButton, StyledIcon } from './Button.style'
import type { IconType } from '../Icon'
import { To } from 'history'
import { Link, LinkProps } from 'react-router-dom'
import Text, { TextVariant } from '../Text'

export type ButtonProps = {
  children?: React.ReactNode
  icon?: IconType
  disabled?: boolean
  containerCss?: SerializedStyles
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: To
  type?: 'button' | 'submit'
} & Omit<ButtonStyleProps, 'clickable' | 'hasText'>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 'button1',
  medium: 'button2',
  small: 'button3',
}

const ButtonComponent: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    children,
    icon,
    variant = 'primary',
    disabled = false,
    full = false,
    size = 'medium',
    containerCss,
    className,
    onClick,
    to,
    type = 'button',
  },
  ref
) => {
  const clickable = !!onClick || !!to || type === 'submit'

  const hasText = !!children

  const as = to ? (props: LinkProps) => <Link {...props} to={to} /> : undefined
  const externalLinkProps =
    typeof to === 'string' && to.includes('http')
      ? ({ as: 'a', href: to, rel: 'noopener noreferrer', target: '_blank' } as const)
      : undefined

  return (
    <StyledButton
      css={containerCss}
      as={as}
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      clickable={clickable}
      hasText={hasText}
      full={full}
      size={size}
      ref={ref}
      {...externalLinkProps}
    >
      {icon && <StyledIcon disabled={disabled} name={icon} size={size} hasText={hasText} />}
      {children && <Text variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]}>{children}</Text>}
    </StyledButton>
  )
}

const Button = React.forwardRef(ButtonComponent)

Button.displayName = 'Button'

export default Button
