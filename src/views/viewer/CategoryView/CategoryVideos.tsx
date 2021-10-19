import React, { useEffect, useState } from 'react'

import { useVideoCount } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { languages } from '@/config/languages'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters } from '@/shared/icons'

import { Container, ControlsContainer, SortContainer, StyledSelect, StyledVideoGrid } from './CategoryVideos.styles'

export const CategoryVideos: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch

  const filtersBarLogic = useFiltersBar()
  const {
    setVideoWhereInput,
    filters: { setSelectedCategoryIdFilter, setIsFiltersOpen },
    canClearFilters: { canClearAllFilters },
    videoWhereInput,
  } = filtersBarLogic

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>()
  const { videoCount } = useVideoCount(
    { where: videoWhereInput },
    {
      notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(() => {
    setVideoWhereInput({
      categoryId_eq: categoryId,
      languageId_eq: 'en',
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
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text variant={mdMatch ? 'h4' : 'h5'}>All videos ({videoCount})</Text>
        </GridItem>
        <StyledSelect
          placeholder="Select language"
          onChange={setSelectedLanguage}
          size="small"
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
            <StyledSelect
              size="small"
              helperText={null}
              value={sortVideosBy}
              items={SORT_OPTIONS}
              onChange={handleSorting}
            />
          </SortContainer>
        )}
      </ControlsContainer>
      <FiltersBar {...filtersBarLogic} />
      <StyledVideoGrid videoWhereInput={videoWhereInput} orderBy={sortVideosBy} onDemandInfinite />
    </Container>
  )
}
