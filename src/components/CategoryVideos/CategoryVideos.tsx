import React, { useState } from 'react'

import { VideoOrderByInput } from '@/api/queries'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters, SvgGlyphClose } from '@/shared/icons'

import {
  Container,
  ControlsContainer,
  FiltersContainer,
  FiltersInnerContainer,
  SortContainer,
} from './CategoryVideos.styles'

export const CategoryVideos = () => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [isFiltersOpen, setiIsFiltersOpen] = useState(false)

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }
  const handleFilterClick = () => {
    setiIsFiltersOpen((value) => !value)
  }
  return (
    <Container>
      <ControlsContainer>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text variant={mdMatch ? 'h4' : 'h5'}>All videos (441)</Text>
        </GridItem>
        <Select size="small" helperText={null} placeholder="Language" value={null} items={SORT_OPTIONS} />
        <div>
          {betweenMdAndLgMatch ? (
            <IconButton variant="secondary" onClick={handleFilterClick}>
              <SvgActionFilters />
            </IconButton>
          ) : (
            <Button variant="secondary" icon={<SvgActionFilters />} onClick={handleFilterClick}>
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
      {mdMatch && (
        <FiltersContainer open={isFiltersOpen}>
          <FiltersInnerContainer>{/* filters go here */}</FiltersInnerContainer>
          <Button variant="tertiary" icon={<SvgGlyphClose />}>
            Clear all
          </Button>
        </FiltersContainer>
      )}
    </Container>
  )
}
