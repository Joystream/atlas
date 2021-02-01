import React, { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { sizes } from '@/shared/theme'
import { Tabs } from '@/shared/components'
import { VideoGrid, PlaceholderVideoGrid, ChannelGrid } from '@/components'
import AllResultsTab from '@/views/SearchView/AllResultsTab'
import EmptyFallback from './EmptyFallback'
import { useSearch } from '@/api/hooks'
import { SearchQuery } from '@/api/queries'

type SearchViewProps = {
  search?: string
}
const tabs = ['all results', 'videos', 'channels']

const SearchView: React.FC<SearchViewProps> = ({ search = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { data, loading, error } = useSearch({ text: search }, { fetchPolicy: 'cache-and-network' })

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

  if (error) {
    throw error
  }
  if (!loading && !data) {
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
