import styled from '@emotion/styled'

import { InfiniteCarousel } from '@/components/InfiniteCarousel/InfiniteCarousel'
import { cVar, media, sizes } from '@/styles'

import { imageShadow } from '../YppLandingView.styles'

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.lg} {
    max-width: 1152px;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const LogosContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizes(10)};
  margin-bottom: ${sizes(8)};
`

export const SelectDifferentChannelButton = styled.button`
  white-space: normal;
  border: none;
  background: none;
  color: ${cVar('colorTextPrimary')};
  padding: 0;
  font: inherit;
  cursor: pointer;

  :hover,
  :focus-visible {
    text-decoration: underline;
  }
`

export const FrontImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: ${cVar('radiusMedium')};
  margin-top: 10%;
  ${imageShadow}
`

export const BackImage = styled.img`
  position: absolute;
  width: 80%;
  max-width: 100%;
  height: auto;
  display: block;
  left: 10%;
  top: -10%;
  border-radius: ${cVar('radiusMedium')};
`

export const StyledInfiniteCarousel = styled(InfiniteCarousel)`
  margin-top: ${sizes(16)};
  ${media.md} {
    margin-top: ${sizes(24)};
  }
`
