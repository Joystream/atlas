import styled from '@emotion/styled'
import { ChangeEvent, FC } from 'react'

import { Checkbox, CheckboxProps } from '@/components/_inputs/Checkbox'
import { sizes } from '@/styles'

export type CheckboxGroupProps = {
  options: CheckboxProps[]
  onChange?: (id: number, event: ChangeEvent<HTMLInputElement>) => void
  checkedIds?: number[]
  name?: string
  disabled?: boolean
  error?: boolean
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  options,
  checkedIds = [],
  onChange,
  name,
  disabled,
  error,
}) => {
  return (
    <Wrapper>
      {options.map((option, idx) => (
        <Checkbox
          disabled={disabled}
          error={error}
          name={name}
          key={`radio-button-group-${idx}`}
          onChange={(_, event) => onChange?.(idx, event)}
          {...option}
          value={checkedIds.includes(idx)}
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
