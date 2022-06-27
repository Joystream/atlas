import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { IconWrapper } from '@/components/_icons/IconWrapper'
import { Modal } from '@/components/_overlays/Modal'
import { cVar, sizes, square, transitions } from '@/styles'

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
  background-color: ${cVar('colorCoreNeutral800')};
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
  background-color: ${cVar('colorCoreNeutral700')};
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
    background-color: ${cVar('colorCoreNeutral500')};
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

export const WalletInfoWrapper = styled.div`
  ${square('100%')};

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const StyledIconWrapper = styled(IconWrapper)`
  margin-bottom: ${sizes(6)};
`

export const WalletLogo = styled.img`
  width: 24px;
  height: 24px;
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
  background-color: ${cVar('colorCoreBlue500')};
  border-radius: 50%;
  opacity: 0;
  animation: ${zoomOut} 600ms ${transitions.easing} 1 100ms forwards;
`
