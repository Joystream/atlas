import { colors } from '@/shared/theme'
import { css } from '@emotion/react'
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
  :not(:placeholder-shown) {
    ${styledinputStates.filled}
  }
  :focus {
    ${styledinputStates.focused}
  }
  :placeholder-shown {
    ${styledinputStates.activated}
  }
  :not(:focus) {
    ${styledinputStates.default}
  }

  ${styledinputStates.default}

  ${({ error }) =>
    error &&
    css`
      &,
      :not(:focus) {
        ${styledinputStates.error}
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      &,
      :not(:focus) {
        ${styledinputStates.disabled}
      }
    `};

  ::-webkit-input-placeholder {
    opacity: 0;
  }
  :focus + span,
  :not(:placeholder-shown) + span {
    ${labelOnTop}
  }
`
