import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

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
