import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Loader } from '@/components/Loader'
import { SvgAlertSuccess } from '@/components/_icons'
import { colors, sizes } from '@/theme'

export const UploadProgressBarContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.gray[900]};
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

type ProgressbarProps = {
  progress: number
  isProcessing?: boolean
  runCompletedAnimation?: boolean
  isCompleted?: boolean
}
const completedAnimationCss = (props: ProgressbarProps) => {
  if (props.isProcessing) {
    return css`
      animation: ${pulseAnimation} 2.5s infinite ease-in-out;
    `
  }
  if (props.runCompletedAnimation) {
    return css`
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
  transform: scaleX(${({ progress }) => `${progress / 100}`});
  transition: transform 1s linear;
  ${completedAnimationCss}

  ${({ isCompleted }) => isCompleted && `opacity: 0.2`};
`

export const BottomProgressBar = styled.div<ProgressbarProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transform-origin: 0 0;
  transform: scaleX(${({ progress }) => `${progress / 100}`});
  transition: transform 1s linear;
  background-color: ${colors.blue[500]};
  height: 4px;
`

export const StyledLoader = styled(Loader)`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`
export const StyledSvgAlertSuccess = styled(SvgAlertSuccess)`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`
