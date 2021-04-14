import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
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

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, to, type = 'button', children, size = 'medium', variant = 'primary', ...styleProps }, ref) => {
    const clickable = !!onClick || !!to || type === 'submit'

    const as = to ? (props: LinkProps) => <Link {...props} to={to} /> : undefined
    const externalLinkProps =
      typeof to === 'string' && to.includes('http')
        ? ({ as: 'a', href: to, rel: 'noopener noreferrer', target: '_blank' } as const)
        : undefined

    return (
      <StyledButtonBase
        ref={ref}
        type={type}
        onClick={onClick}
        clickable={clickable}
        as={as}
        {...externalLinkProps}
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
