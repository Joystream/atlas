import { ChangeEvent, FC, ReactNode, useRef } from 'react'

import { Counter, StyledButton } from '@/components/FilterButton/FilterButton.styles'
import { CheckboxGroup } from '@/components/_inputs/CheckboxGroup'
import { DialogPopover } from '@/components/_overlays/DialogPopover'

import { RadioButtonGroup } from '../_inputs/RadioButtonGroup'

export type FilterButtonOption = {
  value: string
  label: string
  selected: boolean
  applied: boolean
}

export type FilterButtonProps = {
  name: string
  type: 'checkbox' | 'radio'
  label?: string
  icon?: ReactNode
  className?: string
  onChange: (selectedOptions: FilterButtonOption[]) => void
  options?: FilterButtonOption[]
}

export type SectionFilter = Omit<FilterButtonProps, 'onChange'>

export const FilterButton: FC<FilterButtonProps> = ({ type, name, onChange, className, icon, label, options = [] }) => {
  const counter = options.filter((option) => option.applied)?.length
  const triggerRef = useRef<HTMLButtonElement>(null)

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
