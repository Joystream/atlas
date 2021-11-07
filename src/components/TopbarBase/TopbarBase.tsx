import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SvgJoystreamLogoShort } from '@/illustrations'

import { Header, LogoLink } from './TopbarBase.style'

export type TopbarBaseProps = {
  fullLogoNode: React.ReactNode
  logoLinkUrl: string
  noLogo?: boolean
  className?: string
}

export const TopbarBase: React.FC<TopbarBaseProps> = ({ children, fullLogoNode, logoLinkUrl, noLogo, className }) => {
  const mdMatch = useMediaMatch('md')

  return (
    <Header className={className}>
      {!noLogo && <LogoLink to={logoLinkUrl}>{mdMatch ? fullLogoNode : <SvgJoystreamLogoShort />}</LogoLink>}
      {children}
    </Header>
  )
}
