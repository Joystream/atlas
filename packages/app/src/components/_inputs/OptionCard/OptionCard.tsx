import React from 'react'

import { Text } from '@/components/Text'

import { InputAndTitleWrapper, OptionCardLabel, OptionCardTitle } from './OptionCard.styles'

import { RadioInput } from '../RadioInput'

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
          <OptionCardTitle variant="h400">{label}</OptionCardTitle>
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
        <Text variant="t100" secondary>
          {helperText}
        </Text>
      </OptionCardLabel>
    )
  }
)

OptionCard.displayName = 'OptionCard'
