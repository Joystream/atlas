import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { Counter, StyledButton } from '@/components/FilterButton/FilterButton.styles'
import { CheckboxGroup } from '@/components/_inputs/CheckboxGroup'
import { PriceRangeInput } from '@/components/_inputs/PriceRangeInput'
import { DialogPopover } from '@/components/_overlays/DialogPopover'

import { RadioButtonGroup } from '../_inputs/RadioButtonGroup'

export type FilterButtonOption = {
  value: string
  label: string
  selected: boolean
  applied: boolean
}

export type FilterRange = {
  min?: number
  max?: number
  appliedMin?: number
  appliedMax?: number
}

export const isFilterRange = (value: FilterRange | FilterButtonOption[]): value is FilterRange => 'min' in value

export type FilterButtonProps = {
  name: string
  label?: string
  icon?: ReactNode
  className?: string
  type: 'checkbox' | 'radio' | 'range'
  onChange: (value: FilterRange | FilterButtonOption[]) => void
  range?: FilterRange
  options?: FilterButtonOption[]
}

export type SectionFilter = Omit<FilterButtonProps, 'onChange'>

export const FilterButton: FC<FilterButtonProps> = (props) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstRangeInput = useRef<HTMLInputElement | null>(null)
  const [shouldFocus, setShouldFocus] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && shouldFocus) {
      firstRangeInput.current?.focus()
      setShouldFocus(false)
    }
  }, [inView, shouldFocus])

  if (props.type === 'checkbox' || props.type === 'radio') {
    const { type, name, onChange, className, icon, label, options = [] } = props

    const counter = options.filter((option) => option.applied)?.length

    const handleApply = () => {
      onChange(options.map((option) => ({ ...option, applied: option.selected })))
      triggerRef.current?.click()
    }

    const handleCheckboxSelection = (num: number) => {
      const selected = options.map((option, idx) => {
        if (num === idx) {
          return { ...option, selected: !option.selected }
        }
        return option
      })
      onChange(selected)
    }

    const handleRadioButtonClick = (e: ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string | boolean }>) => {
      const optionIdx = options.findIndex((option) => option.value === e.currentTarget.value)
      const selected = options.map((option, idx) => ({ ...option, selected: optionIdx === idx }))
      onChange(selected)
    }

    const handleClear = () => {
      onChange(options.map((option) => ({ ...option, selected: false, applied: false })))
      triggerRef.current?.click()
    }

    return (
      <DialogPopover
        className={className}
        flipEnabled
        appendTo={document.body}
        trigger={
          <StyledButton
            ref={triggerRef}
            icon={counter ? <Counter>{counter}</Counter> : icon}
            iconPlacement="right"
            variant="secondary"
          >
            {label}
          </StyledButton>
        }
        primaryButton={{ text: 'Apply', onClick: handleApply }}
        secondaryButton={{
          text: 'Clear',
          onClick: handleClear,
        }}
      >
        {type === 'checkbox' && (
          <CheckboxGroup
            name={name}
            options={options.map((option) => ({ ...option, value: option.selected }))}
            checkedIds={options.map((option, index) => (option.selected ? index : -1)).filter((index) => index !== -1)}
            onChange={handleCheckboxSelection}
          />
        )}
        {type === 'radio' && (
          <RadioButtonGroup
            name={name}
            options={options}
            value={options.find((option) => option.selected)?.value}
            onChange={handleRadioButtonClick}
          />
        )}
      </DialogPopover>
    )
  }

  if (props.type === 'range') {
    const { onChange, className, icon, label, range } = props

    const isApplied = Boolean(range?.appliedMax || range?.appliedMin)

    const handleApply = () => {
      onChange({ ...range, appliedMin: range?.min, appliedMax: range?.max })
      triggerRef.current?.click()
    }

    const handleClear = () => {
      onChange({ min: undefined, max: undefined, appliedMin: undefined, appliedMax: undefined })
      triggerRef.current?.click()
    }

    return (
      <DialogPopover
        className={className}
        flipEnabled
        onShow={() => setShouldFocus(true)}
        appendTo={document.body}
        trigger={
          <StyledButton
            ref={triggerRef}
            icon={isApplied ? <Counter>1</Counter> : icon}
            iconPlacement="right"
            variant="secondary"
          >
            {label}
          </StyledButton>
        }
        primaryButton={{ text: 'Apply', onClick: handleApply }}
        secondaryButton={{
          text: 'Clear',
          onClick: handleClear,
        }}
      >
        <PriceRangeInput
          ref={(inputRef) => {
            ref(inputRef)
            firstRangeInput.current = inputRef
          }}
          value={range}
          onChange={(value) => onChange({ ...range, ...value })}
        />
      </DialogPopover>
    )
  }

  return null
}
