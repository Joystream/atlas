import React, { useCallback, useRef, useState } from 'react'

import { AssetAvailability, VideoOrderByInput, useSearchLazyQuery } from '@/api/queries'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { Search } from '@/shared/components/Search/Search'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters, SvgGlyphClose } from '@/shared/icons'
import { SentryLogger } from '@/utils/logs'

import {
  Container,
  ControlsContainer,
  FiltersContainer,
  FiltersInnerContainer,
  FiltersSearchContainer,
  SortContainer,
} from './CategoryVideos.styles'

export const CategoryVideos = () => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [isFiltersOpen, setiIsFiltersOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(!mdMatch)
  const [, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo] = useSearchLazyQuery({
    onError: (error) =>
      SentryLogger.error('Failed to search channel videos', 'ChannelView', error, {
        search: { query: searchQuery },
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
          },
          limit: 100,
        },
      })
    },
    [searchVideo]
  )

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }
  const handleFilterClick = () => {
    setiIsFiltersOpen((value) => !value)
  }
  return (
    <Container>
      <ControlsContainer>
        <Text variant={mdMatch ? 'h4' : 'h5'}>All videos (441)</Text>
        {mdMatch && <Select size="small" helperText={null} placeholder="Language" value={null} items={SORT_OPTIONS} />}
        <FiltersSearchContainer>
          <Search
            searchInputRef={searchInputRef}
            isSearchInputOpen={isSearchInputOpen}
            setIsSearchingInputOpen={setIsSearchingInputOpen}
            setIsSearching={setIsSearching}
            search={search}
          />
          {betweenMdAndLgMatch ? (
            <IconButton variant="secondary" onClick={handleFilterClick}>
              <SvgActionFilters />
            </IconButton>
          ) : (
            <Button variant="secondary" icon={<SvgActionFilters />} onClick={handleFilterClick}>
              Filters
            </Button>
          )}
        </FiltersSearchContainer>
        {mdMatch && (
          <SortContainer>
            <Text variant="body2">Sort by</Text>
            <Select size="small" helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
          </SortContainer>
        )}
      </ControlsContainer>
      {mdMatch && (
        <FiltersContainer open={isFiltersOpen}>
          <FiltersInnerContainer>{/* filters go here */}</FiltersInnerContainer>
          <Button variant="tertiary" icon={<SvgGlyphClose />}>
            Clear all
          </Button>
        </FiltersContainer>
      )}
    </Container>
  )
}
