import { FC, useRef } from 'react'

import { SvgActionChevronL, SvgActionChevronR, SvgActionClose } from '@/assets/icons'
import { FilterButton, FilterButtonProps } from '@/components/FilterButton'
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
  filters: FilterButtonProps[]
  onResetFilters?: () => void
}

export const SectionFilters: FC<SectionFiltersProps> = ({ filters, onResetFilters }) => {
  const smMatch = useMediaMatch('sm')
  const filterWrapperRef = useRef<HTMLDivElement>(null)

  const { handleMouseDown, visibleShadows, handleArrowScroll, isOverflow } = useHorizonthalFade(filterWrapperRef)

  const areThereAnyOptionsSelected = filters
    .map((filter) => (filter.type === 'checkbox' ? filter.selectedOptions : filter.selectedOption))
    .flat()
    .some(Boolean)

  if (!smMatch) {
    return null
    // todo create a variant for mobile
    // return <FilterButton icon={<SvgActionFilters />} label="Filters" onApply={() => null} options={[]} />
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
        <FiltersWrapper ref={filterWrapperRef} onMouseDown={handleMouseDown} visibleShadows={visibleShadows}>
          {filters.map((filter, idx) => (
            <FilterButtonWrapper key={idx}>
              <FilterButton {...filter} />
            </FilterButtonWrapper>
          ))}
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
