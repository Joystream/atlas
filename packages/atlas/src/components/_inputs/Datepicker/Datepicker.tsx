import { format, isValid, parse } from 'date-fns'
import { ChangeEvent, FocusEvent, ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'

import { Input } from '@/components/_inputs/Input'

const DATE_FORMAT = 'dd/MM/yyyy'

export type DatepickerProps = {
  name?: string
  value?: Date | null
  required?: boolean
  error?: boolean
  disabled?: boolean
  onChange: (date: Date | null) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

const DatepickerComponent: ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { name, value, required, error, disabled, onChange, onBlur },
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRawValue(value)

    const parsedDate = value ? parse(e.target.value, DATE_FORMAT, new Date()) : null
    onChange(parsedDate)
  }

  return (
    <PatternFormat
      value={rawValue}
      getInputRef={ref}
      customInput={Input}
      name={name}
      format="##/##/####"
      placeholder="DD / MM / YYYY"
      mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
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
