import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { ExpandButton } from '@/shared/components/ExpandButton'
import { colors, sizes, transitions } from '@/shared/theme'

import { UploadStatusGroupSize } from './UploadStatusGroup'

type ProgressbarProps = {
  progress: number
  isProcessing?: boolean
  isCompleted?: boolean
}

type UploadStatusGroupProps = {
  isActive?: boolean
}

type DrawerProps = {
  maxHeight?: number
} & UploadStatusGroupProps

export const Container = styled.div`
  position: relative;
  margin-bottom: ${sizes(6)};
`

export const UploadStatusGroupContainer = styled.div<UploadStatusGroupProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  width: 100%;
  height: ${sizes(20)};
  background-color: ${colors.gray[900]};
  cursor: pointer;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
`

const greenBarAnimation = keyframes`
   0% {
    opacity: 0.2;
    background-color: ${colors.secondary.success[100]};
    transform: scaleX(0);
  }
  75% {
    transform: scaleX(1);
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
`

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2
  }
  100% {
    opacity: 1;
  }
`

const completedAnimationCss = (props: ProgressbarProps) => {
  if (props.isProcessing) {
    return css`
      animation: ${pulseAnimation} 2.5s infinite ease-in-out;
    `
  }
  if (props.isCompleted) {
    return css`
      opacity: 0;
      animation: ${greenBarAnimation} 400ms ease-out;
      animation-iteration-count: 1;
    `
  }
  return null
}

export const ProgressBar = styled.div<ProgressbarProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.gray[800]};
  transform-origin: 0 0;
  transform: scaleX(${({ progress }) => progress && `${progress / 100}`});
  transition: transform 1s linear;

  ${completedAnimationCss}
`

export const BottomProgressBar = styled.div<ProgressbarProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transform-origin: 0 0;
  transform: scaleX(${({ progress }) => progress && `${progress / 100}`});
  transition: transform 1s linear;
  background-color: ${colors.blue[500]};
  height: 4px;
`

type ThumbnailProps = {
  size?: UploadStatusGroupSize
}

export const Thumbnail = styled.div<ThumbnailProps>`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray[700]};
  height: ${sizes(12)};

  ${({ size }) => {
    if (size === 'compact') {
      return css`
        width: ${sizes(12)};
      `
    }
    if (size === 'large') {
      return css`
        width: ${sizes(18)};
      `
    }
  }};
`
export const AssetsInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${sizes(4)};
  height: ${sizes(12)};
  color: ${colors.gray[300]};
`

export const UploadInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-left: auto;
  width: fit-content;
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  text-align: right;
`

export const StyledExpandButton = styled(ExpandButton)`
  margin-left: ${sizes(4)};
`

export const AssetsDrawerContainer = styled.div<DrawerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 100%;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  background-color: ${colors.gray[800]};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
