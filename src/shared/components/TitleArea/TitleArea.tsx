import React, { useState } from 'react'
import { useEffect } from 'react'

import { CharactersCounter, Container, MinMaxChars, StyledInput, TitleAreaInfo } from './TitleArea.style'

import { Text } from '../Text'

export type TitleAreaProps = {
  name?: string
  value?: string
  min?: number
  max?: number
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const TitleArea = React.forwardRef<HTMLInputElement, TitleAreaProps>(
  ({ name, value, placeholder = 'Enter text here', onChange, onBlur, className, max = 60, min = 5 }, ref) => {
    const [charactersCount, setCharactersCount] = useState(0)
    const [touched, setTouched] = useState(false)

    useEffect(() => {
      setCharactersCount(value?.length || 0)
    }, [value])

    const invalidInput = charactersCount < min || charactersCount > max

    return (
      <Container className={className}>
        <StyledInput
          autoComplete="off"
          ref={ref}
          minLength={min}
          maxLength={max}
          name={name}
          placeholder={placeholder}
          type="text"
          onFocus={() => setTouched(true)}
          touchedAndEmpty={touched && !charactersCount}
          defaultValue={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <TitleAreaInfo>
          <MinMaxChars secondary variant="caption">
            Min {min} Chars | Max {max} Chars
          </MinMaxChars>
          <Text secondary variant="caption">
            <CharactersCounter error={invalidInput} variant="caption">
              {charactersCount} &nbsp;
            </CharactersCounter>
            / {max}
          </Text>
        </TitleAreaInfo>
      </Container>
    )
  }
)

TitleArea.displayName = 'TitleArea'
