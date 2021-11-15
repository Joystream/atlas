import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SvgJoystreamLogoShort } from '@/shared/illustrations'

import { Header, LogoLink } from './TopbarBase.style'

export type TopbarBaseProps = {
  fullLogoNode: React.ReactNode
  logoLinkUrl: string
  noLogo?: boolean
  className?: string
  hasSidebar?: boolean
}

export const TopbarBase: React.FC<TopbarBaseProps> = ({
  children,
  fullLogoNode,
  logoLinkUrl,
  noLogo,
  className,
  hasSidebar = false,
}) => {
  const mdMatch = useMediaMatch('md')

  return (
    <Header className={className} hasSidebar={hasSidebar}>
      {!noLogo && <LogoLink to={logoLinkUrl}>{mdMatch ? fullLogoNode : <SvgJoystreamLogoShort />}</LogoLink>}
      {children}
    </Header>
  )
}
