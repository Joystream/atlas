import React from 'react'

import { RadioButtonLabel, RadioButtonStyleProps, StyledHelperText } from './RadioButton.style'

import { RadioInput } from '../RadioInput'
import { Text } from '../Text'

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
        <RadioInput
          {...props}
          ref={ref}
          error={error}
          disabled={disabled}
          onChange={onChange}
          value={value}
          selectedValue={selectedValue}
        />
        {label && <Text variant="body1">{label}</Text>}
        {helperText && <StyledHelperText helperText={helperText} error={error} />}
      </RadioButtonLabel>
    )
  }
)

RadioButton.displayName = 'RadioButton'
