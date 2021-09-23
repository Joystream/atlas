import React, { useState } from 'react'

import { CharactersCounter, Container, MinMaxChars, StyledTextArea, TitleAreaInfo } from './TitleArea.style'

import { Text } from '../Text'

export type TitleAreaProps = {
  name?: string
  value?: string
  min?: number
  max?: number
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
}

export const TitleArea: React.FC<TitleAreaProps> = ({
  name,
  value,
  placeholder = 'Enter text here',
  onChange,
  onBlur,
  className,
  max = 60,
  min = 5,
}) => {
  const [touched, setTouched] = useState(false)
  const invalidInput = (value?.length || 0) < min || (value?.length || 0) > max

  const handleFocus = () => {
    setTouched(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
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
        onFocus={handleFocus}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      />

      <TitleAreaInfo visible={touched && !value?.length}>
        <MinMaxChars secondary variant="caption">
          Min {min} Chars | Max {max} Chars
        </MinMaxChars>
        <Text secondary variant="caption">
          <CharactersCounter error={invalidInput} variant="caption">
            {value?.length || 0} &nbsp;
          </CharactersCounter>
          / {max}
        </Text>
      </TitleAreaInfo>
    </Container>
  )
}
