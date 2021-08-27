import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { IconButton } from '@/shared/components/IconButton'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes, typography } from '@/shared/theme'

import { ChannelLink } from '../ChannelLink'
import { TOP_NAVBAR_HEIGHT } from '../Topbar'

const BUTTONS_HEIGHT = 48

export const Container = styled.section`
  position: relative;
  max-height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);
  margin-bottom: -${sizes(6)}px;
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

  ${media.smalldium} {
    margin-bottom: ${sizes(8)}px;
  }

  ${media.medium} {
    margin-bottom: 0;
  }
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

export const GradientOverlay = styled.div`
  ${absoluteMediaCss};

  background: linear-gradient(180deg, transparent 50%, ${colors.black} 93.23%, ${colors.black} 100%),
    radial-gradient(50.66% 101.32% at 50% 50%, transparent 0%, ${colors.transparentBlack[54]} 100%),
    ${colors.transparentBlack[54]};
`

export const InfoContainer = styled.div`
  position: relative;
  padding-bottom: ${sizes(16)};
  width: 100%;

  ${media.small} {
    margin-bottom: 64px;
    padding-bottom: 0;
  }

  ${media.smalldium} {
    position: absolute;
    margin: 0;
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
  min-height: 80px;

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
  width: 90%;
  margin-bottom: ${sizes(2)};

  ${media.compact} {
    width: 380px;
  }

  ${media.medium} {
    margin-bottom: ${sizes(3)};
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
`

export const ButtonsSpaceKeeper = styled.div`
  min-height: ${BUTTONS_HEIGHT}px;
`

export const SoundButton = styled(IconButton)`
  margin-left: ${sizes(4)};
`
