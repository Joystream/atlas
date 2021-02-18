import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type CoverImageProps = {
  src: string
}

type EditableControlsProps = {
  withImage?: boolean
}

const CONTENT_OVERLAP_MAP = {
  BASE: 0,
  SMALL: 0,
  MEDIUM: 0,
  LARGE: 0,
  XLARGE: 200,
  XXLARGE: 300,
}
const GRADIENT_OVERLAP = 50
const GRADIENT_HEIGHT = 100

export const CoverWrapper = styled.div`
  position: relative;
  padding-bottom: 50px;
  // because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
  // so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin
  margin-bottom: -${CONTENT_OVERLAP_MAP.BASE}px;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.SMALL}px;
    padding-bottom: 0px;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.MEDIUM}px;
  }
  @media screen and (min-width: ${breakpoints.large}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.LARGE}px;
    padding-bottom: 100px;
  }
  @media screen and (min-width: ${breakpoints.xlarge}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.XLARGE}px;
    padding-bottom: 200px;
  }
  @media screen and (min-width: ${breakpoints.xxlarge}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.XXLARGE}px;
  }
`

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  width: calc(100% + calc(2 * var(--global-horizontal-padding)));
  height: 170px;
  position: relative;
  @media screen and (min-width: ${breakpoints.small}) {
    height: 270px;
  }
`

export const Media = styled.div`
  width: 100%;
  height: 0;
  padding-top: 25%;
  position: relative;
  z-index: ${zIndex.background};
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
`

export const EditableControls = styled.div<EditableControlsProps>`
  z-index: 1;
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  :hover + ${Media} {
    opacity: 0.6;
  }
  :hover button {
    opacity: 1;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: center;
  }
`

const commonButtonStyles = css`
  border: none;
  background: ${colors.gray[800]};
  font-size: ${typography.sizes.subtitle2};
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  color: ${colors.white};
  padding: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    background: none;
  }
`

export const RemoveCoverButton = styled.button`
  ${commonButtonStyles};
  bottom: 0;
  right: ${sizes(5)};
  opacity: 1;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  span {
    margin-left: ${sizes(2)};
  }
  svg {
    width: ${sizes(5)};
    fill: ${colors.white};
  }

  @media screen and (min-width: ${breakpoints.small}) {
    top: ${sizes(4)};
    bottom: initial;
    opacity: 0;
    span {
      margin-left: 10px;
    }
    svg {
      width: ${sizes(4)};
      fill: ${colors.white};
    }
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    right: ${sizes(10)};
    top: ${sizes(9)};
  }
`

export const EditCoverButton = styled.button`
  ${commonButtonStyles};
  bottom: 0px;
  left: ${sizes(5)};
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

  @media screen and (min-width: ${breakpoints.small}) {
    left: initial;
    bottom: initial;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    opacity: 1;
    justify-content: center;
    padding-bottom: 40px;
    color: ${colors.gray[200]};
    opacity: 0;
  }
`

export const EditIconWrapper = styled.span`
  svg {
    margin-right: ${sizes(2)};
    width: ${sizes(4)};
    fill: ${colors.white};
  }
  @media screen and (min-width: ${breakpoints.small}) {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border: 2px solid ${colors.gray[200]};
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 18px;
      margin: 0;
      fill: ${colors.gray[200]};
    }
  }
`

export const EditButtonMessage = styled.span`
  text-align: left;
  line-height: ${sizes(5)};
  .large-viewports {
    display: none;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    width: 160px;
    line-height: ${sizes(5)};
    .large-viewports {
      display: inline;
    }
  }
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
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

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
