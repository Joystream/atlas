import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { ChannelLink } from '@/components/ChannelLink'
import { breakpoints, colors, media, sizes, zIndex } from '@/shared/theme'

import { Button } from '../../Button'
import { CircularProgress } from '../../CircularProgress'
import { IconButton } from '../../IconButton'
import { Text } from '../../Text'

type OverlayBackgroundProps = {
  thumbnailUrl?: string | null
}

export const OverlayBackground = styled.div<OverlayBackgroundProps>`
  position: absolute;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  background-image: ${({ thumbnailUrl }) =>
    `linear-gradient(to right, ${colors.transparentBlack[86]}, ${colors.transparentBlack[86]}), url(${thumbnailUrl}) `};
  background-size: cover;
  height: 100%;
`

type InnerContainerProps = {
  isFullScreen?: boolean
}

export const InnerContainer = styled.div<InnerContainerProps>`
  padding: ${sizes(4)};
  height: calc(100% - ${({ isFullScreen }) => (isFullScreen ? '5.5em' : '4.25em')});
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${media.small} {
    flex-direction: column;
    padding: ${sizes(6)};
  }
`

export const VideoInfo = styled.div`
  overflow: hidden;
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.small} {
    margin: unset;
  }
`

export const SubHeading = styled(Text)`
  text-align: center;
`

export const Heading = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: sizes(6), toSize: sizes(8) }, breakpoints.xxs, breakpoints.lg)};

  margin-top: ${sizes(4)};
  flex-shrink: 0;
  max-width: 560px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
`

type StyledChannelLinkProps = {
  noNextVideo?: boolean
}
export const StyledChannelLink = styled(ChannelLink)<StyledChannelLinkProps>`
  flex-shrink: 0;
  margin-top: ${({ noNextVideo }) => (noNextVideo ? sizes(2) : sizes(4))};

  ${media.small} {
    margin-top: ${({ noNextVideo }) => (noNextVideo ? sizes(2) : sizes(3))};
  }

  span {
    font-size: ${({ noNextVideo }) => (noNextVideo ? sizes(5) : '14px')};
    display: flex;
    align-items: center;
    margin-left: ${sizes(2)};
    ${media.small} {
      font-size: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(4))};
      margin-left: ${sizes(3)};
    }
  }

  div {
    width: ${sizes(6)};
    height: ${sizes(6)};
    min-width: ${sizes(6)};
    ${media.small} {
      width: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
      height: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
      min-width: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
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

export const StyledCircularProgress = styled(CircularProgress)`
  width: ${sizes(14)};
  height: ${sizes(14)};
`

export const CountDownButton = styled(IconButton)`
  display: block;
  position: absolute;
  width: ${sizes(10)};
  height: ${sizes(10)};

  svg {
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
`

export const RestartButton = styled(Button)`
  margin-top: ${sizes(6)};
  ${media.small} {
    margin-top: ${sizes(12)};
  }
`
