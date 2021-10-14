import React from 'react'

import { useSearchResults } from '@/hooks/useSearchResults'
import { usePersonalDataStore } from '@/providers/personalData'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'

import { RecentSearchItem } from './RecentSearchItem'
import { Result } from './Result'
import {
  Caption,
  Container,
  PlaceholderWrapper,
  Section,
  ShortcutsGroup,
  ShortcutsWrapper,
  StyledShortcutIndicator,
} from './SearchBox.style'

type SearchBoxProps = {
  searchQuery: string
  onSelectRecentSearch: (title?: string) => void
}

const generatePlaceholders = () => {
  const min = 20
  const max = 100
  const placeholderItems = Array.from({ length: 6 }, () => ({ id: undefined }))
  return placeholderItems.map((_, idx) => {
    const generatedWidth = Math.floor(Math.random() * (max - min)) + min
    return (
      <PlaceholderWrapper key={`placeholder-${idx}`}>
        <SkeletonLoader width="32px" height="32px" rounded />
        <SkeletonLoader width={`${generatedWidth}%`} height="16px" />
      </PlaceholderWrapper>
    )
  })
}

export const SearchBox: React.FC<SearchBoxProps> = ({ searchQuery, onSelectRecentSearch }) => {
  const { channels, videos, loading } = useSearchResults(searchQuery, 3)
  const { recentSearches, deleteRecentSearch } = usePersonalDataStore((state) => ({
    recentSearches: state.recentSearches,
    deleteRecentSearch: state.actions.deleteRecentSearch,
  }))

  const handleRecentSearchDelete = (id: number) => {
    deleteRecentSearch(id)
  }

  return (
    <Container visible={!!recentSearches.length || !!videos.length || !!channels.length || loading}>
      {!!recentSearches.length && (
        <Section>
          <Caption secondary variant="caption">
            Recent searches
          </Caption>
          {recentSearches.slice(0, 6).map((recentSearch) => (
            <RecentSearchItem
              key={`RecentSearchItem-${recentSearch.id}`}
              onDelete={() => handleRecentSearchDelete(recentSearch.id)}
              title={recentSearch.title}
              query={searchQuery}
              onClick={onSelectRecentSearch}
            />
          ))}
        </Section>
      )}
      {loading && <Section>{generatePlaceholders()}</Section>}
      {!!videos.length && (
        <Section>
          <Caption secondary variant="caption">
            Videos
          </Caption>
          {videos.map((video) => (
            <Result key={`result-video-${video.id}`} video={video} query={searchQuery} />
          ))}
        </Section>
      )}
      {!!channels.length && (
        <Section>
          <Caption secondary variant="caption">
            Channels
          </Caption>
          {channels.map((channel) => (
            <Result key={`result-channel-${channel.id}`} channel={channel} query={searchQuery} />
          ))}
        </Section>
      )}
      <ShortcutsWrapper>
        <ShortcutsGroup>
          <StyledShortcutIndicator>⇥</StyledShortcutIndicator>
          or
          <StyledShortcutIndicator group>↓</StyledShortcutIndicator>
          <StyledShortcutIndicator>↑</StyledShortcutIndicator>
          to navigate
        </ShortcutsGroup>
        <ShortcutsGroup>
          <StyledShortcutIndicator>↩</StyledShortcutIndicator>
          to select
        </ShortcutsGroup>
        <ShortcutsGroup>
          <StyledShortcutIndicator>/</StyledShortcutIndicator>
          to search
        </ShortcutsGroup>
      </ShortcutsWrapper>
    </Container>
  )
}
