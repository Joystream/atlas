import styled from '@emotion/styled'
import React from 'react'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { media, sizes } from '@/styles'

import { OptionCardCheckbox, OptionCardRadio } from '../OptionCard/OptionCard'

type Checkbox = {
  checkedValues: Array<number>
  onChange?: (id: number) => void
  options: Array<{ label: string; caption?: string; icon?: React.ReactNode }>
}

type Radio = {
  selectedValue?: string | number
  onChange?: (value: string | number) => void
  options: Array<{ label: string; caption?: string; value: string | number; icon?: React.ReactNode }>
}

export type OptionCardGroupProps = {
  disabled?: boolean
  error?: boolean
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export const OptionCardGroupRadio: React.FC<OptionCardGroupProps & Radio> = ({
  onChange,
  disabled,
  error,
  options,
  selectedValue,
  direction = 'horizontal',
  className,
}) => {
  return (
    <Wrapper className={className} direction={direction}>
      {options.map((option, idx) => (
        <OptionCardRadio
          disabled={disabled}
          error={error}
          key={`radio-button-group-${idx}`}
          onChange={() => onChange?.(option.value)}
          selectedValue={selectedValue}
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
  options,
  checkedValues,
  direction = 'horizontal',
  className,
}) => {
  return (
    <Wrapper className={className} direction={direction}>
      {options.map((option, idx) => (
        <OptionCardCheckbox
          disabled={disabled}
          error={error}
          key={`checkbox-button-group-${idx}`}
          onChange={() => onChange?.(idx)}
          value={checkedValues.includes(idx)}
          {...option}
        />
      ))}
    </Wrapper>
  )
}

export const Wrapper = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: grid;
  grid-auto-flow: ${({ direction }) => (direction === 'vertical' ? 'row' : 'column')};
  grid-auto-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
  }
`
