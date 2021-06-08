import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { darken, fluidRange } from 'polished'

import { Button, IconButton, Placeholder, Text } from '@/shared/components'
import { breakpoints, colors, sizes, media } from '@/shared/theme'

import ChannelLink from '../ChannelLink'

const CONTENT_OVERLAP_MAP = {
  SMALL: 25,
  MEDIUM: 150,
  LARGE: 200,
  XLARGE: 400,
  XXLARGE: 600,
}
const GRADIENT_OVERLAP = 50
const GRADIENT_HEIGHT = 250
const INFO_BOTTOM_MARGIN = 100
const BUTTONS_HEIGHT_PX = '54px'

export const Container = styled.section`
  position: relative;

  // because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
  // so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin
  ${media.small} {
    margin-bottom: -${CONTENT_OVERLAP_MAP.SMALL}px;
  }

  ${media.medium} {
    margin-bottom: -${CONTENT_OVERLAP_MAP.MEDIUM}px;
  }

  ${media.large} {
    margin-bottom: -${CONTENT_OVERLAP_MAP.LARGE}px;
  }

  ${media.xlarge} {
    margin-bottom: -${CONTENT_OVERLAP_MAP.XLARGE}px;
  }

  ${media.xxlarge} {
    margin-bottom: -${CONTENT_OVERLAP_MAP.XXLARGE}px;
  }
`

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  width: calc(100% + calc(2 * var(--global-horizontal-padding)));
`

export const Media = styled.div`
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  position: relative;
`

const absoluteMediaCss = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const PlayerContainer = styled.div`
  ${absoluteMediaCss};
`

const pulse = keyframes`
  0, 100% { 
    background-color: ${colors.gray[800]}
  }
  50% {
    background-color: ${darken(0.15, colors.gray[800])}
  }
`

export const PlayerPlaceholder = styled.div`
  ${absoluteMediaCss};
  background-color: ${colors.gray[800]};
  animation: ${pulse} 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`

export const HorizontalGradientOverlay = styled.div`
  ${absoluteMediaCss};
  display: none;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 11.76%, rgba(0, 0, 0, 0) 100%);

  ${media.small} {
    display: block;
  }
`

export const VerticalGradientOverlay = styled.div`
  ${absoluteMediaCss};

  // as the content overlaps the media more and more as the viewport width grows, we need to hide some part of the media with a gradient
  // this helps with keeping a consistent background behind a page content - we don't want the media to peek out in the content spacing
  background: linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0) ${GRADIENT_HEIGHT / 2}px);

  ${media.small} {
    background: linear-gradient(
      0deg,
      black 0%,
      black ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP}px,
      rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
    );
  }

  ${media.medium} {
    background: linear-gradient(
      0deg,
      black 0%,
      black ${CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP}px,
      rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
    );
  }

  ${media.large} {
    background: linear-gradient(
      0deg,
      black 0%,
      black ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP}px,
      rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
    );
  }

  ${media.xlarge} {
    background: linear-gradient(
      0deg,
      black 0%,
      black ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP}px,
      rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
    );
  }

  ${media.xxlarge} {
    background: linear-gradient(
      0deg,
      black 0%,
      black ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP}px,
      rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
    );
  }
`

export const InfoContainer = styled.div<{ isLoading: boolean }>`
  position: relative;
  margin-top: -${sizes(8)};
  padding-bottom: ${sizes(12)};

  ${media.small} {
    position: absolute;
    margin: 0;
    padding-bottom: 0;
    bottom: ${CONTENT_OVERLAP_MAP.SMALL + INFO_BOTTOM_MARGIN / 4}px;
  }

  ${media.medium} {
    bottom: ${CONTENT_OVERLAP_MAP.MEDIUM + INFO_BOTTOM_MARGIN / 2}px;
  }

  ${media.large} {
    bottom: ${CONTENT_OVERLAP_MAP.LARGE + INFO_BOTTOM_MARGIN}px;
  }

  ${media.xlarge} {
    bottom: ${CONTENT_OVERLAP_MAP.XLARGE + INFO_BOTTOM_MARGIN}px;
  }

  ${media.xxlarge} {
    bottom: ${CONTENT_OVERLAP_MAP.XXLARGE + INFO_BOTTOM_MARGIN}px;
  }
`

export const StyledChannelLink = styled(ChannelLink)`
  margin-bottom: ${sizes(4)};
`

export const TitleContainer = styled.div`
  a {
    text-decoration: none;
  }
  margin-bottom: ${sizes(8)};

  ${media.medium} {
    margin-bottom: ${sizes(10)};
  }

  span {
    display: block;
    max-width: 40ch;
    ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '22px' }, breakpoints.base, breakpoints.xlarge)};
    ${fluidRange({ prop: 'lineHeight', fromSize: '20px', toSize: '26px' }, breakpoints.base, breakpoints.xlarge)};
    color: ${colors.white};
  }
`

export const Title = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '40px', toSize: '72px' }, breakpoints.base, breakpoints.xlarge)};
  ${fluidRange({ prop: 'lineHeight', fromSize: '48px', toSize: '68px' }, breakpoints.base, breakpoints.xlarge)};

  display: inline-block;
  margin-bottom: ${sizes(4)};

  ${media.medium} {
    margin-bottom: ${sizes(5)};
  }
`

export const TitlePlaceholder = styled(Placeholder)`
  margin-bottom: ${sizes(4)};

  ${media.medium} {
    margin-bottom: ${sizes(5)};
  }
`

export const ControlsContainer = styled.div`
  min-height: ${BUTTONS_HEIGHT_PX};
`

export const ButtonsContainer = styled.div`
  display: flex;
`

export const PlayButton = styled(Button)`
  width: 140px;
  height: ${BUTTONS_HEIGHT_PX};
`

export const SoundButton = styled(IconButton)`
  margin-left: ${sizes(4)};
  height: ${BUTTONS_HEIGHT_PX};
  width: ${BUTTONS_HEIGHT_PX};
`
