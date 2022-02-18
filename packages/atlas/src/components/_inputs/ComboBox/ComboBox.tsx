import { useCombobox } from 'downshift'
import React, { useEffect, useRef, useState } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { SvgActionLoader } from '@/components/_icons'

import { ComboBoxWrapper, ListWrapper } from './ComboBox.styles'

import { TextField, TextFieldProps } from '../TextField'

export type ComboBoxProps<T = unknown> = {
  items?: (ListItemProps & T)[]
  loading?: boolean
  onSelectedItemChange?: (item?: ListItemProps & T) => void
  onInputValueChange?: (item?: string) => void | Promise<void>
  resetOnSelect?: boolean
  notFoundNode?: ListItemProps | null
} & Omit<TextFieldProps, 'charactersCount'>

// don't use React.FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ComboBox = <T extends unknown>(props: ComboBoxProps<T>) => {
  const {
    loading,
    items = [],
    onSelectedItemChange,
    onInputValueChange,
    resetOnSelect,
    notFoundNode,
    error,
    ...textFieldProps
  } = props
  const [inputItems, setInputItems] = useState<(ListItemProps & T)[]>([])
  const comboBoxWrapperRef = useRef<HTMLDivElement>(null)
  const textFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (items) {
      setInputItems(items)
    }
  }, [items])

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, getComboboxProps, reset } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? (item.label as string) : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return
      }
      onSelectedItemChange?.(selectedItem)
      setInputItems([])
      if (resetOnSelect) {
        reset()
      }
    },
    onInputValueChange: ({ inputValue }) => {
      if (!inputValue) {
        reset()
        return
      }
      const filteredItems = items.filter((item) =>
        (item.label as string)?.toLowerCase().startsWith(inputValue?.toLowerCase())
      )
      setInputItems(filteredItems)
      onInputValueChange?.(inputValue)
    },
  })

  // This function will calculate the position of dropdown when TextField's helper text is present
  const getTextFieldBottomEdgePosition = () => {
    if (!textFieldRef.current || !comboBoxWrapperRef.current || !textFieldProps.helperText) {
      return
    }
    const { y: wrapperY } = comboBoxWrapperRef.current.getBoundingClientRect()
    const { y: inputY, height: inputHeight } = textFieldRef.current.getBoundingClientRect()
    return inputY - wrapperY + inputHeight
  }

  return (
    <ComboBoxWrapper ref={comboBoxWrapperRef}>
      <div {...getComboboxProps()}>
        <TextField
          {...textFieldProps}
          error={error}
          {...getInputProps({ ref: textFieldRef })}
          nodeEnd={loading && <SvgActionLoader />}
        />
      </div>
      <ListWrapper {...getMenuProps()} topPosition={getTextFieldBottomEdgePosition()}>
        {isOpen &&
          inputItems.map((item, index) => (
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
        {isOpen && !error && inputItems.length === 0 && !loading && notFoundNode && (
          <ListItem {...notFoundNode} size="large" onClick={() => reset()} />
        )}
      </ListWrapper>
    </ComboBoxWrapper>
  )
}
