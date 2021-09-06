import React, { useEffect, useRef, useState } from 'react'

import { CharactersCounter, Container, MinMaxChars, StyledInput, TitleAreaInfo } from './TitleArea.style'

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

export const TitleArea = React.forwardRef<HTMLTextAreaElement, TitleAreaProps>(
  ({ name, value, placeholder = 'Enter text here', onChange, onBlur, className, max = 60, min = 5 }, ref) => {
    const [charactersCount, setCharactersCount] = useState(0)
    const [touched, setTouched] = useState(false)
    const invalidInput = charactersCount < min || charactersCount > max
    const containerRef = useRef<HTMLDivElement>(null)

    const handleFocus = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharactersCount(e.target.value.length)
      setTouched(true)
    }

    useEffect(() => {
      const textarea = containerRef.current?.querySelector('textarea')
      if (!textarea) {
        return
      }
      textarea.style.height = 'initial'
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = scrollHeight + 'px'
    })

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharactersCount(e.target.value.length)
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
    }

    return (
      <Container ref={containerRef} className={className}>
        <StyledInput
          ref={ref}
          rows={1}
          minLength={min}
          maxLength={max}
          name={name}
          placeholder={placeholder}
          onFocus={handleFocus}
          touchedAndEmpty={touched && !charactersCount}
          defaultValue={value}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
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
