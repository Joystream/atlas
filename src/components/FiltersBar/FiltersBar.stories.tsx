import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import { VideoOrderByInput } from '@/api/queries'
import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { GridItem } from '@/components/LayoutGrid'
import { Select } from '@/components/Select'
import { Text } from '@/components/Text'
import { languages } from '@/config/languages'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SvgActionFilters } from '@/icons'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { colors, media, sizes } from '@/theme'

import { FiltersBar, FiltersBarProps } from './FiltersBar'
import { useFiltersBar } from './useFiltersBar'

export default {
  title: 'other/FiltersBar',
  component: FiltersBar,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<FiltersBarProps> = () => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch

  const filtersBarLogic = useFiltersBar()

  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen },
    canClearFilters: { canClearAllFilters },
  } = filtersBarLogic

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput | null | undefined>(
    VideoOrderByInput.CreatedAtDesc
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')

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
            <Select
              size="small"
              helperText={null}
              value={sortVideosBy}
              items={SORT_OPTIONS}
              onChange={setSortVideosBy}
            />
          </SortContainer>
        )}
      </ControlsContainer>
      <FiltersBar {...filtersBarLogic} />
    </Container>
  )
}

export const Regular = RegularTemplate.bind({})

const Container = styled.div`
  margin-top: ${sizes(16)};
  position: relative;
`

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};
  z-index: 100;
  position: relative;
  background-color: black;
  min-height: 72px;

  ${media.md} {
    grid-template-columns: auto 160px 1fr 242px;
  }
`

const SortContainer = styled.div`
  padding-left: ${sizes(4)};
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: 1fr;
  ${media.xs} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
  }
`
