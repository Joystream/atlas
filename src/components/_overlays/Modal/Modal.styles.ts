import styled from '@emotion/styled'

import { zIndex } from '@/styles'

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
`

export const ModalContent = styled.div`
  display: flex;
  z-index: ${zIndex.globalOverlay};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.12), 0 24px 40px rgba(0, 0, 0, 0.16);
`
