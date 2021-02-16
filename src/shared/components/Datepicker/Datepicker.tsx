import React, { forwardRef, useState } from 'react'
import InputBase from '../InputBase'
import { DateInput } from './Datepicker.style'

export type DatepickerProps = {
  required?: boolean
  error?: boolean
  disabled?: boolean
}

const DatepickerComponent: React.ForwardRefRenderFunction<HTMLInputElement, DatepickerProps> = (
  { error, disabled, required },
  ref
) => {
  return (
    <InputBase error={error} disabled={disabled}>
      <label>
        <DateInput
          ref={ref}
          disabled={disabled}
          error={error}
          type="text"
          required={required}
          tabIndex={disabled ? -1 : 0}
          placeholder="DD / MM / YYYY"
        />
      </label>
    </InputBase>
  )
}

const Datepicker = forwardRef(DatepickerComponent)

Datepicker.displayName = 'Datepicker'

export default Datepicker
