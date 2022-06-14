import styled from '@emotion/styled'
import React from 'react'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { media, sizes } from '@/styles'

import { OptionCardCheckbox, OptionCardRadio } from '../OptionCard/OptionCard'

type Checkbox = {
  checkedValues: Array<number>
  onChange?: (id: number) => void
  options: Array<{ label: string; caption?: string }>
}

type Radio = {
  selectedValue?: string | number
  onChange?: (id: string | number) => void
  options: Array<{ label: string; caption?: string; value: string | number }>
}

export type OptionCardGroupProps = {
  disabled?: boolean
  error?: boolean
  icon?: React.ReactNode
  direction?: 'vertical' | 'horizontal'
}

export const OptionCardGroupRadio: React.FC<OptionCardGroupProps & Radio> = ({
  onChange,
  disabled,
  error,
  icon,
  options,
  selectedValue,
  direction = 'horizontal',
}) => {
  return (
    <Wrapper direction={direction}>
      {options.map((option, idx) => (
        <OptionCardRadio
          disabled={disabled}
          error={error}
          key={`radio-button-group-${idx}`}
          onChange={() => onChange?.(option.value)}
          selectedValue={selectedValue}
          icon={icon}
          {...option}
        />
      ))}
    </Wrapper>
  )
}

export const OptionCardGroupCheckbox: React.FC<OptionCardGroupProps & Checkbox> = ({
  onChange,
  disabled,
  error,
  icon,
  options,
  checkedValues,
  direction = 'horizontal',
}) => {
  return (
    <Wrapper direction={direction}>
      {options.map((option, idx) => (
        <OptionCardCheckbox
          disabled={disabled}
          error={error}
          key={`checkbox-button-group-${idx}`}
          onChange={() => onChange?.(idx)}
          value={checkedValues.includes(idx)}
          icon={icon}
          {...option}
        />
      ))}
    </Wrapper>
  )
}

export const Wrapper = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: grid;
  grid-auto-flow: ${({ direction }) => (direction === 'vertical' ? 'row' : 'column')};
  gap: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
  }
`
