import styled from '@emotion/styled'

import { colors } from '@/shared/theme'

export const VideoHeroSliderWrapper = styled.div`
  position: absolute;
  right: var(--global-horizontal-padding);
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(3, auto);
`

type VideoSliderThumbnailProps = {
  active?: boolean
}
export const VideoSliderThumbnail = styled.img<VideoSliderThumbnailProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  transform: translateY(${({ active }) => (active ? '-8px' : 0)});
  transition: opacity 150ms ease-out, transform 150ms ease-out;
`
export const VideoSliderPreviewWrapper = styled.div`
  width: 80px;
  height: 45px;
  position: relative;
  :hover ${VideoSliderThumbnail} {
    opacity: 1;
    transform: translateY(-8px);
  }
`

type VideoSliderProgressBarProps = {
  active?: boolean
}

export const VideoSliderProgressBar = styled.div<VideoSliderProgressBarProps>`
  opacity: ${({ active }) => (active ? 1 : 0)};
  position: absolute;
  bottom: 0;
  background-color: ${colors.transparentWhite[32]};
  height: 2px;
  width: 80px; /* temporary */
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
