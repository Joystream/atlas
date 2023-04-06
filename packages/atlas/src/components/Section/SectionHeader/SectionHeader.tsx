import { FC, ReactNode, useState } from 'react'

import { ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { AppliedFilters, SectionFilter } from '@/utils/filters'

import { DynamicSearch, SearchProps } from './DynamicSearch/DynamicSearch'
import { SectionFilters } from './SectionFilters/SectionFilters'
import {
  MobileFirstRow,
  MobileSecondRow,
  OverflowHiddenWrapper,
  RightSide,
  SectionHeaderWrapper,
  StartWrapper,
  StyledButton,
  StyledSelect,
} from './SectionHeader.styles'
import { SectionTitleComponent } from './SectionTitle/SectionTitle'

import { AvatarProps } from '../../Avatar'
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
  filters?: SectionFilter[]
  onApplyFilters?: (appliedFilters: AppliedFilters) => void
  button?: Omit<ButtonProps, 'size' | 'variant'>
}

export const SectionHeader: FC<SectionHeaderProps> = ({ start, sort, search, filters, onApplyFilters, button }) => {
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
              {start.type === 'tabs' && <Tabs {...start.tabsProps} />}
            </>
          )}
          {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
          {!isSearchInputOpen && (
            <RightSide>
              {filters && filtersInFirstRow && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
              {button && <StyledButton {...button} size="medium" variant="secondary" />}
            </RightSide>
          )}
        </MobileFirstRow>
        <MobileSecondRow>
          {filters && !filtersInFirstRow && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
          {sort?.type === 'select' && <Select {...sort.selectProps} size="medium" />}
        </MobileSecondRow>
      </SectionHeaderWrapper>
    )
  }

  // DESKTOP
  return (
    <SectionHeaderWrapper isTabs={start.type === 'tabs'}>
      <StartWrapper enableHorizonthalScrolling={start.type === 'tabs'}>
        {start.type === 'title' && <SectionTitleComponent nodeStart={start.nodeStart} title={start.title} />}
        {start.type === 'tabs' && <Tabs {...start.tabsProps} />}
      </StartWrapper>
      {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
      <OverflowHiddenWrapper>
        {filters && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
      </OverflowHiddenWrapper>
      {sort?.type === 'toggle-button' && <ToggleButtonGroup {...sort.toggleButtonOptionTypeProps} />}
      {sort?.type === 'select' && <StyledSelect {...sort.selectProps} size="medium" />}
      {button && <StyledButton {...button} size="medium" variant="secondary" />}
    </SectionHeaderWrapper>
  )
}
