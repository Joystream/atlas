import styled from '@emotion/styled'
import { Placement } from '@popperjs/core'
import { id } from 'date-fns/locale'
import React, { LegacyRef, MutableRefObject, useCallback, useRef, useState } from 'react'
import { usePopper } from 'react-popper'

import { useVideosConnection } from '@/api/hooks'
import { AssetAvailability, VideoOrderByInput, useSearchLazyQuery } from '@/api/queries'
import { SORT_OPTIONS } from '@/config/sorting'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useToggle } from '@/hooks/useToggle'
import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { RadioButton } from '@/shared/components/RadioButton'
import { Search } from '@/shared/components/Search/Search'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters, SvgGlyphClose, SvgGlyphHide } from '@/shared/icons'
import { colors, media, sizes } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const CategoryVideos = () => {
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch
  const dateButtonRef = React.useRef(null)
  const lengthButtonRef = React.useRef(null)
  const licenseButtonRef = React.useRef(null)
  const otherFiltersButtonRef = React.useRef(null)
  const [isDateUploadedFilterOpen, toggleDateUploadedFilterOpen] = useToggle()
  const [isLengthFilterOpen, toggleLengthFilterOpen] = useToggle()
  const [isLicenseFilterOpen, toggleLicenseFilterOpen] = useToggle()
  const [isOtherFiltersOpen, toggleOtherFiltersOpen] = useToggle()
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
            // channelId_eq: '0',
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
      {mdMatch && (
        <FiltersContainer open={isFiltersOpen}>
          <FiltersInnerContainer>
            <Button variant="secondary" ref={dateButtonRef} onClick={toggleDateUploadedFilterOpen}>
              Date uploaded
            </Button>
            <Popover
              targetRef={dateButtonRef}
              isVisible={isDateUploadedFilterOpen}
              content={
                <>
                  <RadioButton name="date-uploaded" label="Last 24 hours" value={24} selectedValue={24}></RadioButton>
                  <RadioButton name="date-uploaded" label="Last 7 days" value={7} selectedValue={24}></RadioButton>
                  <RadioButton name="date-uploaded" label="Last 30 days" value={30} selectedValue={24}></RadioButton>
                  <RadioButton name="date-uploaded" label="Last 365 days" value={365} selectedValue={24}></RadioButton>
                </>
              }
              footer={
                <>
                  <Button size="small" variant="secondary" disabled>
                    Clear
                  </Button>
                  <Button size="small" disabled>
                    Apply
                  </Button>
                </>
              }
            />
            <Button variant="secondary" ref={lengthButtonRef} onClick={toggleLengthFilterOpen}>
              Length
            </Button>
            <Popover
              targetRef={lengthButtonRef}
              isVisible={isLengthFilterOpen}
              content={
                <>
                  <Checkbox name="length" label="Less than 4 minutes" value={false}></Checkbox>
                  <Checkbox name="length" label="4 to 10 minutes" value={false}></Checkbox>
                  <Checkbox name="length" label="More than 10 minutes" value={false}></Checkbox>
                </>
              }
              footer={
                <>
                  <Button size="small" variant="secondary" disabled>
                    Clear
                  </Button>
                  <Button size="small" disabled>
                    Apply
                  </Button>
                </>
              }
            />
            <Button variant="secondary" ref={licenseButtonRef} onClick={toggleLicenseFilterOpen}>
              License
            </Button>
            <Popover
              targetRef={licenseButtonRef}
              isVisible={isLicenseFilterOpen}
              content={
                <>
                  {knownLicenses.map((license) => (
                    <Checkbox key={license.code} name="license" label={license.name} value={false}></Checkbox>
                  ))}
                </>
              }
              footer={
                <>
                  <Button size="small" variant="secondary" disabled>
                    Clear
                  </Button>
                  <Button size="small" disabled>
                    Apply
                  </Button>
                </>
              }
            />
            <Button variant="secondary" ref={otherFiltersButtonRef} onClick={toggleOtherFiltersOpen}>
              Other filters
            </Button>
            <Popover
              targetRef={otherFiltersButtonRef}
              isVisible={isOtherFiltersOpen}
              content={
                <>
                  <OtherFilterStyledText secondary variant="overhead">
                    <OtherFilterStyledIcon />
                    Exclude:
                  </OtherFilterStyledText>
                  <Checkbox name="other-filters" label="Paid promotional material" value={false}></Checkbox>
                  <Checkbox name="other-filters" label="Mature content rating" value={false}></Checkbox>
                </>
              }
              footer={
                <>
                  <Button size="small" variant="secondary" disabled>
                    Clear
                  </Button>
                  <Button size="small" disabled>
                    Apply
                  </Button>
                </>
              }
            />
          </FiltersInnerContainer>
          <Button variant="tertiary" icon={<SvgGlyphClose />}>
            Clear all
          </Button>
        </FiltersContainer>
      )}
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
      {header && <HeaderContainer>{header}</HeaderContainer>}
      <ContentContainer>{content}</ContentContainer>
      <FooterContainer>{footer}</FooterContainer>
    </PopperContainer>
  )
}

const OtherFilterStyledText = styled(Text)`
  display: flex;
  align-items: center;
`

const OtherFilterStyledIcon = styled(SvgGlyphHide)`
  margin-right: ${sizes(2)};

  & path {
    fill: currentColor;
    stroke: currentColor;
  }
`

const HeaderContainer = styled.div`
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[600]};
`

const ContentContainer = styled.div`
  display: grid;
  gap: ${sizes(3)};
  padding: 0 0 ${sizes(4)} 0;
`

const FooterContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: end;
  gap: ${sizes(2)};

  /* padding-top: ${sizes(4)}; */

  /* border-top: 1px solid ${colors.gray[600]}; */
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
