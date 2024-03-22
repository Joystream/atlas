import { debounce } from 'lodash-es'
import { FC, MouseEvent, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { SPECIAL_CHARACTERS } from '@/config/regex'
import { useSearchResults } from '@/hooks/useSearchResults'
import { usePersonalDataStore } from '@/providers/personalData'
import { createPlaceholderData } from '@/utils/data'

import { RecentSearchItem } from './RecentSearchItem'
import { Result } from './Result'
import {
  Caption,
  Container,
  PlaceholderWrapper,
  SearchSection,
  ShortcutsGroup,
  ShortcutsWrapper,
  SkeletonAvatar,
  StyledShortcutIndicator,
} from './SearchBox.styles'

type SearchBoxProps = {
  searchQuery: string
  onSelectRecentSearch: (title?: string) => void
  className?: string
  selectedItem: null | number
  onLastSelectedItem: () => void
  onSelectItem: (title?: string | null) => void
  handleSetNumberOfItems: (items: number) => void
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void
  hasFocus: boolean
}

export const SearchBox: FC<SearchBoxProps> = memo(
  ({
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
    const { channels, videos, loading } = useSearchResults({ searchQuery, first: 3, fetchPolicy: 'network-only' })
    const { recentSearches, deleteRecentSearch } = usePersonalDataStore((state) => ({
      recentSearches: state.recentSearches,
      deleteRecentSearch: state.actions.deleteRecentSearch,
    }))
    const containerRef = useRef<HTMLDivElement>(null)
    const topRef = useRef(0)
    const [visualViewportHeight, setVisualViewportHeight] = useState(window.visualViewport?.height || 0)

    // Calculate searchbox height whether keyboard is open or not
    useLayoutEffect(() => {
      const debouncedVisualViewportChange = debounce(() => {
        setVisualViewportHeight(window.visualViewport?.height ?? 0)
      }, 100)
      window.visualViewport?.addEventListener('resize', debouncedVisualViewportChange)

      return () => {
        window.visualViewport?.removeEventListener('resize', debouncedVisualViewportChange)
      }
    }, [])

    const scrollToSelectedItem = useCallback(
      (top: number, title?: string | null) => {
        const offsetTop = -250
        const offsetBottom = -50
        onSelectItem(title)
        if (!containerRef.current) {
          return
        }
        const { offsetHeight } = containerRef.current
        if (selectedItem === 0 || top < offsetHeight) {
          containerRef?.current?.scrollTo(0, 0)
        }
        if (top >= offsetHeight + (top < topRef.current ? offsetTop : offsetBottom)) {
          containerRef?.current?.scrollTo(0, top + (top < topRef.current ? offsetBottom : offsetTop))
        }
        topRef.current = top
      },
      [onSelectItem, selectedItem]
    )

    const placeholders = useMemo(() => {
      const min = 20
      const max = 80
      const placeholderItems = createPlaceholderData(6)
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
    const slicedVideos = videos.items.slice(0, 3)
    const slicedChannels = channels.items.slice(0, 3)

    // Pass number off all results
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
          <SearchSection>
            <Caption as="span" color="colorText" variant="t100">
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
          </SearchSection>
        )}
        {loading && !!searchQuery && <SearchSection>{placeholders}</SearchSection>}
        {!!slicedVideos.length && !loading && (
          <SearchSection>
            <Caption as="span" color="colorText" variant="t100">
              Videos
            </Caption>
            {slicedVideos.map((video, idx) => (
              <Result
                key={`result-video-${video.id}`}
                loading={loading}
                video={video}
                query={searchQuery}
                selected={selectedItem === idx + filteredRecentSearches.length}
                handleSelectedItem={scrollToSelectedItem}
                selectedItem={selectedItem}
              />
            ))}
          </SearchSection>
        )}
        {!!slicedChannels.length && !loading && (
          <SearchSection>
            <Caption as="span" color="colorText" variant="t100">
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
          </SearchSection>
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
)

SearchBox.displayName = 'SearchBox'
