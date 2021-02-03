import React, { useState } from 'react'
import { Container, Title, WarningText, StyledTooltip, StyledInput } from './HeaderTextField.style'

export type HeaderTextFieldProps = {
  value: string
  helperText: string
  errorText: string
  onChange: (value: string) => void
  variant?: 'default' | 'error' | 'warning'
}

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ value, helperText, errorText, onChange, variant = 'default' }, ref) => {
    const [isInEditMode, setEditMode] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter' || ref === null) {
        return
      }
      setEditMode(false)
    }

    return (
      <Container>
        {isInEditMode ? (
          <StyledInput
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditMode(false)}
            autoFocus
          />
        ) : (
          <Title variant="h1" onClick={() => setEditMode(true)}>
            {value}
            {variant === 'error' && <WarningText variant="body1">{errorText}</WarningText>}
          </Title>
        )}
        {!isInEditMode && value && <StyledTooltip data-text={helperText} />}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
