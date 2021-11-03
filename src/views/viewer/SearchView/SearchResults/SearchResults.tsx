import React, { useEffect, useState } from 'react'

import { ChannelGrid } from '@/components/ChannelGrid'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { SkeletonLoaderVideoGrid } from '@/components/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { languages } from '@/config/languages'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchResults } from '@/hooks/useSearchResults'
import { useSearchStore } from '@/providers/search'
import { Button } from '@/shared/components/Button'
import { EmptyFallback } from '@/shared/components/EmptyFallback'
import { Tabs } from '@/shared/components/Tabs'
import { SvgActionFilters } from '@/shared/icons'

import { FiltersWrapper, PaddingWrapper, Results, SearchControls, StyledSelect } from './SearchResults.style'

type SearchResultsProps = {
  query: string
}
const tabs = ['Videos', 'Channels']

export const SearchResults: React.FC<SearchResultsProps> = React.memo(({ query }) => {
  const smMatch = useMediaMatch('sm')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const filtersBarLogic = useFiltersBar(false)
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters, clearAllFilters },
    videoWhereInput,
  } = filtersBarLogic
  const { videos, channels, loading, error } = useSearchResults({
    searchQuery: query,
    videoWhereInput: selectedIndex === 0 ? videoWhereInput : undefined,
  })
  const {
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()

  useEffect(() => {
    if (selectedIndex === 1) {
      setIsFiltersOpen(false)
    }
  }, [clearAllFilters, selectedIndex, setIsFiltersOpen, setLanguage])

  const handleSelectLanguage = (selectedLanguage: unknown) => {
    setLanguage(selectedLanguage)
    setVideoWhereInput((value) => ({
      ...value,
      languageId_eq: selectedLanguage as string,
    }))
  }

  const toggleFilters = () => {
    setIsFiltersOpen((state) => !state)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  return (
    <ViewWrapper>
      <SearchControls>
        <PaddingWrapper filtersOpen={isFiltersOpen}>
          <Tabs tabs={mappedTabs} onSelectTab={setSelectedIndex} initialIndex={0} variant="large" />
          <FiltersWrapper>
            {smMatch && selectedIndex === 0 && (
              <StyledSelect
                items={languages}
                placeholder="Any language"
                size="small"
                value={language}
                onChange={handleSelectLanguage}
              />
            )}
            {selectedIndex === 0 && (
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
        <FiltersBar {...filtersBarLogic} hasCategories mobileLanguageSelector />
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer big>
          {!loading && channels.length === 0 && videos.length === 0 && !!query ? (
            <EmptyFallback
              title={`No ${selectedIndex === 0 ? 'videos' : 'channels'} found`}
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
              {selectedIndex === 0 && (loading ? <SkeletonLoaderVideoGrid /> : <VideoGrid videos={videos} />)}
              {selectedIndex === 1 &&
                (loading ? <SkeletonLoaderVideoGrid /> : <ChannelGrid channels={channels} repeat="fill" />)}
            </>
          )}
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
