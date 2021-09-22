import { UseSelectStateChange, useSelect } from 'downshift'
import React, { Ref } from 'react'

import { SvgGlyphChevronDown } from '@/shared/icons'

import {
  SelectBadge,
  SelectButton,
  SelectLabel,
  SelectMenu,
  SelectMenuWrapper,
  SelectOption,
  SelectWrapper,
  StyledLabelText,
  StyledSvgGlyphInfo,
} from './Select.style'

import { InputBase, InputBaseProps } from '../InputBase'
import { Tooltip } from '../Tooltip'

export type SelectSizes = 'regular' | 'small'

export type SelectItem<T = string> = {
  value: T
  name: string
  tooltipHeaderText?: string
  tooltipText?: string
  badgeText?: string
}

export type SelectProps<T = string> = {
  onChange?: (value?: T | null) => void
  value?: T | null
  labelPosition?: 'top' | 'left'
  items: SelectItem<T>[]
  placeholder?: string
  containerRef?: Ref<HTMLDivElement>
  size?: SelectSizes
} & InputBaseProps

// don't use React.FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
export const Select = <T extends unknown>({
  label = '',
  labelPosition = 'top',
  items,
  placeholder = 'Select option',
  error,
  value,
  disabled,
  onChange,
  containerRef,
  size = 'regular',
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
      <SelectWrapper labelPosition={labelPosition} ref={containerRef}>
        <SelectLabel {...getLabelProps()} tabIndex={disabled ? -1 : 0}>
          {label && <StyledLabelText labelPosition={labelPosition}>{label}</StyledLabelText>}
        </SelectLabel>
        <SelectMenuWrapper>
          <SelectButton
            disabled={disabled}
            error={error}
            filled={selectedItemValue != null}
            isOpen={isOpen}
            type="button"
            {...getToggleButtonProps()}
            tabIndex={disabled ? -1 : 0}
            size={size}
          >
            {selectedItem?.name || placeholder}
            {selectedItem?.badgeText && <SelectBadge variant="caption">{selectedItem.badgeText}</SelectBadge>}
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
        </SelectMenuWrapper>
      </SelectWrapper>
    </InputBase>
  )
}
