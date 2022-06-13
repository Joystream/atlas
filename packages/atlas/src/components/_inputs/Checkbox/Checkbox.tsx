import React from 'react'

import { SvgActionMinus } from '@/components/_icons'

import { CheckboxInput, Checkmark, Container, StyledGlyphCheck } from './Checkbox.styles'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'

type HTMLCheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  name?: string
  value?: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  caption?: string
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
      caption,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = indeterminate || false
    const isSelected = value

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(!value, e)
      }
    }

    return (
      <RadioAndCheckboxBase
        disabled={disabled}
        label={label}
        error={error}
        caption={caption}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Container>
          <CheckboxInput
            name={name}
            ref={ref}
            type="checkbox"
            checked={isSelected}
            disabled={disabled}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            error={error}
            {...props}
          />
          <Checkmark error={error}>
            {!isSelected ? null : isIndeterminate ? <SvgActionMinus /> : <StyledGlyphCheck />}
          </Checkmark>
        </Container>
      </RadioAndCheckboxBase>
    )
  }
)

Checkbox.displayName = 'Checkbox'
