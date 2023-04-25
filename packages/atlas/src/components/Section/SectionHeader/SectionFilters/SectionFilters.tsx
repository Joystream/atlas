import { FC, useRef } from 'react'

import { SvgActionChevronL, SvgActionChevronR, SvgActionClose } from '@/assets/icons'
import { FilterButton, FilterButtonOption, FilterRange, SectionFilter, isFilterRange } from '@/components/FilterButton'
import { MobileFilterButton } from '@/components/MobileFilterButton'
import { Button } from '@/components/_buttons/Button'
import { useHorizonthalFade } from '@/hooks/useHorizonthalFade'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  ChevronButton,
  ChevronButtonHandler,
  FilterButtonWrapper,
  FiltersWrapper,
  SectionFiltersWrapper,
  VerticalDivider,
} from './SectionFilters.styles'

type SectionFiltersProps = {
  filters: SectionFilter[]
  onApplyFilters?: (appliedFilters: SectionFilter[]) => void
}

export const SectionFilters: FC<SectionFiltersProps> = ({ filters, onApplyFilters }) => {
  const smMatch = useMediaMatch('sm')
  const filterWrapperRef = useRef<HTMLDivElement>(null)

  const { handleMouseDown, visibleShadows, handleArrowScroll, isOverflow } = useHorizonthalFade(filterWrapperRef)

  const areThereAnyOptionsSelected = filters
    .map(
      (filter) =>
        filter.options?.map((option) => option.applied) ?? (filter.range?.appliedMin || filter.range?.appliedMax)
    )
    .flat()
    .some(Boolean)

  const handleApply = (name: string, selectedOptions: FilterButtonOption[] | FilterRange) => {
    onApplyFilters?.(
      filters.map((filter) => {
        if (filter.name === name) {
          const isFilter = isFilterRange(selectedOptions)
          return { ...filter, [isFilter ? 'range' : 'options']: selectedOptions }
        }
        return filter
      })
    )
  }

  const handleResetFilters = () => {
    const newFilters = filters.map((filter) => ({
      ...filter,
      options: filter.options?.map((option) => ({ ...option, selected: false, applied: false })),
      range: { min: undefined, max: undefined, maxApplied: undefined, minApplied: undefined },
    }))

    onApplyFilters?.(newFilters)
  }

  if (!smMatch) {
    return <MobileFilterButton filters={filters} onChangeFilters={onApplyFilters} />
  }

  return (
    <SectionFiltersWrapper>
      {areThereAnyOptionsSelected && (
        <>
          <Button icon={<SvgActionClose />} variant="tertiary" onClick={handleResetFilters}>
            Clear
          </Button>
          <VerticalDivider />
        </>
      )}
      <ChevronButtonHandler>
        <FiltersWrapper ref={filterWrapperRef} onMouseDown={handleMouseDown} visibleShadows={visibleShadows}>
          {filters.map((filter, idx) => {
            return (
              <FilterButtonWrapper key={idx}>
                <FilterButton {...filter} onChange={(selectedOptions) => handleApply(filter.name, selectedOptions)} />
              </FilterButtonWrapper>
            )
          })}
        </FiltersWrapper>
        {visibleShadows.left && isOverflow && (
          <ChevronButton
            direction="left"
            size="small"
            variant="tertiary"
            icon={<SvgActionChevronL />}
            onClick={handleArrowScroll('left')}
          />
        )}
        {visibleShadows.right && isOverflow && (
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
