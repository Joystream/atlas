import React from 'react'

import { InputAndTitleWrapper, RadioCardLabel, RadioCardTitle } from './RadioCardButton.styles'

import { RadioInput } from '../RadioInput'
import { Text } from '../Text'

export type RadioCardButtonProps = {
  label: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  selectedValue: string | number
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const RadioCardButton = React.forwardRef<HTMLInputElement, RadioCardButtonProps>(
  ({ helperText, label, selectedValue, className, value, onChange, disabled, error, ...props }, ref) => {
    return (
      <RadioCardLabel disabled={disabled} selected={value === selectedValue} error={error} className={className}>
        <InputAndTitleWrapper>
          <RadioCardTitle variant="subtitle1">{label}</RadioCardTitle>
          <RadioInput
            {...props}
            ref={ref}
            selectedValue={selectedValue}
            value={value}
            error={error}
            disabled={disabled}
            onChange={onChange}
          />
        </InputAndTitleWrapper>
        <Text variant="caption" secondary>
          {helperText}
        </Text>
      </RadioCardLabel>
    )
  }
)

RadioCardButton.displayName = 'RadioCardButton'
