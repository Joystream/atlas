import styled from '@emotion/styled'

import { AppLogo } from '@/components/AppLogo'
import { Text } from '@/components/Text'
import { cVar, sizes, zIndex } from '@/styles'

export const Wrapper = styled.div`
  position: relative;
`

export const Image = styled.img`
  object-fit: contain;
  width: 100%;
`

export const StyledText = styled(Text)`
  display: flex;
`

export const LogoWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  gap: ${sizes(6)};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.overlay};
`

export const AppLogoContainer = styled.div`
  max-height: 48px;
  display: flex;
  justify-content: center;
`
export const StyledAppLogo = styled(AppLogo)`
  max-height: 100%;
`

export const Fade = styled.div`
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, ${cVar('colorBackground')} 100%);
  width: 100%;
  height: 128px;
`
