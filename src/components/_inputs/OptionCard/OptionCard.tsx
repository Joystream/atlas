import React from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import {
  IconContainer,
  InputAndTitleWrapper,
  OptionCardLabel,
  OptionCardTitle,
  TitleIconWrapper,
} from './OptionCard.styles'

import { RadioInput } from '../RadioInput'

export type OptionCardProps = {
  label: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  selectedValue: string | number
  icon?: React.ReactNode
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const OptionCard = React.forwardRef<HTMLInputElement, OptionCardProps>(
  ({ helperText, label, selectedValue, className, value, onChange, icon, disabled, error, ...props }, ref) => {
    return (
      <OptionCardLabel disabled={disabled} checked={value === selectedValue} error={error} className={className}>
        <InputAndTitleWrapper>
          <TitleIconWrapper>
            {!!icon && (
              <IconContainer disabled={disabled} error={error} checked={value === selectedValue}>
                {icon}
              </IconContainer>
            )}
            <OptionCardTitle color={error ? cVar('colorTextError') : undefined} variant="h400">
              {label}
            </OptionCardTitle>
          </TitleIconWrapper>
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
