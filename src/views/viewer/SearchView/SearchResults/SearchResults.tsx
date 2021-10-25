import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ChannelGrid } from '@/components/ChannelGrid'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { SkeletonLoaderVideoGrid } from '@/components/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { useSearchResults } from '@/hooks/useSearchResults'
import { Tabs } from '@/shared/components/Tabs'

import { EmptyFallback } from './EmptyFallback'
import { Filters, PaddingWrapper, Results, SearchControls } from './SearchResults.style'

type SearchResultsProps = {
  query: string
}
const tabs = ['Videos', 'Channels']

export const SearchResults: React.FC<SearchResultsProps> = React.memo(({ query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const filtersBarLogic = useFiltersBar(false)
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, setLanguage, language },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic
  const { videos, channels, loading, error } = useSearchResults({ searchQuery: query, videoWhereInput })

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

  if (!loading && channels.length === 0 && videos.length === 0 && !!query) {
    return <EmptyFallback />
  }

  const mappedTabs = tabs.map((tab) => ({ name: tab }))

  return (
    <ViewWrapper>
      <SearchControls filtersOpen={isFiltersOpen}>
        <PaddingWrapper>
          <Tabs
            tabs={mappedTabs}
            onSelectTab={setSelectedIndex}
            initialIndex={0}
            onFiltersClick={selectedIndex === 0 ? toggleFilters : undefined}
            onSelectedLanguage={handleSelectLanguage}
            filtersActive={canClearAllFilters}
            selectedLanguage={language}
          />
        </PaddingWrapper>
        <CSSTransition in={isFiltersOpen} timeout={100} classNames="filters" unmountOnExit>
          <Filters>
            <FiltersBar {...filtersBarLogic} variant="secondary" hasCategories mobileLanguageSelector />
          </Filters>
        </CSSTransition>
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer big>
          {selectedIndex === 0 && (loading ? <SkeletonLoaderVideoGrid /> : <VideoGrid videos={videos} />)}
          {selectedIndex === 1 &&
            (loading ? <SkeletonLoaderVideoGrid /> : <ChannelGrid channels={channels} repeat="fill" />)}
        </LimitedWidthContainer>
      </Results>
    </ViewWrapper>
  )
})
