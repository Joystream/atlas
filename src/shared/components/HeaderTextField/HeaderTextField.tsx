import React, { useState } from 'react'
import { Container, Title, WarningText, StyledTooltip, StyledInput } from './HeaderTextField.style'

type HeaderTextFieldProps = {
  title: string
  helperText: string
  errorText: string
  variant?: 'default' | 'error' | 'warning'
}

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ title, helperText, errorText, variant = 'default' }, ref) => {
    const [text, setText] = useState(title)
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        ) : (
          <Title variant="h1" onClick={() => setEditMode(true)}>
            {text}
          </Title>
        )}
        {variant === 'error' && <WarningText variant="body1">{errorText}</WarningText>}
        {!isInEditMode && text && <StyledTooltip data-text={helperText} />}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
