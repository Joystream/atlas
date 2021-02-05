import { colors, sizes, typography, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'

const SNACKBAR_POSITION = 34

export const SnackbarWrapper = styled.div`
  background-color: ${colors.gray[800]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(3)} ${sizes(3)} ${sizes(3)} ${sizes(6)};
  max-width: 430px;
  position: fixed;
  bottom: ${SNACKBAR_POSITION}px;
  left: ${SNACKBAR_POSITION}px;
  z-index: ${zIndex.overlay};
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
  word-break: break-all;
  svg {
    margin-right: ${sizes(4)};
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
`
