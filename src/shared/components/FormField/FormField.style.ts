import styled from '@emotion/styled'

import { colors, sizes, typography } from '@/shared/theme'

import { Text } from '../Text'

type DenseProps = {
  dense?: boolean
}

export const FormFieldWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 4 : 6)};
  width: 100%;
  max-width: 760px;
`

export const FormFieldHeader = styled.header`
  display: flex;
  align-items: center;
  width: 85%;
  padding-bottom: ${sizes(2)};
  word-wrap: break-word;
`

export const FormFieldTitle = styled(Text)`
  margin-right: ${sizes(4)};
`

export const FormFieldDescription = styled(Text)`
  width: 85%;
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.gray[300]};
  line-height: ${sizes(5)};
  word-wrap: break-word;
`

export const ChildrenWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 2 : 6)};
`
