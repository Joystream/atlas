import React, { forwardRef } from 'react'
import InputBase, { InputBaseProps } from '../InputBase'
import { SelectButton, SelectMenu, SelectOption, SelectWrapper, StyledLabelText } from './Select.style'
import { useSelect, UseSelectStateChange } from 'downshift'
import Icon from '../Icon'

export type SelectedItem = {
  value: string | boolean
  name: string
}

export type SelectProps = {
  onChange?: (changes: UseSelectStateChange<SelectedItem>) => void
  value?: SelectedItem | null
  items: SelectedItem[]
  placeholder?: string
} & InputBaseProps

const SelectComponent: React.ForwardRefRenderFunction<HTMLDivElement, SelectProps> = (
  { label = '', items, placeholder = 'Select option', error, value, disabled, onChange, ...inputBaseProps },
  ref
) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items: items || [], selectedItem: value, onSelectedItemChange: onChange })

  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps}>
      <SelectWrapper ref={ref}>
        <SelectButton
          disabled={disabled}
          error={error}
          filled={!!selectedItem}
          isOpen={isOpen}
          type="button"
          {...getToggleButtonProps()}
          tabIndex={disabled ? -1 : 0}
        >
          {selectedItem?.name || placeholder}
          <Icon name="chevron-down" />
        </SelectButton>
        <label {...getLabelProps()} tabIndex={disabled ? -1 : 0}>
          <StyledLabelText>{label}</StyledLabelText>
        </label>
        <SelectMenu isOpen={isOpen} {...getMenuProps()}>
          {isOpen &&
            items &&
            items.map((item, index) => (
              <SelectOption isSelected={highlightedIndex === index} key={index} {...getItemProps({ item, index })}>
                {item?.name}
              </SelectOption>
            ))}
        </SelectMenu>
      </SelectWrapper>
    </InputBase>
  )
}
const Select = forwardRef(SelectComponent)

Select.displayName = 'Select'

export default Select
