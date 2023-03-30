import { throttle } from 'lodash-es'
import { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

import { SvgActionChevronL, SvgActionChevronR, SvgActionClose, SvgActionFilters, SvgActionSearch } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  ChevronButton,
  ChevronButtonHandler,
  FilterButtonWrapper,
  FiltersAndSortWrapper,
  FiltersWrapper,
  MobileFirstRow,
  MobileSecondRow,
  SearchInput,
  SectionFiltersWrapper,
  SectionHeaderWrapper,
  SectionSearchWrapper,
  SectionTitle,
  SectionTitleWrapper,
  TabsWrapper,
  TitleAndSearchWrapper,
  VerticalDivider,
} from './SectionHeader.styles'

import { Avatar, AvatarProps } from '../../Avatar'
import { FilterButton, FilterButtonProps } from '../../FilterButton'
import { IconWrapper, IconWrapperProps } from '../../IconWrapper'
import { Tabs, TabsProps } from '../../Tabs'
import { Button } from '../../_buttons/Button'
import { InputProps } from '../../_inputs/Input'
import { Select, SelectProps } from '../../_inputs/Select'
import { ToggleButtonGroup, ToggleButtonOptionTypeProps } from '../../_inputs/ToggleButtonGroup'

type SearchProps = Omit<InputProps, 'size' | 'actionButton' | 'nodeStart' | 'type' | 'placeholder'>

const SCROLL_SHADOW_OFFSET = 10

type Sort =
  | {
      type: 'toggle-button'
      toggleButtonOptionTypeProps: ToggleButtonOptionTypeProps
    }
  | {
      type: 'select'
      selectProps: SelectProps
    }

type TitleNodeStart =
  | {
      type: 'icon'
      iconWrapperProps: IconWrapperProps
    }
  | {
      type: 'avatar'
      avatarProps: AvatarProps
    }
  | {
      type: 'custom'
      node: ReactNode
    }

type SectionHeaderStart =
  | {
      type: 'title'
      title: string
      nodeStart?: TitleNodeStart
    }
  | {
      type: 'tabs'
      tabsProps: TabsProps
    }

export type SectionHeaderProps = {
  start: SectionHeaderStart
  search?: SearchProps
  sort?: Sort
  onResetFilters?: () => void
  filters?: FilterButtonProps[]
}

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

export const SectionHeader: FC<SectionHeaderProps> = ({ start, sort, search, filters, onResetFilters }) => {
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false)
  const smMatch = useMediaMatch('sm')

  // MOBILE
  if (!smMatch) {
    const filtersInFirstRow = !sort && start.type === 'title'
    return (
      <SectionHeaderWrapper isTabs={start.type === 'tabs'}>
        <MobileFirstRow>
          {!isSearchInputOpen && (
            <>
              {start.type === 'title' && <SectionTitleComponent nodeStart={start.nodeStart} title={start.title} />}
              {start.type === 'tabs' && (
                <TabsWrapper>
                  <Tabs {...start.tabsProps} />
                </TabsWrapper>
              )}
            </>
          )}
          {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
          {filters && filtersInFirstRow && <SectionFilters filters={filters} />}
        </MobileFirstRow>
        <MobileSecondRow>
          {filters && !filtersInFirstRow && <SectionFilters filters={filters} />}
          {sort?.type === 'select' && <Select {...sort.selectProps} size="medium" />}
        </MobileSecondRow>
      </SectionHeaderWrapper>
    )
  }

  // DESKTOP
  return (
    <SectionHeaderWrapper isTabs={start.type === 'tabs'}>
      <TitleAndSearchWrapper>
        {start.type === 'title' && <SectionTitleComponent nodeStart={start.nodeStart} title={start.title} />}
        {start.type === 'tabs' && (
          <TabsWrapper>
            <Tabs {...start.tabsProps} />
          </TabsWrapper>
        )}
        {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
      </TitleAndSearchWrapper>
      {filters && <SectionFilters filters={filters} onResetFilters={onResetFilters} />}
      <FiltersAndSortWrapper>
        {sort?.type === 'toggle-button' && <ToggleButtonGroup {...sort.toggleButtonOptionTypeProps} />}
        {sort?.type === 'select' && <Select {...sort.selectProps} size="medium" />}
      </FiltersAndSortWrapper>
    </SectionHeaderWrapper>
  )
}

type DynamicSearchProps = {
  search: SearchProps
  isOpen: boolean
  onSearchToggle: (isOpen: boolean) => void
}

const DynamicSearch: FC<DynamicSearchProps> = ({ isOpen, onSearchToggle, search }) => {
  return (
    <SectionSearchWrapper>
      {isOpen ? (
        <SearchInput
          {...search}
          actionButton={{
            onClick: () => onSearchToggle(false),
            icon: <SvgActionClose />,
          }}
          nodeStart={<Button icon={<SvgActionSearch />} variant="tertiary" />}
          size="medium"
          placeholder="Search"
          type="search"
        />
      ) : (
        <Button
          icon={<SvgActionSearch />}
          onClick={() => {
            onSearchToggle(true)
          }}
          variant="tertiary"
        />
      )}
    </SectionSearchWrapper>
  )
}

type SectionTitleComponentProps = {
  nodeStart?: TitleNodeStart
  title: string
}

const SectionTitleComponent: FC<SectionTitleComponentProps> = ({ nodeStart, title }) => {
  const smMatch = useMediaMatch('sm')

  const renderNodeStart = () => {
    if (nodeStart?.type === 'avatar') {
      return <Avatar {...nodeStart.avatarProps} size={smMatch ? 'default' : 'bid'} />
    }
    if (nodeStart?.type === 'icon') {
      return <IconWrapper {...nodeStart?.iconWrapperProps} size="medium" />
    }
    if (nodeStart?.type === 'custom') {
      return <>{nodeStart.node}</>
    }
  }

  return (
    <SectionTitleWrapper>
      {nodeStart && renderNodeStart()}
      <SectionTitle variant={smMatch ? 'h500' : 'h400'} as="h3">
        {title}
      </SectionTitle>
    </SectionTitleWrapper>
  )
}

type SectionFiltersProps = {
  filters: FilterButtonProps[]
  onResetFilters?: () => void
}

const SectionFilters: FC<SectionFiltersProps> = ({ filters, onResetFilters }) => {
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
