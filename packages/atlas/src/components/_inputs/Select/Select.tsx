import { UseSelectStateChange, useSelect } from 'downshift'
import { isEqual } from 'lodash-es'
import { ForwardedRef, ReactNode, Ref, forwardRef, useMemo } from 'react'

import { TextProps } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { SvgActionChevronB } from '@/components/_icons'

import {
  NodeContainer,
  SelectButton,
  SelectLabel,
  SelectMenu,
  SelectMenuWrapper,
  SelectOption,
  SelectSizes,
  SelectWrapper,
  StyledLabelText,
  StyledPill,
  StyledSvgGlyphInfo,
  ValueContainer,
} from './Select.styles'

import { InputBase, InputBaseProps } from '../InputBase'

export type SelectItem<T = string> = {
  value: T
  name: string
  // replaces the name in the menu list
  menuName?: string
  // hides the item in the menu list
  hideInMenu?: boolean
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
  labelTextProps?: Omit<TextProps, 'ref'>
  items: SelectItem<T>[]
  placeholder?: string
  containerRef?: Ref<HTMLDivElement>
  size?: SelectSizes
  iconLeft?: ReactNode
} & InputBaseProps

// don't use FC so we can use a generic type on a component
// `T extends unknown` is a workaround, ESBuild seems to have hard time parsing <T,> generic declaration
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const _Select = <T extends unknown>(
  {
    label = '',
    labelTextProps,
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
    iconLeft,
    ...inputBaseProps
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
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: itemsValues,
    selectedItem: value !== undefined ? value : null,
    onSelectedItemChange: handleItemSelect,
  })
  const selectedItem = useMemo(
    () => items.find((item) => isEqual(item.value, selectedItemValue)),
    [items, selectedItemValue]
  )

  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps} isSelect={true}>
      <SelectWrapper labelPosition={labelPosition}>
        <SelectLabel {...getLabelProps()} ref={ref} tabIndex={disabled ? -1 : 0}>
          {label && (
            <StyledLabelText variant="t200" {...labelTextProps} labelPosition={labelPosition}>
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
            {iconLeft && <NodeContainer>{iconLeft}</NodeContainer>}
            <ValueContainer hasIconLeft={!!iconLeft}>
              {(valueLabel ?? '') + (selectedItem?.name || placeholder)}
            </ValueContainer>
            {selectedItem?.badgeText && <StyledPill label={selectedItem.badgeText} />}
            <SvgActionChevronB className="chevron-bottom" />
          </SelectButton>
          <SelectMenu isOpen={isOpen} {...getMenuProps()}>
            {isOpen &&
              items.map((item, index) => {
                const itemProps = { ...getItemProps({ item: item.value, index }) }
                if (item.hideInMenu) return null
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
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof _Select>
