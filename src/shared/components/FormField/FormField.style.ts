import { colors, sizes, typography } from '@/shared/theme'
import styled from '@emotion/styled'
import Text from '../Text'

export const FormFieldWrapper = styled.div`
  margin-top: ${sizes(2)};
  width: 100%;
  max-width: var(--input-max-width);
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

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(5)};
`
