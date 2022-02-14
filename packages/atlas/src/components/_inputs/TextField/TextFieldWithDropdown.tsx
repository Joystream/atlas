import { useCombobox } from 'downshift'
import React, { useState } from 'react'

import { ListItem } from '@/components/ListItem'
import { SvgActionLoader } from '@/components/_icons'

import { ListWrapper, TextFieldWithDropdownWrapper } from './TextFieldWithDropdown.styles'

import { TextField } from '.'

type TextFieldWithDropdownProps = {
  items?: Array<string>
  loading?: boolean
  onSelect?: (item?: string) => void
  onChange?: (val?: string) => void
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

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, reset, getItemProps } = useCombobox({
    items: inputItems || [],
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        resetOnSelect && reset()
        onSelect?.(selectedItem)
      }
    },
    onInputValueChange: ({ inputValue }) => {
      onChange?.(inputValue)
      if (inputValue) {
        setInputItems(items.filter((item) => item.toLowerCase().startsWith(inputValue.toLowerCase())))
      }
    },
  })

  return (
    <TextFieldWithDropdownWrapper style={{ width: '100%' }}>
      <TextField {...getInputProps()} nodeEnd={loading && <SvgActionLoader />} />
      <ListWrapper {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => {
            return (
              <ListItem
                key={`${item}${index}`}
                {...getItemProps({
                  item,
                  index,
                })}
                label={item}
                size="large"
                selected={highlightedIndex === index}
              />
            )
          })}
      </ListWrapper>
    </TextFieldWithDropdownWrapper>
  )
}
