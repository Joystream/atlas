import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SkeletonLoader } from '@/components/SkeletonLoader'
import { SPECIAL_CHARACTERS } from '@/config/regex'
import { useSearchResults } from '@/hooks/useSearchResults'
import { usePersonalDataStore } from '@/providers/personalData'

import { RecentSearchItem } from './RecentSearchItem'
import { Result } from './Result'
import {
  Caption,
  Container,
  PlaceholderWrapper,
  Section,
  ShortcutsGroup,
  ShortcutsWrapper,
  SkeletonAvatar,
  StyledShortcutIndicator,
} from './SearchBox.style'

type SearchBoxProps = {
  searchQuery: string
  onSelectRecentSearch: (title?: string) => void
  className?: string
  selectedItem: null | number
  onLastSelectedItem: () => void
  onSelectItem: (title?: string | null) => void
  handleSetNumberOfItems: (items: number) => void
  onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  hasFocus: boolean
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  onSelectRecentSearch,
  className,
  selectedItem,
  onLastSelectedItem,
  onSelectItem,
  handleSetNumberOfItems,
  onMouseMove,
  hasFocus,
}) => {
  const { channels, videos, loading } = useSearchResults({ searchQuery })
  const { recentSearches, deleteRecentSearch } = usePersonalDataStore((state) => ({
    recentSearches: state.recentSearches,
    deleteRecentSearch: state.actions.deleteRecentSearch,
  }))
  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef(0)
  const [visualViewportHeight, setVisualViewportHeight] = useState(window.visualViewport.height)

  // Calculate searchbox height whether keyboard is open or not
  useEffect(() => {
    const debouncedVisualViewportChange = debounce(() => {
      setVisualViewportHeight(window.visualViewport.height)
    }, 100)
    window.visualViewport.addEventListener('resize', debouncedVisualViewportChange)

    return () => {
      window.visualViewport.removeEventListener('resize', debouncedVisualViewportChange)
    }
  }, [])

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

  const generatePlaceholders = useMemo(() => {
    const min = 20
    const max = 80
    const placeholderItems = Array.from({ length: 6 }, () => ({ id: undefined }))
    return placeholderItems.map((_, idx) => {
      const generatedWidth = Math.floor(Math.random() * (max - min)) + min
      return (
        <PlaceholderWrapper key={`placeholder-${idx}`}>
          <SkeletonAvatar width="32px" height="32px" rounded />
          <SkeletonLoader width={`${generatedWidth}%`} height="16px" />
        </PlaceholderWrapper>
      )
    })
  }, [])

  const handleRecentSearchDelete = (title: string) => {
    deleteRecentSearch(title)
  }

  const filteredRecentSearches = searchQuery.length
    ? recentSearches
        .filter((item) =>
          new RegExp(`${searchQuery.replace(SPECIAL_CHARACTERS, '\\$&').replace(/\s+/g, '|')}`, 'i').test(
            item.title || ''
          )
        )
        .slice(0, 3)
    : recentSearches
  const slicedVideos = videos.slice(0, 3)
  const slicedChannels = channels.slice(0, 3)

  useEffect(() => {
    handleSetNumberOfItems(filteredRecentSearches.length + slicedVideos.length + slicedChannels.length)
  }, [handleSetNumberOfItems, filteredRecentSearches.length, slicedVideos.length, slicedChannels.length])

  // Fire when user select last result
  useEffect(() => {
    if (selectedItem === filteredRecentSearches.length + slicedVideos.length + slicedChannels.length) {
      onLastSelectedItem()
    }
  }, [
    recentSearches.length,
    slicedVideos.length,
    slicedChannels.length,
    onLastSelectedItem,
    selectedItem,
    filteredRecentSearches.length,
  ])

  return (
    <Container
      isVisible={!!filteredRecentSearches.length || !!slicedVideos.length || !!slicedChannels.length || loading}
      className={className}
      ref={containerRef}
      onMouseMove={onMouseMove}
      hasQuery={searchQuery}
      visualViewportHeight={visualViewportHeight}
      hasFocus={hasFocus}
      data-scroll-lock-scrollable
    >
      {!!filteredRecentSearches.length && (
        <Section>
          <Caption secondary variant="caption">
            Recent searches
          </Caption>
          {filteredRecentSearches.map((recentSearch, idx) => (
            <RecentSearchItem
              key={`RecentSearchItem-${recentSearch.title}`}
              onDelete={() => handleRecentSearchDelete(recentSearch.title)}
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
      {loading && !!searchQuery && <Section>{generatePlaceholders}</Section>}
      {!!slicedVideos.length && !loading && (
        <Section>
          <Caption secondary variant="caption">
            Videos
          </Caption>
          {slicedVideos.map((video, idx) => (
            <Result
              key={`result-video-${video.id}`}
              video={video}
              query={searchQuery}
              selected={selectedItem === idx + filteredRecentSearches.length}
              handleSelectedItem={scrollToSelectedItem}
              selectedItem={selectedItem}
            />
          ))}
        </Section>
      )}
      {!!slicedChannels.length && !loading && (
        <Section>
          <Caption secondary variant="caption">
            Channels
          </Caption>
          {slicedChannels.map((channel, idx) => (
            <Result
              key={`result-channel-${channel.id}`}
              channel={channel}
              query={searchQuery}
              selected={selectedItem === idx + filteredRecentSearches.length + slicedVideos.length}
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
