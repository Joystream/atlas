import styled from '@emotion/styled'
import { forwardRef } from 'react'

import { SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Input } from '@/components/_inputs/Input'
import { sizes } from '@/styles'

export type InputRange = {
  min?: number
  max?: number
}

type RangeInputsProps = {
  value?: InputRange
  onChange?: (value: InputRange) => void
}
export const PriceRangeInput = forwardRef<HTMLInputElement, RangeInputsProps>(
  ({ onChange, value }: RangeInputsProps, ref) => {
    return (
      <InputsContainer>
        <Input
          ref={ref}
          type="number"
          size="medium"
          nodeStart={<SvgJoyTokenMonochrome16 />}
          placeholder="Min"
          value={value?.min ?? ''}
          onChange={(e) => onChange?.({ ...value, min: parseInt(e.target.value, 10) })}
        />
        <Input
          type="number"
          size="medium"
          nodeStart={<SvgJoyTokenMonochrome16 />}
          placeholder="Max"
          value={value?.max ?? ''}
          onChange={(e) => onChange?.({ ...value, max: parseInt(e.target.value, 10) })}
        />
      </InputsContainer>
    )
  }
)

PriceRangeInput.displayName = 'PriceRangeInput'

const InputsContainer = styled.div`
  display: flex;
  gap: ${sizes(2)};
`
