import parse from 'html-react-parser'
import React from 'react'

import { Text } from '@/shared/components/Text'
import { SvgClock } from '@/shared/icons'

import { ResultWrapper } from './ResultWrapper'
import { ClockWrapper, RecentSearchItemWrapper } from './SearchBox.style'
import { useHighlitedTitle } from './useHighlitedTitle'

type RecentSearchItemProps = {
  onDelete?: () => void
  to: string
  query?: string
  title?: string
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({ title, onDelete, to, query }) => {
  const highlightedTitle = useHighlitedTitle(title, query)

  return (
    <ResultWrapper to={to} onDelete={onDelete}>
      <RecentSearchItemWrapper>
        <ClockWrapper>
          <SvgClock />
        </ClockWrapper>
        <Text secondary variant="button2">
          {parse(highlightedTitle)}
        </Text>
      </RecentSearchItemWrapper>
    </ResultWrapper>
  )
}
