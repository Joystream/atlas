import styled from '@emotion/styled'

import { colors, sizes, typography } from '@/theme'

import { Text } from '../../Text'

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
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.gray[300]};
  line-height: ${sizes(5)};
  word-wrap: break-word;
`

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(4)};
`
