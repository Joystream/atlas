import React, { forwardRef, useState } from 'react'
import InputBase, { InputBaseProps } from '../InputBase'
import { StyledTextArea } from './TextArea.style'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  rows?: number
  spellcheck?: boolean
} & InputBaseProps

const TextAreaComponent: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  { onChange, name, placeholder, value, className, rows = 5, disabled, spellcheck = true, ...inputBaseProps },
  ref
) => {
  const [charactersCount, setCharactersCount] = useState(0)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <InputBase disabled={disabled} charactersCount={charactersCount} {...inputBaseProps}>
      <StyledTextArea
        className={className}
        name={name}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        rows={rows}
        spellCheck={spellcheck}
      />
    </InputBase>
  )
}

const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'

export default TextArea
