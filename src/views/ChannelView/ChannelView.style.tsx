import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import { Avatar, Placeholder, Text } from '@/shared/components'
import { breakpoints, colors, sizes, zIndex } from '@/shared/theme'
import { ReactComponent as BgPattern } from '@/assets/bg-pattern.svg'
import { css } from '@emotion/core'

const SM_TITLE_HEIGHT = '48px'
const TITLE_HEIGHT = '56px'

const CONTENT_OVERLAP_MAP = {
  BASE: 0,
  SMALL: 0,
  MEDIUM: 0,
  LARGE: 100,
  XLARGE: 200,
  XXLARGE: 300,
}
const GRADIENT_OVERLAP = 50
const GRADIENT_HEIGHT = 100
const INFO_BOTTOM_MARGIN = 75

type CoverImageProps = {
  src: string
}

export const Header = styled.section`
  position: relative;
  padding-bottom: 50px;

  // because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
  // so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin
  margin-bottom: -${CONTENT_OVERLAP_MAP.BASE}px;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.SMALL}px;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.MEDIUM}px;
    padding-bottom: 0;
  }
  @media screen and (min-width: ${breakpoints.large}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.LARGE}px;
  }
  @media screen and (min-width: ${breakpoints.xlarge}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.XLARGE}px;
  }
  @media screen and (min-width: ${breakpoints.xxlarge}) {
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
  padding-top: 25%;
  position: relative;
  z-index: ${zIndex.background};
`

export const StyledBgPattern = styled(BgPattern)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
`

export const CoverImage = styled.div<CoverImageProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-repeat: no-repeat;
  background-position: center;
  background-attachment: local;
  background-size: cover;

  // as the content overlaps the media more and more as the viewport width grows, we need to hide some part of the media with a gradient
  // this helps with keeping a consistent background behind a page content - we don't want the media to peek out in the content spacing
  background-image: linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0) ${GRADIENT_HEIGHT / 4}px), url(${({ src }) => src});
  @media screen and (min-width: ${breakpoints.small}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${Math.min(CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP, 0)}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${Math.min(CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP, 0)}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
  @media screen and (min-width: ${breakpoints.large}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
  @media screen and (min-width: ${breakpoints.xlarge}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
  @media screen and (min-width: ${breakpoints.xxlarge}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-top: -64px;

  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: -100px;
    flex-direction: row;
    align-items: center;
  }

  @media screen and (min-width: ${breakpoints.medium}) {
    position: absolute;
    margin-top: 0;
    bottom: ${CONTENT_OVERLAP_MAP.MEDIUM + INFO_BOTTOM_MARGIN}px;
  }

  @media screen and (min-width: ${breakpoints.large}) {
    bottom: ${CONTENT_OVERLAP_MAP.LARGE + INFO_BOTTOM_MARGIN}px;
  }

  @media screen and (min-width: ${breakpoints.xlarge}) {
    bottom: ${CONTENT_OVERLAP_MAP.XLARGE + INFO_BOTTOM_MARGIN}px;
  }

  @media screen and (min-width: ${breakpoints.xxlarge}) {
    bottom: ${CONTENT_OVERLAP_MAP.XXLARGE + INFO_BOTTOM_MARGIN}px;
  }
`
export const TitleContainer = styled.div`
  max-width: 100%;
  @media screen and (min-width: ${breakpoints.medium}) {
    max-width: 60%;
  }
  background-color: ${colors.gray[800]};
  padding: 0 ${sizes(2)};
`

export const Title = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  margin: -4px 0 0;
  line-height: ${SM_TITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    line-height: ${TITLE_HEIGHT};
  }

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const VideoSection = styled.section`
  position: relative;
`

const avatarCss = css`
  width: 128px;
  min-width: 128px;
  height: 128px;
  margin-bottom: ${sizes(3)};

  @media (min-width: ${breakpoints.small}) {
    margin: 0 ${sizes(6)} 0 0;
  }

  @media (min-width: ${breakpoints.medium}) {
    width: 136px;
    min-width: 136px;
    height: 136px;
  }
`

export const StyledAvatar = styled(Avatar)`
  ${avatarCss};
`

export const AvatarPlaceholder = styled(Placeholder)`
  ${avatarCss};
  border-radius: 100%;
`

export const TitlePlaceholder = styled(Placeholder)`
  width: 300px;
  height: ${SM_TITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    height: ${TITLE_HEIGHT};
  }
`
