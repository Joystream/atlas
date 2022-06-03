import styled from '@emotion/styled'

import { cVar, sizes, transitions } from '@/styles'

type FormGroupProps = {
  error?: boolean
  disabled?: boolean
}

export const FormGroup = styled.div<FormGroupProps>`
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

    :focus {
      border: 1px solid ${cVar('colorCoreBlue500')};
    }

    :disabled {
      cursor: not-allowed;
    }

    ::placeholder {
      color: ${cVar('colorCoreNeutral300')};
    }

    :not(:placeholder-shown):not(button) {
      border: 1px solid ${cVar('colorCoreNeutral200')};
    }

    &:focus {
      border: 1px solid ${cVar('colorCoreBlue500')};
    }

    :not(:focus):not(button) {
      border: 1px solid
        ${({ error, disabled }) => (error && !disabled ? cVar('colorCoreRed400') : cVar('colorCoreNeutral200'))};
    }
  }
`
