import styled from '@emotion/styled'

import { media, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { IconButton } from '../IconButton'
import { Text } from '../Text'

export const CONTENT_OVERLAP_MAP = {
  BASE: 0,
  SMALL: 0,
  MEDIUM: 0,
  LARGE: 100,
  XLARGE: 200,
  XXLARGE: 300,
}
const GRADIENT_OVERLAP = 50
const GRADIENT_HEIGHT = 100

type CoverImageProps = {
  src: string
}

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  width: calc(100% + calc(2 * var(--global-horizontal-padding)));
  position: relative;
`

export const Media = styled.div`
  width: 100%;
  height: 0;
  padding-top: 25%;
  position: relative;
  z-index: ${zIndex.background};
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

  /* as the content overlaps the media more and more as the viewport width grows, we need to hide some part of the media with a gradient
   this helps with keeping a consistent background behind a page content - we don't want the media to peek out in the content spacing */
  background-image: linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0) ${GRADIENT_HEIGHT / 4}px), url(${({ src }) => src});

  ${media.small} {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${Math.min(CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP, 0)}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.SMALL - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }

  ${media.medium} {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${Math.min(CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP, 0)}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.MEDIUM - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }

  ${media.large} {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.LARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }

  ${media.xlarge} {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }

  ${media.xxlarge} {
    background-image: linear-gradient(
        0deg,
        black 0%,
        black ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP}px,
        rgba(0, 0, 0, 0) ${CONTENT_OVERLAP_MAP.XXLARGE - GRADIENT_OVERLAP + GRADIENT_HEIGHT}px
      ),
      url(${({ src }) => src});
  }
`

export const CoverWrapper = styled.div`
  position: relative;

  /* because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
   so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin */
  margin-bottom: -${CONTENT_OVERLAP_MAP.BASE}px;
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

export const EditableControls = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

  ${media.medium} {
    background-color: ${colors.transparentBlack[54]};
    opacity: 0;

    :hover {
      opacity: 1;
    }
  }

  ${media.xlarge} {
    height: 80%;
  }
`

export const EditCoverDesktopOverlay = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${colors.gray[200]};
  display: none;

  ${media.medium} {
    display: flex;
    cursor: pointer;
  }
`

export const EditCoverMobileButton = styled(IconButton)`
  position: absolute;
  left: var(--global-horizontal-padding);
  top: ${sizes(1)};
  background-color: ${colors.gray[800]};

  &:hover {
    background-color: ${colors.transparentBlack[54]};
  }
  ${media.medium} {
    display: none;
  }
`

export const EditButtonMessage = styled(Text)`
  font-weight: 700;
  font-family: ${typography.fonts.headers};
  line-height: 1;
  color: ${colors.gray[100]};
  margin-top: ${sizes(1)};
`

export const FailedUploadContainer = styled.div`
  position: absolute;
  top: ${sizes(16)};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`
