import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { ChannelLink } from '@/components/ChannelLink'
import { breakpoints, colors, media, sizes, zIndex } from '@/shared/theme'

import { Button } from '../Button'
import { CircularProgressbar } from '../CircularProgressbar'
import { IconButton } from '../IconButton'
import { Text } from '../Text'

type OverlayBackgroundProps = {
  thumbnail?: string | null
}

export const OverlayBackground = styled.div<OverlayBackgroundProps>`
  position: absolute;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  background-image: ${({ thumbnail }) =>
    `linear-gradient(to right, ${colors.transparentBlack[86]}, ${colors.transparentBlack[86]}), url(${thumbnail}) `};
  background-size: cover;
  height: 100%;
`

type InnerContainerProps = {
  isFullScreen?: boolean
}

export const InnerContainer = styled.div<InnerContainerProps>`
  padding: ${sizes(6)};
  height: calc(100% - 76px);
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${({ isFullScreen }) => (isFullScreen ? 'center' : 'unset')};
  align-items: center;

  ${media.compact} {
    justify-content: center;
  }

  ${media.small} {
    flex-direction: column;
  }
`

export const VideoInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Heading = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: sizes(6), toSize: sizes(8) }, breakpoints.base, breakpoints.large)};

  margin-top: ${sizes(4)};
  flex-shrink: 0;
  max-width: 560px;
  word-break: break-all;
  width: 100%;
  text-align: center;
`

type StyledChannelLinkProps = {
  noNextVideo?: boolean
}
export const StyledChannelLink = styled(ChannelLink)<StyledChannelLinkProps>`
  flex-shrink: 0;
  margin-top: ${({ noNextVideo }) => (noNextVideo ? sizes(2) : sizes(4))};

  span {
    ${({ noNextVideo }) => noNextVideo && `font-size: ${sizes(10)}`};

    display: flex;
    align-items: center;
    margin-left: ${sizes(2)};
    ${media.small} {
      margin-left: ${sizes(3)};
    }
  }
`
export const CountDownWrapper = styled.div`
  flex-shrink: 0;
  margin: ${sizes(6)} ${sizes(4)};
  position: relative;
  display: flex;
  height: ${sizes(14)};
  justify-content: center;
  align-items: center;
`

export const StyledCircularProgressBar = styled(CircularProgressbar)`
  width: ${sizes(14)};
  height: ${sizes(14)};
`

export const CountDownButton = styled(IconButton)`
  /* we need important, because video.js is setting this value to inline-block */
  display: block !important;
  position: absolute;
  width: ${sizes(10)};
  height: ${sizes(10)};

  svg {
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
`

export const RestartButton = styled(Button)`
  margin-top: ${sizes(12)};
`
