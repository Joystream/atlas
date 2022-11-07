import styled from '@emotion/styled'

import { Svg404PatternBottomLeft, Svg404PatternTopRight, SvgSmallTokens } from '@/components/_illustrations'
import { media, square } from '@/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
`

export const StyledSvgSmallTokens = styled(SvgSmallTokens)`
  ${square('128px')};

  ${media.sm} {
    ${square('unset')};
  }
`

export const TextContainer = styled.div`
  text-align: center;

  ${media.sm} {
    width: 610px;
  }

  ${media.md} {
    width: 584px;
  }

  ${media.lg} {
    width: 640px;
  }

  ${media.xl} {
    width: 880px;
  }

  ${media.xxl} {
    width: 724px;
  }
`

export const BottomPattern = styled(Svg404PatternBottomLeft)`
  position: absolute;
  bottom: 0;
  left: calc(var(--size-global-horizontal-padding) * -1);

  ${square('216px')};

  ${media.sm} {
    ${square('unset')};
  }

  ${media.xxl} {
    left: 0;
  }
`

export const TopPattern = styled(Svg404PatternTopRight)`
  position: absolute;
  top: 0;
  right: calc(var(--size-global-horizontal-padding) * -1);
  width: 270px;
  height: 216px;

  ${media.sm} {
    width: unset;
    height: unset;
  }

  ${media.xxl} {
    right: 0;
  }
`
