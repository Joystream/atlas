import { useCombobox } from 'downshift'
import React from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { SvgActionLoader } from '@/components/_icons'

import { ListWrapper, TextFieldWithDropdownWrapper } from './TextFieldWithDropdown.styles'

import { TextField, TextFieldProps } from '.'

type TextFieldWithDropdownProps<ItemType = unknown> = {
  items?: (ListItemProps & ItemType)[]
  loading?: boolean
  onSelectedItemChange?: (item?: ListItemProps & ItemType) => void
  onInputValueChange?: (item?: string) => void | Promise<void>
  resetOnSelect?: boolean
  notFoundNode?: ListItemProps | null
} & TextFieldProps

export const TextFieldWithDropdown = <ItemType,>(props: TextFieldWithDropdownProps<ItemType>) => {
  const {
    loading,
    items = [],
    onSelectedItemChange,
    onInputValueChange,
    resetOnSelect,
    notFoundNode,
    ...textFieldProps
  } = props
  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, getComboboxProps, reset } = useCombobox({
    items,
    itemToString: (item) => (item ? item.label : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return
      }
      onSelectedItemChange?.(selectedItem)
      if (resetOnSelect) {
        reset()
      }
    },
    onInputValueChange: ({ inputValue }) => {
      onInputValueChange?.(inputValue)
    },
  })

  return (
    <TextFieldWithDropdownWrapper>
      <div {...getComboboxProps()}>
        <TextField {...getInputProps()} nodeEnd={loading && <SvgActionLoader />} {...textFieldProps} />
      </div>
      <ListWrapper {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
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
          ))}
        {notFoundNode && <ListItem {...notFoundNode} size="large" onClick={() => reset()} />}
      </ListWrapper>
    </TextFieldWithDropdownWrapper>
  )
}
