import { throttle } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { FilterButton, FilterButtonProps } from '@/components/FilterButton'
import { Button } from '@/components/_buttons/Button'

import {
  ButtonLeft,
  ButtonRight,
  Container,
  ContainerWidth,
  ContentWrapper,
  Label,
  OptionWrapper,
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

const SCROLL_SHADOW_OFFSET = 10

export const ToggleButtonGroup = <T extends string = string>(props: ToggleButtonGroupProps<T>) => {
  const { type, label, width = 'auto', className } = props
  const optionWrapperRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
  const { onMouseDown } = useDraggableScroll(optionWrapperRef, { direction: 'horizontal' })
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: false,
  })

  useEffect(() => {
    if (optionWrapperRef.current) {
      setIsOverflowing(optionWrapperRef.current.clientWidth < optionWrapperRef.current.scrollWidth)
    }
  }, [])

  useEffect(() => {
    const optionGroup = optionWrapperRef.current
    if (!optionGroup || !isOverflowing || width !== 'fixed') {
      return
    }
    setShadowsVisible((prev) => ({ ...prev, right: true }))
    const { clientWidth, scrollWidth } = optionGroup

    const touchHandler = throttle(() => {
      setShadowsVisible({
        left: optionGroup.scrollLeft > SCROLL_SHADOW_OFFSET,
        right: optionGroup.scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    optionGroup.addEventListener('touchmove', touchHandler, { passive: true })
    optionGroup.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      optionGroup.removeEventListener('touchmove', touchHandler)
      optionGroup.removeEventListener('scroll', touchHandler)
    }
  }, [isOverflowing, width])

  const handleArrowScroll = (direction: 'left' | 'right') => () => {
    const optionGroup = optionWrapperRef.current
    if (!optionGroup || !isOverflowing) {
      return
    }

    const addition = (direction === 'left' ? -1 : 1) * (optionGroup.clientWidth / 2)
    optionGroup.scrollBy({ left: addition, behavior: 'smooth' })
  }

  return (
    <Container className={className} width={width}>
      {label && (
        <Label variant="t100" as="p" color="colorText">
          {label}
        </Label>
      )}
      <ContentWrapper>
        {width === 'fixed' && isOverflowing && shadowsVisible.left && (
          <ButtonLeft
            onClick={handleArrowScroll('left')}
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
          />
        )}
        <OptionWrapper onMouseDown={onMouseDown} ref={optionWrapperRef} shadowsVisible={shadowsVisible}>
          {type === 'options' &&
            props.options.map((option) => (
              <Button
                key={option}
                fullWidth
                variant={option !== props.value ? 'tertiary' : 'secondary'}
                onClick={() => props.onChange(option)}
                size="small"
              >
                {option}
              </Button>
            ))}
          {type === 'filter' &&
            props.filters.map((filterButtonProps, idx) => <FilterButton key={idx} {...filterButtonProps} />)}
        </OptionWrapper>
        {width === 'fixed' && isOverflowing && shadowsVisible.right && (
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
