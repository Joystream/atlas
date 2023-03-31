import { throttle } from 'lodash-es'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

import { SvgActionChevronL, SvgActionChevronR, SvgActionClose, SvgActionFilters } from '@/assets/icons'
import { FilterButton, FilterButtonProps } from '@/components/FilterButton'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  ChevronButton,
  ChevronButtonHandler,
  FilterButtonWrapper,
  FiltersWrapper,
  SectionFiltersWrapper,
  VerticalDivider,
} from './SectionFilters.styles'

type CallbackArg = {
  hasOverflow: boolean
  clientWidth: number | undefined
  scrollWidth: number | undefined
}

export const useIsOverflow = (ref: React.RefObject<HTMLElement>, callback?: (arg: CallbackArg) => void) => {
  const [isOverflow, setIsOverflow] = useState<boolean>()
  const [clientWidth, setClientWidth] = useState<number>()
  const [scrollWidth, setScrollWidth] = useState<number>()

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const trigger = () => {
      if (!ref.current) {
        return
      }
      const hasOverflow = ref.current.scrollWidth > ref.current.clientWidth
      setClientWidth(ref.current.clientWidth)
      setIsOverflow(hasOverflow)
      setScrollWidth(ref.current.scrollWidth)

      if (callback)
        callback({ hasOverflow, clientWidth: ref.current.clientWidth, scrollWidth: ref.current.scrollWidth })
    }

    if (ref.current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(ref.current)
      }

      trigger()
    }
  }, [callback, ref])

  return { isOverflow, clientWidth, scrollWidth }
}

type SectionFiltersProps = {
  filters: FilterButtonProps[]
  onResetFilters?: () => void
}

const SCROLL_SHADOW_OFFSET = 10

export const SectionFilters: FC<SectionFiltersProps> = ({ filters, onResetFilters }) => {
  const smMatch = useMediaMatch('sm')
  const filterWrapperRef = useRef<HTMLDivElement>(null)
  const { onMouseDown } = useDraggableScroll(filterWrapperRef, { direction: 'horizontal' })
  const { isOverflow } = useIsOverflow(filterWrapperRef)

  const areThereAnyOptionsSelected = filters
    .map((filter) => filter.selectedOptions)
    .flat()
    .some(Boolean)

  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: false,
  })

  useEffect(() => {
    if (!isOverflow) {
      setShadowsVisible({ right: false, left: false })
    }
    setShadowsVisible((prev) => ({ ...prev, right: !!isOverflow }))
  }, [isOverflow])

  useEffect(() => {
    const filterWrapper = filterWrapperRef.current
    if (!filterWrapper) {
      return
    }

    const scrollWidth = filterWrapper.scrollWidth
    const clientWidth = filterWrapper.clientWidth

    const touchHandler = throttle((event: Event | TouchEvent) => {
      const scrollLeft = (event.target as HTMLDivElement)?.scrollLeft
      setShadowsVisible({
        left: scrollLeft > SCROLL_SHADOW_OFFSET,
        right: scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    filterWrapper.addEventListener('touchmove', touchHandler)
    filterWrapper.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      filterWrapper.removeEventListener('touchmove', touchHandler)
      filterWrapper.removeEventListener('scroll', touchHandler)
    }
  }, [])

  if (!smMatch) {
    return <FilterButton icon={<SvgActionFilters />} label="Filters" onApply={() => null} options={[]} />
  }

  const handleArrowScroll = (direction: 'left' | 'right') => () => {
    const filterWrapper = filterWrapperRef.current
    if (!filterWrapper || !isOverflow) {
      return
    }

    const addition = (direction === 'left' ? -1 : 1) * (filterWrapper.clientWidth / 2)
    filterWrapper.scrollBy({ left: addition, behavior: 'smooth' })
  }

  return (
    <SectionFiltersWrapper>
      {areThereAnyOptionsSelected && (
        <>
          <Button icon={<SvgActionClose />} variant="tertiary" onClick={onResetFilters}>
            Clear
          </Button>
          <VerticalDivider />
        </>
      )}
      <ChevronButtonHandler>
        <FiltersWrapper ref={filterWrapperRef} onMouseDown={onMouseDown} shadowsVisible={shadowsVisible}>
          {filters.map((filter, idx) => (
            <FilterButtonWrapper key={idx}>
              <FilterButton {...filter} />
            </FilterButtonWrapper>
          ))}
        </FiltersWrapper>
        {shadowsVisible.left && isOverflow && (
          <ChevronButton
            direction="left"
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
            onClick={handleArrowScroll('left')}
          />
        )}
        {shadowsVisible.right && isOverflow && (
          <ChevronButton
            direction="right"
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronR />}
            onClick={handleArrowScroll('right')}
          />
        )}
      </ChevronButtonHandler>
    </SectionFiltersWrapper>
  )
}
