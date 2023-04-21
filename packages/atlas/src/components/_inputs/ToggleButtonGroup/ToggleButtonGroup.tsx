import { useRef } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { FilterButton, FilterButtonProps } from '@/components/FilterButton'
import { useHorizonthalFade } from '@/hooks/useHorizonthalFade'

import {
  ButtonLeft,
  ButtonRight,
  Container,
  ContainerWidth,
  ContentWrapper,
  Label,
  OptionWrapper,
  ToggleButton,
} from './ToggleButtonGroup.styles'

type SharedToggleButtonProps = {
  label?: string
  width?: ContainerWidth
  className?: string
}

export type ToggleButtonOptionTypeProps<T extends string = string> = {
  type: 'options'
  options: T[]
  value?: T
  onChange: (value: T) => void
} & SharedToggleButtonProps

export type ToggleButtonFilterTypeProps = {
  type: 'filter'
  onClearFilters?: () => void
  filters: FilterButtonProps[]
} & SharedToggleButtonProps

export type ToggleButtonGroupProps<T extends string = string> =
  | ToggleButtonFilterTypeProps
  | ToggleButtonOptionTypeProps<T>

export const ToggleButtonGroup = <T extends string = string>(props: ToggleButtonGroupProps<T>) => {
  const { type, label, width = 'auto', className } = props
  const optionWrapperRef = useRef<HTMLDivElement>(null)

  const { handleArrowScroll, handleMouseDown, isOverflow, visibleShadows } = useHorizonthalFade(optionWrapperRef)

  return (
    <Container className={className} width={width}>
      {label && (
        <Label variant="t100" as="p" color="colorText">
          {label}
        </Label>
      )}
      <ContentWrapper>
        {width === 'fixed' && isOverflow && visibleShadows.left && (
          <ButtonLeft
            onClick={handleArrowScroll('left')}
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
          />
        )}
        <OptionWrapper onMouseDown={handleMouseDown} ref={optionWrapperRef} visibleShadows={visibleShadows}>
          {type === 'options' &&
            props.options.map((option) => (
              <ToggleButton
                key={option}
                fullWidth
                variant={option !== props.value ? 'tertiary' : 'secondary'}
                onClick={() => props.onChange(option)}
                size="small"
              >
                {option}
              </ToggleButton>
            ))}
          {type === 'filter' &&
            props.filters.map((filterButtonProps, idx) => <FilterButton key={idx} {...filterButtonProps} />)}
        </OptionWrapper>
        {width === 'fixed' && isOverflow && visibleShadows.right && (
          <ButtonRight
            onClick={handleArrowScroll('right')}
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronR />}
          />
        )}
      </ContentWrapper>
    </Container>
  )
}
