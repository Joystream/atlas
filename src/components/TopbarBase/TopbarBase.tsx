import React from 'react'

import { FullLogo, Header, LogoContainer, LogoLink, ShortLogo, StudioText } from './TopbarBase.style'

export type TopbarVariant = 'default' | 'studio'
export type TopbarBaseProps = {
  variant?: TopbarVariant
  className?: string
  isHamburgerButtonPresent?: boolean
}

export const TopbarBase: React.FC<TopbarBaseProps> = ({
  children,
  variant = 'default',
  className,
  isHamburgerButtonPresent = true,
}) => {
  const isStudio = variant === 'studio'
  const logoLink = isStudio ? '/studio' : '/'
  return (
    <Header className={className}>
      <LogoContainer variant={variant} isHamburgerButtonPresent={isHamburgerButtonPresent}>
        <LogoLink to={logoLink}>
          <ShortLogo />
          <FullLogo variant={variant} />
          {isStudio && <StudioText secondary>studio</StudioText>}
        </LogoLink>
      </LogoContainer>
      {children}
    </Header>
  )
}
