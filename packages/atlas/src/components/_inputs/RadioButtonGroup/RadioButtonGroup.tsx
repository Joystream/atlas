import styled from '@emotion/styled'
import React from 'react'

import { RadioButton, RadioButtonProps } from '@/components/_inputs/RadioButton'
import { sizes } from '@/styles'

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
    <Wrapper>
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
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${sizes(2)};
`
