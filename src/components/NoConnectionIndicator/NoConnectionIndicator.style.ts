import { colors, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'

export const IndicatorWrapper = styled.div`
  position: fixed;
  top: 100px;
  z-index: ${zIndex.globalOverlay};
  margin: 0 auto;
  right: 30px;
  background-color: ${colors.error};
  border-radius: 2px;
  padding: 8px 12px;
  color: white;
`
