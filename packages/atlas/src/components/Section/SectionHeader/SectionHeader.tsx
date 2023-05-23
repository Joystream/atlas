import { FC, ReactNode, useState } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { SectionFilter } from '@/components/FilterButton'
import { ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { DynamicSearch, SearchProps } from './DynamicSearch/DynamicSearch'
import { SectionFilters } from './SectionFilters/SectionFilters'
import {
  MobileFirstRow,
  MobileSecondRow,
  OverflowHiddenWrapper,
  RightSide,
  SectionHeaderWrapper,
  StartWrapper,
  StyledArrowButton,
  StyledButton,
  StyledSelect,
} from './SectionHeader.styles'
import { SectionTitleComponent } from './SectionTitle/SectionTitle'

import { AvatarProps } from '../../Avatar'
import { IconWrapperProps } from '../../IconWrapper'
import { Tabs, TabsProps } from '../../Tabs'
import { Select, SelectProps } from '../../_inputs/Select'
import { ToggleButtonGroup, ToggleButtonOptionTypeProps } from '../../_inputs/ToggleButtonGroup'

type Sort<T> =
  | {
      type: 'toggle-button'
      toggleButtonOptionTypeProps: ToggleButtonOptionTypeProps<T>
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
      nodeEnd?: ReactNode
    }
  | {
      type: 'tabs'
      tabsProps: TabsProps
    }

type Carousel =
  | {
      isCarousel?: true
      onMoveCarouselRight?: () => void
      onMoveCarouselLeft?: () => void
      isBeginning?: boolean
      isEnd?: boolean
    }
  | {
      isCarousel?: false
    }

export type SectionHeaderProps<T> = {
  start: SectionHeaderStart
  search?: SearchProps
  sort?: Sort<T>
  filters?: SectionFilter[]
  onApplyFilters?: (appliedFilters: SectionFilter[]) => void
  button?: Omit<ButtonProps, 'size' | 'variant'>
} & Carousel

export function SectionHeader<T>(props: SectionHeaderProps<T>) {
  const { start, sort, search, filters, onApplyFilters, button, isCarousel } = props
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false)
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')

  // MOBILE
  if (!smMatch) {
    const filtersInFirstRow = !sort && start.type === 'title'
    return (
      <SectionHeaderWrapper isTabs={start.type === 'tabs'} isSearchInputOpen={isSearchInputOpen}>
        <MobileFirstRow>
          {!isSearchInputOpen && (
            <>
              {start.type === 'title' && <SectionTitleComponent {...start} />}
              {start.type === 'tabs' && <Tabs {...start.tabsProps} />}
            </>
          )}
          {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
          {!isSearchInputOpen && (
            <RightSide>
              {filters && filtersInFirstRow && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
              {isCarousel && (
                <>
                  <ArrowButton disabled={props.isBeginning} direction="left" onClick={props.onMoveCarouselLeft} />
                  <ArrowButton disabled={props.isEnd} direction="right" onClick={props.onMoveCarouselRight} />
                </>
              )}
              {button && <StyledButton {...button} size="medium" variant="secondary" />}
            </RightSide>
          )}
        </MobileFirstRow>
        <MobileSecondRow>
          {filters && !filtersInFirstRow && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
          {sort?.type === 'select' && <Select {...sort.selectProps} size="medium" />}
          {sort?.type === 'toggle-button' && <ToggleButtonGroup {...sort.toggleButtonOptionTypeProps} width="fluid" />}
        </MobileSecondRow>
      </SectionHeaderWrapper>
    )
  }

  const shouldShowFilters = !mdMatch ? !isSearchInputOpen : true
  // DESKTOP
  return (
    <SectionHeaderWrapper isTabs={start.type === 'tabs'}>
      <StartWrapper enableHorizonthalScrolling={start.type === 'tabs'}>
        {start.type === 'title' && <SectionTitleComponent {...start} />}
        {start.type === 'tabs' && <Tabs {...start.tabsProps} />}
      </StartWrapper>
      {search && <DynamicSearch search={search} isOpen={isSearchInputOpen} onSearchToggle={setIsSearchInputOpen} />}
      <OverflowHiddenWrapper>
        {filters && shouldShowFilters && <SectionFilters filters={filters} onApplyFilters={onApplyFilters} />}
      </OverflowHiddenWrapper>
      {sort?.type === 'toggle-button' && <ToggleButtonGroup {...sort.toggleButtonOptionTypeProps} />}
      {sort?.type === 'select' && <StyledSelect {...sort.selectProps} size="medium" />}
      {isCarousel && (
        <>
          <ArrowButton disabled={props.isBeginning} direction="left" onClick={props.onMoveCarouselLeft} />
          <ArrowButton disabled={props.isEnd} direction="right" onClick={props.onMoveCarouselRight} />
        </>
      )}
      {button && <StyledButton {...button} size="medium" variant="secondary" />}
    </SectionHeaderWrapper>
  )
}

type ArrowButtonProps = {
  disabled?: boolean
  onClick?: () => void
  direction: 'left' | 'right'
}
const ArrowButton: FC<ArrowButtonProps> = ({ disabled, onClick, direction }) => {
  return (
    <StyledArrowButton
      disabled={disabled}
      size="medium"
      icon={direction === 'left' ? <SvgActionChevronL /> : <SvgActionChevronR />}
      variant="tertiary"
      onClick={onClick}
    />
  )
}
