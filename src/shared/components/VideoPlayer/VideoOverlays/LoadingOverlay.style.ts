import styled from '@emotion/styled'
import Lottie from 'react-lottie-player'

import { SvgPlayerLoaderFallback } from '@/shared/icons'
import { colors, sizes } from '@/shared/theme'

export const StyledLottie = styled(Lottie)`
  width: ${sizes(18)};
  height: ${sizes(18)};
`
export const StyledSvgPlayerLoaderFallback = styled(SvgPlayerLoaderFallback)`
  width: ${sizes(18)};
  height: ${sizes(18)};
`

export const OverlayBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.transparentBlack[54]};
  display: flex;
  background-size: cover;
  justify-content: center;
  align-items: center;
`
