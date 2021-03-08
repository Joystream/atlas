import React from 'react'
import { FullLogo, FullLogoStudio, Header, LogoLink, NavigationContainer, ShortLogo } from './TopbarBase.style'

export type TopbarBaseProps = {
  variant?: 'default' | 'studio'
  hasFocus?: boolean
  className?: string
}

const StudioTopbar: React.FC<TopbarBaseProps> = ({ children, variant = 'default', hasFocus, className }) => {
  return (
    <Header hasFocus={hasFocus} className={className}>
      <NavigationContainer>
        <LogoLink to={variant === 'default' ? '/' : '/studio'}>
          <ShortLogo />
          {variant === 'default' ? <FullLogo /> : <FullLogoStudio />}
        </LogoLink>
      </NavigationContainer>
      {children}
    </Header>
  )
}

export default StudioTopbar
