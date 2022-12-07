import styled from '@emotion/styled'

import { InfiniteCarousel } from '@/components/InfiniteCarousel/InfiniteCarousel'
import { cVar, media, sizes } from '@/styles'

import { imageShadow } from './YppLandingView.styles'

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

export const StyledInfiniteCarousel = styled(InfiniteCarousel)`
  margin-top: ${sizes(16)};
  text-align: left;
  overflow: unset;
  ${media.md} {
    margin-top: ${sizes(24)};
  }
`
