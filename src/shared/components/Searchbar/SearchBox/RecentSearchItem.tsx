import parse from 'html-react-parser'
import React, { useMemo } from 'react'

import { Text } from '@/shared/components/Text'
import { SvgClock } from '@/shared/icons'

import { ResultWrapper } from './ResultWrapper'
import { ClockWrapper, RecentSearchItemWrapper } from './SearchBox.style'

type RecentSearchItemProps = {
  onDelete?: () => void
  to: string
  query?: string
  title?: string
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({ title, onDelete, to, query }) => {
  const highlightedTitle = useMemo(() => {
    if (query) {
      const regex = new RegExp(query, 'i')
      return title ? title.replace(regex, (match) => `<span style="color: white">${match}</span>`) : ''
    }
    return title || ''
  }, [query, title])

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
