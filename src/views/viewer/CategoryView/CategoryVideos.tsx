import styled from '@emotion/styled'
import { id } from 'date-fns/locale'
import React, { useCallback, useRef, useState } from 'react'

import { AssetAvailability, useSearchLazyQuery } from '@/api/queries'
import { Button } from '@/shared/components/Button'
import { Search } from '@/shared/components/Search/Search'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const CategoryVideos = () => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo, { loading: loadingSearch, data: searchData, error: errorSearch }] = useSearchLazyQuery({
    onError: (error) =>
      SentryLogger.error('Failed to search channel videos', 'ChannelView', error, {
        search: { channelId: id, query: searchQuery },
      }),
  })
  const search = useCallback(
    (searchQuery: string) => {
      setSearchQuery(searchQuery)
      searchVideo({
        variables: {
          text: searchQuery,
          whereVideo: {
            isPublic_eq: true,
            mediaAvailability_eq: AssetAvailability.Accepted,
            thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
            channelId_eq: '0',
          },
          limit: 100,
        },
      })
    },
    [searchVideo]
  )
  const searchInputRef = useRef<HTMLInputElement>(null)
  return (
    <Container>
      <Text variant="h5">All videos (441)</Text>
      <FiltersSearchContainer>
        <Search
          searchInputRef={searchInputRef}
          isSearchInputOpen={isSearchInputOpen}
          setIsSearchingInputOpen={setIsSearchingInputOpen}
          setIsSearching={setIsSearching}
          search={search}
        />
        <Button variant="secondary">Filters</Button>
      </FiltersSearchContainer>
    </Container>
  )
}

const Container = styled.div`
  margin: ${sizes(16)} 0 0 0;
  display: grid;
  gap: ${sizes(4)};
`

const FiltersSearchContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-template-columns: 1fr auto;
`
