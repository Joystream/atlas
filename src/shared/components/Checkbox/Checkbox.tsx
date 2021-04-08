import React, { useState } from 'react'
import Icon from '../Icon'
import {
  CheckboxLabel,
  Checkmark,
  Container,
  InnerContainer,
  Input,
  LabelText,
  StyledHelperText,
} from './Checkbox.styles'

type HTMLCheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  name?: string
  value: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void
  label?: string
  helperText?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      name,
      value,
      indeterminate,
      onChange,
      disabled = false,
      onFocus,
      onBlur,
      error = false,
      className,
      label,
      helperText,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = indeterminate || false
    const isSelected = !!value
    const [isFocused, setIsFocused] = useState(false)

    const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(!value)
      }
    }
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(true)
        if (onFocus) {
          onFocus(e)
        }
      }
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(false)
        if (onBlur) {
          onBlur(e)
        }
      }
    }

    return (
      <>
        <CheckboxLabel disabled={disabled}>
          <Container selected={value} disabled={disabled} isFocused={isFocused} error={error}>
            <InnerContainer selected={value} disabled={disabled} error={error} isFocused={isFocused}>
              <Input
                name={name}
                ref={ref}
                type="checkbox"
                data-multiple="false"
                checked={isSelected}
                disabled={disabled}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
              />
              <Checkmark>{isSelected ? <Icon name={isIndeterminate ? 'dash' : 'check'} /> : null}</Checkmark>
            </InnerContainer>
          </Container>
          {label && <LabelText variant="body1">{label}</LabelText>}
        </CheckboxLabel>
        <StyledHelperText helperText={helperText} error={error} />
      </>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
