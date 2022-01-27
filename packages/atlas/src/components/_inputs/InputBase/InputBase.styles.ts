import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, oldColors, sizes, transitions } from '@/styles'

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
    color: ${oldColors.gray[50]};
  }

  input,
  button,
  textarea {
    transition: border ${transitions.timings.regular} ${transitions.easing};
    background: none;
    padding: ${sizes(3)} ${sizes(4)};
    font: ${cVar('typographyDesktopT300')};
    letter-spacing: ${cVar('typographyDesktopT300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT300TextTransform')};

    :focus {
      border: 1px solid ${oldColors.blue[500]};
    }

    :disabled {
      cursor: not-allowed;
    }

    ::placeholder {
      color: ${oldColors.gray[300]};
    }

    :not(:placeholder-shown):not(button) {
      border: 1px solid ${oldColors.gray[200]};
    }

    &:focus {
      border: 1px solid ${oldColors.blue[500]};
    }

    :not(:focus):not(button) {
      border: 1px solid
        ${({ error, disabled }) => (error && !disabled ? oldColors.secondary.alert[100] : oldColors.gray[200])};
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
