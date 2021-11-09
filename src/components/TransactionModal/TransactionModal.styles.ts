import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import Lottie from 'react-lottie-player'

import { Spinner } from '@/components/Spinner'
import { SvgPolkadotLogo } from '@/components/icons'
import { Modal } from '@/components/overlays/Modal'
import { cVar } from '@/styles'
import { colors, sizes, square, transitions } from '@/theme'

type StepProps = {
  isActive?: boolean
  past?: boolean
  loop?: boolean
}

const slideAndFadeIn = (loop?: boolean) => keyframes`
  0% {
  width: ${loop ? 0 : '100%'};
  opacity: 1;
}

50% {
  width: 100%;
  opacity: 1;
}

100% {
  width: 100%;
  opacity: 0;
}
`

const zoomOut = keyframes`
  from {
    opacity: 0;
    transform: scale(2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

export const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  background-color: ${colors.gray[800]};
`

export const StepsBar = styled.div`
  padding: ${sizes(2)};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  grid-gap: ${sizes(2)};
  width: 100%;
  height: 24px;
`

export const Step = styled.div<StepProps>`
  position: relative;
  background-color: ${colors.gray[700]};
  height: 100%;
  transition: background-color ${transitions.timings.regular} ${transitions.easing};

  &::after {
    content: '';
    height: 100%;
    position: absolute;
    display: ${({ isActive, past }) => (isActive || past ? 'block' : 'none')};
    animation-name: ${({ isActive, past, loop }) => (isActive && !past ? slideAndFadeIn(loop) : 'unset')};
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0, 0, 0.3, 1);
    animation-duration: 2s;
    background-color: ${colors.gray[500]};
    width: 100%;
  }
`

export const StyledTransactionIllustration = styled.div`
  height: 264px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`

export const StyledSpinner = styled(Spinner)`
  position: absolute;
  top: ${sizes(8)};
  left: ${sizes(6)};
`

export const StyledLottie = styled(Lottie, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: { width: number; height: number } }>`
  width: ${({ size }) => (size ? `${size.width}px` : 'auto')};
  height: ${({ size }) => (size ? `${size.height}px` : 'auto')};
`

export const PolkadotLogoWrapper = styled.div`
  ${square('100%')};

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const StyledPolkadotLogo = styled(SvgPolkadotLogo)`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${sizes(6)};
`

export const SuccessBackground = styled.div`
  ${square('100%')};

  position: absolute;
  background: ${cVar('colorCoreBlue500')};
  opacity: 0.2;
`

export const SuccessWrapper = styled.div`
  ${square('100%')};

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SuccessIcon = styled.div`
  ${square(48)};

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.blue[500]};
  border-radius: 50%;
  opacity: 0;
  animation: ${zoomOut} 600ms ${transitions.easing} 1 100ms forwards;
`
