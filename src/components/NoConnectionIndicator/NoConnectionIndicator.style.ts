import { Text } from '@/shared/components'
import { colors, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'

export const TextWrapper = styled.div`
  margin-left: ${sizes(4)};
`

export const StyledTitle = styled(Text)`
  color: ${colors.gray[50]};
`
export const StyledSubTitle = styled(Text)`
  color: ${colors.gray[300]};
`

export const IndicatorWrapper = styled.div`
  align-items: center;
  width: 100%;
  max-width: 500px;
  display: flex;
  position: fixed;
  top: 90px;
  z-index: ${zIndex.nearOverlay};
  background-color: ${colors.gray[900]};
  border-left: 7px solid ${colors.error};
  padding: 14px 24px;
  color: white;
  left: var(--sidenav-collapsed-width);
  margin-left: 12px;
`
