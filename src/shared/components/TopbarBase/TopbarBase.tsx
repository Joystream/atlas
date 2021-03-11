import React from 'react'
import { FullLogo, FullLogoStudio, Header, LogoLink, LogoContainer, ShortLogo } from './TopbarBase.style'

export type TopbarVariant = 'default' | 'studio'
export type TopbarBaseProps = {
  variant?: TopbarVariant
  hasFocus?: boolean
  className?: string
}

const StudioTopbar: React.FC<TopbarBaseProps> = ({ children, variant = 'default', hasFocus, className }) => {
  return (
    <Header hasFocus={hasFocus} className={className}>
      <LogoContainer variant={variant}>
        <LogoLink to={variant === 'default' ? '/' : '/studio'}>
          {variant === 'default' && <ShortLogo />}
          {variant === 'default' ? <FullLogo /> : <FullLogoStudio />}
        </LogoLink>
      </LogoContainer>
      {children}
    </Header>
  )
}

export default StudioTopbar
