import React from 'react'

import { Container, HelperText, StyledInput } from './TitleArea.style'

export type TitleAreaProps = {
  name?: string
  value?: string
  helperText?: string
  placeholder?: string
  error?: boolean
  warning?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const TitleArea = React.forwardRef<HTMLInputElement, TitleAreaProps>(
  ({ name, value, helperText, placeholder, error, warning, onChange, onBlur, className }, ref) => {
    const controlled = onChange?.name === 'onChange'
    return (
      <Container className={className}>
        <StyledInput
          ref={ref}
          name={name}
          placeholder={placeholder}
          type="text"
          defaultValue={value}
          onChange={onChange}
          onBlur={onBlur}
          widthSize={controlled && value ? value.length : null}
        />
        {helperText && (
          <HelperText variant="body1" error={error} warning={warning}>
            {helperText}
          </HelperText>
        )}
      </Container>
    )
  }
)

TitleArea.displayName = 'TitleArea'
