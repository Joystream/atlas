import React, { forwardRef } from 'react'
import InputBase, { InputBaseProps } from '../InputBase'
import { SelectButton, SelectMenu, SelectOption, SelectWrapper, StyledLabelText } from './Select.style'
import { useSelect, UseSelectStateChange } from 'downshift'
import Icon from '../Icon'

export type SelectedItem = {
  value: string
  name: string
} | null

export type SelectProps = {
  onChange: (changes: UseSelectStateChange<SelectedItem>) => void
  value?: SelectedItem
  items: SelectedItem[]
  placeholder?: string
} & InputBaseProps

const Select: React.ForwardRefRenderFunction<HTMLDivElement, SelectProps> = (props, ref) => {
  const { label = '', items, placeholder = 'Select option', error, warning, value, disabled, onChange } = props

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items, selectedItem: value, onSelectedItemChange: onChange })

  return (
    <InputBase error={error} warning={warning} disabled={disabled}>
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

Select.displayName = 'Select'

export default forwardRef(Select)
