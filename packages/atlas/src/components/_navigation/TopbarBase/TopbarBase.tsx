import { FC, PropsWithChildren, ReactNode } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Header, LogoDivider, LogoLink } from './TopbarBase.styles'

export type TopbarBaseProps = PropsWithChildren<{
  fullLogoNode: ReactNode
  logoLinkUrl: string
  noLogo?: boolean
  className?: string
}>

export const TopbarBase: FC<TopbarBaseProps> = ({ children, fullLogoNode, logoLinkUrl, noLogo, className }) => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')

  return (
    <Header className={className} data-scroll-lock-fill-gap>
      {!noLogo && (
        <LogoLink to={logoLinkUrl}>
          {mdMatch ? fullLogoNode : <AppLogo variant="short" height={32} width={undefined} />}
          {xsMatch && <LogoDivider />}
          {xsMatch && (
            <Text variant="h200" as="h4" color="colorTextMuted" margin={{ right: 2 }}>
              {smMatch ? 'Powered' : ''} by Joystream
            </Text>
          )}
        </LogoLink>
      )}
      {children}
    </Header>
  )
}
