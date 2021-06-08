import { useSelect, UseSelectStateChange } from 'downshift'
import React, { Ref } from 'react'

import { Tooltip } from '@/shared/components'
import { SvgGlyphChevronDown } from '@/shared/icons'

import {
  SelectButton,
  SelectMenu,
  SelectOption,
  SelectWrapper,
  StyledLabelText,
  StyledSvgGlyphInfo,
} from './Select.style'

import InputBase, { InputBaseProps } from '../InputBase'

export type SelectItem<T = string> = {
  value: T
  name: string
  tooltipHeaderText?: string
  tooltipText?: string
}

export type SelectProps<T = string> = {
  onChange?: (value?: T | null) => void
  value?: T | null
  items: SelectItem<T>[]
  placeholder?: string
  containerRef?: Ref<HTMLDivElement>
} & InputBaseProps

// don't use React.FC so we can use a generic type on a component
const Select = <T,>({
  label = '',
  items,
  placeholder = 'Select option',
  error,
  value,
  disabled,
  onChange,
  containerRef,
  ...inputBaseProps
}: SelectProps<T>) => {
  const itemsValues = items.map((item) => item.value)

  const handleItemSelect = (changes: UseSelectStateChange<T>) => {
    onChange?.(changes.selectedItem)
  }

  const {
    isOpen,
    selectedItem: selectedItemValue,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items: itemsValues, selectedItem: value, onSelectedItemChange: handleItemSelect })

  const selectedItem = items.find((item) => item.value === selectedItemValue)

  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps} isSelect={true}>
      <SelectWrapper ref={containerRef}>
        <label {...getLabelProps()} tabIndex={disabled ? -1 : 0}>
          {label && <StyledLabelText>{label}</StyledLabelText>}
        </label>
        <SelectButton
          disabled={disabled}
          error={error}
          filled={selectedItemValue != null}
          isOpen={isOpen}
          type="button"
          {...getToggleButtonProps()}
          tabIndex={disabled ? -1 : 0}
        >
          {selectedItem?.name || placeholder}
          <SvgGlyphChevronDown />
        </SelectButton>
        <SelectMenu isOpen={isOpen} {...getMenuProps()}>
          {isOpen &&
            items.map((item, index) => (
              <SelectOption
                isSelected={highlightedIndex === index}
                key={`${item.name}-${index}`}
                {...getItemProps({ item: item.value, index })}
              >
                {item.tooltipText && (
                  <Tooltip
                    headerText={item.tooltipHeaderText}
                    text={item.tooltipText}
                    placement="top-end"
                    offsetX={6}
                    offsetY={12}
                  >
                    <StyledSvgGlyphInfo />
                  </Tooltip>
                )}
                {item?.name}
              </SelectOption>
            ))}
        </SelectMenu>
      </SelectWrapper>
    </InputBase>
  )
}

export default Select
