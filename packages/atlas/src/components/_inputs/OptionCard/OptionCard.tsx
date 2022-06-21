import { FC, PropsWithChildren, ReactNode, forwardRef } from 'react'

import { Text } from '@/components/Text'

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

export type OptionCardProps = PropsWithChildren<{
  checked?: boolean
  label: string
  helperText?: string
  error?: boolean
  disabled?: boolean
  icon?: ReactNode
  className?: string
}>
export const OptionCardBase: FC<OptionCardProps> = ({
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
          <OptionCardTitle as="span" color={error ? 'colorTextError' : undefined} variant="h400">
            {label}
          </OptionCardTitle>
        </TitleIconWrapper>
        {children}
      </InputAndTitleWrapper>
      <Text as="span" variant="t100" color="colorText">
        {helperText}
      </Text>
    </OptionCardLabel>
  )
}

export const OptionCardRadio = forwardRef<HTMLInputElement, OptionCardProps & RadioType>(
  ({ helperText, label, selectedValue, className, value, onChange, icon, disabled, error, ...props }, ref) => {
    return (
      <OptionCardBase
        icon={icon}
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

export const OptionCardCheckbox = forwardRef<HTMLInputElement, OptionCardProps & CheckboxType>(
  ({ helperText, label, className, value, onChange, icon, disabled, error, ...props }, ref) => {
    return (
      <OptionCardBase
        icon={icon}
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
