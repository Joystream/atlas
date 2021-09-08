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

export const FormFieldTitle = styled(Text)`
  margin: 0;
  line-height: ${sizes(5)};
  word-wrap: break-word;
  width: 85%;
`

export const FormFieldDescription = styled(Text)`
  margin-top: ${sizes(2)};
  width: 85%;
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.gray[300]};
  line-height: ${sizes(5)};
  word-wrap: break-word;
`

export const ChildrenWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 2 : 6)};
`
