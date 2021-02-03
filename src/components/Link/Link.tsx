import React, { ReactChild } from 'react'
import { DisabledLabel, StyledLink } from './Link.style'

export type LinkProps = {
  children: ReactChild
  to: string
  disabled?: boolean
  className?: string
  replace?: boolean
  ref?: React.Ref<HTMLAnchorElement>
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Link: React.FC<LinkProps> = ({ to = '', disabled = false, replace = false, ref, children, className }) => {
  if (disabled) return <DisabledLabel>{children}</DisabledLabel>
  return (
    <StyledLink to={to} className={className} replace={replace} ref={ref}>
      {children}
    </StyledLink>
  )
}

export default Link
