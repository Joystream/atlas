import React from 'react'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'
import { RadioInput } from '../RadioInput'

type RadioButtonProps = Partial<{
  selectedValue: string | number
  label: string
  helperText?: string
  className?: string
  error?: boolean
}> &
  React.InputHTMLAttributes<HTMLInputElement>

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, selectedValue, label, helperText, className, disabled, error, onChange, ...props }, ref) => {
    return (
      <RadioAndCheckboxBase
        disabled={disabled}
        className={className}
        label={label}
        error={error}
        helperText={helperText}
      >
        <RadioInput
          {...props}
          ref={ref}
          error={error}
          disabled={disabled}
          onChange={onChange}
          value={value}
          selectedValue={selectedValue}
        />
      </RadioAndCheckboxBase>
    )
  }
)

RadioButton.displayName = 'RadioButton'
