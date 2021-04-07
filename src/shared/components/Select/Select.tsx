import React from 'react'
import InputBase, { InputBaseProps } from '../InputBase'
import { SelectButton, SelectMenu, SelectOption, SelectWrapper, StyledLabelText } from './Select.style'
import { useSelect, UseSelectStateChange } from 'downshift'
import Icon from '../Icon'

export type SelectItem<T = string> = {
  value: T
  name: string
}

export type SelectProps<T = string> = {
  onChange?: (value?: T | null) => void
  value?: T | null
  items: SelectItem<T>[]
  placeholder?: string
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
      <SelectWrapper>
        <label {...getLabelProps()} tabIndex={disabled ? -1 : 0}>
          <StyledLabelText>{label}</StyledLabelText>
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
          <Icon name="chevron-down" />
        </SelectButton>
        <SelectMenu isOpen={isOpen} {...getMenuProps()}>
          {isOpen &&
            items.map((item, index) => (
              <SelectOption
                isSelected={highlightedIndex === index}
                key={index}
                {...getItemProps({ item: item.value, index })}
              >
                {item?.name}
              </SelectOption>
            ))}
        </SelectMenu>
      </SelectWrapper>
    </InputBase>
  )
}

export default Select
