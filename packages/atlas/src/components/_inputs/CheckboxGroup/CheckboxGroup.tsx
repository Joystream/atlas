import styled from '@emotion/styled'
import React from 'react'

import { Checkbox, CheckboxProps } from '@/components/_inputs/Checkbox'
import { sizes } from '@/styles'

export type CheckboxGroupProps = {
  options: CheckboxProps[]
  onChange?: (id: number, event: React.ChangeEvent<HTMLInputElement>) => void
  value: number[]
  name?: string
  disabled?: boolean
  error?: boolean
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, value, onChange, name, disabled, error }) => {
  return (
    <Wrapper>
      {options.map((option, idx) => (
        <Checkbox
          disabled={disabled}
          error={error}
          name={name}
          key={`radio-button-group-${idx}`}
          label="test"
          onChange={(_, event) => onChange?.(idx, event)}
          {...option}
          value={value.includes(idx)}
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
