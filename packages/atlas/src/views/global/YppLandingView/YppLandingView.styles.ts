import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

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

export const FrontImage = styled.img<{ parallaxPosition: number }>`
  transform: translateY(-${({ parallaxPosition }) => parallaxPosition}px);
  will-change: transform;
  width: 100%;
`

export const BackImage = styled.img`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
`
