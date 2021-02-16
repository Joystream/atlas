// this rule gives trouble on forward refed components
/* eslint-disable react/display-name */
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
    const isSelected = !!value
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return (
      <Container
        selected={value}
        disabled={disabled}
        isFocused={isFocused}
        isHovered={isHovered}
        error={error}
        onMouseEnter={() => {
          if (!disabled) {
            setIsHovered(true)
          }
        }}
        onMouseLeave={() => {
          if (!disabled) {
            setIsHovered(false)
          }
        }}
      >
        <InnerContainer isFocused={isFocused} isHovered={isHovered} selected={value} disabled={disabled} error={error}>
          <Input
            ref={ref}
            type="checkbox"
            data-multiple="false"
            checked={isSelected}
            disabled={disabled}
            onChange={() => {
              if (!disabled && onChange) {
                onChange(!value)
              }
            }}
            onFocus={(e) => {
              if (!disabled) {
                setIsFocused(true)
                if (onFocus) {
                  onFocus(e)
                }
              }
            }}
            onBlur={(e) => {
              if (!disabled) {
                setIsFocused(false)
                if (onBlur) {
                  onBlur(e)
                }
              }
            }}
            {...props}
          />
          <Checkmark>{isSelected ? <Icon name={isIndeterminate ? 'dash' : 'check'} /> : null}</Checkmark>
        </InnerContainer>
      </Container>
    )
  }
)

export default Checkbox
