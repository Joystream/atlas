import { FC, ReactNode, useState } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

import { DynamicSearch, SearchProps } from './DynamicSearch/DynamicSearch'
import { SectionFilters } from './SectionFilters/SectionFilters'
import {
  FiltersAndSortWrapper,
  MobileFirstRow,
  MobileSecondRow,
  SectionHeaderWrapper,
  TabsMobileWrapper,
  TitleAndSearchWrapper,
} from './SectionHeader.styles'
import { SectionTitleComponent } from './SectionTitle/SectionTitle'

import { AvatarProps } from '../../Avatar'
import { FilterButtonProps } from '../../FilterButton'
import { IconWrapperProps } from '../../IconWrapper'
import { Tabs, TabsProps } from '../../Tabs'
import { Select, SelectProps } from '../../_inputs/Select'
import { ToggleButtonGroup, ToggleButtonOptionTypeProps } from '../../_inputs/ToggleButtonGroup'

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
                <TabsMobileWrapper>
                  <Tabs {...start.tabsProps} />
                </TabsMobileWrapper>
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
        {start.type === 'tabs' && <Tabs {...start.tabsProps} />}
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
