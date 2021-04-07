import styled from '@emotion/styled'
import resizer from '@/assets/resizer.svg'

export const StyledTextArea = styled.textarea`
  width: 100%;
  display: block;
  position: relative;
  ::-webkit-resizer {
    background: url(${resizer}) no-repeat;
  }
`
