import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/_buttons/Button'
import { TextField } from '@/components/_inputs/TextField'
import { Footer } from '@/components/_overlays/Dialog/Dialog.styles'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar, media, sizes } from '@/styles'

export const StyledDialogModal = styled(DialogModal)`
  ${Footer} {
    background: ${cVar('colorCoreNeutral800')};
  }
`

export const Wrapper = styled.div`
  margin-top: ${sizes(4)};
`
export const StyledTextField = styled(TextField)`
  margin-bottom: ${sizes(5)};
`

export const StyledAvatar = styled(Avatar)`
  margin-top: ${sizes(9)};
  margin-bottom: ${sizes(6)};
  pointer-events: none;
`

export const StyledButton = styled(Button)`
  ${media.md} {
    margin-left: auto;
  }
`
