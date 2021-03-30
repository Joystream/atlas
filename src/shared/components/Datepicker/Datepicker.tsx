import React, { forwardRef } from 'react'
import { parse } from 'date-fns'
import NumberFormat from 'react-number-format'
import TextField from '../TextField'

export type DatepickerProps = {
  name?: string
  value?: string
  required?: boolean
  error?: boolean
  disabled?: boolean
  helperText?: string
  onChange: (date: string | null) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const DatepickerComponent: React.ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { name, value, required, error, disabled, helperText, onChange, onBlur },
  ref
) => {
  const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    console.log(e.target.value)
    if (!e.target.value) {
      onChange(null)
    } else {
      onChange(e.target.value)
    }
  }
  return (
    <NumberFormat
      value={value}
      getInputRef={ref}
      customInput={TextField}
      name={name}
      format="##/##/####"
      label="DD / MM / YYYY"
      mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
      helperText={helperText}
      error={error}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      onBlur={onBlur}
    />
  )
}

const Datepicker = forwardRef(DatepickerComponent)

Datepicker.displayName = 'Datepicker'

export default Datepicker
