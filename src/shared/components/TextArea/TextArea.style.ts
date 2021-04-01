import { colors, sizes, typography } from '@/shared/theme'
import styled from '@emotion/styled'

export const TextAreaWrapper = styled.div`
  width: 100%;
`

export const StyledTextArea = styled.textarea`
  width: 100%;
`
type HelperTextProps = {
  helperTextVariant?: 'default' | 'error' | 'warning'
}

const helperVariants = {
  default: colors.gray[400],
  error: colors.error,
  warning: colors.warning,
}

export const HelperText = styled.p<HelperTextProps>`
  margin-right: ${sizes(4)};
  margin: 0;
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
  word-break: break-all;
`

export const HelperTextsWrapper = styled.div`
  margin-left: 4px;
  margin-top: 8px;
  font-size: ${typography.sizes.body2};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HelperTextCount = styled.span<HelperTextProps>`
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
`
