import styled from '@emotion/styled'

import { colors, sizes, transitions, typography } from '@/shared/theme'

type FormGroupProps = {
  error?: boolean
  disabled?: boolean
}

export const FormGroup = styled.label<FormGroupProps>`
  display: inline-block;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  input:-webkit-autofill::first-line,
  textarea:-webkit-autofill::first-line {
    font-size: 1rem;
  }

  input,
  button,
  textarea {
    transition: border ${transitions.timings.regular} ${transitions.easing};
    background: none;
    padding: 10px ${sizes(4)};
    font-size: ${typography.sizes.body1};
    line-height: 28px;

    :disabled {
      cursor: not-allowed;
    }

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
  font-size: ${typography.sizes.body2};
`
