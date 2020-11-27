import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import { Avatar, Placeholder } from '@/shared/components'
import { breakpoints, colors, sizes } from '@/shared/theme'
import { css } from '@emotion/core'

const SM_TITLE_HEIGHT = '48px'
const TITLE_HEIGHT = '56px'

const CONTENT_OVERLAP_MAP = {
  BASE: 0,
  SMALL: 50,
  MEDIUM: 350,
  LARGE: 500,
  XLARGE: 600,
  XXLARGE: 800,
}
const GRADIENT_OVERLAP = 150
const GRADIENT_HEIGHT = 250
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
    padding-bottom: 0;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.MEDIUM}px;
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

export const CoverImage = styled.div<CoverImageProps>`
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: local;
  background-size: cover;

  // as the content overlaps the media more and more as the viewport width grows, we need to hide some part of the media with a gradient
  // this helps with keeping a consistent background behind a page content - we don't want the media to peek out in the content spacing
  background-image: linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0) ${GRADIENT_HEIGHT / 2}px), url(${({ src }) => src});
  @media screen and (min-width: ${breakpoints.small}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP}px,
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
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: start;
  @media (min-width: ${breakpoints.small}) {
    flex-direction: row;
    align-items: center;
  }

  width: 100%;

  bottom: ${CONTENT_OVERLAP_MAP.BASE + INFO_BOTTOM_MARGIN / 2}px;
  @media screen and (min-width: ${breakpoints.small}) {
    bottom: ${CONTENT_OVERLAP_MAP.SMALL + INFO_BOTTOM_MARGIN}px;
  }

  @media screen and (min-width: ${breakpoints.medium}) {
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

export const Title = styled.h1`
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  font-weight: bold;
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
    width: 136px;
    min-width: 136px;
    height: 136px;
    margin: 0 ${sizes(6)} 0 0;
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
