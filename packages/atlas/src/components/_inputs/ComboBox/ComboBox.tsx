import { useCombobox } from 'downshift'
import React, { useEffect, useRef, useState } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { Loader } from '@/components/_loaders/Loader'

import { ComboBoxWrapper, ListWrapper, StyledThumbnail } from './ComboBox.styles'

import { Input, InputProps } from '../Input'

type ModifiedListItemProps = ListItemProps & {
  label: string
  thumbnailUrl?: string
}

export type ComboBoxProps<T = unknown> = {
  items?: (ModifiedListItemProps & T)[]
  loading?: boolean
  onSelectedItemChange?: (item?: ModifiedListItemProps & T) => void
  onInputValueChange?: (item?: string) => void | Promise<void>
  resetOnSelect?: boolean
  notFoundNode?: ModifiedListItemProps | null
} & InputProps

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
  const [inputItems, setInputItems] = useState<(ModifiedListItemProps & T)[]>([])
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

  const noItemsFound = isOpen && !error && inputItems.length === 0 && !loading && notFoundNode

  // This function will calculate the position of dropdown when TextField's helper text is present
  const getTextFieldBottomEdgePosition = () => {
    if (!textFieldRef.current || !comboBoxWrapperRef.current) {
      return
    }
    const { y: wrapperY } = comboBoxWrapperRef.current.getBoundingClientRect()
    const { y: inputY, height: inputHeight } = textFieldRef.current.getBoundingClientRect()
    return inputY - wrapperY + inputHeight
  }

  return (
    <ComboBoxWrapper ref={comboBoxWrapperRef}>
      <div {...getComboboxProps()}>
        <Input
          {...textFieldProps}
          error={error || !!noItemsFound}
          {...getInputProps({ ref: textFieldRef })}
          nodeEnd={loading && <Loader variant="small" />}
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
              nodeStart={item.nodeStart || (item.thumbnailUrl && <StyledThumbnail src={item.thumbnailUrl} />)}
            />
          ))}
        {noItemsFound && <ListItem {...notFoundNode} size="large" onClick={() => reset()} />}
      </ListWrapper>
    </ComboBoxWrapper>
  )
}
