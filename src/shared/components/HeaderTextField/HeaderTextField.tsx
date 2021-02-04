import React, { useEffect } from 'react'
import { Container, WarningText, StyledTooltip, StyledInput } from './HeaderTextField.style'

export type HeaderTextFieldProps = {
  value: string
  helperText: string
  errorText: string
  onChange: (value: string) => void
  variant?: 'default' | 'error' | 'warning'
}

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ value, helperText, errorText, onChange, variant = 'default' }, ref) => {
    useEffect(() => {
      if (ref === null) {
        return
      }
      ref.current.style.width = value.length + 'ch'
    }, [ref, value, value.length])

    return (
      <Container>
        <StyledInput ref={ref} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
        {variant === 'error' && <WarningText variant="body1">{errorText}</WarningText>}
        {value && <StyledTooltip data-text={helperText} />}
      </Container>
    )
  }
)

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
