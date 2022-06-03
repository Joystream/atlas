import React, { useState } from 'react'

import {
  CharactersCounter,
  Container,
  CounterText,
  MinMaxChars,
  StyledTextArea,
  TitleAreaInfo,
} from './TitleInput.styles'

export type TitleInputProps = {
  error?: boolean
  name?: string
  value?: string
  min?: number
  max?: number
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  disabled?: boolean
}

export const TitleInput = React.forwardRef<HTMLTextAreaElement, TitleInputProps>(
  (
    {
      name,
      value,
      placeholder = 'Enter text here',
      onChange,
      onBlur,
      onFocus,
      className,
      max = 60,
      min = 5,
      disabled,
      error,
    },
    ref
  ) => {
    const [footerVisible, setFooterVisible] = useState(false)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
    }

    const handleFocus = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onFocus?.(event)
      if (!footerVisible) {
        setFooterVisible(true)
      }
    }

    return (
      <Container className={className}>
        <StyledTextArea
          rows={1}
          minLength={min}
          maxLength={max}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          onFocus={handleFocus}
          disabled={disabled}
          error={error}
          ref={ref}
        />
        <TitleAreaInfo visible={footerVisible || error || !!value?.length}>
          <MinMaxChars variant="t100">
            Min {min} chars • Max {max} chars
          </MinMaxChars>
          <CounterText variant="t100">
            <CharactersCounter hasValue={!!value?.length} variant="t100">
              {value?.length || 0} &nbsp;
            </CharactersCounter>
            / {max}
          </CounterText>
        </TitleAreaInfo>
      </Container>
    )
  }
)

TitleInput.displayName = 'TitleInput'
