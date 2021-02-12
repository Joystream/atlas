import React, { useState } from 'react'
import { Container, HelperText, StyledInput } from './HeaderTextField.style'

export type HeaderTextFieldProps = {
  value: string
  helperText?: string
  error?: boolean
  warning?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const HeaderTextField = React.forwardRef<HTMLInputElement, HeaderTextFieldProps>(
  ({ value, helperText, error, warning, onChange }, ref) => {
    const [valueLength, setValueLength] = useState(value.length)
    const controlled = onChange?.name === 'onChange'
    return (
      <Container>
        <StyledInput
          ref={ref}
          type="text"
          defaultValue={value}
          onChange={onChange}
          widthSize={controlled ? value.length : valueLength}
          onBlur={(e) => setValueLength(e.target.value.length)}
          required
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

HeaderTextField.displayName = 'HeaderTextField'

export default HeaderTextField
