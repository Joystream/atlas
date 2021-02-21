import React, { useState } from 'react'
import Icon from '../Icon'
import { Checkmark, Container, InnerContainer, Input } from './Checkbox.styles'

type HTMLCheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface CheckboxProps extends Omit<HTMLCheckboxProps, 'value' | 'onChange' | 'checked' | 'multiple' | 'ref'> {
  value: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  className?: string
  onChange?: (value: boolean) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ value, indeterminate, onChange, disabled = false, onFocus, onBlur, error = false, className, ...props }, ref) => {
    const isIndeterminate = indeterminate || false
    const [isFocused, setIsFocused] = useState(false)
    const [_value, _setValue] = useState(false)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && onChange) {
        console.log({ value2: !value })
        onChange(!value)
      }
    }
    const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(true)
        if (onFocus) {
          onFocus(e)
        }
      }
    }
    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsFocused(false)
        if (onBlur) {
          onBlur(e)
        }
      }
    }
    return (
      <Container selected={value} disabled={disabled} isFocused={isFocused} error={error} className={className}>
        <InnerContainer selected={value} disabled={disabled} error={error} isFocused={isFocused}>
          <Input
            ref={ref}
            type="checkbox"
            data-multiple="false"
            checked={value}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // onChangeHandler(e)
            }}
            onChange={onChangeHandler}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            {...props}
          />
          <Checkmark>{value ? <Icon name={isIndeterminate ? 'dash' : 'check'} /> : null}</Checkmark>
        </InnerContainer>
      </Container>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
