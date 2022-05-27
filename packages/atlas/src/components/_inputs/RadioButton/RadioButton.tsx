import { InputHTMLAttributes, forwardRef } from 'react'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'
import { RadioInput } from '../RadioInput'

export type RadioButtonProps = Partial<{
  selectedValue: string | number
  label: string
  caption?: string
  className?: string
  error?: boolean
}> &
  InputHTMLAttributes<HTMLInputElement>

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
