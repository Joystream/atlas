import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef } from 'react'

import { SvgActionMinus } from '@/assets/icons'

import { CheckboxInput, Checkmark, Container, StyledGlyphCheck } from './Checkbox.styles'

import { RadioAndCheckboxBase } from '../RadioAndCheckboxBase'

type HTMLCheckboxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  name?: string
  value?: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
  caption?: string
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
      caption,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = indeterminate || false
    const isSelected = value

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
