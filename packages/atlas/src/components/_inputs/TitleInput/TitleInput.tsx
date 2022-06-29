import { ChangeEvent, KeyboardEvent, forwardRef, useState } from 'react'

import { Text } from '@/components/Text'

import { CharactersCounter, Container, MinMaxChars, StyledTextArea, TitleAreaInfo } from './TitleInput.styles'

export type TitleInputProps = {
  error?: boolean
  name?: string
  value?: string
  min?: number
  max?: number
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  disabled?: boolean
}

export const TitleInput = forwardRef<HTMLTextAreaElement, TitleInputProps>(
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
    }

    const handleFocus = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
          <MinMaxChars as="span" variant="t100" color="colorTextMuted" margin={{ bottom: 1, right: 2 }}>
            Min {min} chars • Max {max} chars
          </MinMaxChars>
          <Text as="span" variant="t100" color="colorTextMuted">
            <CharactersCounter as="span" color={value?.length ? undefined : 'colorTextMuted'} variant="t100">
              {value?.length || 0} &nbsp;
            </CharactersCounter>
            / {max}
          </Text>
        </TitleAreaInfo>
      </Container>
    )
  }
)

TitleInput.displayName = 'TitleInput'
