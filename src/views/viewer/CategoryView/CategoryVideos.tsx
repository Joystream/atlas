import React, { useEffect, useState } from 'react'

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

import { Container, ControlsContainer, SortContainer, StyledSelect, StyledVideoGrid } from './CategoryVideos.styles'
import { FallbackWrapper } from './CategoryView.style'

export const CategoryVideos: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const mdMatch = useMediaMatch('md')

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

  useEffect(() => {
    setVideoWhereInput((value) => ({
      ...value,
      languageId_eq: selectedLanguage,
    }))
  }, [selectedLanguage, setVideoWhereInput])

  return (
    <Container>
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
