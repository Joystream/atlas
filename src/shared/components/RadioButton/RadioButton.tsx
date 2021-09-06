import React from 'react'

import {
  RadioButtonContainer,
  RadioButtonLabel,
  RadioButtonStyleProps,
  StyledHelperText,
  StyledLabelText,
} from './RadioButton.style'

import { RadioInput } from '../RadioInput/RadioInput'

type RadioButtonProps = Partial<{
  selectedValue: string | number
  label: string
  helperText?: string
  className?: string
}> &
  RadioButtonStyleProps &
  React.InputHTMLAttributes<HTMLInputElement>

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, selectedValue, label, helperText, className, disabled, error, onChange, ...props }, ref) => {
    return (
      <RadioButtonLabel disabled={disabled} className={className}>
        <RadioButtonContainer>
          <RadioInput
            {...props}
            ref={ref}
            error={error}
            disabled={disabled}
            onChange={onChange}
            type="radio"
            value={value}
            selectedValue={selectedValue}
          />
        </RadioButtonContainer>
        {label && <StyledLabelText variant="body1">{label}</StyledLabelText>}
        {helperText && <StyledHelperText helperText={helperText} error={error} />}
      </RadioButtonLabel>
    )
  }
)

RadioButton.displayName = 'RadioButton'
