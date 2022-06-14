import { FC, memo, useCallback } from 'react'

import { SvgActionClock } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'

import { ResultTitle } from './ResultTitle'
import { ResultWrapper } from './ResultWrapper'
import { ClockWrapper, RecentSearchItemWrapper, Title } from './SearchBox.styles'

type RecentSearchItemProps = {
  onClick: (title?: string) => void
  onDelete?: () => void
  query?: string
  title?: string
  selected?: boolean
  handleSelectedItem: (top: number, title?: string) => void
  selectedItem: null | number
}

export const RecentSearchItem: FC<RecentSearchItemProps> = memo(
  ({ title, onDelete, query, onClick, selected, handleSelectedItem, selectedItem }) => {
    const onSelected = useCallback(
      (top: number) => {
        handleSelectedItem(top, title)
      },
      [handleSelectedItem, title]
    )

    const handleClick = useCallback(() => {
      onClick(title)
    }, [onClick, title])

    return (
      <ResultWrapper
        onDelete={onDelete}
        onClick={handleClick}
        handleSelectedItem={onSelected}
        selected={selected}
        to={absoluteRoutes.viewer.search({ query: title?.trim() })}
        variant="textOnly"
        selectedItem={selectedItem}
      >
        <RecentSearchItemWrapper>
          <ClockWrapper>
            <SvgActionClock />
          </ClockWrapper>
          <Title secondary={!selected} variant="t200-strong">
            <ResultTitle title={title} query={query} />
          </Title>
        </RecentSearchItemWrapper>
      </ResultWrapper>
    )
  }
)

RecentSearchItem.displayName = 'RecentSearchItem'
