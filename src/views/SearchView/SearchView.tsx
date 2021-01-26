import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { sizes } from '@/shared/theme'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'

import { SEARCH } from '@/api/queries'
import { Search, SearchVariables } from '@/api/queries/__generated__/Search'
import { TabsMenu } from '@/shared/components'
import { VideoGrid, PlaceholderVideoGrid, ChannelGrid } from '@/components'
import { usePersonalData } from '@/hooks'
import AllResultsTab from '@/views/SearchView/AllResultsTab'
import EmptyFallback from './EmptyFallback'

type SearchViewProps = {
  search?: string
} & RouteComponentProps
const tabs = ['all results', 'videos', 'channels']

const SearchView: React.FC<SearchViewProps> = ({ search = '', location }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { data, loading, error } = useQuery<Search, SearchVariables>(SEARCH, { variables: { text: search } })
  console.log({ location })
  const getChannelsAndVideos = (loading: boolean, data: Search | undefined) => {
    if (loading || !data?.search) {
      return { channels: [], videos: [] }
    }
    const results = data.search
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
  if (!loading && !data?.search) {
    throw new Error(`There was a problem with your search...`)
  }

  if (!loading && channels.length === 0 && videos.length === 0) {
    return <EmptyFallback />
  }

  return (
    <Container>
      <TabsMenu tabs={tabs} onSelectTab={setSelectedIndex} initialIndex={0} />
      {selectedIndex === 0 && (
        <AllResultsTab
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
  )
}

const Container = styled.div`
  margin: ${sizes(4)} 0;
  > * {
    margin-bottom: ${sizes(12)};
  }
`

export default SearchView
