import { forwardRef } from 'react'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'
import { RadioInput, RadioInputProps } from '../RadioInput'

export type RadioButtonProps = {
  label?: string
  caption?: string
  className?: string
} & RadioInputProps

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, selectedValue, label, caption, className, disabled, error, onChange, ...props }, ref) => {
    return (
      <RadioAndCheckboxBase disabled={disabled} className={className} label={label} error={error} caption={caption}>
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
