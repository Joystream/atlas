import React from 'react'

import { InputAndTitleWrapper, RadioCardLabel, RadioCardTitle } from './RadioCardButton.styles'

import { RadioInput } from '../RadioInput'
import { Text } from '../Text'

export type RadioCardButtonProps = Partial<{
  label: string
  helperText: string
  selectedValue: string | number
  className?: string
}> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement>

export const RadioCardButton = React.forwardRef<HTMLInputElement, RadioCardButtonProps>(
  ({ helperText, label, selectedValue, className, value, onChange, ...props }, ref) => {
    return (
      <RadioCardLabel selected={value === selectedValue} className={className}>
        <InputAndTitleWrapper>
          <RadioCardTitle variant="subtitle1">{label}</RadioCardTitle>
          <RadioInput {...props} ref={ref} selectedValue={selectedValue} value={value} />
        </InputAndTitleWrapper>
        <Text variant="caption" secondary>
          {helperText}
        </Text>
      </RadioCardLabel>
    )
  }
)

RadioCardButton.displayName = 'RadioCardButton'
