import styled from '@emotion/styled'

import { Modal } from '@/components/_overlays/Modal'
import { cVar, sizes } from '@/styles'

export const IllustrationWrapper = styled.div`
  background-color: ${cVar('colorBackground')};
  padding-bottom: ${sizes(6)};
  display: flex;
  justify-content: center;
`

export const StyledModal = styled(Modal)`
  flex-direction: column;
  background-color: ${cVar('colorBackgroundStrong')};
`
