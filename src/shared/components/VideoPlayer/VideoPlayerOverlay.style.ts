import styled from '@emotion/styled'

import { ChannelLink } from '@/components/ChannelLink'
import { colors, sizes, zIndex } from '@/shared/theme'

import { ControlButton } from './VideoPlayer.style'
import { PlayerState } from './VideoPlayerOverlay'

import { Button } from '../Button'
import { CircularProgressbar } from '../CircularProgressbar'
import { Text } from '../Text'

type OverlayBackgroundProps = {
  playerState: PlayerState
  thumbnail?: string | null
}

const getOverlayBackground = (variant?: PlayerState) => {
  switch (variant) {
    case 'ended':
      return colors.transparentBlack[86]
    case 'loading':
      return colors.transparentBlack[54]
    default:
      return 'unset'
  }
}
export const OverlayBackground = styled.div<OverlayBackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${({ playerState, thumbnail }) =>
    `linear-gradient(to right, ${getOverlayBackground(playerState)}, ${getOverlayBackground(
      playerState
    )}), url(${thumbnail}) `};
  background-size: cover;
`

export const PlayOverlay = styled.div`
  position: absolute;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-direction: column;
  z-index: ${zIndex.header};
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - ${sizes(18)});
`

export const Heading = styled(Text)`
  margin-top: ${sizes(4)};
  max-width: 560px;
  text-align: center;
`

type StyledChannelLinkProps = {
  noNextVideo?: boolean
}
export const StyledChannelLink = styled(ChannelLink)<StyledChannelLinkProps>`
  margin-top: ${sizes(4)};

  span {
    ${({ noNextVideo }) => noNextVideo && `font-size: ${sizes(10)}`};
    ${({ noNextVideo }) => noNextVideo && `height: ${sizes(12)}`};

    margin-left: ${sizes(3)};
  }
`
export const CountDownWrapper = styled.div`
  position: relative;
  margin-top: ${sizes(6)};
  width: ${sizes(14)};
  height: ${sizes(14)};
`

export const StyledCircularProgressBar = styled(CircularProgressbar)`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const CountDownButton = styled(ControlButton)`
  /* we need important, because video.js is setting this value to inline-block */
  display: flex !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${sizes(10)};
  height: ${sizes(10)};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
`

export const RestartButton = styled(Button)`
  margin-top: ${sizes(12)};
`
