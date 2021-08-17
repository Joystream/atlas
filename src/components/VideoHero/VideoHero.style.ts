import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Button, IconButton, SkeletonLoader, Text } from '@/shared/components'
import { colors, media, sizes, typography } from '@/shared/theme'

import { ChannelLink } from '../ChannelLink'

const CONTENT_OVERLAP_MAP = {
  SMALL: 24,
  MEDIUM: 24,
  LARGE: 24,
  XLARGE: 24,
  XXLARGE: 24,
}

export const Container = styled.section`
  position: relative;
  max-height: 100vh;

  /* because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
   so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin */
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

  /* 2:1 ratio */
  padding-top: 50%;
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

export const VerticalGradientOverlay = styled.div`
  ${absoluteMediaCss};

  background: linear-gradient(180deg, transparent 50%, ${colors.black} 93.23%, ${colors.black} 100%),
    radial-gradient(50.66% 101.32% at 50% 50%, transparent 0%, ${colors.transparentBlack[32]} 100%),
    ${colors.transparentBlack[32]};
`

export const InfoContainer = styled.div<{ isLoading: boolean }>`
  position: relative;
  padding-bottom: ${sizes(16)};
  width: 100%;

  ${media.small} {
    position: absolute;
    margin: 0;
    padding-bottom: 0;
    bottom: 64px;
  }

  ${media.medium} {
    bottom: 96px;
  }

  ${media.large} {
    bottom: 128px;
  }
`

export const StyledChannelLink = styled(ChannelLink)`
  margin-bottom: ${sizes(4)};
`

export const TitleContainer = styled.div`
  a {
    text-decoration: none;
  }

  margin-bottom: ${sizes(4)};

  ${media.small} {
    margin-bottom: ${sizes(8)};
  }
`

export const Title = styled(Text)`
  font-size: ${typography.sizes.h3};
  line-height: ${typography.lineHeights.h3};

  ${media.large} {
    font-size: ${typography.sizes.h2};
    line-height: ${typography.lineHeights.h2};
  }
`

export const TitleSkeletonLoader = styled(SkeletonLoader)`
  margin-bottom: ${sizes(4)};

  ${media.medium} {
    margin-bottom: ${sizes(5)};
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
`

export const PlayButton = styled(Button)`
  width: 140px;
`

export const SoundButton = styled(IconButton)`
  margin-left: ${sizes(4)};
`
