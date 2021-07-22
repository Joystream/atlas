import styled from '@emotion/styled'

import { colors } from '@/shared/theme'

export const OverlayBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.transparentBlack[54]};
  display: flex;
  background-size: cover;
  justify-content: center;
  align-items: center;
`
