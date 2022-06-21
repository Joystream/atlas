import { ChangeEvent, ForwardRefRenderFunction, forwardRef, useState } from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import { CustomBorder, StyledText, StyledTextArea, TextAreaContainer, TextAreaWrapper } from './TextArea.styles'

import { InputSize } from '../inputs.utils'

export type TextAreaProps = {
  name?: string
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  size?: InputSize
  rows?: number
  spellcheck?: boolean
  error?: boolean
  counter?: boolean
  maxLength?: number | undefined
  disabled?: boolean
}

const TextAreaComponent: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  {
    onChange,
    onBlur,
    name,
    placeholder,
    value,
    rows,
    disabled,
    counter,
    spellcheck = true,
    maxLength,
    error,
    size = 'large',
  },
  ref
) => {
  const [charactersCount, setCharactersCount] = useState(0)

  const defaultRows = size === 'medium' ? 4 : 3
  const _rows = rows ? rows : defaultRows

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
    if (!counter) {
      return
    }
    setCharactersCount(e.target.value.length)
  }

  return (
    <TextAreaWrapper>
      <TextAreaContainer>
        <StyledTextArea
          name={name}
          ref={ref}
          error={error}
          inputSize={size}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleOnChange}
          value={value}
          rows={_rows}
          spellCheck={spellcheck}
          onBlur={onBlur}
        />
        <CustomBorder disabled={disabled} />
      </TextAreaContainer>
      {counter && maxLength ? (
        <StyledText disabled={disabled} variant="t100" color={cVar('colorTextMuted')}>
          <Text
            variant="t100"
            color={
              charactersCount
                ? charactersCount > maxLength
                  ? cVar('colorTextError')
                  : cVar('colorTextStrong')
                : cVar('colorTextMuted')
            }
          >
            {charactersCount}
          </Text>{' '}
          / {maxLength}
        </StyledText>
      ) : null}
    </TextAreaWrapper>
  )
}

export const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'
