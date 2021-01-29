import React, { ReactChild } from 'react'
import { CustomLinkStyleProps, DisabledLabel, StyledLink } from './Link.style'

type CustomLinkProps = {
  children: ReactChild
  to: string
  disabled?: boolean
  className?: string
  replace?: boolean
  ref?: React.Ref<HTMLAnchorElement>
  state?: any
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
} & CustomLinkStyleProps

export default function CustomLink({
  children,
  to = '',
  disabled = false,
  className = '',
  replace = false,
  ref = () => {},
  state = null,
  ...props
}: CustomLinkProps) {
  if (disabled) return <DisabledLabel>{children}</DisabledLabel>
  return (
    <StyledLink to={to} className={className} replace={replace} ref={ref} state={state}>
      {children}
    </StyledLink>
  )
}
