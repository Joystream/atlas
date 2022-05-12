import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes, transitions } from '@/styles'

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
    color: ${cVar('colorCoreNeutral50')};
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

    :not(button) {
      border: 0;
    }

    :focus {
      box-shadow: 0 0 0 1px ${cVar('colorCoreBlue500')};
    }

    :disabled {
      cursor: not-allowed;
    }

    ::placeholder {
      color: ${cVar('colorCoreNeutral300')};
    }

    :not(:placeholder-shown):not(button) {
      box-shadow: 0 0 0 1px ${cVar('colorCoreNeutral200')};
    }

    &:focus {
      box-shadow: 0 0 0 1px ${cVar('colorCoreBlue500')};
    }

    :not(:focus):not(button) {
      box-shadow: 0 0 0 1px
        ${({ error, disabled }) => cVar(error && !disabled ? 'colorCoreRed400' : 'colorCoreNeutral200')};
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
