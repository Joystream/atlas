import { useCombobox } from 'downshift'
import { uniqBy } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { usePopper } from 'react-popper'

import { ListItem, ListItemProps } from '@/components/ListItem'
import { Loader } from '@/components/_loaders/Loader'
import { flipModifier, popperIndexModifier, sameWidthModifier } from '@/utils/popperModifiers'

import { ComboBoxWrapper, ListWrapper, StyledSvgActionPlus, StyledThumbnail } from './ComboBox.styles'

import { Input, InputProps } from '../Input'

type ModifiedListItemProps = ListItemProps & {
  label: string
  thumbnailUrls?: string[]
  isSeparator?: boolean
}

export type ComboBoxProps<T = unknown> = {
  items?: (ModifiedListItemProps & T)[]
  initialSelectedItem?: ModifiedListItemProps & T
  selectedItem?: ModifiedListItemProps & T
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
    initialSelectedItem,
    selectedItem,
    value,
    ...textFieldProps
  } = props
  const [inputItems, setInputItems] = useState<(ModifiedListItemProps & T)[]>([])
  const comboBoxWrapperRef = useRef<HTMLDivElement>(null)
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null)
  const { styles, attributes, update } = usePopper(comboBoxWrapperRef.current, dropdownRef, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: [sameWidthModifier, flipModifier, popperIndexModifier],
  })

  useEffect(() => {
    if (items) {
      setInputItems(items.slice(0, 10))
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
    initialSelectedItem,
    selectedItem,
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
      onInputValueChange?.(inputValue)
      new Promise(() => {
        const filteredItems = items
          .filter(
            (item) =>
              ((item.label as string)?.toLowerCase().startsWith(inputValue?.toLowerCase() || '') ||
                (item.caption as string)?.toLowerCase().startsWith(inputValue?.toLowerCase() || '')) &&
              !item.isSeparator
          )
          .slice(0, 20)
        setInputItems(inputValue?.length ? uniqBy(filteredItems, 'label') : items.slice(0, 20))
      })
    },
    onIsOpenChange: () => {
      update?.()
    },
  })

  useEffect(() => {
    if (value) {
      setInputValue(value as string)
    }
  }, [setInputValue, value])

  useEffect(() => {
    if (selectedItem && !isOpen) {
      setInputValue(selectedItem.label)
    }
  }, [isOpen, selectedItem, setInputValue])

  const noItemsFound = isOpen && !error && inputItems.length === 0 && !processing && notFoundNode && inputValue

  return (
    <ComboBoxWrapper ref={comboBoxWrapperRef}>
      <Input
        {...textFieldProps}
        error={error || !!noItemsFound}
        {...getInputProps({ ref: textFieldRef })}
        nodeEnd={processing && inputValue ? <Loader variant="small" /> : textFieldProps.nodeEnd}
        nodeStart={typeof textFieldProps.nodeStart === 'undefined' ? <StyledSvgActionPlus /> : textFieldProps.nodeStart}
        onFocus={(event) => {
          textFieldProps?.onFocus?.(event)
        }}
        value={inputValue ?? value}
        onClick={() => {
          update?.()
          toggleMenu()
        }}
      />
      {ReactDOM.createPortal(
        <div ref={setDropdownRef} style={{ ...styles.popper }} {...attributes.popper}>
          <ListWrapper {...getMenuProps()} isOpen={items.length && isOpen}>
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
                    nodeStart={
                      item.nodeStart ||
                      (item.thumbnailUrls && <StyledThumbnail resolvedUrls={item.thumbnailUrls} type="thumbnail" />)
                    }
                    isSeparator={item.isSeparator}
                  />
                ))}
              </>
            )}
            {noItemsFound && <ListItem {...notFoundNode} size="large" onClick={reset} />}
          </ListWrapper>
        </div>,
        document.body
      )}
    </ComboBoxWrapper>
  )
}
