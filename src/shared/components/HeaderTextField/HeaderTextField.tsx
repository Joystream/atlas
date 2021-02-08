import React, { useRef, useEffect } from 'react'
import { Container, HelperText, StyledInput } from './HeaderTextField.style'

export type Variant = 'default' | 'error' | 'warning'

export type HeaderTextFieldProps = {
  value: string
  helperText?: string
  onChange: (value: string) => void
  variant?: Variant
}
type ChangeEvent = React.ChangeEvent<HTMLInputElement>

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ value, helperText, onChange, variant = 'default' }, ref) => {
    const inputElement = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (inputElement.current === null) {
        return
      }
      inputElement.current.style.width = value.length + 'ch'
    }, [inputElement, value.length])

    return (
      <Container>
        <StyledInput
          ref={inputElement}
          type="text"
          value={value}
          onChange={(e: ChangeEvent) => onChange(e.target.value)}
          required
        />
        {helperText && (
          <HelperText variant="body1" helperTextVariant={variant}>
            {helperText}
          </HelperText>
        )}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
