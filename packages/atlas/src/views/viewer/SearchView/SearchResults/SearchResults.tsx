import { FC, memo, useEffect, useMemo, useState } from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { ChannelGrid } from '@/components/_channel/ChannelGrid'
import { SvgActionFilters } from '@/components/_icons'
import { SkeletonLoaderVideoGrid } from '@/components/_loaders/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/_video/VideoGrid'
import { languages } from '@/config/languages'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchResults } from '@/hooks/useSearchResults'
import { useSearchStore } from '@/providers/search'

import {
  FiltersWrapper,
  PaddingWrapper,
  Results,
  SearchControls,
  StyledPagination,
  StyledSelect,
} from './SearchResults.styles'

type SearchResultsProps = {
  query: string
}
const tabs = ['Videos', 'Channels']

const INITIAL_NUMBER_OF_RESULTS = 20

export const SearchResults: FC<SearchResultsProps> = memo(({ query }) => {
  const smMatch = useMediaMatch('sm')
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [numberOfColumns, setNumberOfColumns] = useState(1)
  const [page, setPage] = useState(0)
  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const numberOfFullyFilledRows = numberOfColumns ? Math.ceil(INITIAL_NUMBER_OF_RESULTS / numberOfColumns) : 6
  const numberOfResults =
    INITIAL_NUMBER_OF_RESULTS % numberOfColumns === 0
      ? INITIAL_NUMBER_OF_RESULTS
      : numberOfColumns * numberOfFullyFilledRows
  const { videos, channels, loading, error } = useSearchResults({
    searchQuery: query,
    videoWhereInput: selectedTabIndex === 0 ? videoWhereInput : undefined,
    first: numberOfResults,
  })

  const refetch = selectedTabIndex === 0 ? videos.refetch : channels.refetch
  const {
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()

  useEffect(() => {
    if (selectedTabIndex === 1) {
      setIsFiltersOpen(false)
    }
  }, [selectedTabIndex, setIsFiltersOpen])

  const paginationData = useMemo(() => {
    return {
      pageInfo: selectedTabIndex === 0 ? videos.pageInfo : channels.pageInfo,
      totalCount: selectedTabIndex === 0 ? videos.totalCount : channels.totalCount,
      type: selectedTabIndex === 0 ? 'videos' : 'channels',
    }
  }, [channels.pageInfo, channels.totalCount, selectedTabIndex, videos.pageInfo, videos.totalCount])

  const handlePageChange = (page: number) => {
    const fetchMore = selectedTabIndex === 0 ? videos.fetchMore : channels.fetchMore
    const { totalCount, pageInfo } = paginationData
    const items = selectedTabIndex === 0 ? videos.items : channels.items
    setPage(page)
    if (
      !!items.length &&
      page * numberOfResults + numberOfResults > items?.length &&
      items?.length < (totalCount ?? 0)
    ) {
      fetchMore({
        variables: {
          first: page * numberOfResults + numberOfResults * 2 - items.length,
          after: pageInfo?.endCursor,
        },
      })
    }
  }

  const handleSelectLanguage = (selectedLanguage: unknown) => {
    setLanguage(selectedLanguage as string | null | undefined)
    setVideoWhereInput((value) => ({
      ...value,
      language: {
        iso_eq: selectedLanguage as string,
      },
    }))
  }

  const toggleFilters = () => {
    setIsFiltersOpen((state) => !state)
  }

  useEffect(() => {
    setPage(0)
  }, [query])

  useEffect(() => {
    setPage(0)
    refetch()
  }, [refetch, selectedTabIndex])

  if (error) {
    return <ViewErrorFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  const showEmptyFallback =
    !loading &&
    ((videos.items.length === 0 && selectedTabIndex === 0) ||
      (channels.items.length === 0 && selectedTabIndex === 1)) &&
    !!query

  const sliceStart = page * numberOfResults
  const sliceEnd = page * numberOfResults + numberOfResults
  const paginatedVideos = videos.items.slice(sliceStart, sliceEnd)
  const paginatedChannels = channels.items.slice(sliceStart, sliceEnd)
  const placeHoldersCount = numberOfColumns * numberOfFullyFilledRows

  return (
    <ViewWrapper>
      <SearchControls>
        <PaddingWrapper filtersOpen={isFiltersOpen}>
          <Tabs tabs={mappedTabs} onSelectTab={setSelectedTabIndex} initialIndex={0} />
          <FiltersWrapper>
            {smMatch && selectedTabIndex === 0 && (
              <StyledSelect
                onChange={handleSelectLanguage}
                size="medium"
                value={language}
                items={[{ name: 'All languages', value: 'undefined' }, ...languages]}
              />
            )}
            {selectedTabIndex === 0 && (
              <Button
                icon={<SvgActionFilters />}
                iconPlacement="left"
                variant="secondary"
                badge={canClearAllFilters}
                onClick={toggleFilters}
              >
                {smMatch && 'Filters'}
              </Button>
            )}
          </FiltersWrapper>
        </PaddingWrapper>
        <FiltersBar {...filtersBarLogic} activeFilters={['categories', 'date', 'length', 'other', 'language']} />
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer big>
          {showEmptyFallback ? (
            <EmptyFallback
              title={`No ${selectedTabIndex === 0 ? 'videos' : 'channels'} found`}
              subtitle="Please, try using different search terms or change your filtering criteria"
              button={
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => {
                    setSearchOpen(true)
                    setSearchQuery('')
                  }}
                >
                  Start new search
                </Button>
              }
            />
          ) : (
            <>
              {selectedTabIndex === 0 &&
                (loading ? (
                  <SkeletonLoaderVideoGrid
                    videosCount={placeHoldersCount}
                    onResize={(sizes) => {
                      setNumberOfColumns(sizes.length)
                    }}
                  />
                ) : (
                  <VideoGrid videos={paginatedVideos} />
                ))}
              {selectedTabIndex === 1 &&
                (loading ? (
                  <SkeletonLoaderVideoGrid
                    videosCount={placeHoldersCount}
                    onResize={(sizes) => {
                      setNumberOfColumns(sizes.length)
                    }}
                  />
                ) : (
                  <ChannelGrid channels={paginatedChannels} repeat="fill" />
                ))}
            </>
          )}
          <StyledPagination
            onChangePage={handlePageChange}
            page={page}
            totalCount={paginationData.totalCount}
            itemsPerPage={numberOfResults}
            maxPaginationLinks={7}
          />
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
SearchResults.displayName = 'SearchResults'
