import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { media, sizes, zIndex } from '@/styles'

export const Wrapper = styled.div`
  padding-top: ${sizes(24)};
  text-align: center;
`

export const HeroWrapper = styled.div`
  position: relative;
`

const commonHeroImagesStyles = css`
  position: absolute;
  left: 50%;
`

export const FrontImage = styled.img<{ parallaxPosition: number }>`
  ${commonHeroImagesStyles};

  z-index: ${zIndex.nearOverlay};
  transform: translate(-50%, -${({ parallaxPosition }) => parallaxPosition}px);
  width: 100%;
  will-change: transform;

  ${media.md} {
    max-width: 888px;
  }

  ${media.lg} {
    max-width: 1152px;
  }
`

export const BackImage = styled.img`
  ${commonHeroImagesStyles};

  transform: translateX(-50%);
  width: 84%;

  ${media.md} {
    max-width: 740px;
  }

  ${media.lg} {
    max-width: 960px;
  }
`
