import React from 'react'
import { FullLogo, Header, LogoLink, StudioText, LogoContainer, ShortLogo } from './TopbarBase.style'

export type TopbarVariant = 'default' | 'studio'
export type TopbarBaseProps = {
  variant?: TopbarVariant
  hasFocus?: boolean
  className?: string
}

const TopbarBase: React.FC<TopbarBaseProps> = ({ children, variant = 'default', hasFocus, className }) => {
  const isStudio = variant === 'studio'
  const logoLink = isStudio ? '/studio' : '/'
  return (
    <Header hasFocus={hasFocus} className={className}>
      <LogoContainer variant={variant}>
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

export default TopbarBase
