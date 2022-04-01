import { To } from 'history'
import React from 'react'

import { getLinkPropsFromTo } from '@/utils/button'

import { BorderWrapper, ButtonBaseStyleProps, StyledButtonBase } from './ButtonBase.styles'

export type ButtonBaseProps = {
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAnimationEnd?: (e: React.AnimationEvent<HTMLButtonElement>) => void
  to?: To
  newTab?: boolean
  type?: 'button' | 'submit'
  textOnly?: boolean
  iconOnly?: boolean
  children?: React.ReactNode
  className?: string
  tabIndex?: number
} & Partial<Pick<ButtonBaseStyleProps, 'size' | 'variant' | 'fullWidth'>>

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (
    {
      onClick,
      to,
      newTab,
      type = 'button',
      children,
      size = 'medium',
      variant = 'primary',
      textOnly = false,
      iconOnly = false,
      tabIndex,
      disabled,
      ...styleProps
    },
    ref
  ) => {
    const linkProps = getLinkPropsFromTo(to, newTab)

    return (
      <StyledButtonBase
        ref={ref}
        tabIndex={tabIndex}
        type={to ? undefined : type}
        onClick={onClick}
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
