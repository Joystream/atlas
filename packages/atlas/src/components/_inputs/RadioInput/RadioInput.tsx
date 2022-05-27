import { InputHTMLAttributes, forwardRef } from 'react'

import { CustomRadioInputProps, Input, RadioInputWrapper, StyledRadioInput } from './RadioInput.styles'

export type RadioInputProps = Partial<{
  selectedValue: string | number
  className?: string
}> &
  CustomRadioInputProps &
  InputHTMLAttributes<HTMLInputElement>

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ error, disabled, value, selectedValue, onChange, className, ...props }, ref) => {
    const isSelected = value === selectedValue
    return (
      <RadioInputWrapper className={className} checked={isSelected} error={error} disabled={disabled}>
        <Input
          {...props}
          ref={ref}
          value={value}
          type="radio"
          disabled={disabled}
          checked={isSelected}
          onChange={onChange}
          error={error}
        />
        <StyledRadioInput error={error} disabled={disabled} />
      </RadioInputWrapper>
    )
  }
)

RadioInput.displayName = 'RadioInput'
