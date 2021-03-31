import React from 'react'
import { SerializedStyles } from '@emotion/react'
import { ButtonStyleProps, StyledButton, StyledIcon } from './Button.style'
import type { IconType } from '../Icon'
import { To } from 'history'
import { Link, LinkProps } from 'react-router-dom'

export type ButtonProps = {
  children?: React.ReactNode
  icon?: IconType
  disabled?: boolean
  containerCss?: SerializedStyles
  className?: string
  rotateIcon?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: To
} & Omit<ButtonStyleProps, 'clickable' | 'hasText'>

const ButtonComponent: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    children,
    icon,
    variant = 'primary',
    disabled = false,
    full = false,
    size = 'medium',
    containerCss,
    rotateIcon,
    className,
    onClick,
    to,
  },
  ref
) => {
  const clickable = !!onClick || !!to

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
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      clickable={clickable}
      hasText={hasText}
      rotateIcon={rotateIcon}
      full={full}
      size={size}
      ref={ref}
      {...externalLinkProps}
    >
      {icon && <StyledIcon disabled={disabled} name={icon} size={size} hasText={hasText} />}
      {children && <span>{children}</span>}
    </StyledButton>
  )
}

const Button = React.forwardRef(ButtonComponent)

Button.displayName = 'Button'

export default Button
