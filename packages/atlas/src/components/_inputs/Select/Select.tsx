import { UseSelectStateChange, useSelect } from 'downshift'
import React, { Ref, forwardRef, useMemo } from 'react'

import { Tooltip } from '@/components/Tooltip'
import { SvgActionChevronB } from '@/components/_icons'

import {
  SelectButton,
  SelectLabel,
  SelectMenu,
  SelectMenuWrapper,
  SelectOption,
  SelectWrapper,
  StyledLabelText,
  StyledPill,
  StyledSvgGlyphInfo,
} from './Select.styles'

import { InputBase, InputBaseProps } from '../InputBase'

export type SelectSizes = 'regular' | 'small'

export type SelectItem<T = string> = {
  value: T
  name: string
  menuName?: string
  tooltipHeaderText?: string
  tooltipText?: string
  badgeText?: string
  onClick?: () => void
}

export type SelectProps<T = string> = {
  onChange?: (value?: T | null) => void
  value?: T | null
  valueLabel?: string
  labelPosition?: 'top' | 'left'
  items: SelectItem<T>[]
  placeholder?: string
  containerRef?: Ref<HTMLDivElement>
  size?: SelectSizes
} & InputBaseProps

// don't use React.FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const _Select = <T extends unknown>(
  {
    label = '',
    labelPosition = 'top',
    items,
    placeholder = 'Select option',
    error,
    value,
    valueLabel,
    disabled,
    onChange,
    containerRef,
    size = 'regular',
    ...inputBaseProps
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const itemsValues = items.map((item) => item.value)

  const handleItemSelect = (changes: UseSelectStateChange<T>) => {
    onChange?.(changes.selectedItem)
  }

  const {
    isOpen,
    selectedItem: selectedItemValue,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: itemsValues,
    selectedItem: value !== undefined ? value : null,
    onSelectedItemChange: handleItemSelect,
  })

  const selectedItem = useMemo(() => items.find((item) => item.value === selectedItemValue), [items, selectedItemValue])

  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps} isSelect={true}>
      <SelectWrapper labelPosition={labelPosition}>
        <SelectLabel {...getLabelProps()} ref={ref} tabIndex={disabled ? -1 : 0}>
          {label && (
            <StyledLabelText variant="t200" labelPosition={labelPosition}>
              {label}
            </StyledLabelText>
          )}
        </SelectLabel>
        <SelectMenuWrapper>
          <SelectButton
            disabled={disabled}
            error={error}
            filled={selectedItemValue != null}
            isOpen={isOpen}
            type="button"
            {...getToggleButtonProps()}
            tabIndex={disabled ? -1 : 0}
            size={size}
          >
            {(valueLabel ?? '') + (selectedItem?.name || placeholder)}
            {selectedItem?.badgeText && <StyledPill label={selectedItem.badgeText} />}
            <SvgActionChevronB />
          </SelectButton>
          <SelectMenu isOpen={isOpen} {...getMenuProps()}>
            {isOpen &&
              items.map((item, index) => {
                const itemProps = { ...getItemProps({ item: item.value, index }) }
                return (
                  <SelectOption
                    isSelected={highlightedIndex === index}
                    key={`${item.name}-${index}`}
                    {...itemProps}
                    onClick={(e) => {
                      item.onClick?.()
                      itemProps.onClick(e)
                    }}
                  >
                    {item.tooltipText && (
                      <Tooltip
                        headerText={item.tooltipHeaderText}
                        text={item.tooltipText}
                        placement="top-end"
                        offsetX={6}
                        offsetY={12}
                      >
                        <StyledSvgGlyphInfo />
                      </Tooltip>
                    )}
                    {item?.menuName ?? item?.name}
                  </SelectOption>
                )
              })}
          </SelectMenu>
        </SelectMenuWrapper>
      </SelectWrapper>
    </InputBase>
  )
}

// https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion
export const Select = forwardRef(_Select) as <T>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof _Select>
