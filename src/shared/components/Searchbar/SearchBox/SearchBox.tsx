import React, { useCallback, useEffect, useRef } from 'react'

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
  selectedItem: null | number
  onLastSelectedItem: () => void
  onSelectItem: (title?: string | null) => void
  handleSetNumberOfItems: (items: number) => void
  onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  onSelectRecentSearch,
  selectedItem,
  onLastSelectedItem,
  onSelectItem,
  handleSetNumberOfItems,
  onMouseMove,
}) => {
  const { channels, videos, loading } = useSearchResults(searchQuery, 3)
  const { recentSearches, deleteRecentSearch } = usePersonalDataStore((state) => ({
    recentSearches: state.recentSearches,
    deleteRecentSearch: state.actions.deleteRecentSearch,
  }))
  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef(0)

  const scrollToSelectedItem = useCallback(
    (top: number, title?: string | null) => {
      onSelectItem(title)
      if (!containerRef.current) {
        return
      }
      const { offsetHeight } = containerRef.current
      if (selectedItem === 0 || top < offsetHeight) {
        containerRef?.current?.scrollTo(0, 0)
      }
      if (top >= offsetHeight + (top < topRef.current ? -250 : -50)) {
        containerRef?.current?.scrollTo(0, top + (top < topRef.current ? -50 : -250))
      }
      topRef.current = top
    },
    [onSelectItem, selectedItem]
  )

  const handleRecentSearchDelete = (id: number) => {
    deleteRecentSearch(id)
  }

  const slicedReccentSearches = recentSearches.slice(0, 6)

  useEffect(() => {
    handleSetNumberOfItems(slicedReccentSearches.length + videos.length + channels.length)
  }, [handleSetNumberOfItems, slicedReccentSearches.length, videos.length, channels.length])

  // Fire when user select last result
  useEffect(() => {
    if (selectedItem === slicedReccentSearches.length + videos.length + channels.length) {
      onLastSelectedItem()
    }
  }, [
    recentSearches.length,
    videos.length,
    channels.length,
    onLastSelectedItem,
    selectedItem,
    slicedReccentSearches.length,
  ])

  return (
    <Container
      visible={!!recentSearches.length || !!videos.length || !!channels.length || loading}
      ref={containerRef}
      onMouseMove={onMouseMove}
    >
      {!!recentSearches.length && (
        <Section>
          <Caption secondary variant="caption">
            Recent searches
          </Caption>
          {slicedReccentSearches.map((recentSearch, idx) => (
            <RecentSearchItem
              key={`RecentSearchItem-${recentSearch.id}`}
              onDelete={() => handleRecentSearchDelete(recentSearch.id)}
              title={recentSearch.title}
              query={searchQuery}
              selected={idx === selectedItem}
              handleSelectedItem={scrollToSelectedItem}
              onClick={onSelectRecentSearch}
              selectedItem={selectedItem}
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
          {videos.map((video, idx) => (
            <Result
              key={`result-video-${video.id}`}
              video={video}
              query={searchQuery}
              selected={selectedItem === idx + slicedReccentSearches.length}
              handleSelectedItem={scrollToSelectedItem}
              selectedItem={selectedItem}
            />
          ))}
        </Section>
      )}
      {!!channels.length && (
        <Section>
          <Caption secondary variant="caption">
            Channels
          </Caption>
          {channels.map((channel, idx) => (
            <Result
              key={`result-channel-${channel.id}`}
              channel={channel}
              query={searchQuery}
              selected={selectedItem === idx + slicedReccentSearches.length + videos.length}
              handleSelectedItem={scrollToSelectedItem}
              selectedItem={selectedItem}
            />
          ))}
        </Section>
      )}
      <ShortcutsWrapper>
        <ShortcutsGroup>
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
