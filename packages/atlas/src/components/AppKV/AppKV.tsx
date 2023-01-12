import appKv from '@/assets/images/app-kv.webp'
import { StyledSvgJoystreamLogoFull } from '@/components/_navigation/SidenavBase'

import { AppLogoContainer, Fade, Image, LogoWrapper, StyledAppLogo, StyledText, Wrapper } from './AppKV.styles'

export const AppKV = () => {
  return (
    <Wrapper>
      <Image src={appKv} />
      <LogoWrapper>
        <AppLogoContainer>
          <StyledAppLogo variant="full" />
        </AppLogoContainer>
        <StyledText as="span" variant="t100" color="colorTextMuted">
          Powered by
          <StyledSvgJoystreamLogoFull />
        </StyledText>
      </LogoWrapper>
      <Fade />
    </Wrapper>
  )
}
