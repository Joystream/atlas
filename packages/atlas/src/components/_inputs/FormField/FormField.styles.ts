import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { oldColors, sizes } from '@/styles'

type DenseProps = {
  dense?: boolean
}

export const FormFieldWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 4 : 10)};
  width: 100%;
`

export const FormFieldHeader = styled.header`
  display: flex;
  align-items: center;
  width: 85%;
  word-wrap: break-word;
`

export const FormFieldTitle = styled(Text)`
  margin-right: ${sizes(4)};
`

export const FormFieldDescription = styled(Text)`
  width: 85%;
  padding: ${sizes(2)} 0;
  color: ${oldColors.gray[300]};
  word-wrap: break-word;
`

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(4)};
`
