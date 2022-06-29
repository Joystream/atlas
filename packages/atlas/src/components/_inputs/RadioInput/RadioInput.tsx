import { ChangeEvent, InputHTMLAttributes, forwardRef } from 'react'

import { CustomRadioInputProps, Input, RadioInputWrapper, StyledRadioInput } from './RadioInput.styles'

export type RadioInputProps = {
  selectedValue?: string | number | boolean | null
  className?: string
  value?: string | number | boolean
  onChange?: (e: ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string | boolean }>) => void
} & CustomRadioInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

const TRUE = 'true'
const FALSE = 'false'

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ error, disabled, value, selectedValue, onChange, className, ...props }, ref) => {
    const isSelected = value === selectedValue
    const valueIsBoolean = value === true || value === false
    const normalizedValue = value === true ? TRUE : value === false ? FALSE : value
    const handleBooleanChange = (e: ChangeEvent<HTMLInputElement>) => {
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value: !!value,
        },
      }
      onChange?.(modifiedEvent)
    }
    return (
      <RadioInputWrapper className={className} checked={isSelected} error={error} disabled={disabled}>
        <Input
          {...props}
          ref={ref}
          value={normalizedValue}
          type="radio"
          disabled={disabled}
          checked={isSelected}
          onChange={!valueIsBoolean ? onChange : handleBooleanChange}
          error={error}
        />
        <StyledRadioInput error={error} disabled={disabled} />
      </RadioInputWrapper>
    )
  }
)

RadioInput.displayName = 'RadioInput'
