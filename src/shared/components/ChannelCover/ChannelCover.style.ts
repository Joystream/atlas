import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Icon from '../Icon'

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

type StyledEditIconProps = {
  variant: 'mobile' | 'desktop'
}

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

export const CoverWrapper = styled.div`
  position: relative;
  // because of the fixed aspect ratio, as the viewport width grows, the media will occupy more height as well
  // so that the media doesn't take too big of a portion of the space, we let the content overlap the media via a negative margin
  margin-bottom: -${CONTENT_OVERLAP_MAP.BASE}px;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-bottom: -${CONTENT_OVERLAP_MAP.SMALL}px;
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

export const EditableControls = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;

  :hover + ${Media} {
    opacity: 0.5;
  }
  :hover button {
    opacity: 1;
  }
`

const commonButtonStyles = css`
  border: none;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 100%;
  height: 32px;
  width: 32px;
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  @media screen and (min-width: ${breakpoints.small}) {
    border-radius: 0;
    background: none;
    font-size: ${typography.sizes.subtitle2};
  }
`

export const RemoveCoverButton = styled.button`
  ${commonButtonStyles};
  top: ${sizes(1)};
  right: var(--global-horizontal-padding);
  opacity: 1;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  span {
    display: none;
  }
  svg {
    width: 14px;
    fill: ${colors.white};
  }

  @media screen and (min-width: ${breakpoints.small}) {
    top: ${sizes(4)};
    bottom: initial;
    opacity: 0;
    width: unset;
    span {
      display: inline;
      margin-left: 10px;
    }
    svg {
      width: ${sizes(4)};
      fill: ${colors.white};
    }
  }
`

export const EditCoverButton = styled.button`
  ${commonButtonStyles};
  top: ${sizes(1)};
  left: var(--global-horizontal-padding);
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  display: flex;
  align-items: center;

  @media screen and (min-width: ${breakpoints.small}) {
    left: initial;
    bottom: initial;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    color: ${colors.gray[200]};
    opacity: 0;
  }
`

export const EditIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
  }
  @media screen and (min-width: ${breakpoints.small}) {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border: 2px solid ${colors.gray[200]};
    border-radius: 100%;
    svg {
    }
  }
`
export const StyledEditIcon = styled(Icon)<StyledEditIconProps>`
  display: ${({ variant }) => (variant === 'mobile' ? 'inline' : 'none')};
  height: 14px;
  @media screen and (min-width: ${breakpoints.small}) {
    display: ${({ variant }) => (variant === 'desktop' ? 'inline' : 'none')};
    width: 18px;
    margin: 0;
    fill: ${colors.gray[200]};
  }
`

export const EditButtonMessage = styled.span`
  display: none;
  @media screen and (min-width: ${breakpoints.small}) {
    text-align: left;
    display: inline;
    width: 160px;
    line-height: ${sizes(5)};
  }
`
