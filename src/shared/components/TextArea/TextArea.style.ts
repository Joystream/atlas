import { colors, sizes, transitions, typography } from '@/shared/theme'
import styled from '@emotion/styled'

export const TextAreaWrapper = styled.div`
  max-width: 300px;
`

export const StyledTextArea = styled.textarea`
  background: ${colors.black};
  width: 100%;
  resize: none;
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.subtitle2};
  border: none;
  border-bottom: 1px solid ${colors.gray[900]};
  transition: all ${transitions.timings.loading} ${transitions.easing};
  ::placeholder {
    color: ${colors.gray[400]};
  }
  &:hover {
    background: ${colors.gray[900]};
  }
  :focus {
    border-bottom: 1px solid ${colors.blue[500]};
    background: ${colors.gray[900]};
  }
  :placeholder-shown {
    border-bottom: 1px solid ${colors.gray[200]};
  }
  :not(:focus) {
    border-bottom: 1px solid ${colors.gray[900]};
  }
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
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
  word-break: break-all;
`

export const HelperTextsWrapper = styled.div`
  margin-left: 4px;
  margin-top: 10px;
  font-size: ${sizes(3)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HelperTextCount = styled.span<HelperTextProps>`
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
`
