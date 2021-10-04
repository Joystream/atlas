import styled from '@emotion/styled'

import { colors, media, sizes, zIndex } from '@/shared/theme'

export const VideoHeroSliderWrapper = styled.div`
  position: absolute;
  margin: ${sizes(4)};
  padding: 0 inherit;
  top: 0;
  left: 0;
  display: grid;
  width: calc(100% - ${sizes(8)});
  height: 100%;
  grid-gap: 8px;
  grid-template-columns: repeat(3, 1fr);
  ${media.sm} {
    bottom: 0;
    z-index: ${zIndex.overlay};
    right: 0;
    padding-bottom: inherit;
    left: unset;
    top: unset;
    margin: auto;
    width: auto;
    height: auto;
  }
`

type VideoSliderThumbnailProps = {
  active?: boolean
}
export const VideoSliderThumbnail = styled.img<VideoSliderThumbnailProps>`
  display: none;
  ${media.sm} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    object-fit: cover;
    transition: opacity 150ms ease-out, transform 150ms ease-out;
    transform: translateY(${({ active }) => (active ? '-8px' : 0)});
    opacity: ${({ active }) => (active ? 1 : 0.5)};
    display: block;
  }
`
export const VideoSliderPreviewWrapper = styled.div`
  position: relative;
  :hover ${VideoSliderThumbnail} {
    opacity: 1;
    transform: translateY(-8px);
  }
  ${media.sm} {
    width: 80px;
    height: 45px;
  }
`

type VideoSliderProgressBarProps = {
  active?: boolean
}

export const VideoSliderProgressBar = styled.div<VideoSliderProgressBarProps>`
  background-color: ${colors.transparentWhite[32]};
  position: absolute;
  height: 4px;
  width: 100%;
  ${media.sm} {
    opacity: ${({ active }) => (active ? 1 : 0)};
    bottom: 0;
    height: 2px;
  }
`

type VideoSliderProgressProps = {
  progress?: number
}

export const VideoSliderProgress = styled.div<VideoSliderProgressProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${colors.gray[200]};
  width: 100%;
  transform-origin: 0 0;
  transform: scaleX(${({ progress = 0 }) => progress / 100});
  transition: transform 125ms ease-in;
`
