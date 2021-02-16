import { colors, sizes, typography } from '@/shared/theme'
import styled from '@emotion/styled'
import Text from '../Text'

type FormFieldWrapperProps = {
  fullWidth?: boolean
}

export const FormFieldWrapper = styled.div<FormFieldWrapperProps>`
  margin-top: ${sizes(2)};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '350px')};
`

export const FormFieldTitle = styled(Text)`
  margin: 0;
  line-height: ${sizes(5)};
`

export const FormFieldDescription = styled(Text)`
  margin-top: ${sizes(2)};
  font-size: ${typography.sizes.subtitle2};
  line-height: ${sizes(5)};
  color: ${colors.gray[300]};
`

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(5)};
`
