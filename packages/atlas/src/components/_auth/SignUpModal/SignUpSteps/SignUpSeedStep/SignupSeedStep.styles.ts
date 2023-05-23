import styled from '@emotion/styled'

import { TextButton } from '@/components/_buttons/Button'
import { TextArea } from '@/components/_inputs/TextArea'
import { cVar } from '@/styles'

export const StyledTextButton = styled(TextButton)`
  justify-self: start;
`

export const StyledTextArea = styled(TextArea)`
  color: ${cVar('colorTextCaution')};
  resize: none;

  :disabled {
    cursor: auto;
    opacity: 1;
  }
`
