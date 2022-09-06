import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes, zIndex } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin-top: ${sizes(16)};
  text-align: center;

  ${media.md} {
    margin-top: ${sizes(24)};
  }
`

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.md} {
    max-width: 888px;
  }

  ${media.lg} {
    max-width: 1152px;
  }
`

const commonHeroImagesStyles = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
`

export const FrontImage = styled.img<{ parallaxPosition: number }>`
  ${commonHeroImagesStyles};

  z-index: ${zIndex.nearOverlay};
  transform: translateY(-${({ parallaxPosition }) => parallaxPosition}px);
  will-change: transform;
`

export const BackImage = styled.img`
  ${commonHeroImagesStyles};
`
