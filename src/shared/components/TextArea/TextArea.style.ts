import { colors, sizes, transitions, typography } from '@/shared/theme'
import styled from '@emotion/styled'

export const TextAreaWrapper = styled.div`
  width: 100%;
  max-width: var(--input-max-width); ;
`

export const StyledTextArea = styled.textarea`
  background: transparent;
  width: 100%;
  resize: none;
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.subtitle2};
  border: none;
  border-bottom: 1px solid ${colors.gray[900]};
  transition: all ${transitions.timings.loading} ${transitions.easing};
  ::placeholder {
    color: ${colors.gray[400]};
    transition: color ${transitions.timings.loading} ${transitions.easing};
  }
  :focus {
    border-bottom: 1px solid ${colors.blue[500]};
  }
  :placeholder-shown {
    border-bottom: 1px solid ${colors.gray[200]};
  }
  :not(:focus) {
    border-bottom: 1px solid ${colors.gray[900]};
  }
  :hover {
    :not(:focus) {
      border-bottom: 1px solid ${colors.gray[500]};
      ::placeholder {
        color: ${colors.gray[500]};
      }
    }
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
