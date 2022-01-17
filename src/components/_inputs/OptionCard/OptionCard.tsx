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

import { Checkbox, CheckboxProps } from '../Checkbox'
import { RadioInput, RadioInputProps } from '../RadioInput'

type CheckboxType = {
  onChange?: (value: boolean) => void
} & CheckboxProps
type RadioType = RadioInputProps

export type OptionCardProps = {
  checked?: boolean
  label: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}
export const OptionCardBase: React.FC<OptionCardProps> = ({
  helperText,
  label,
  icon,
  disabled,
  error,
  checked,
  className,
  children,
}) => {
  return (
    <OptionCardLabel disabled={disabled} checked={checked} error={error} className={className}>
      <InputAndTitleWrapper>
        <TitleIconWrapper>
          {!!icon && (
            <IconContainer disabled={disabled} error={error} checked={checked}>
              {icon}
            </IconContainer>
          )}
          <OptionCardTitle color={error ? cVar('colorTextError') : undefined} variant="h400">
            {label}
          </OptionCardTitle>
        </TitleIconWrapper>
        {children}
      </InputAndTitleWrapper>
      <Text variant="t100" secondary>
        {helperText}
      </Text>
    </OptionCardLabel>
  )
}

export const OptionCardRadio = React.forwardRef<HTMLInputElement, OptionCardProps & RadioType>(
  ({ helperText, label, selectedValue, className, value, onChange, icon, disabled, error, ...props }, ref) => {
    return (
      <OptionCardBase
        label={label}
        helperText={helperText}
        disabled={disabled}
        checked={value === selectedValue}
        error={error}
        className={className}
      >
        <RadioInput
          {...props}
          ref={ref}
          selectedValue={selectedValue}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </OptionCardBase>
    )
  }
)
OptionCardRadio.displayName = 'OptionCardRadio'

export const OptionCardCheckbox = React.forwardRef<HTMLInputElement, OptionCardProps & CheckboxType>(
  ({ helperText, label, className, value, onChange, icon, disabled, error, ...props }, ref) => {
    return (
      <OptionCardBase
        label={label}
        helperText={helperText}
        disabled={disabled}
        checked={value}
        error={error}
        className={className}
      >
        <Checkbox {...props} ref={ref} value={value} disabled={disabled} onChange={onChange} />
      </OptionCardBase>
    )
  }
)
OptionCardCheckbox.displayName = 'OptionCardCheckbox'
