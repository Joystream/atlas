import { isEqual } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import { useVideoCount } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { languages } from '@/config/languages'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { EmptyFallback } from '@/shared/components/EmptyFallback'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters } from '@/shared/icons'

import {
  Container,
  ControlsContainer,
  SortContainer,
  StyledSelect,
  StyledSticky,
  StyledVideoGrid,
} from './CategoryVideos.styles'
import { FallbackWrapper } from './CategoryView.style'

export const CategoryVideos: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const mdMatch = useMediaMatch('md')
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollWhenFilterChange = useRef(false)

  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setSelectedCategoryIdFilter, setIsFiltersOpen },
    canClearFilters: { canClearAllFilters, clearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>()
  const { videoCount } = useVideoCount(
    { where: videoWhereInput },
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  useEffect(() => {
    setVideoWhereInput({
      categoryId_eq: categoryId,
    })
    setSelectedCategoryIdFilter(categoryId)
  }, [categoryId, setSelectedCategoryIdFilter, setVideoWhereInput])

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }

  const handleFilterClick = () => {
    setIsFiltersOpen((value) => !value)
  }

  const topbarHeight = mdMatch ? 80 : 64

  useEffect(() => {
    setVideoWhereInput((value) => ({
      ...value,
      languageId_eq: selectedLanguage,
    }))
  }, [selectedLanguage, setVideoWhereInput])

  useEffect(() => {
    if (scrollWhenFilterChange.current) {
      containerRef.current?.scrollIntoView()
    }

    // account for videoWhereInput initialization
    if (!isEqual(videoWhereInput, {})) {
      scrollWhenFilterChange.current = true
    }
  }, [videoWhereInput])

  return (
    <Container ref={containerRef}>
      <StyledSticky style={{ top: topbarHeight - 1 }}>
        <ControlsContainer>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Text variant={mdMatch ? 'h4' : 'h5'}>All videos {videoCount !== undefined && `(${videoCount})`}</Text>
          </GridItem>
          <StyledSelect
            placeholder="Any language"
            onChange={setSelectedLanguage}
            size="small"
            value={selectedLanguage}
            items={languages}
          />
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
          <SortContainer>
            <Text variant="body2">Sort by</Text>
            <StyledSelect
              size="small"
              helperText={null}
              value={sortVideosBy}
              items={SORT_OPTIONS}
              onChange={handleSorting}
            />
          </SortContainer>
        </ControlsContainer>
        <FiltersBar {...filtersBarLogic} />
      </StyledSticky>

      <StyledVideoGrid
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
  )
}
