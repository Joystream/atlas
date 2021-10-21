import React, { useCallback } from 'react'

import { absoluteRoutes } from '@/config/routes'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClock } from '@/shared/icons'

import { ResultTitle } from './ResultTitle'
import { ResultWrapper } from './ResultWrapper'
import { ClockWrapper, RecentSearchItemWrapper } from './SearchBox.style'

type RecentSearchItemProps = {
  onClick: (title?: string) => void
  onDelete?: () => void
  query?: string
  title?: string
  selected?: boolean
  handleSelectedItem: (top: number, title?: string) => void
  selectedItem: null | number
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({
  title,
  onDelete,
  query,
  onClick,
  selected,
  handleSelectedItem,
  selectedItem,
}) => {
  const onSelected = useCallback(
    (top: number) => {
      handleSelectedItem(top, title)
    },
    [handleSelectedItem, title]
  )

  return (
    <ResultWrapper
      onDelete={onDelete}
      onClick={() => onClick(title)}
      handleSelectedItem={onSelected}
      selected={selected}
      to={absoluteRoutes.viewer.search({ query: title?.trim() })}
      variant="textOnly"
      selectedItem={selectedItem}
    >
      <RecentSearchItemWrapper>
        <ClockWrapper>
          <SvgGlyphClock />
        </ClockWrapper>
        <Text secondary variant="button2">
          <ResultTitle title={title} query={query} />
        </Text>
      </RecentSearchItemWrapper>
    </ResultWrapper>
  )
}
