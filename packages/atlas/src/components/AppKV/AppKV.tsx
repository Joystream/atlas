import { FC, ReactNode } from 'react'

import appKv from '@/assets/images/app-kv.webp'
import { StyledSvgJoystreamLogoFull } from '@/components/_navigation/SidenavBase'

import { AppLogoContainer, Fade, Image, LogoWrapper, StyledAppLogo, StyledText, Wrapper } from './AppKV.styles'

type AppKVProps = {
  customNode?: ReactNode
}

export const AppKV: FC<AppKVProps> = ({ customNode }) => {
  return (
    <Wrapper>
      <Image src={appKv} />
      <LogoWrapper>
        {customNode ? (
          customNode
        ) : (
          <>
            <AppLogoContainer>
              <StyledAppLogo variant="full" />
            </AppLogoContainer>
            <StyledText as="span" variant="t100" color="colorTextMuted">
              Powered by
              <StyledSvgJoystreamLogoFull />
            </StyledText>
          </>
        )}
      </LogoWrapper>
      <Fade />
    </Wrapper>
  )
}
