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
  StyledTooltip,
  ToggleButton,
} from './ToggleButtonGroup.styles'

type SharedToggleButtonProps = {
  label?: string
  width?: ContainerWidth
  className?: string
}

type ToggleButtonOption<T = string> = {
  label: string
  value: T
  disabled?: boolean
  tooltipText?: string
}

export type ToggleButtonOptionTypeProps<T = string> = {
  type: 'options'
  options: ToggleButtonOption<T>[]
  value?: T
  onChange: (value: T) => void
} & SharedToggleButtonProps

export type ToggleButtonFilterTypeProps = {
  type: 'filter'
  onClearFilters?: () => void
  filters: FilterButtonProps[]
} & SharedToggleButtonProps

export type ToggleButtonGroupProps<T = string> =
  | {
      size?: 'small' | 'medium' | 'large'
    } & (ToggleButtonFilterTypeProps | ToggleButtonOptionTypeProps<T>)

export function ToggleButtonGroup<T = string>(props: ToggleButtonGroupProps<T>) {
  const { type, label, width = 'auto', className, size = 'small' } = props
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
            props.options.map((option, i) => (
              <StyledTooltip key={i} text={option.tooltipText}>
                <ToggleButton
                  fullWidth
                  variant={option.value !== props.value ? 'tertiary' : 'secondary'}
                  onClick={() => props.onChange(option.value)}
                  size={size}
                  disabled={option.disabled}
                >
                  {option.label}
                </ToggleButton>
              </StyledTooltip>
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
