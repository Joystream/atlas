import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import { id } from 'date-fns/locale'
import React, { LegacyRef, MutableRefObject, useCallback, useRef, useState } from 'react'
import { usePopper } from 'react-popper'

import { AssetAvailability, VideoOrderByInput, useSearchLazyQuery } from '@/api/queries'
import { SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Search } from '@/shared/components/Search/Search'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters, SvgGlyphClose } from '@/shared/icons'
import { colors, media, sizes } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const CategoryVideos = () => {
  const dateButtonRef = React.useRef(null)
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(!mdMatch)
  const [isFiltersOpen, setiIsFiltersOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo, { loading: loadingSearch, data: searchData, error: errorSearch }] = useSearchLazyQuery({
    onError: (error) =>
      SentryLogger.error('Failed to search channel videos', 'ChannelView', error, {
        search: { channelId: id, query: searchQuery },
      }),
  })

  const betweenMdAndLgMatch = mdMatch && !lgMatch
  const search = useCallback(
    (searchQuery: string) => {
      setSearchQuery(searchQuery)
      searchVideo({
        variables: {
          text: searchQuery,
          whereVideo: {
            isPublic_eq: true,
            mediaAvailability_eq: AssetAvailability.Accepted,
            thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
            channelId_eq: '0',
          },
          limit: 100,
        },
      })
    },
    [searchVideo]
  )
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
      // refetch({ ...variables, orderBy: value })
    }
  }
  const handleFilterClick = () => {
    setiIsFiltersOpen((value) => !value)
  }
  console.log({ isFiltersOpen })
  return (
    <Container>
      <ControlsContainer>
        <Text variant={mdMatch ? 'h4' : 'h5'}>All videos (441)</Text>
        {mdMatch && <Select helperText={null} placeholder="Language" value={null} items={SORT_OPTIONS} />}
        <FiltersSearchContainer>
          <Search
            searchInputRef={searchInputRef}
            isSearchInputOpen={isSearchInputOpen}
            setIsSearchingInputOpen={setIsSearchingInputOpen}
            setIsSearching={setIsSearching}
            search={search}
          />
          {betweenMdAndLgMatch ? (
            <IconButton variant="secondary" onClick={handleFilterClick}>
              <SvgActionFilters />
            </IconButton>
          ) : (
            <Button variant="secondary" icon={<SvgActionFilters />} onClick={handleFilterClick}>
              Filters
            </Button>
          )}
        </FiltersSearchContainer>
        {mdMatch && (
          <SortContainer>
            <Text variant="body2">Sort by</Text>
            <Select helperText={null} value={sortVideosBy} items={SORT_OPTIONS} onChange={handleSorting} />
          </SortContainer>
        )}
      </ControlsContainer>
      <FiltersContainer open={isFiltersOpen}>
        <FiltersInnerContainer>
          <Button variant="secondary" ref={dateButtonRef}>
            Date uploaded
          </Button>
          <Button variant="secondary">Length</Button>
          <Button variant="secondary">License</Button>
          <Button variant="secondary">Other filters</Button>
        </FiltersInnerContainer>
        <Button variant="tertiary" icon={<SvgGlyphClose />}>
          Clear all
        </Button>
      </FiltersContainer>
      <Popover
        targetRef={dateButtonRef}
        isVisible={isFiltersOpen}
        header="Popover Title"
        content={<div>kek</div>}
        footer={
          <div>
            <Button>a</Button>
          </div>
        }
      />
    </Container>
  )
}

type PopoverProps = {
  targetRef: MutableRefObject<null>
  isVisible: boolean
  placement?: Placement
  header?: string
  content: React.ReactNode
  footer?: React.ReactNode
}

const Popover: React.FC<PopoverProps> = ({
  targetRef,
  isVisible,
  placement = 'bottom-start',
  header,
  content,
  footer,
}) => {
  const popperRef = useRef(null)
  const [arrowRef, setArrowRed] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(targetRef.current, popperRef.current, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  })

  if (!isVisible) return null

  return (
    <PopperContainer ref={popperRef} style={styles.popper} {...attributes.popper}>
      <div ref={setArrowRed} style={styles.arrow} className="arrow" />
      <HeaderContainer>{header}</HeaderContainer>
      {content}
      <FooterContainer>{footer}</FooterContainer>
    </PopperContainer>
  )
}

const HeaderContainer = styled.div`
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[600]};
`

const FooterContainer = styled.div`
  padding-top: ${sizes(4)};
  border-top: 1px solid ${colors.gray[600]};
`

const PopperContainer = styled.div`
  background-color: ${colors.gray[700]};
  padding: ${sizes(4)};
`

const Container = styled.div`
  margin: ${sizes(16)} 0 0 0;
`

const FiltersSearchContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-template-columns: 1fr auto;

  ${media.md} {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
`

const ControlsContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};

  ${media.md} {
    grid-template-columns: auto 168px 1fr 241px;
    align-items: center;
  }
`

const SortContainer = styled.div`
  border-left: 1px solid ${colors.gray[700]};
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

const FiltersContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: space-between;
  padding: ${sizes(4)};
  background-color: ${colors.gray[900]};
`

const FiltersInnerContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`
