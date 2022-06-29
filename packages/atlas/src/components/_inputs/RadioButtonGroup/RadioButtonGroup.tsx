import styled from '@emotion/styled'
import { forwardRef } from 'react'

import { RadioButton, RadioButtonProps } from '@/components/_inputs/RadioButton'
import { sizes } from '@/styles'

export type RadioButtonGroupProps = {
  options: Omit<RadioButtonProps, 'selectedValue'>[]
} & Omit<RadioButtonProps, 'selectedValue'>

export const RadioButtonGroup = forwardRef<HTMLDivElement, RadioButtonGroupProps>(
  ({ options, value, onChange, name, disabled, error, caption, className }, ref) => {
    return (
      <Wrapper className={className} ref={ref}>
        {options.map((option) => (
          <RadioButton
            disabled={disabled}
            error={error}
            name={name}
            key={`radio-button-group-${option.value}`}
            onChange={onChange}
            selectedValue={value}
            caption={caption || option.caption}
            {...option}
          />
        ))}
      </Wrapper>
    )
  }
)

RadioButtonGroup.displayName = 'RadioButtonGroup'

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${sizes(2)};
`
