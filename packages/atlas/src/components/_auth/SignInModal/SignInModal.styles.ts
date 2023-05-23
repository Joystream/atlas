import styled from '@emotion/styled'

import { DialogModal } from '@/components/_overlays/DialogModal'
import { media } from '@/styles'

export const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
