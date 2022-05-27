import { ChangeEvent, DetailedHTMLProps, FocusEvent, InputHTMLAttributes, forwardRef, useState } from 'react'

import { SvgActionMinus } from '@/components/_icons'

import { Checkmark, Container, InnerContainer, Input, StyledGlyphCheck } from './Checkbox.styles'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'

type HTMLCheckboxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  name?: string
  value: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void
  label?: string
  helperText?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(!value, e)
      }
    }
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(true)
        if (onFocus) {
          onFocus(e)
        }
      }
    }
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(false)
        if (onBlur) {
          onBlur(e)
        }
      }
    }

    return (
      <RadioAndCheckboxBase
        disabled={disabled}
        label={label}
        error={error}
        helperText={helperText}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Container selected={value} disabled={disabled} isFocused={isFocused} error={error}>
          <InnerContainer selected={value} disabled={disabled} error={error} isFocused={isFocused}>
            <Input
              name={name}
              ref={ref}
              type="checkbox"
              checked={isSelected}
              disabled={disabled}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            <Checkmark>{!isSelected ? null : isIndeterminate ? <SvgActionMinus /> : <StyledGlyphCheck />}</Checkmark>
          </InnerContainer>
        </Container>
      </RadioAndCheckboxBase>
    )
  }
)

Checkbox.displayName = 'Checkbox'
