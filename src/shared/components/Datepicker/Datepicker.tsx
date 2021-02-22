import React, { forwardRef } from 'react'
import { parse } from 'date-fns'
import NumberFormat from 'react-number-format'
import TextField from '../TextField'

export type DatepickerProps = {
  required?: boolean
  error?: boolean
  disabled?: boolean
  helperText?: string
  onChange: (date: Date) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const DatepickerComponent: React.ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { required, error, disabled, helperText, onChange, onBlur },
  ref
) => {
  const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    const date = parse(e.target.value, 'dd/MM/yyyy', new Date())
    onChange(date)
  }
  return (
    <NumberFormat
      getInputRef={ref}
      customInput={TextField}
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
