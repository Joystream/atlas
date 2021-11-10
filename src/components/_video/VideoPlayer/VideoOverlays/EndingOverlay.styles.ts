import styled from '@emotion/styled'

import { CircularProgress } from '@/components/CircularProgress'
import { Text } from '@/components/Text'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { Button } from '@/components/_inputs/Button'
import { IconButton } from '@/components/_inputs/IconButton'
import { colors, media, sizes, zIndex } from '@/theme'

type OverlayBackgroundProps = {
  thumbnailUrl?: string | null
}

export const OverlayBackground = styled.div<OverlayBackgroundProps>`
  position: absolute;
  display: flex;
  overflow: auto;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  height: 100%;
  background-color: ${colors.gray[900]};
`

type ContainerProps = {
  isFullScreen?: boolean
}

export const Container = styled.div<ContainerProps>`
  height: calc(100% - ${({ isFullScreen }) => (isFullScreen ? '5.5em' : '4.25em')});
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.md} {
    flex-direction: column;
    width: auto;
  }
`

export const InnerContainer = styled.div`
  display: flex;
  overflow-y: auto;
  align-items: center;
  justify-content: center;

  ${media.md} {
    width: 100%;
  }
`

export const VideoInfo = styled.div<{ noNextVideo?: boolean }>`
  overflow: hidden;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ noNextVideo }) => (noNextVideo ? 'center' : 'unset')};

  ${media.md} {
    width: ${({ noNextVideo }) => (noNextVideo ? 'auto' : '320px')};
    margin: unset;
    align-items: unset;
    margin-left: ${({ noNextVideo }) => (noNextVideo ? 0 : sizes(6))};
  }
`

export const SubHeading = styled(Text)`
  text-align: center;
`

export const Heading = styled(Text)`
  margin-top: ${sizes(3)};
  flex-shrink: 0;
  max-width: 560px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  ${media.md} {
    margin-top: ${sizes(2)};
    text-align: left;
  }
`

type StyledChannelLinkProps = {
  noNextVideo?: boolean
}
export const StyledChannelLink = styled(ChannelLink)<StyledChannelLinkProps>`
  flex-shrink: 0;
  display: flex;
  margin-top: ${({ noNextVideo }) => (noNextVideo ? sizes(2) : sizes(3))};
  justify-content: ${({ noNextVideo }) => (noNextVideo ? 'center' : 'unset')};

  ${media.md} {
    margin-top: ${({ noNextVideo }) => (noNextVideo ? sizes(2) : sizes(4))};
  }

  span {
    font-size: ${({ noNextVideo }) => (noNextVideo ? sizes(5) : '14px')};
    display: flex;
    align-items: center;
    margin-left: ${sizes(2)};

    ${media.md} {
      font-size: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(4))};
      margin-left: ${sizes(3)};
    }
  }

  div {
    width: ${sizes(6)};
    height: ${sizes(6)};
    min-width: ${sizes(6)};

    ${media.md} {
      margin-right: ${sizes(1)};
      width: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
      height: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
      min-width: ${({ noNextVideo }) => (noNextVideo ? sizes(10) : sizes(8))};
    }
  }
`
export const CountDownWrapper = styled.div`
  flex-shrink: 0;
  margin-right: ${sizes(8)};
  margin-left: ${sizes(4)};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 4.25em);

  ${media.md} {
    margin: ${sizes(6)} ${sizes(4)};
    height: ${sizes(14)};
  }
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
  align-self: center;

  ${media.md} {
    margin-top: ${sizes(12)};
  }
`

export const VideoThumbnail = styled.img`
  width: 320px;
  display: none;

  ${media.md} {
    display: block;
  }
`
