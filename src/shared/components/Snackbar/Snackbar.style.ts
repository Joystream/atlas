import { colors, sizes, typography } from '@/shared/theme'
import styled from '@emotion/styled'

export const SnackbarWrapper = styled.div`
  background-color: ${colors.gray[800]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(3)} ${sizes(3)} ${sizes(3)} ${sizes(6)};
  max-width: 430px;
`

export const SnackbarButton = styled.button`
  border: none;
  background: none;
  color: ${colors.gray[300]};
  padding: ${sizes(3)};
  cursor: pointer;
`

export const SnackbarParagraph = styled.p`
  margin: 0;
  font-size: ${typography.sizes.body2};
  color: ${colors.white};
  display: flex;
  align-items: center;

  svg {
    margin-right: ${sizes(4)};
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
`
