import { ChangeEvent, FC, ReactNode, useState } from 'react'

import { SvgActionFilters } from '@/assets/icons'

import { SectionFilter } from '../FilterButton'
import { Counter } from '../FilterButton/FilterButton.styles'
import { MobileFilterContainer } from '../FiltersBar/FiltersBar.styles'
import { Text } from '../Text'
import { Button } from '../_buttons/Button'
import { CheckboxGroup } from '../_inputs/CheckboxGroup'
import { InputRange, PriceRangeInput } from '../_inputs/PriceRangeInput'
import { RadioButtonGroup } from '../_inputs/RadioButtonGroup'
import { DialogModal, DialogModalProps } from '../_overlays/DialogModal'

export type MobileFilterButtonProps = {
  filters: SectionFilter[]
  onChangeFilters?: (newFilters: SectionFilter[]) => void
}

export const MobileFilterButton: FC<MobileFilterButtonProps> = ({ filters, onChangeFilters }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const counter = filters.reduce((prev, curr) => {
    return prev + (curr.options?.filter((option) => option.applied).length || 0)
  }, 0)

  const handleApply = () => {
    const newFilters = filters.map((filter) => ({
      ...filter,
      options: filter.options?.map((option) => ({ ...option, applied: option.selected })),
      range: { ...filter.range, appliedMin: filter.range?.min, appliedMax: filter.range?.max },
    }))

    onChangeFilters?.(newFilters)
    setIsFiltersOpen(false)
  }

  const handleCheckboxSelection = (name: string, num: number) => {
    const filterIdxToEdit = filters.findIndex((filter) => filter.name === name)
    if (filterIdxToEdit === -1) {
      return
    }

    const newFilters = filters.map((filter, filterIdx) => {
      if (filterIdx === filterIdxToEdit) {
        return {
          ...filter,
          options: filter.options?.map((option, optionIdx) => {
            if (num === optionIdx) {
              return { ...option, selected: !option.selected }
            }
            return option
          }),
        }
      }
      return filter
    })

    onChangeFilters?.(newFilters)
  }

  const handleRadioButtonClick = (e: ChangeEvent<Omit<HTMLInputElement, 'value'> & { value: string | boolean }>) => {
    const filterIdxToEdit = filters.findIndex((filter) => filter.name === e.currentTarget.name)
    if (filterIdxToEdit === -1) {
      return
    }
    const newFilters = filters.map((filter, filterIdx) => {
      if (filterIdx === filterIdxToEdit) {
        const optionIdx = filter.options?.findIndex((option) => option.value === e.currentTarget.value)
        return {
          ...filter,
          options: filter.options?.map((option, idx) => {
            if (optionIdx === idx) {
              return { ...option, selected: true }
            }
            return { ...option, selected: false }
          }),
        }
      }
      return filter
    })

    onChangeFilters?.(newFilters)
  }

  const handleRangeChange = (name: string, range: InputRange) => {
    const newFilters = filters.map((filter) => {
      if (filter.name === name) {
        return {
          ...filter,
          range,
        }
      }
      return filter
    })

    onChangeFilters?.(newFilters)
  }

  const handleClear = () => {
    const newFilters = filters.map((filter) => ({
      ...filter,
      options: filter.options?.map((option) => ({ ...option, selected: false, applied: false })),
      range: { min: undefined, max: undefined, appliedMin: undefined, appliedMax: undefined },
    }))

    onChangeFilters?.(newFilters)
    setIsFiltersOpen(false)
  }

  return (
    <>
      <Button
        icon={counter ? <Counter>{counter}</Counter> : <SvgActionFilters />}
        iconPlacement="right"
        variant="secondary"
        onClick={() => setIsFiltersOpen(true)}
      >
        Filters
      </Button>
      <MobileFilterDialog
        title="Filters"
        primaryButton={{
          text: 'Apply',
          onClick: handleApply,
        }}
        secondaryButton={{
          text: 'Clear',
          onClick: handleClear,
        }}
        onExitClick={() => setIsFiltersOpen(false)}
        show={isFiltersOpen}
        content={
          <>
            {filters.map(({ name, options = [], label, type, range }, idx) => (
              <MobileFilterContainer key={idx}>
                <Text as="span" variant="h300">
                  {label}
                </Text>
                {type === 'checkbox' && (
                  <CheckboxGroup
                    name={name}
                    onChange={(num) => handleCheckboxSelection(name, num)}
                    options={options?.map((option) => ({ ...option, value: option.selected }))}
                    checkedIds={options
                      .map((option, index) => (option.selected ? index : -1))
                      .filter((index) => index !== -1)}
                  />
                )}
                {type === 'radio' && (
                  <RadioButtonGroup
                    name={name}
                    onChange={handleRadioButtonClick}
                    options={options}
                    value={options.find((option) => option.selected)?.value}
                  />
                )}
                {type === 'range' && (
                  <PriceRangeInput value={range} onChange={(newRange) => handleRangeChange(name, newRange)} />
                )}
              </MobileFilterContainer>
            ))}
          </>
        }
      />
    </>
  )
}

const MobileFilterDialog: FC<{ content: ReactNode } & DialogModalProps> = ({ content, ...dialogModalProps }) => {
  return (
    <DialogModal {...dialogModalProps} dividers>
      {content}
    </DialogModal>
  )
}
