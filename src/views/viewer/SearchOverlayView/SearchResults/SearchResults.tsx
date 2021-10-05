import React, { useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useSearch } from '@/api/hooks'
import { AssetAvailability, SearchQuery } from '@/api/queries'
import { ChannelGrid } from '@/components/ChannelGrid'
import { SkeletonLoaderVideoGrid } from '@/components/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'
import { Tabs } from '@/shared/components/Tabs'
import { SvgGlyphClose } from '@/shared/icons'
import { SentryLogger } from '@/utils/logs'

import { EmptyFallback } from './EmptyFallback'
import { MobileFilters } from './MobileFilters'
import {
  ClearButton,
  Filter,
  Filters,
  FiltersWrapper,
  PaddingWrapper,
  Results,
  SearchControls,
} from './SearchResults.style'

type SearchResultsProps = {
  query: string
}
const tabs = ['Videos', 'Channels']

export const SearchResults: React.FC<SearchResultsProps> = React.memo(({ query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const { data, loading, error } = useSearch(
    {
      text: query,
      limit: 50,
      whereVideo: {
        mediaAvailability_eq: AssetAvailability.Accepted,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
      },
      whereChannel: {},
    },
    { onError: (error) => SentryLogger.error('Failed to fetch search results', 'SearchResults', error) }
  )

  const smMatch = useMediaMatch('sm')

  const getChannelsAndVideos = (loading: boolean, data: SearchQuery['search'] | undefined) => {
    if (loading || !data) {
      return { channels: [], videos: [] }
    }
    const results = data
    const videos = results.flatMap((result) => (result.item.__typename === 'Video' ? [result.item] : []))
    const channels = results.flatMap((result) => (result.item.__typename === 'Channel' ? [result.item] : []))
    return { channels, videos }
  }

  const { channels, videos } = useMemo(() => getChannelsAndVideos(loading, data), [loading, data])
  const updateRecentSearches = usePersonalDataStore((state) => state.actions.updateRecentSearches)

  const handleVideoClick = (id: string) => {
    updateRecentSearches(id, 'video')
  }
  const handleChannelClick = (id: string) => {
    updateRecentSearches(id, 'channel')
  }

  const toggleFilters = () => {
    setFiltersOpen((state) => !state)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  if (!loading && channels.length === 0 && videos.length === 0) {
    return <EmptyFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  const FILTERS = [
    {
      name: 'Categories',
      action: null,
    },
    {
      name: 'Date uploaded',
      action: null,
    },
    {
      name: 'Length',
      action: null,
    },
    {
      name: 'License',
      action: null,
    },
    {
      name: 'Other filters',
      action: null,
    },
  ]

  return (
    <ViewWrapper>
      <SearchControls filtersOpen={filtersOpen}>
        <PaddingWrapper>
          <Tabs tabs={mappedTabs} onSelectTab={setSelectedIndex} initialIndex={0} onFiltersClick={toggleFilters} />
        </PaddingWrapper>
        <CSSTransition in={filtersOpen} timeout={100} classNames="filters" unmountOnExit>
          <Filters>
            <FiltersWrapper>
              {smMatch ? (
                <>
                  {FILTERS.map((filter) => (
                    <Filter variant="secondary" key={filter.name} indicator={3}>
                      {filter.name}
                    </Filter>
                  ))}
                  <ClearButton variant="tertiary" icon={<SvgGlyphClose />}>
                    Clear all
                  </ClearButton>
                </>
              ) : (
                <MobileFilters onClose={toggleFilters} />
              )}
            </FiltersWrapper>
          </Filters>
        </CSSTransition>
      </SearchControls>
      <Results>
        {selectedIndex === 0 &&
          (loading ? (
            <SkeletonLoaderVideoGrid />
          ) : (
            <VideoGrid videos={videos} onVideoClick={handleVideoClick} onChannelClick={handleChannelClick} />
          ))}
        {selectedIndex === 1 &&
          (loading ? (
            <SkeletonLoaderVideoGrid />
          ) : (
            <ChannelGrid channels={channels} repeat="fill" onChannelClick={handleChannelClick} />
          ))}
      </Results>
    </ViewWrapper>
  )
})
