import React, { forwardRef, useState } from 'react'
import { getVariant } from '../InputBase'
import { HelperText, HelperTextCount, HelperTextsWrapper, StyledTextArea, TextAreaWrapper } from './TextArea.style'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  maxLength?: number
  className?: string
  helperText?: string
  warning?: boolean
  error?: boolean
  rows?: number
  spellcheck?: boolean
}
const TextAreaComponent: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  {
    onChange,
    name,
    placeholder = 'Something should be here',
    value,
    maxLength,
    className,
    rows = 10,
    helperText = '\u00A0',
    warning,
    error,
    spellcheck = true,
  },
  ref
) => {
  const [charactersWarning, setCharactersWarning] = useState<'warning' | 'error' | null>(null)
  const [charactersCount, setCharactersCount] = useState(0)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }

    if (!maxLength) {
      return
    }

    const warningLength = maxLength * 0.8
    const currentLength = e.target.value.length

    setCharactersCount(currentLength)

    if (currentLength > warningLength) {
      setCharactersWarning('warning')
    } else {
      setCharactersWarning(null)
    }

    if (currentLength > maxLength) {
      setCharactersWarning('error')
    }
  }

  return (
    <TextAreaWrapper className={className}>
      <StyledTextArea
        name={name}
        ref={ref}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        rows={rows}
        spellCheck={spellcheck}
      />
      <HelperTextsWrapper>
        <HelperText helperTextVariant={getVariant(warning, error)}>{helperText}</HelperText>
        {(charactersWarning === 'warning' || charactersWarning === 'error') && (
          <HelperTextCount helperTextVariant={charactersWarning}>
            {charactersCount}/{maxLength}
          </HelperTextCount>
        )}
      </HelperTextsWrapper>
    </TextAreaWrapper>
  )
}

const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'

export default TextArea
