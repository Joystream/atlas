import styled from '@emotion/styled'

import { colors, sizes, typography } from '@/shared/theme'

import { Text } from '../Text'

export const FormFieldWrapper = styled.div`
  margin-top: ${sizes(6)};
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

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(6)};
`
