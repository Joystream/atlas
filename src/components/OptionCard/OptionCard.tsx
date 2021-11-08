import React from 'react'

import { InputAndTitleWrapper, OptionCardLabel, OptionCardTitle } from './OptionCard.styles'

import { RadioInput } from '../RadioInput'
import { Text } from '../Text'

export type OptionCardProps = {
  label: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  selectedValue: string | number
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const OptionCard = React.forwardRef<HTMLInputElement, OptionCardProps>(
  ({ helperText, label, selectedValue, className, value, onChange, disabled, error, ...props }, ref) => {
    return (
      <OptionCardLabel disabled={disabled} checked={value === selectedValue} error={error} className={className}>
        <InputAndTitleWrapper>
          <OptionCardTitle variant="subtitle1">{label}</OptionCardTitle>
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
      </OptionCardLabel>
    )
  }
)

OptionCard.displayName = 'OptionCard'
