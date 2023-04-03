import { ChangeEvent, FC, ReactNode, useRef, useState } from 'react'

import { Counter, StyledButton } from '@/components/FilterButton/FilterButton.styles'
import { CheckboxProps } from '@/components/_inputs/Checkbox'
import { CheckboxGroup } from '@/components/_inputs/CheckboxGroup'
import { DialogPopover } from '@/components/_overlays/DialogPopover'

import { RadioButtonProps } from '../_inputs/RadioButton'
import { RadioButtonGroup } from '../_inputs/RadioButtonGroup'

export type RadioOption = Pick<RadioButtonProps, 'value' | 'label' | 'id'>
export type CheckboxOption = Pick<CheckboxProps, 'value' | 'label' | 'id'>

export type FilterButtonRadio = {
  type: 'radio'
  options: RadioOption[]
  selectedOption?: RadioOption | null
  onApply: (selectedOption: RadioOption | null) => void
}

export type FilterButtonCheckbox = {
  type: 'checkbox'
  options: CheckboxOption[]
  selectedOptions?: CheckboxOption[]
  onApply: (selectedIndexes: CheckboxOption[]) => void
}

type SharedFilterButtonProps = {
  label?: string
  icon?: ReactNode
  className?: string
}

export type FilterButtonProps = (FilterButtonCheckbox | FilterButtonRadio) & SharedFilterButtonProps

export const FilterButton: FC<FilterButtonProps> = (props) => {
  const { type, onApply, className, icon, label, options } = props

  const counter = type === 'checkbox' ? props.selectedOptions?.length : props.selectedOption && 1
  const [locallySelectedCheckboxIndexes, setLocallyCheckboxSelectedIndexes] = useState<number[]>([])
  const [locallySelectedRadioOption, setLocallySelectedRadioOption] = useState<string>()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleApply = () => {
    type === 'checkbox' && onApply(options.filter((_, idx) => locallySelectedCheckboxIndexes.includes(idx)))
    if (type === 'radio') {
      onApply(options.find((option) => option.value?.toString() === locallySelectedRadioOption?.toString()) || {})
    }
    triggerRef.current?.click()
  }

  const handleCheckboxSelection = (num: number) => {
    setLocallyCheckboxSelectedIndexes((prev) => {
      if (prev.includes(num)) {
        return prev.filter((prevNum) => prevNum !== num)
      } else {
        return [...prev, num]
      }
    })
  }

  const handleRadioButtonClick = (e: ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string | boolean }>) => {
    setLocallySelectedRadioOption(e.currentTarget.value.toString())
  }

  const handleClear = () => {
    if (type === 'checkbox') {
      onApply([])
    } else {
      onApply(null)
    }
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
      onShow={() => {
        if (type === 'checkbox') {
          const selectedIndexes = props.selectedOptions?.map((_, idx) => idx) || []
          setLocallyCheckboxSelectedIndexes(selectedIndexes)
        } else {
          const selectedOption = props.selectedOption?.value?.toString()
          setLocallySelectedRadioOption(selectedOption)
        }
      }}
    >
      {type === 'checkbox' && (
        <CheckboxGroup
          options={options}
          checkedIds={locallySelectedCheckboxIndexes}
          onChange={handleCheckboxSelection}
        />
      )}
      {type === 'radio' && (
        <RadioButtonGroup
          name="aaaa"
          options={options}
          value={locallySelectedRadioOption}
          onChange={handleRadioButtonClick}
        />
      )}
    </DialogPopover>
  )
}
