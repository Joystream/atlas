import React from 'react'

import { Header, JoystreamFullLogo, LogoContainer, LogoLink, ShortLogo, StudioFullLogo } from './TopbarBase.style'

export type TopbarVariant = 'default' | 'studio'
export type TopbarBaseProps = {
  variant?: TopbarVariant
  className?: string
  isHamburgerButtonPresent?: boolean
  noLogo?: boolean
}

export const TopbarBase: React.FC<TopbarBaseProps> = ({
  children,
  variant = 'default',
  className,
  isHamburgerButtonPresent = true,
  noLogo,
}) => {
  const isStudio = variant === 'studio'
  const logoLink = isStudio ? '/studio' : '/'
  return (
    <Header className={className}>
      {!noLogo && (
        <LogoContainer variant={variant} isHamburgerButtonPresent={isHamburgerButtonPresent}>
          <LogoLink to={logoLink}>
            <ShortLogo />
            {isStudio ? <StudioFullLogo /> : <JoystreamFullLogo />}
          </LogoLink>
        </LogoContainer>
      )}
      {children}
    </Header>
  )
}
