import styled from '@emotion/styled'
import { IconButton } from '@/shared/components'
import { colors, sizes, media, zIndex } from '@/shared/theme'

export const DialogBackDrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0, 0, 0, 0.4);
`

export const StyledContainer = styled.div`
  z-index: ${zIndex.globalOverlay};
  --dialog-padding: ${sizes(4)};
  ${media.small} {
    --dialog-padding: ${sizes(6)};
  }

  position: relative;
  width: 90%;
  max-width: 440px;
  min-height: 150px;
  max-height: 75vh;
  overflow: auto;
  margin: ${sizes(16)} auto;
  color: ${colors.white};
  background-color: ${colors.gray[700]};
  padding: var(--dialog-padding);
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.12), 0 24px 40px rgba(0, 0, 0, 0.16);

  ${media.medium} {
    margin: ${sizes(32)} auto;
  }
`

export const StyledExitButton = styled(IconButton)`
  position: absolute;
  top: var(--dialog-padding);
  right: var(--dialog-padding);
`
