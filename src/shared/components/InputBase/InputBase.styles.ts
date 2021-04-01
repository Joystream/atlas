import { colors, sizes, transitions, typography } from '@/shared/theme'
import styled from '@emotion/styled'

type FormGroupProps = {
  error?: boolean
  disabled?: boolean
}

export const FormGroup = styled.label<FormGroupProps>`
  display: inline-block;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    // This is madness, but basically, it will make autofill transparent for a long time.
    // Changing background-color and color won't work
    transition: color 99999s, background-color 99999s;
    transition-delay: 99999s;
  }
  input:-webkit-autofill::first-line,
  textarea:-webkit-autofill::first-line {
    font-size: 1rem;
  }

  input,
  button,
  textarea {
    transition: all ${transitions.timings.regular} ${transitions.easing};
    background: none;
    padding: 10px ${sizes(4)};
    font-size: ${typography.sizes.body1};
    line-height: 28px;
    ::placeholder {
      color: ${colors.gray[300]};
    }
    :not(:placeholder-shown) {
      border: 1px solid ${colors.gray[200]};
    }
    :focus {
      border: 1px solid ${colors.blue[500]};
    }
    :not(:focus) {
      border: 1px solid ${({ error, disabled }) => (error && !disabled ? colors.error : colors.gray[200])};
    }
  }
  input,
  textarea {
    color: ${colors.gray[50]};
  }
`

export const LabelText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-bottom: ${sizes(2)};
  color: ${colors.gray[200]};
  background-color: none;
  font-size: ${typography.sizes.body2};
`
