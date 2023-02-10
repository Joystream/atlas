import styled from '@emotion/styled'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes, zIndex } from '@/styles'

type VideoHeroSliderWrapperProps = {
  columnsNumber?: number
}

export const VideoHeroSliderWrapper = styled.div<VideoHeroSliderWrapperProps>`
  position: absolute;
  margin: ${sizes(4)};
  top: 0;
  left: 0;
  display: grid;
  width: calc(100% - ${sizes(8)});
  height: 100%;
  grid-gap: ${sizes(2)};
  grid-template-columns: repeat(${({ columnsNumber = 0 }) => columnsNumber}, 1fr);
  ${media.sm} {
    bottom: 0;
    z-index: ${zIndex.overlay};
    right: 0;
    padding: inherit;
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
  background-color: ${cVar('colorCoreNeutral400Lighten')};
  position: absolute;
  height: 4px;
  width: 100%;
  opacity: ${({ active }) => (active ? 1 : 0.25)};
  ${media.sm} {
    opacity: ${({ active }) => (active ? 1 : 0)};
    bottom: 0;
    height: 2px;
  }
`

export const VideoSliderProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${cVar('colorCoreNeutral200')};
  width: 100%;
  transform-origin: 0 0;
  transition: transform 125ms ease-in;
`

export const ThumbnailSkeletonLoader = styled(SkeletonLoader)<VideoSliderProgressBarProps>`
  transform: translateY(${({ active }) => (active ? '-8px' : 0)});
`
