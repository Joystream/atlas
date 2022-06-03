import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import resizeIcon from '@/components/_icons/svgs/action-resize.svg'
import { cVar, sizes } from '@/styles'

export const StyledTextArea = styled.textarea`
  width: 100%;
  resize: vertical;

  ::-webkit-resizer {
    background: url(${resizeIcon}) no-repeat;
  }
`

export type HelperTextProps = {
  helperTextVariant?: 'error' | 'warning'
}

const helperVariants = {
  error: cVar('colorTextError'),
  warning: cVar('colorTextCaution'),
}

export const HelperTextCount = styled(Text)<HelperTextProps>`
  margin-top: ${sizes(2)};
  display: block;
  text-align: right;
  ${({ helperTextVariant }) => helperTextVariant && `color: ${helperVariants[helperTextVariant]}`};
`
