import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { InfiniteCarousel } from '@/components/InfiniteCarousel/InfiniteCarousel'
import { cVar, media, sizes } from '@/styles'

import { imageShadow } from '../YppLandingView.styles'

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.lg} {
    max-width: 1082px;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const WidgetsContainer = styled(FlexBox)`
  text-align: left;
  flex-direction: column;

  > * {
    flex: 1;
    width: 100%;
  }

  ${media.sm} {
    flex-direction: row;
  }
`

export const ImagesContainer = styled(FlexBox)`
  position: relative;
  margin: 40px 0;

  ${media.sm} {
    margin: 80px 0;
  }
`

export const RightImage = styled.img`
  position: absolute;
  width: auto;
  height: 100%;
  object-fit: contain;
  display: block;
  left: 0%;
  z-index: 10;
  border-radius: ${cVar('radiusMedium')};
  padding: 40px 0;
  box-shadow: 10px blue;

  ${media.lg} {
    left: unset;
    right: 40%;
  }
`

export const LeftImage = styled.img`
  position: absolute;
  width: auto;
  height: 100%;
  object-fit: contain;
  display: block;
  right: 0%;
  z-index: 10;
  border-radius: ${cVar('radiusMedium')};
  padding: 40px 0;

  ${media.xs} {
    width: auto;
  }

  ${media.lg} {
    left: 40%;
  }
`

export const FrontImage = styled.img`
  max-height: 520px;
  width: 95%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: ${cVar('radiusMedium')};
  z-index: 20;
  ${imageShadow}

  ${media.xs} {
    width: auto;
  }

  ${media.xs} {
    width: 70%;
  }
`

export const LogosContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizes(10)};
  margin-bottom: ${sizes(6)};
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
