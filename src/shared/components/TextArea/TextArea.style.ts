import styled from '@emotion/styled'
import resizer from '@/shared/icons/resizer.svg'

export const StyledTextArea = styled.textarea`
  width: 100%;
  display: block;
  position: relative;
  :disabled {
    cursor: not-allowed;
  }
  ::-webkit-resizer {
    background: url(${resizer}) no-repeat;
  }
`
