import React, { useState } from 'react'
import { Container, Input, Checkmark, CheckboxLabel, LabelText } from '@/shared/components/Checkbox/Checkbox.styles'
import { StyledInnerContainer } from './RadioButton.style'

export type RadioButtonProps = {
  name?: string
  value: string
  selected: string
  disabled?: boolean
  error?: boolean
  label?: string
  onChange: (value: string) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ name, value, selected, disabled = false, onChange, onFocus, onBlur, error = false, label, ...props }, ref) => {
    const isSelected = value === selected
    const [isFocused, setIsFocused] = useState(false)

    const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(true)
        if (onFocus) {
          onFocus(e)
        }
      }
    }
    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(false)
        if (onBlur) {
          onBlur(e)
        }
      }
    }
    return (
      <CheckboxLabel disabled={disabled}>
        <Container
          selected={isSelected}
          disabled={disabled}
          isFocused={isFocused}
          error={error}
          onClick={() => {
            onChange(value)
          }}
        >
          <StyledInnerContainer selected={isSelected} disabled={disabled} error={error} isFocused={isFocused}>
            <Input
              name={name}
              ref={ref}
              type="radio"
              value={value}
              defaultChecked={isSelected}
              disabled={disabled}
              onFocus={onFocusHandler}
              onBlur={onBlurHandler}
              {...props}
            />
            <Checkmark />
          </StyledInnerContainer>
        </Container>
        {label && <LabelText variant="subtitle2">{label}</LabelText>}
      </CheckboxLabel>
    )
  }
)

RadioButton.displayName = 'RadioButton'

export default RadioButton
