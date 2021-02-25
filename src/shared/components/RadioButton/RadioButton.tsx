import React, { useState } from 'react'
import { Container, Input, Checkmark } from '@/shared/components/Checkbox/Checkbox.styles'
import { StyledInnerContainer } from './RadioButton.style'

export type RadioButtonProps = {
  name?: string
  defaultValue?: string
  defaultChecked?: boolean
  disabled?: boolean
  error?: boolean
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ name, defaultValue, defaultChecked, disabled = false, onFocus, onBlur, error = false, ...props }, ref) => {
    const isSelected = !!defaultChecked
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
      <Container selected={isSelected} disabled={disabled} isFocused={isFocused} error={error}>
        <StyledInnerContainer selected={isSelected} disabled={disabled} error={error} isFocused={isFocused}>
          <Input
            name={name}
            ref={ref}
            type="radio"
            defaultValue={defaultValue}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            {...props}
          />
          <Checkmark />
        </StyledInnerContainer>
      </Container>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
