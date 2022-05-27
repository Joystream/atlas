import { ChangeEvent, ForwardRefRenderFunction, forwardRef, useState } from 'react'

import { StyledTextArea } from './TextArea.styles'

import { InputBase, InputBaseProps } from '../InputBase'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  rows?: number
  spellcheck?: boolean
} & InputBaseProps

const TextAreaComponent: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  { onChange, onBlur, name, placeholder, value, rows = 5, disabled, spellcheck = true, ...inputBaseProps },
  ref
) => {
  const [charactersCount, setCharactersCount] = useState(0)

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <InputBase disabled={disabled} charactersCount={charactersCount} {...inputBaseProps}>
      <StyledTextArea
        name={name}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        rows={rows}
        spellCheck={spellcheck}
        onBlur={onBlur}
      />
    </InputBase>
  )
}

export const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'
