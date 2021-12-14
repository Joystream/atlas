import styled from '@emotion/styled'

import { cVar, zIndex } from '@/styles'

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0 0 0 / 0.4);
  transition: opacity 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
`

type ModalContentProps = {
  noBoxShadow?: boolean
}

export const ModalContent = styled.div<ModalContentProps>`
  display: flex;
  z-index: ${zIndex.globalOverlay};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
  max-width: 90vw;
  overflow: hidden;
  ${({ noBoxShadow }) =>
    !noBoxShadow && `box-shadow: ${cVar('effectElevation24Layer2')}, ${cVar('effectElevation24Layer1')}`};
`
