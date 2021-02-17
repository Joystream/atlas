import React, { forwardRef, useState } from 'react'
import NumberFormat from 'react-number-format'
import { parse, isValid } from 'date-fns'
import TextField from '../TextField'

export type DatepickerProps = {
  required?: boolean
  error?: boolean
  disabled?: boolean
}

const DatepickerComponent: React.ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { required, error, disabled },
  ref
) => {
  const [validationError, setValidationError] = useState(false)
  const validateDate: (event: React.FocusEvent<HTMLInputElement>) => void = (e) => {
    if (!e.target.value) {
      setValidationError(false)
      return
    }
    const date = parse(e.target.value, 'dd/MM/yyyy', new Date())
    setValidationError(!isValid(date))
  }
  return (
    <NumberFormat
      getInputRef={ref}
      customInput={TextField}
      format="##/##/####"
      label="DD / MM / YYYY"
      mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
      onBlur={validateDate}
      error={error || validationError}
      required={required}
      disabled={disabled}
    />
  )
}

const Datepicker = forwardRef(DatepickerComponent)

Datepicker.displayName = 'Datepicker'

export default Datepicker
