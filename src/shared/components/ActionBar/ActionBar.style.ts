import styled from '@emotion/styled'
import { breakpoints, colors, sizes, transitions, typography } from '@/shared/theme'
import { Text, Button } from '@/shared/components'

export const StyledActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: ${colors.gray[800]};
  padding: ${sizes(3)} ${sizes(8)};
`

export const StyledTextContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: ${sizes(1)};
  width: 280px;
`

export const StyledPrimaryText = styled(Text)`
  color: ${colors.white};
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.h5};
  font-weight: ${typography.weights.bold};
  letter-spacing: ${sizes(0.5)};
`

export const StyledSecondaryText = styled(Text)`
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  line-height: 20px;
`

export const StyledButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`

export const StyledSecondaryButton = styled(Button)`
  border: none;
  background-color: ${colors.transparent};
  &:hover {
    color: ${colors.gray[300]};
  }
`
