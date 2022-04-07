import styled from '@emotion/styled'

import { Dialog } from '@/components/_overlays/Dialog'

export type PopoverWidth = 'default' | 'wide'

export const StyledDialog = styled(Dialog)<{ popoverWidth: PopoverWidth }>`
  width: ${({ popoverWidth }) => (popoverWidth === 'wide' ? '320px' : '240px')};
  max-height: 320px;
`
