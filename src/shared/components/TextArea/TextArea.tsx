import React, { forwardRef, useState } from 'react'
import HelperText from '../HelperText/HelperText'
import InputBase, { InputBaseProps } from '../InputBase'
import { StyledTextArea, TextAreaWrapper } from './TextArea.style'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  maxLength?: number
  className?: string
  helperText?: string
  warning?: boolean
  disabled?: boolean
  error?: boolean
  rows?: number
  spellcheck?: boolean
} & InputBaseProps
const TextAreaComponent: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  {
    onChange,
    name,
    placeholder,
    value,
    maxLength,
    className,
    rows = 10,
    helperText = '\u00A0',
    warning,
    error,
    disabled,
    spellcheck = true,
    label,
  },
  ref
) => {
  const [charactersCount, setCharactersCount] = useState(0)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <InputBase
      label={label}
      warning={warning}
      disabled={disabled}
      error={error}
      helperText={helperText}
      charactersCount={charactersCount}
      maxLength={maxLength}
    >
      <TextAreaWrapper className={className}>
        <StyledTextArea
          name={name}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleOnChange}
          value={value}
          rows={rows}
          spellCheck={spellcheck}
        />
      </TextAreaWrapper>
    </InputBase>
  )
}

const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'

export default TextArea
