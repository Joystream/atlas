import styled from '@emotion/styled'

import { TextField } from '@/components/_inputs/TextField'
import { cVar, zIndex } from '@/styles'

export const ComboBoxWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const ListWrapper = styled.ul<{ topPosition?: number }>`
  max-height: 188px;
  overflow-y: auto;
  background: ${cVar('colorBackgroundStrong')};
  padding: 0;
  position: absolute;
  top: ${({ topPosition }) => (topPosition ? `${topPosition}px` : 'unset')};
  left: 0;
  width: 100%;
  z-index: ${zIndex.globalOverlay};
  margin: 0;
`

export const StyledTextField = styled(TextField)`
  input {
    :not(:placeholder-shown) {
      :not(button) {
        :focus {
          box-shadow: 0 0 0 1px ${({ error }) => cVar(error ? 'colorCoreRed400' : 'colorCoreBlue500')};
        }
      }
    }
  }
`

export const StyledThumbnail = styled.img`
  max-height: 32px;
`
