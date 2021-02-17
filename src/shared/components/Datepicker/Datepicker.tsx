import React, { forwardRef } from 'react'
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
  const handleInputChange: (e: React.KeyboardEvent<HTMLInputElement>) => void = (e) => {
    const target = e.target as HTMLInputElement
    if (!target.value || e.key === 'Backspace') {
      return
    }
    if (/^[0-9][0-9]$/.test(target.value) || /(^[0-9][0-9](\s+\/\s+)[0-9][0-9]$)/.test(target.value)) {
      target.value = target.value + ' / '
    }
  }
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
          onKeyUp={handleInputChange}
          maxLength={14}
        />
      </label>
    </InputBase>
  )
}

const Datepicker = forwardRef(DatepickerComponent)

Datepicker.displayName = 'Datepicker'

export default Datepicker
