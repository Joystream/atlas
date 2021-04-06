import styled from '@emotion/styled'
import resizer from '@/shared/icons/resizer.svg'
import Icon from '../Icon'

export const StyledTextArea = styled.textarea`
  width: 100%;
  ::-webkit-resizer {
    display: none;
  }
`

export const TextAreaWrapper = styled.div`
  position: relative;
  display: inline-block;

  ::after {
    content: '';
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: url(${resizer}) no-repeat;
    width: 20px;
    height: 20px;
  }
`
