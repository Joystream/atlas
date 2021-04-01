import styled from '@emotion/styled'

type TextInputProps = {
  filled?: boolean
  focused?: boolean
  disabled?: boolean
  error?: boolean
}

export const TextInput = styled.input<TextInputProps>`
  width: 100%;
`
