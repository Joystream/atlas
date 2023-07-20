import { ChangeEvent, ForwardRefRenderFunction, forwardRef, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { Text } from '@/components/Text'

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
    className,
    counter,
    spellcheck = true,
    maxLength,
    error,
    size = 'large',
  },
  ref
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [charactersCount, setCharactersCount] = useState(0)
  const defaultRows = size === 'medium' ? 4 : 3
  const _rows = rows ? rows : defaultRows
  const initialCharactersCount = textAreaRef.current?.value.length
  const computedCharactersCount = charactersCount || initialCharactersCount

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
          className={className}
          name={name}
          ref={mergeRefs([ref, textAreaRef])}
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
        <StyledText as="span" disabled={disabled} variant="t100" color="colorTextMuted">
          <Text
            as="span"
            variant="t100"
            color={
              computedCharactersCount
                ? computedCharactersCount > maxLength
                  ? 'colorTextError'
                  : undefined
                : 'colorTextMuted'
            }
          >
            {computedCharactersCount || 0}
          </Text>{' '}
          / {maxLength}
        </StyledText>
      ) : null}
    </TextAreaWrapper>
  )
}

export const TextArea = forwardRef(TextAreaComponent)

TextArea.displayName = 'TextArea'
