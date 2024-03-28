import { FC, PropsWithChildren, ReactNode } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { TextButton } from '@/components/_buttons/Button'
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
        </LogoLink>
      )}
      <FlexBox gap={2} alignItems="center">
        {xsMatch && <LogoDivider />}
        {xsMatch && (
          <TextButton to="https://www.joystream.org/" variant="tertiary">
            {smMatch ? 'Powered' : ''} by Joystream
          </TextButton>
        )}
      </FlexBox>
      {children}
    </Header>
  )
}
