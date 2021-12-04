import { Global } from '@emotion/react'
import { isEqual } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useVideoCount } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionFilters } from '@/components/_icons'
import { languages } from '@/config/languages'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Container,
  ControlsContainer,
  StyledSelect,
  StyledSticky,
  StyledVideoGrid,
  categoryGlobalStyles,
} from './CategoryVideos.styles'
import { FallbackWrapper } from './CategoryView.styles'

const SELECT_LANGUAGE_ITEMS = [{ name: 'All languages', value: 'undefined' }, ...languages]

const ADAPTED_SORT_OPTIONS = [
  { name: 'newest', value: VideoOrderByInput.CreatedAtDesc },
  { name: 'oldest', value: VideoOrderByInput.CreatedAtAsc },
]

export const CategoryVideos: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollWhenFilterChange = useRef(false)

  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen, isFiltersOpen, language, setLanguage },
    canClearFilters: { canClearAllFilters, clearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)

  const { videoCount } = useVideoCount(
    { where: videoWhereInput },
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  useEffect(() => {
    setVideoWhereInput({
      category: {
        id_eq: categoryId,
      },
    })
  }, [categoryId, setVideoWhereInput])

  useEffect(() => {
    if (scrollWhenFilterChange.current) {
      containerRef.current?.scrollIntoView()
    }
    // account for videoWhereInput initialization
    if (!isEqual(videoWhereInput, {})) {
      scrollWhenFilterChange.current = true
    }
  }, [videoWhereInput])

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }

  const handleFilterClick = () => {
    setIsFiltersOpen((value) => !value)
  }

  const handleSelectLanguage = useCallback(
    (language: string | null | undefined) => {
      setLanguage(language)
      setVideoWhereInput((value) => ({
        ...value,
        languageId_eq: language === 'undefined' ? undefined : language,
      }))
    },
    [setLanguage, setVideoWhereInput]
  )

  const topbarHeight = mdMatch ? 80 : 64

  const sortingNode = (
    <StyledSelect
      size="small"
      helperText={null}
      value={sortVideosBy}
      valueLabel="Sort by: "
      items={ADAPTED_SORT_OPTIONS}
      onChange={handleSorting}
    />
  )
  return (
    <>
      <Global styles={categoryGlobalStyles} />
      <Container ref={containerRef}>
        <StyledSticky style={{ top: topbarHeight - 1 }}>
          <ControlsContainer>
            <GridItem colSpan={{ base: 2, sm: 1 }}>
              <Text variant={mdMatch ? 'h500' : 'h400'}>
                All videos {videoCount !== undefined && `(${videoCount})`}
              </Text>
            </GridItem>
            {smMatch ? (
              <StyledSelect
                onChange={handleSelectLanguage}
                size="small"
                value={language}
                items={SELECT_LANGUAGE_ITEMS}
              />
            ) : (
              sortingNode
            )}
            <div>
              <Button
                badge={canClearAllFilters}
                variant="secondary"
                icon={<SvgActionFilters />}
                onClick={handleFilterClick}
              >
                Filters
              </Button>
            </div>
            {smMatch && sortingNode}
          </ControlsContainer>
          <FiltersBar {...filtersBarLogic} />
        </StyledSticky>

        <StyledVideoGrid
          isFiltersOpen={isFiltersOpen}
          emptyFallback={
            <FallbackWrapper>
              <EmptyFallback
                title="No videos found"
                subtitle="Please, try changing your filtering criteria"
                button={
                  <Button onClick={clearAllFilters} variant="secondary">
                    Clear all filters
                  </Button>
                }
              />
            </FallbackWrapper>
          }
          videoWhereInput={videoWhereInput}
          orderBy={sortVideosBy}
          onDemandInfinite
        />
      </Container>
    </>
  )
}
