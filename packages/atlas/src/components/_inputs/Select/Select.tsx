import { UseSelectStateChange, useSelect } from 'downshift'
import { isEqual } from 'lodash-es'
import { ForwardedRef, ReactNode, Ref, forwardRef, useMemo } from 'react'

import { List } from '@/components/List'
import { ListItemProps } from '@/components/ListItem'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { ConsoleLogger } from '@/utils/logs'

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
      <SelectMenuWrapper>
        <SelectButton
          ref={ref}
          disabled={disabled}
          error={error}
          isOpen={isOpen}
          type="button"
          tabIndex={disabled ? -1 : 0}
          inputSize={size}
          data-select
          {...getToggleButtonProps()}
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
        <SelectMenu {...getMenuProps()}>
          {isOpen && (
            <List
              scrollable
              items={items.map((item, index) => {
                return item.hideInMenu
                  ? null
                  : {
                      selected: item.value === selectedItemValue,
                      highlight: highlightedIndex === index,
                      label: item.name,
                      ...item,
                      ...getItemProps({ item: item.value, index, onClick: item.onClick }),
                    }
              })}
              size={size === 'medium' ? 'small' : 'medium'}
            />
          )}
        </SelectMenu>
      </SelectMenuWrapper>
    </SelectWrapper>
  )
}

// https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion
export const Select = forwardRef(_Select) as <T>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
) => ReturnType<typeof _Select>
