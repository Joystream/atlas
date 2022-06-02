import React from 'react'

import { RadioButton, RadioButtonProps } from '@/components/_inputs/RadioButton'

export type RadioButtonGroupProps = {
  options: RadioButtonProps[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string | number
  name?: string
  disabled?: boolean
  error?: boolean
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  value,
  onChange,
  name,
  disabled,
  error,
}) => {
  return (
    <>
      {options.map((option) => (
        <RadioButton
          disabled={disabled}
          error={error}
          name={name}
          key={`radio-button-group-${option.id}`}
          label="test"
          onChange={onChange}
          selectedValue={value}
          {...option}
        />
      ))}
    </>
  )
}
