import appKv from '@/assets/images/app-kv.webp'
import { AppLogo } from '@/components/AppLogo'
import { StyledSvgJoystreamLogoFull } from '@/components/_navigation/SidenavBase'

import { Fade, Image, LogoWrapper, StyledText, Wrapper } from './AppKV.styles'

export const AppKV = () => {
  return (
    <Wrapper>
      <Image src={appKv} />
      <LogoWrapper>
        <AppLogo variant="full" />
        <StyledText as="span" variant="t100" color="colorTextMuted">
          Powered by
          <StyledSvgJoystreamLogoFull />
        </StyledText>
      </LogoWrapper>
      <Fade />
    </Wrapper>
  )
}
