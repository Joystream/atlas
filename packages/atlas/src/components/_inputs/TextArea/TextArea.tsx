import { ChangeEvent, FC, ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react'

import { HelperTextCount, StyledTextArea } from './TextArea.styles'

import { InputBase, InputBaseProps } from '../InputBase'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  warning?: boolean
  rows?: number
  spellcheck?: boolean
} & InputBaseProps

const TextAreaComponent: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  {
    onChange,
    onBlur,
    name,
    placeholder,
    value,
    rows = 5,
    disabled,
    spellcheck = true,
    maxLength,
    warning,
    error,
    ...inputBaseProps
  },
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
      {charactersCount ? (
        <CharacterCounter warning={warning} error={error} charactersCount={charactersCount} maxLength={maxLength} />
      ) : null}
    </InputBase>
  )
}

export type CharacterCounterProps = {
  error?: boolean
  warning?: boolean
  maxLength?: number
  charactersCount?: number
}

export const CharacterCounter: FC<CharacterCounterProps> = ({ maxLength, charactersCount }) => {
  const [charactersWarning, setCharactersWarning] = useState<'warning' | 'error' | null>(null)

  useEffect(() => {
    if (!maxLength || !charactersCount) {
      return
    }
    const warningLength = maxLength * 0.8

    if (charactersCount > warningLength) {
      setCharactersWarning('warning')
    } else {
      setCharactersWarning(null)
    }
    if (charactersCount > maxLength) {
      setCharactersWarning('error')
    }
  }, [charactersCount, maxLength])

  return charactersWarning === 'warning' || charactersWarning === 'error' ? (
    <HelperTextCount variant="t100" helperTextVariant={charactersWarning} secondary>
      {charactersCount}/{maxLength}
    </HelperTextCount>
  ) : null
}

export const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'
