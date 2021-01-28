import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { sizes } from '@/shared/theme'
import { RouteComponentProps } from '@/views/LayoutWithRouting'
import { useQuery } from '@apollo/client'

import { SEARCH } from '@/api/queries'
import { Search, SearchVariables } from '@/api/queries/__generated__/Search'
import { Tabs } from '@/shared/components'
import { VideoGrid, PlaceholderVideoGrid, ChannelGrid } from '@/components'
import AllResultsTab from '@/views/SearchView/AllResultsTab'
import EmptyFallback from './EmptyFallback'

type SearchViewProps = {
  search?: string
} & RouteComponentProps
const tabs = ['all results', 'videos', 'channels']

const SearchView: React.FC<SearchViewProps> = ({ search = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { data, loading, error } = useQuery<Search, SearchVariables>(SEARCH, { variables: { text: search } })

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
      <Tabs tabs={tabs} onSelectTab={setSelectedIndex} initialIndex={0} />
      {selectedIndex === 0 && <AllResultsTab loading={loading} videos={videos} channels={channels} />}
      {selectedIndex === 1 && (loading ? <PlaceholderVideoGrid /> : <VideoGrid videos={videos} />)}
      {selectedIndex === 2 && (loading ? <PlaceholderVideoGrid /> : <ChannelGrid channels={channels} repeat="fill" />)}
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
