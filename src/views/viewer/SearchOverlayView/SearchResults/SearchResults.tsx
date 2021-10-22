import styled from '@emotion/styled'
import React, { useState } from 'react'

import { ChannelGrid } from '@/components/ChannelGrid'
import { SkeletonLoaderVideoGrid } from '@/components/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { useSearchResults } from '@/hooks/useSearchResults'
import { Tabs } from '@/shared/components/Tabs'
import { sizes } from '@/shared/theme'

import { AllResultsTab } from './AllResultsTab'
import { EmptyFallback } from './EmptyFallback'

type SearchResultsProps = {
  query: string
}
const tabs = ['All results', 'Videos', 'Channels']

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { channels, videos, error, loading } = useSearchResults(query)

  if (error) {
    return <ViewErrorFallback />
  }

  if (!loading && channels.length === 0 && videos.length === 0) {
    return <EmptyFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  return (
    <ViewWrapper>
      <Container>
        <Tabs tabs={mappedTabs} onSelectTab={setSelectedIndex} initialIndex={0} />
        {selectedIndex === 0 && <AllResultsTab key={query} loading={loading} videos={videos} channels={channels} />}
        {selectedIndex === 1 && (loading ? <SkeletonLoaderVideoGrid /> : <VideoGrid videos={videos} />)}
        {selectedIndex === 2 &&
          (loading ? <SkeletonLoaderVideoGrid /> : <ChannelGrid channels={channels} repeat="fill" />)}
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
