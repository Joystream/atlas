import React, { useEffect, useState } from 'react'

import { useCategories } from '@/api/hooks'
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

import { FiltersWrapper, PaddingWrapper, Results, SearchControls, StyledSelect } from './SearchResults.styles'

type SearchResultsProps = {
  query: string
}
const tabs = ['Videos', 'Channels']

export const SearchResults: React.FC<SearchResultsProps> = React.memo(({ query }) => {
  const smMatch = useMediaMatch('sm')
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters, clearAllFilters },
    videoWhereInput,
  } = filtersBarLogic
  const { videos, channels, loading, error } = useSearchResults({
    searchQuery: query,
    videoWhereInput: selectedTabIndex === 0 ? videoWhereInput : undefined,
  })
  const {
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()
  const { categories } = useCategories()

  useEffect(() => {
    if (selectedTabIndex === 1) {
      setIsFiltersOpen(false)
    }
  }, [clearAllFilters, selectedTabIndex, setIsFiltersOpen, setLanguage])

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

  if (error) {
    return <ViewErrorFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  const showEmptyFallback =
    !loading &&
    ((videos.length === 0 && selectedTabIndex === 0) || (channels.length === 0 && selectedTabIndex === 1)) &&
    !!query

  return (
    <ViewWrapper>
      <SearchControls>
        <PaddingWrapper filtersOpen={isFiltersOpen}>
          <Tabs tabs={mappedTabs} onSelectTab={setSelectedTabIndex} initialIndex={0} />
          <FiltersWrapper>
            {smMatch && selectedTabIndex === 0 && (
              <StyledSelect
                onChange={handleSelectLanguage}
                size="small"
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
        <FiltersBar {...filtersBarLogic} categories={categories} />
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
              {selectedTabIndex === 0 && (loading ? <SkeletonLoaderVideoGrid /> : <VideoGrid videos={videos} />)}
              {selectedTabIndex === 1 &&
                (loading ? <SkeletonLoaderVideoGrid /> : <ChannelGrid channels={channels} repeat="fill" />)}
            </>
          )}
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
SearchResults.displayName = 'SearchResults'
