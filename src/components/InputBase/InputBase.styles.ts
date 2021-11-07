import styled from '@emotion/styled'

import { colors, sizes, transitions, typography } from '@/theme'

import { Text } from '../Text'

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
  textarea {
    color: ${colors.gray[50]};
  }

  input,
  button,
  textarea {
    transition: border ${transitions.timings.regular} ${transitions.easing};
    background: none;
    padding: 10px ${sizes(4)};
    font-size: ${typography.sizes.body1};
    line-height: ${typography.lineHeights.body1};

    :focus {
      border: 1px solid ${colors.blue[500]};
    }

    :disabled {
      cursor: not-allowed;
    }

    ::placeholder {
      color: ${colors.gray[300]};
    }

    :not(:placeholder-shown):not(button) {
      border: 1px solid ${colors.gray[200]};
    }

    &:focus {
      border: 1px solid ${colors.blue[500]};
    }

    :not(:focus):not(button) {
      border: 1px solid
        ${({ error, disabled }) => (error && !disabled ? colors.secondary.alert[100] : colors.gray[200])};
    }
  }
`

export const LabelText = styled(Text)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-bottom: ${sizes(2)};
`
