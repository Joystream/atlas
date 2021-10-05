import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { VideoOrderByInput } from '@/api/queries'
import { languages } from '@/config/languages'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters } from '@/shared/icons'

import { Container, ControlsContainer, SortContainer } from './CategoryVideos.styles'

import { FiltersBar, useFiltersBar } from '../FiltersBar'
import { InfiniteVideoGrid } from '../InfiniteGrids'

export const CategoryVideos = () => {
  const { id } = useParams()
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch

  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setSelectedCategoryIdFilter, setiIsFiltersOpen },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')

  useEffect(() => {
    setVideoWhereInput({
      categoryId_eq: id,
      languageId_eq: 'en',
    })
    setSelectedCategoryIdFilter(id)
  }, [id, setSelectedCategoryIdFilter, setVideoWhereInput])

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }

  const handleFilterClick = () => {
    setiIsFiltersOpen((value) => !value)
  }

  useEffect(() => {
    setVideoWhereInput((value) => ({
      ...value,
      languageId_eq: selectedLanguage,
    }))
  }, [selectedLanguage, setVideoWhereInput])

  console.log({ videoWhereInput })
  return (
    <Container>
      <ControlsContainer>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text variant={mdMatch ? 'h4' : 'h5'}>All videos (441)</Text>
        </GridItem>
        <Select
          onChange={setSelectedLanguage}
          size="small"
          helperText={null}
          value={selectedLanguage}
          items={languages}
        />
        <div>
          {betweenMdAndLgMatch ? (
            <IconButton variant="secondary" onClick={handleFilterClick}>
              <SvgActionFilters />
            </IconButton>
          ) : (
            <Button
              badge={canClearAllFilters}
              variant="secondary"
              icon={<SvgActionFilters />}
              onClick={handleFilterClick}
            >
              Filters
            </Button>
          )}
        </div>
        {mdMatch && (
          <SortContainer>
            <Text variant="body2">Sort by</Text>
            <Select size="small" helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
          </SortContainer>
        )}
      </ControlsContainer>
      <FiltersBar {...filtersBarLogic} />
      {/* <InfiniteVideoGrid videoWhereInput={videoWhereInput} orderBy={sortVideosBy} onDemand /> */}
    </Container>
  )
}
