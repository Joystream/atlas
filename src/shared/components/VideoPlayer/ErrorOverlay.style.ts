import styled from '@emotion/styled'
import Lottie from 'react-lottie-player'

import { colors, media, sizes, zIndex } from '@/shared/theme'

import { Button } from '../Button'
import { Text } from '../Text'

export const OverlayBackground = styled.div`
  display: flex;
  z-index: ${zIndex.overlay};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray[900]};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
`

export const InnerContainer = styled.div`
  padding: ${sizes(6)};
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  width: 100%;
  display: flex;
  align-items: center;

  ${media.compact} {
    justify-content: center;
  }
`

export const StyledLottie = styled(Lottie)`
  width: 216px;
`

export const Heading = styled(Text)`
  margin-top: ${sizes(8)};
`

export const ErrorMessage = styled(Text)`
  max-width: 560px;
  margin-top: ${sizes(2)};
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(8)};
  display: flex;
`
export const StyledDiscordButton = styled(Button)`
  margin-right: ${sizes(4)};
`
