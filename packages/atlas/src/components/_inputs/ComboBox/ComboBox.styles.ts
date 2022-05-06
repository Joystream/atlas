import styled from '@emotion/styled'

import { TextField } from '@/components/_inputs/TextField'
import { Spinner } from '@/components/_loaders/Spinner'
import { cVar, sizes, zIndex } from '@/styles'

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

export const StyledSpinner = styled(Spinner)`
  position: absolute;
  margin-top: 50%;
  right: ${sizes(4)};
`

export const StyledTextField = styled(TextField)`
  input {
    :not(:placeholder-shown) {
      :not(button) {
        :focus {
          border: 1px solid ${({ error }) => cVar(error ? 'colorCoreRed400' : 'colorCoreBlue500')};
        }
      }
    }
  }
`

export const StyledThumbnail = styled.img`
  max-height: 32px;
`
