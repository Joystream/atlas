import { format, isValid, parse } from 'date-fns'
import React, { forwardRef, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import { TextField } from '../forms/TextField'

const DATE_FORMAT = 'dd/MM/yyyy'

export type DatepickerProps = {
  name?: string
  value?: Date | null
  required?: boolean
  error?: boolean
  disabled?: boolean
  helperText?: string
  onChange: (date: Date | null) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const DatepickerComponent: React.ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { name, value, required, error, disabled, helperText, onChange, onBlur },
  ref
) => {
  const [rawValue, setRawValue] = useState<string>()

  useEffect(() => {
    if (value && isValid(value)) {
      setRawValue(format(value, DATE_FORMAT))
    } else if (!value) {
      setRawValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRawValue(value)

    const parsedDate = value ? parse(e.target.value, DATE_FORMAT, new Date()) : null
    onChange(parsedDate)
  }

  return (
    <NumberFormat
      value={rawValue}
      getInputRef={ref}
      customInput={TextField}
      name={name}
      format="##/##/####"
      placeholder="DD / MM / YYYY"
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

export const Datepicker = forwardRef(DatepickerComponent)

Datepicker.displayName = 'Datepicker'
