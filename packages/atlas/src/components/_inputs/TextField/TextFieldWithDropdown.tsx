import { useCombobox } from 'downshift'
import React, { useState } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { SvgActionLoader } from '@/components/_icons'

import { ListWrapper, TextFieldWithDropdownWrapper } from './TextFieldWithDropdown.styles'

import { TextField } from '.'

type TextFieldWithDropdownProps = {
  items?: Array<ListItemProps>
  loading?: boolean
  onSelect?: (item?: string) => void
  onChange?: (val?: string) => void | Promise<void>
  resetOnSelect?: boolean
}

export const TextFieldWithDropdown: React.FC<TextFieldWithDropdownProps> = ({
  loading,
  items = [],
  onSelect,
  onChange,
  resetOnSelect,
}) => {
  const [inputItems, setInputItems] = useState(items)

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, reset, getItemProps, getComboboxProps } = useCombobox({
    items: inputItems || [],
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem?.label) {
        resetOnSelect && reset()
        onSelect?.(selectedItem.label)
      }
    },
    onInputValueChange: ({ inputValue }) => {
      onChange?.(inputValue)
      if (inputValue) {
        setInputItems(items.filter((item) => item.label.toLowerCase().startsWith(inputValue.toLowerCase())))
      }
    },
  })

  return (
    <TextFieldWithDropdownWrapper style={{ width: '100%' }}>
      <div {...getComboboxProps()}>
        <TextField {...getInputProps()} nodeEnd={loading && <SvgActionLoader />} />
      </div>
      <ListWrapper {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => {
            return (
              <ListItem
                {...item}
                key={`${item}${index}`}
                {...getItemProps({
                  item,
                  index,
                })}
                size="large"
                selected={highlightedIndex === index}
              />
            )
          })}
      </ListWrapper>
    </TextFieldWithDropdownWrapper>
  )
}
