import styled from '@emotion/styled'
import { IconButton } from '@/shared/components'
import { colors, sizes, media } from '@/shared/theme'

export const StyledContainer = styled.div`
  --dialog-padding: ${sizes(4)};
  ${media.small} {
    --dialog-padding: ${sizes(6)};
  }

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
