import styled from '@emotion/styled'

import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { sizes } from '@/styles'

export const Wrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  align-items: center;
`
export const StyledDialogModal = styled(DialogModal)`
  .dialog-content {
    padding: ${sizes(4)} 0;
  }
`

export const StyledInput = styled(Input)`
  margin: 0 ${sizes(4)};
`

export const ListWrapper = styled.div`
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
`
