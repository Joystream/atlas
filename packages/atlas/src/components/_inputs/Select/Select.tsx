import { UseSelectStateChange, useSelect } from 'downshift'
import { isEqual } from 'lodash-es'
import { ForwardedRef, ReactNode, Ref, forwardRef, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { usePopper } from 'react-popper'

import { SvgActionChevronB, SvgActionChevronT } from '@/assets/icons'
import { List } from '@/components/List'
import { ListItemProps } from '@/components/ListItem'
import { ConsoleLogger } from '@/utils/logs'
import { dropdownModifiers } from '@/utils/popperModifiers'

import {
  InlineLabel,
  NodeContainer,
  SelectButton,
  SelectChevronWrapper,
  SelectMenu,
  SelectMenuWrapper,
  SelectWrapper,
  ValueAndPlaceholderText,
} from './Select.styles'

import { InputSize } from '../inputs.utils'

export type SelectItem<T = string> = {
  value: T
  name: string
  // replaces the name in the menu list
  menuName?: string
  // hides the item in the menu list
  hideInMenu?: boolean
  onClick?: () => void
} & Omit<ListItemProps, 'label' | 'highlight' | 'size'>

export type SelectProps<T = string> = {
  onChange?: (value?: T | null) => void
  inlineLabel?: string
  value?: T | null
  items: SelectItem<T>[]
  placeholder?: string
  containerRef?: Ref<HTMLDivElement>
  size?: InputSize
  icon?: ReactNode
  error?: boolean
  disabled?: boolean
  className?: string
}

// don't use FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const _Select = <T extends unknown>(
  {
    inlineLabel,
    items,
    placeholder = 'Select',
    error,
    disabled,
    value,
    className,
    onChange,
    containerRef,
    size = 'large',
    icon,
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const itemsValues = items.map((item) => item.value)
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null)
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null)
  const { styles, attributes, update } = usePopper(wrapperRef, dropdownRef, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: dropdownModifiers,
  })

  const handleItemSelect = (changes: UseSelectStateChange<T>) => {
    onChange?.(changes.selectedItem)
  }

  const {
    isOpen,
    selectedItem: selectedItemValue,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: itemsValues,
    selectedItem: value !== undefined ? value : null,
    onSelectedItemChange: handleItemSelect,
    onIsOpenChange: () => {
      update?.()
    },
  })

  if (inlineLabel && icon) {
    ConsoleLogger.error('Select: inlineLabel and icon are mutually exclusive. icon will be ignored.')
  }

  const selectedItem = useMemo(
    () => items.find((item) => isEqual(item.value, selectedItemValue)),
    [items, selectedItemValue]
  )
  return (
    <SelectWrapper ref={containerRef} className={className}>
      <SelectMenuWrapper ref={setWrapperRef}>
        <SelectButton
          ref={ref}
          disabled={disabled}
          error={error}
          isOpen={isOpen}
          type="button"
          tabIndex={disabled ? -1 : 0}
          inputSize={size}
          data-select
          {...getToggleButtonProps({ onClick: () => update?.() })}
        >
          {icon && !inlineLabel && <NodeContainer isOpen={isOpen}>{icon}</NodeContainer>}
          {inlineLabel && (
            <InlineLabel as="span" variant={size === 'large' ? 't300-strong' : 't200-strong'} color="colorText">
              {inlineLabel}:
            </InlineLabel>
          )}
          <ValueAndPlaceholderText
            as="span"
            variant={size === 'large' ? 't300' : 't200'}
            color={selectedItem ? undefined : 'colorTextMuted'}
          >
            {selectedItem ? selectedItem.name : placeholder}
          </ValueAndPlaceholderText>
          <SelectChevronWrapper>{isOpen ? <SvgActionChevronT /> : <SvgActionChevronB />}</SelectChevronWrapper>
        </SelectButton>
        <span />

        {ReactDOM.createPortal(
          <div ref={setDropdownRef} style={{ ...styles.popper }} {...attributes.popper} data-popper-escaped="false">
            <SelectMenu {...getMenuProps()}>
              {isOpen && (
                <List
                  scrollable
                  items={items
                    .filter((item) => !item.hideInMenu)
                    .map((item, index) => ({
                      selected: item.value === selectedItemValue,
                      highlight: highlightedIndex === index,
                      label: item.name,
                      ...item,
                      ...getItemProps({ item: item.value, index, onClick: item.onClick, disabled: item.isSeparator }),
                    }))}
                  size={size === 'medium' ? 'small' : 'medium'}
                />
              )}
            </SelectMenu>
          </div>,
          document.body
        )}
      </SelectMenuWrapper>
    </SelectWrapper>
  )
}

// https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion
export const Select = forwardRef(_Select) as <T>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
) => ReturnType<typeof _Select>
