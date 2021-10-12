import React from 'react'

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
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({ title, onDelete, query, onClick }) => {
  return (
    <ResultWrapper onDelete={onDelete} onClick={() => onClick(title)}>
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
