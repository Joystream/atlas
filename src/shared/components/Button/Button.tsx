import React from 'react'
import { SerializedStyles } from '@emotion/react'
import { ButtonStyleProps, StyledButton, StyledIcon } from './Button.style'
import type { IconType } from '../Icon'

export type ButtonProps = {
  children?: React.ReactNode
  icon?: IconType
  disabled?: boolean
  containerCss?: SerializedStyles
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: string
  as?: React.ElementType
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
    className,
    onClick,
    as,
    to = '',
  },
  ref
) => {
  const clickable = !!onClick
  const hasText = !!children

  return (
    <StyledButton
      as={as}
      to={to}
      css={containerCss}
      className={className}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      clickable={clickable}
      hasText={hasText}
      full={full}
      size={size}
      ref={ref}
    >
      {icon && <StyledIcon disabled={disabled} name={icon} size={size} hasText={hasText} />}
      {children && <span>{children}</span>}
    </StyledButton>
  )
}

const Button = React.forwardRef(ButtonComponent)

Button.displayName = 'Button'

export default Button
