import { FC, PropsWithChildren, ReactNode } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Header, LogoLink } from './TopbarBase.styles'

export type TopbarBaseProps = PropsWithChildren<{
  fullLogoNode: ReactNode
  logoLinkUrl: string
  noLogo?: boolean
  className?: string
}>

export const TopbarBase: FC<TopbarBaseProps> = ({ children, fullLogoNode, logoLinkUrl, noLogo, className }) => {
  const mdMatch = useMediaMatch('md')

  return (
    <Header className={className} data-scroll-lock-fill-gap>
      {!noLogo && (
        <LogoLink to={logoLinkUrl}>
          {mdMatch ? fullLogoNode : <AppLogo variant="short" height={32} width={undefined} />}
        </LogoLink>
      )}
      {children}
    </Header>
  )
}
