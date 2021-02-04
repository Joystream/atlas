import { colors } from '@/shared/theme'
import styled from '@emotion/styled'
import { labelOnTop, styledinputStates } from '../InputBase'

type TextInputProps = {
  filled?: boolean
  focused?: boolean
  disabled?: boolean
  error?: boolean
}

export const TextInput = styled.input<TextInputProps>`
  color: ${colors.white};

  ${styledinputStates.default}

  ${({ focused, filled }) => focused && !filled && styledinputStates.activated};
  ${({ focused, filled }) => focused && filled && styledinputStates.focused};
  ${({ focused, filled }) => !focused && filled && styledinputStates.filled};

  ${({ error }) => error && styledinputStates.error};
  ${({ disabled }) => disabled && styledinputStates.disabled};

  ::-webkit-input-placeholder {
    opacity: 0;
  }
  :focus + span,
  :not(:placeholder-shown) + span {
    ${labelOnTop}
  }
`
