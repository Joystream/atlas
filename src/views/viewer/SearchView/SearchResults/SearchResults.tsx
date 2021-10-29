import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ChannelGrid } from '@/components/ChannelGrid'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { SkeletonLoaderVideoGrid } from '@/components/SkeletonLoaderVideoGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { useSearchResults } from '@/hooks/useSearchResults'
import { useSearchStore } from '@/providers/search'
import { Button } from '@/shared/components/Button'
import { EmptyFallback } from '@/shared/components/EmptyFallback'
import { Tabs } from '@/shared/components/Tabs'
import { transitions } from '@/shared/theme'

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
    canClearFilters: { canClearAllFilters, clearAllFilters },
    videoWhereInput,
  } = filtersBarLogic
  const { videos, channels, loading, error } = useSearchResults({ searchQuery: query, videoWhereInput })
  const {
    actions: { setSearchOpen },
  } = useSearchStore()

  useEffect(() => {
    if (selectedIndex === 1) {
      setLanguage(undefined)
      clearAllFilters()
    }
  }, [clearAllFilters, selectedIndex, setLanguage])

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
      <SearchControls filtersOpen={isFiltersOpen}>
        <PaddingWrapper>
          <Tabs
            tabs={mappedTabs}
            onSelectTab={setSelectedIndex}
            initialIndex={0}
            onFiltersClick={selectedIndex === 0 ? toggleFilters : undefined}
            onSelectedLanguage={selectedIndex === 0 ? handleSelectLanguage : undefined}
            filtersActive={canClearAllFilters}
            selectedLanguage={language}
          />
        </PaddingWrapper>
        <CSSTransition
          in={isFiltersOpen}
          timeout={parseInt(transitions.timings.routing)}
          classNames="filters"
          unmountOnExit
          mountOnEnter
        >
          <Filters>
            <FiltersBar {...filtersBarLogic} variant="secondary" hasCategories mobileLanguageSelector />
          </Filters>
        </CSSTransition>
      </SearchControls>
      <Results filtersOpen={isFiltersOpen}>
        <LimitedWidthContainer big>
          {!loading && channels.length === 0 && videos.length === 0 && !!query ? (
            <EmptyFallback
              title={`No ${selectedIndex === 0 ? 'videos' : 'channels'} found`}
              subtitle="Please, try using different search terms or change your filtering criteria"
              button={
                <Button variant="secondary" size="large" onClick={() => setSearchOpen(true)}>
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
