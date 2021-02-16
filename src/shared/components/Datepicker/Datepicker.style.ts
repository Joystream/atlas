import { colors } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { styledinputStates } from '../InputBase'

type DateInputProps = {
  disabled?: boolean
  error?: boolean
}

export const DateInput = styled.input<DateInputProps>`
  color: ${colors.white};
  :focus {
    ${styledinputStates.focused}
  }
  :not(:focus) {
    ${styledinputStates.filled}
    ${styledinputStates.default}
  }
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
`
