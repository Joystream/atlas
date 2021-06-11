import styled from '@emotion/styled'
import React, { useState, useMemo } from 'react'

import { useSearch } from '@/api/hooks'
import { SearchQuery, AssetAvailability } from '@/api/queries'
import { VideoGrid, PlaceholderVideoGrid, ChannelGrid, ViewWrapper } from '@/components'
import { usePersonalData } from '@/hooks'
import { Tabs } from '@/shared/components'
import { sizes } from '@/shared/theme'

import AllResultsTab from './AllResultsTab'
import EmptyFallback from './EmptyFallback'

type SearchResultsProps = {
  query: string
}
const tabs = ['all results', 'videos', 'channels']

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { data, loading, error } = useSearch({
    text: query,
    whereVideo: {
      mediaAvailability_eq: AssetAvailability.Accepted,
      thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
    },
    whereChannel: {},
  })

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
  const { updateRecentSearches } = usePersonalData()

  const handleVideoClick = (id: string) => {
    updateRecentSearches(id, 'video')
  }
  const handleChannelClick = (id: string) => {
    updateRecentSearches(id, 'channel')
  }
  if (error) {
    throw error
  }
  if (!loading && !data) {
    throw new Error(`There was a problem with your search...`)
  }

  if (!loading && channels.length === 0 && videos.length === 0) {
    return <EmptyFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  return (
    <ViewWrapper>
      <Container>
        <Tabs tabs={mappedTabs} onSelectTab={setSelectedIndex} initialIndex={0} />
        {selectedIndex === 0 && (
          <AllResultsTab
            key={query}
            loading={loading}
            videos={videos}
            channels={channels}
            onVideoClick={handleVideoClick}
            onChannelClick={handleChannelClick}
          />
        )}
        {selectedIndex === 1 &&
          (loading ? (
            <PlaceholderVideoGrid />
          ) : (
            <VideoGrid videos={videos} onVideoClick={handleVideoClick} onChannelClick={handleChannelClick} />
          ))}
        {selectedIndex === 2 &&
          (loading ? (
            <PlaceholderVideoGrid />
          ) : (
            <ChannelGrid channels={channels} repeat="fill" onChannelClick={handleChannelClick} />
          ))}
      </Container>
    </ViewWrapper>
  )
}

const Container = styled.div`
  margin: ${sizes(4)} 0;
  > * {
    margin-bottom: ${sizes(12)};
  }
`

export default SearchResults
