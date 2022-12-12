import { useCombobox } from 'downshift'
import { uniqBy } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { Loader } from '@/components/_loaders/Loader'

import { ComboBoxWrapper, ListWrapper, StyledSvgActionPlus, StyledThumbnail } from './ComboBox.styles'

import { Input, InputProps } from '../Input'

type ModifiedListItemProps = ListItemProps & {
  label: string
  thumbnailUrl?: string
  isSeparator?: boolean
}

export type ComboBoxProps<T = unknown> = {
  items?: (ModifiedListItemProps & T)[]
  processing?: boolean
  onSelectedItemChange?: (item?: ModifiedListItemProps & T) => void
  onInputValueChange?: (item?: string) => void | Promise<void>
  resetOnSelect?: boolean
  notFoundNode?: ModifiedListItemProps | null
} & InputProps

// don't use FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ComboBox = <T extends unknown>(props: ComboBoxProps<T>) => {
  const {
    processing,
    items = [],
    onSelectedItemChange,
    onInputValueChange,
    resetOnSelect,
    notFoundNode,
    error,
    value,
    ...textFieldProps
  } = props
  const [inputItems, setInputItems] = useState<(ModifiedListItemProps & T)[]>([])
  const comboBoxWrapperRef = useRef<HTMLDivElement>(null)
  const textFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (items) {
      setInputItems(items)
    }
  }, [items, value])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    reset,
    toggleMenu,
    inputValue,
    setInputValue,
  } = useCombobox({
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
      const filteredItems = items.filter(
        (item) => (item.label as string)?.toLowerCase().startsWith(inputValue?.toLowerCase() || '') && !item.isSeparator
      )
      setInputItems(inputValue?.length ? uniqBy(filteredItems, 'label') : items)
      onInputValueChange?.(inputValue)
    },
  })

  useEffect(() => {
    if (value) {
      setInputValue(value as string)
    }
  }, [setInputValue, value])

  const noItemsFound = isOpen && !error && inputItems.length === 0 && !processing && notFoundNode && inputValue

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
      {/*<div {...getComboboxProps()}>*/}
      <Input
        {...textFieldProps}
        error={error || !!noItemsFound}
        {...getInputProps({ ref: textFieldRef })}
        nodeEnd={processing && inputValue && <Loader variant="small" />}
        nodeStart={<StyledSvgActionPlus />}
        onFocus={(event) => {
          textFieldProps?.onFocus?.(event)
        }}
        onClick={toggleMenu}
      />
      {/*</div>*/}
      <ListWrapper {...getMenuProps()} topPosition={getTextFieldBottomEdgePosition()} isOpen={isOpen}>
        {isOpen && (
          <>
            {inputItems.map((item, index) => (
              <ListItem
                key={`${item}${index}`}
                {...item}
                {...getItemProps({
                  item,
                  index,
                  disabled: item.isSeparator,
                })}
                size="large"
                highlight={highlightedIndex === index}
                nodeStart={item.nodeStart || (item.thumbnailUrl && <StyledThumbnail src={item.thumbnailUrl} />)}
                isSeparator={item.isSeparator}
              />
            ))}
          </>
        )}
        {noItemsFound && <ListItem {...notFoundNode} size="large" onClick={reset} />}
      </ListWrapper>
    </ComboBoxWrapper>
  )
}
