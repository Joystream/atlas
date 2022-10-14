import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

import { imageShadow } from './YppLandingView.styles'

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.lg} {
    max-width: 1152px;
  }
`

export const FrontImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  ${imageShadow}
`

export const BackImage = styled.img`
  position: absolute;
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  left: 0;
  top: 0;
`
