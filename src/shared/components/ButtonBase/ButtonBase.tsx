import React from 'react'
import { Link } from 'react-router-dom'
import { To } from 'history'
import { ButtonBaseStyleProps, StyledButtonBase } from './ButtonBase.style'

export type ButtonBaseProps = {
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: To
  type?: 'button' | 'submit'
  children?: React.ReactNode
  className?: string
} & Partial<Pick<ButtonBaseStyleProps, 'size' | 'variant'>>

const getLinkPropsFromTo = (to?: To) => {
  if (!to) {
    return {}
  }

  if (typeof to === 'string' && to.includes('http')) {
    return { as: 'a', href: to, rel: 'noopener noreferrer', target: '_blank' } as const
  }

  return { as: Link, to: to }
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, to, type = 'button', children, size = 'medium', variant = 'primary', ...styleProps }, ref) => {
    const clickable = !!onClick || !!to || type === 'submit'

    const linkProps = getLinkPropsFromTo(to)

    return (
      <StyledButtonBase
        ref={ref}
        type={type}
        onClick={onClick}
        clickable={clickable}
        {...linkProps}
        size={size}
        variant={variant}
        {...styleProps}
      >
        {children}
      </StyledButtonBase>
    )
  }
)
ButtonBase.displayName = 'ButtonBase'

export default ButtonBase
