import React, { forwardRef, useState } from 'react'
import { HelperText, HelperTextCount, HelperTextsWrapper, StyledTextArea, TextAreaWrapper } from './TextArea.style'

export type TextAreaProps = {
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  maxLength?: number
  className?: string
  helperText?: string
  warning?: boolean
  error?: boolean
  rows?: number
}
const TextAreaComponent: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  {
    onChange,
    placeholder = 'Something should be here',
    value,
    maxLength,
    className,
    rows = 10,
    helperText = '\u00A0',
    warning,
    error,
  },
  ref
) => {
  const [charactersWarning, setCharactersWarning] = useState<'warning' | 'error' | undefined>()
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

    setCharactersCount(0)

    if (currentLength > warningLength) {
      setCharactersCount(currentLength)
      setCharactersWarning('warning')
    }

    if (currentLength === maxLength) {
      setCharactersCount(currentLength)
      setCharactersWarning('error')
    }
  }

  return (
    <TextAreaWrapper className={className}>
      <StyledTextArea
        ref={ref}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        rows={rows}
        maxLength={maxLength}
      />
      <HelperTextsWrapper>
        <HelperText helperTextVariant={getVariant(warning, error)}>{helperText}</HelperText>
        {charactersCount !== 0 && (
          <HelperTextCount helperTextVariant={charactersWarning}>
            {charactersCount}/{maxLength}
          </HelperTextCount>
        )}
      </HelperTextsWrapper>
    </TextAreaWrapper>
  )
}

const getVariant = (warning?: boolean, error?: boolean) => {
  if (error) {
    return 'error'
  }
  if (warning && !error) {
    return 'warning'
  }
}

const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'

export default TextArea
