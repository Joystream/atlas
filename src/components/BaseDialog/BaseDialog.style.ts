import styled from '@emotion/styled'

import { IconButton } from '@/shared/components/IconButton'
import { colors, media, sizes, zIndex } from '@/shared/theme'

export const DialogBackDrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
`

export const StyledContainer = styled.div`
  display: grid;
  --dialog-padding: ${sizes(4)};
  ${media.sm} {
    --dialog-padding: ${sizes(6)};
  }

  z-index: ${zIndex.globalOverlay};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 440px;
  min-height: 150px;
  max-height: 75vh;
  overflow: auto;
  color: ${colors.white};
  background-color: ${colors.gray[700]};
  padding: var(--dialog-padding);
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.12), 0 24px 40px rgba(0, 0, 0, 0.16);
`

export const StyledExitButton = styled(IconButton)`
  position: absolute;
  top: var(--dialog-padding);
  right: var(--dialog-padding);
`
