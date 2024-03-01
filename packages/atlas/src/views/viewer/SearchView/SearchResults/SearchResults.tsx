import { FC, memo } from 'react'

import { SvgActionFilters } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section } from '@/components/Section/Section'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchResults } from '@/hooks/useSearchResults'
import { useSearchStore } from '@/providers/search'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

import { FiltersWrapper, PaddingWrapper, Results, SearchControls, StyledSelect } from './SearchResults.styles'

type SearchResultsProps = {
  query: string
}

export const SearchResults: FC<SearchResultsProps> = memo(({ query }) => {
  const smMatch = useMediaMatch('sm')
  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const { videos, channels, loading, error } = useSearchResults({
    searchQuery: query,
    videoWhereInput,
    first: 5,
  })
  const { setSearchOpen, setSearchQuery } = useSearchStore((state) => state.actions)

  const handleSelectLanguage = (selectedLanguage: unknown) => {
    setLanguage(selectedLanguage as string | null | undefined)
    setVideoWhereInput((value) => ({
      ...value,
      language_eq: selectedLanguage === 'undefined' ? undefined : (selectedLanguage as string),
    }))
  }

  const toggleFilters = () => {
    setIsFiltersOpen((state) => !state)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  const showEmptyFallback = !loading && videos.items.length === 0 && channels.items.length === 0 && !!query
  const { pageInfo, items: videoItems, fetchMore } = videos

  return (
    <ViewWrapper>
      <SearchControls>
        <PaddingWrapper filtersOpen={isFiltersOpen}>
          <FiltersWrapper>
            {smMatch && (
              <StyledSelect
                onChange={handleSelectLanguage}
                size="medium"
                value={language}
                items={[{ name: 'All languages', value: 'undefined' }, ...atlasConfig.derived.languagesSelectValues]}
              />
            )}
            <Button
              icon={<SvgActionFilters />}
              iconPlacement="left"
              variant="secondary"
              badge={canClearAllFilters}
              onClick={toggleFilters}
            >
              {smMatch && 'Filters'}
            </Button>
          </FiltersWrapper>
        </PaddingWrapper>
        <FiltersBar {...filtersBarLogic} activeFilters={['categories', 'date', 'length', 'other', 'language']} />
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer big>
          {showEmptyFallback ? (
            <EmptyFallback
              title="No results found"
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
            <Section
              contentProps={{
                type: 'grid',
                grid: {
                  xxs: {
                    columns: 1,
                  },
                },
                children: videoItems?.map((video, idx) => (
                  <VideoTileViewer direction="horizontal" detailsVariant="withChannelName" id={video.id} key={idx} />
                )),
              }}
              footerProps={{
                reachedEnd: !pageInfo?.hasNextPage,
                fetchMore: async () => {
                  if (pageInfo?.hasNextPage) {
                    await fetchMore({
                      variables: { first: 4, after: pageInfo.endCursor },
                    })
                  }
                  return
                },
                type: 'infinite',
                loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
              }}
            />
          )}
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
SearchResults.displayName = 'SearchResults'
