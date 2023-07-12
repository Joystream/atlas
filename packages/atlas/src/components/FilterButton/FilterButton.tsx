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
  const [filterValue, setFilterValue] = useState<FilterRange | FilterButtonOption[] | undefined>(
    props.type === 'range' ? props.range : props.options
  )
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && shouldFocus) {
      firstRangeInput.current?.focus()
      setShouldFocus(false)
    }
  }, [inView, shouldFocus])

  if (props.type === 'checkbox' || props.type === 'radio') {
    const { type, name, onChange, className, icon, label, options = [] } = props

    const currentValue = filterValue as FilterButtonOption[]
    const counter = currentValue.filter((option) => option.applied)?.length
    const handleApply = () => {
      onChange(currentValue.map((option) => ({ ...option, applied: option.selected })))
      triggerRef.current?.click()
    }

    const handleCheckboxSelection = (num: number) => {
      const selected = currentValue.map((option, idx) => {
        if (num === idx) {
          return { ...option, selected: !option.selected }
        }
        return option
      })
      setFilterValue(selected)
    }

    const handleRadioButtonClick = (e: ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string | boolean }>) => {
      const optionIdx = currentValue.findIndex((option) => option.value === e.currentTarget.value)
      const selected = currentValue.map((option, idx) => ({ ...option, selected: optionIdx === idx }))
      setFilterValue(selected)
    }

    const handleClear = () => {
      setFilterValue(currentValue.map((option) => ({ ...option, selected: false, applied: false })))
      onChange(currentValue)
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
            options={currentValue.map((option) => ({ ...option, value: option.selected }))}
            checkedIds={currentValue
              .map((option, index) => (option.selected ? index : -1))
              .filter((index) => index !== -1)}
            onChange={handleCheckboxSelection}
          />
        )}
        {type === 'radio' && (
          <RadioButtonGroup
            name={name}
            options={currentValue}
            value={currentValue.find((option) => option.selected)?.value}
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
      const currentValue = filterValue as FilterRange
      onChange({ ...currentValue, appliedMin: currentValue?.min, appliedMax: currentValue?.max })
      triggerRef.current?.click()
    }

    const handleClear = () => {
      setFilterValue({ min: undefined, max: undefined, appliedMin: undefined, appliedMax: undefined })
      if (filterValue) {
        onChange(filterValue)
      }
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
          value={filterValue as FilterRange}
          onChange={(value) => setFilterValue({ ...range, ...value })}
        />
      </DialogPopover>
    )
  }

  return null
}
