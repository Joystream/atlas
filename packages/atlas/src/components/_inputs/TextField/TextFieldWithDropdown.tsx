import { useCombobox } from 'downshift'
import React from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { SvgActionLoader } from '@/components/_icons'

import { ListWrapper, TextFieldWithDropdownWrapper } from './TextFieldWithDropdown.styles'

import { TextField } from '.'

type TextFieldWithDropdownProps<ItemType = unknown> = {
  items?: (ListItemProps & ItemType)[]
  loading?: boolean
  onSelect?: (item?: ListItemProps & ItemType) => void
  onChange?: (item?: string) => void | Promise<void>
  resetOnSelect?: boolean
}

export const TextFieldWithDropdown = <ItemType,>({
  loading,
  items = [],
  onSelect,
  onChange,
  resetOnSelect,
}: TextFieldWithDropdownProps<ItemType>) => {
  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, getComboboxProps, reset } = useCombobox({
    items,
    itemToString: (item) => (item ? item.label : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return
      }
      onSelect?.(selectedItem)
      if (resetOnSelect) {
        reset()
      }
    },
    onInputValueChange: ({ inputValue }) => {
      onChange?.(inputValue)
    },
  })

  return (
    <TextFieldWithDropdownWrapper>
      <div {...getComboboxProps()}>
        <TextField {...getInputProps()} nodeEnd={loading && <SvgActionLoader />} />
      </div>
      <ListWrapper {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => {
            return (
              <ListItem
                key={`${item}${index}`}
                {...item}
                {...getItemProps({
                  item,
                  index,
                })}
                size="large"
                highlight={highlightedIndex === index}
              />
            )
          })}
      </ListWrapper>
    </TextFieldWithDropdownWrapper>
  )
}
