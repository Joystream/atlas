import { To } from 'history'
import React from 'react'
import { Link } from 'react-router-dom'

import { BorderWrapper, ButtonBaseStyleProps, StyledButtonBase } from './ButtonBase.style'

export type ButtonBaseProps = {
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: To
  type?: 'button' | 'submit'
  textOnly?: boolean
  iconOnly?: boolean
  children?: React.ReactNode
  className?: string
} & Partial<Pick<ButtonBaseStyleProps, 'size' | 'variant' | 'fullWidth'>>

const getLinkPropsFromTo = (to?: To) => {
  if (!to) {
    return {}
  }

  if (typeof to === 'string' && to.includes('http')) {
    return { as: 'a', href: to, rel: 'noopener noreferrer', target: '_blank' } as const
  }

  return { as: Link, to: to }
}

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (
    {
      onClick,
      to,
      type = 'button',
      children,
      size = 'medium',
      variant = 'primary',
      textOnly = false,
      iconOnly = false,
      disabled,
      ...styleProps
    },
    ref
  ) => {
    const clickable = !!onClick || !!to || type === 'submit'

    const linkProps = getLinkPropsFromTo(to)

    return (
      <StyledButtonBase
        ref={ref}
        type={to ? undefined : type}
        onClick={onClick}
        clickable={clickable}
        disabled={disabled}
        aria-disabled={disabled}
        {...linkProps}
        size={size}
        variant={variant}
        textOnly={textOnly}
        iconOnly={iconOnly}
        {...styleProps}
      >
        <BorderWrapper textOnly={textOnly}>{children}</BorderWrapper>
      </StyledButtonBase>
    )
  }
)
ButtonBase.displayName = 'ButtonBase'
