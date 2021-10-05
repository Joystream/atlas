import React, { useRef, useState } from 'react'

import { VideoOrderByInput } from '@/api/queries'
import { languages } from '@/config/languages'
import { SORT_OPTIONS } from '@/config/sorting'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useDialog } from '@/providers/dialogs'
import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem } from '@/shared/components/LayoutGrid'
import { PopoverDialog } from '@/shared/components/Popover'
import { RadioButton } from '@/shared/components/RadioButton'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgActionFilters, SvgGlyphClose } from '@/shared/icons'

import {
  Container,
  ControlsContainer,
  DateUploadFilterContainer,
  FiltersContainer,
  FiltersInnerContainer,
  MobileFilterContainer,
  OtherFilterStyledIcon,
  OtherFilterStyledText,
  SortContainer,
} from './CategoryVideos.styles'

import { ActionDialog, ActionDialogProps } from '../ActionDialog'
import { MessageIconWrapper, StyledTitleText } from '../MessageDialog/MessageDialog.style'

export const CategoryVideos = () => {
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const betweenMdAndLgMatch = mdMatch && !lgMatch
  const betweenBaseAndSMMatch = !smMatch

  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')

  // filters
  const [isFiltersOpen, setiIsFiltersOpen] = useState(true)
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [dateUploadedFilter, setdateUploadedFilter] = useState<number | undefined>()
  const [licensesFilter, setLicensesFilter] = useState<number[]>([])
  const [videoLegnthFilter, setVideoLegnthFilter] = useState<string[]>([])
  const [paidPromotionalMaterialFilter, setPaidPromotionalMaterialFilter] = useState(false)
  const [matureContentRatingFilter, setMatureContentRatingFilter] = useState(false)

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }

  const clearSortVideosBy = () => setSortVideosBy(VideoOrderByInput.CreatedAtDesc)
  const clearDateUploadedFilter = () => setdateUploadedFilter(undefined)
  const clearVideoLegnthFilter = () => setVideoLegnthFilter([])
  const clearLicensesFilter = () => setLicensesFilter([])
  const clearOtherFilters = () => {
    setPaidPromotionalMaterialFilter(false)
    setMatureContentRatingFilter(false)
  }
  const clearAllFilters = () => {
    clearSortVideosBy()
    clearDateUploadedFilter()
    clearVideoLegnthFilter()
    clearLicensesFilter()
    clearOtherFilters()
  }
  const canClearAllFilters =
    sortVideosBy !== VideoOrderByInput.CreatedAtDesc ||
    dateUploadedFilter !== undefined ||
    videoLegnthFilter.length !== 0 ||
    licensesFilter.length !== 0 ||
    matureContentRatingFilter ||
    paidPromotionalMaterialFilter

  const handleFilterClick = () => {
    setiIsFiltersOpen((value) => !value)
  }
  console.log({
    sortVideosBy,
    dateUploadedFilter,
    licensesFilter,
    videoLegnthFilter,
    paidPromotionalMaterialFilter,
    matureContentRatingFilter,
  })
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
      {betweenBaseAndSMMatch ? (
        <MobileFilterDialog
          onExitClick={() => setiIsFiltersOpen(false)}
          showDialog={isFiltersOpen}
          title="Filters"
          content={
            <>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Sort by
                </Text>
                <Select
                  size="small"
                  helperText={null}
                  value={sortVideosBy}
                  items={SORT_OPTIONS}
                  onChange={handleSorting}
                />
              </MobileFilterContainer>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Date uploaded
                </Text>
                <RadioButton
                  onClick={() => {
                    setdateUploadedFilter(1)
                  }}
                  name="date-uploaded"
                  label="Last 24 hours"
                  value={1}
                  selectedValue={dateUploadedFilter}
                ></RadioButton>
                <RadioButton
                  onClick={() => {
                    setdateUploadedFilter(7)
                  }}
                  name="date-uploaded"
                  label="Last 7 days"
                  value={7}
                  selectedValue={dateUploadedFilter}
                ></RadioButton>
                <RadioButton
                  onClick={() => {
                    setdateUploadedFilter(30)
                  }}
                  name="date-uploaded"
                  label="Last 30 days"
                  value={30}
                  selectedValue={dateUploadedFilter}
                ></RadioButton>
                <RadioButton
                  onClick={() => {
                    setdateUploadedFilter(365)
                  }}
                  name="date-uploaded"
                  label="Last 365 days"
                  value={365}
                  selectedValue={dateUploadedFilter}
                ></RadioButton>
              </MobileFilterContainer>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Length
                </Text>
                <Checkbox
                  onChange={(value) => {
                    setVideoLegnthFilter((filter) =>
                      value ? [...filter, '0-to-4'] : filter.filter((videoLength) => videoLength !== '0-to-4')
                    )
                  }}
                  name="length"
                  label="Less than 4 minutes"
                  value={videoLegnthFilter.includes('0-to-4')}
                ></Checkbox>
                <Checkbox
                  onChange={(value) => {
                    setVideoLegnthFilter((filter) =>
                      value ? [...filter, '4-to-10'] : filter.filter((videoLength) => videoLength !== '4-to-10')
                    )
                  }}
                  name="length"
                  label="4 to 10 minutes"
                  value={videoLegnthFilter.includes('4-to-10')}
                ></Checkbox>
                <Checkbox
                  onChange={(value) => {
                    setVideoLegnthFilter((filter) =>
                      value ? [...filter, '10-to-9999'] : filter.filter((videoLength) => videoLength !== '10-to-9999')
                    )
                  }}
                  name="length"
                  label="More than 10 minutes"
                  value={videoLegnthFilter.includes('10-to-9999')}
                ></Checkbox>
              </MobileFilterContainer>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  License
                </Text>
                {knownLicenses.map((license) => (
                  <Checkbox
                    name="license"
                    key={license.code}
                    label={license.name}
                    value={!!licensesFilter?.includes(license.code)}
                    onChange={(value) =>
                      setLicensesFilter((licenses) =>
                        value ? [...licenses, license.code] : licenses.filter((code) => code !== license.code)
                      )
                    }
                  ></Checkbox>
                ))}
              </MobileFilterContainer>
              <MobileFilterContainer>
                <OtherFilterStyledText secondary variant="overhead">
                  <OtherFilterStyledIcon />
                  Exclude:
                </OtherFilterStyledText>
                <Checkbox
                  onChange={setPaidPromotionalMaterialFilter}
                  name="other-filters"
                  label="Paid promotional material"
                  value={paidPromotionalMaterialFilter}
                ></Checkbox>
                <Checkbox
                  onChange={setMatureContentRatingFilter}
                  name="other-filters"
                  label="Mature content rating"
                  value={matureContentRatingFilter}
                ></Checkbox>
              </MobileFilterContainer>
            </>
          }
          primaryButton={{
            text: 'Apply',
            onClick: () => null, //TODO: apply filters
          }}
          secondaryButton={{
            text: 'Clear',
            disabled: canClearAllFilters === false,
            onClick: clearAllFilters,
          }}
        />
      ) : (
        <FiltersContainer open={isFiltersOpen}>
          <FiltersInnerContainer>
            <PopoverDialog
              content={
                <DateUploadFilterContainer>
                  <RadioButton
                    onClick={() => {
                      setdateUploadedFilter(1)
                    }}
                    name="date-uploaded"
                    label="Last 24 hours"
                    value={1}
                    selectedValue={dateUploadedFilter}
                  ></RadioButton>
                  <RadioButton
                    onClick={() => {
                      setdateUploadedFilter(7)
                    }}
                    name="date-uploaded"
                    label="Last 7 days"
                    value={7}
                    selectedValue={dateUploadedFilter}
                  ></RadioButton>
                  <RadioButton
                    onClick={() => {
                      setdateUploadedFilter(30)
                    }}
                    name="date-uploaded"
                    label="Last 30 days"
                    value={30}
                    selectedValue={dateUploadedFilter}
                  ></RadioButton>
                  <RadioButton
                    onClick={() => {
                      setdateUploadedFilter(365)
                    }}
                    name="date-uploaded"
                    label="Last 365 days"
                    value={365}
                    selectedValue={dateUploadedFilter}
                  ></RadioButton>
                </DateUploadFilterContainer>
              }
              footer={
                <>
                  <Button
                    onClick={clearDateUploadedFilter}
                    size="small"
                    variant="secondary"
                    disabled={dateUploadedFilter === undefined}
                  >
                    Clear
                  </Button>
                  <Button size="small">Apply</Button>
                </>
              }
            >
              <Button variant="secondary" onClick={() => null}>
                Date uploaded
              </Button>
            </PopoverDialog>
            <PopoverDialog
              content={
                <>
                  <Checkbox
                    onChange={(value) => {
                      setVideoLegnthFilter((filter) =>
                        value ? [...filter, '0-to-4'] : filter.filter((videoLength) => videoLength !== '0-to-4')
                      )
                    }}
                    name="length"
                    label="Less than 4 minutes"
                    value={videoLegnthFilter.includes('0-to-4')}
                  ></Checkbox>
                  <Checkbox
                    onChange={(value) => {
                      setVideoLegnthFilter((filter) =>
                        value ? [...filter, '4-to-10'] : filter.filter((videoLength) => videoLength !== '4-to-10')
                      )
                    }}
                    name="length"
                    label="4 to 10 minutes"
                    value={videoLegnthFilter.includes('4-to-10')}
                  ></Checkbox>
                  <Checkbox
                    onChange={(value) => {
                      setVideoLegnthFilter((filter) =>
                        value ? [...filter, '10-to-9999'] : filter.filter((videoLength) => videoLength !== '10-to-9999')
                      )
                    }}
                    name="length"
                    label="More than 10 minutes"
                    value={videoLegnthFilter.includes('10-to-9999')}
                  ></Checkbox>
                </>
              }
              footer={
                <>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={clearVideoLegnthFilter}
                    disabled={videoLegnthFilter.length === 0}
                  >
                    Clear
                  </Button>
                  <Button size="small">Apply</Button>
                </>
              }
            >
              <Button variant="secondary" onClick={() => null}>
                Length
              </Button>
            </PopoverDialog>
            <PopoverDialog
              content={
                <>
                  {knownLicenses.map((license) => (
                    <Checkbox
                      name="license"
                      key={license.code}
                      label={license.name}
                      value={!!licensesFilter?.includes(license.code)}
                      onChange={(value) =>
                        setLicensesFilter((licenses) =>
                          value ? [...licenses, license.code] : licenses.filter((code) => code !== license.code)
                        )
                      }
                    ></Checkbox>
                  ))}
                </>
              }
              footer={
                <>
                  <Button
                    size="small"
                    variant="secondary"
                    disabled={licensesFilter.length === 0}
                    onClick={clearLicensesFilter}
                  >
                    Clear
                  </Button>
                  <Button size="small">Apply</Button>
                </>
              }
            >
              <Button variant="secondary" onClick={() => null}>
                License
              </Button>
            </PopoverDialog>
            <PopoverDialog
              content={
                <>
                  <OtherFilterStyledText secondary variant="overhead">
                    <OtherFilterStyledIcon />
                    Exclude:
                  </OtherFilterStyledText>
                  <Checkbox
                    onChange={setPaidPromotionalMaterialFilter}
                    name="other-filters"
                    label="Paid promotional material"
                    value={paidPromotionalMaterialFilter}
                  ></Checkbox>
                  <Checkbox
                    onChange={setMatureContentRatingFilter}
                    name="other-filters"
                    label="Mature content rating"
                    value={matureContentRatingFilter}
                  ></Checkbox>
                </>
              }
              footer={
                <>
                  <Button
                    onClick={clearOtherFilters}
                    size="small"
                    variant="secondary"
                    disabled={!matureContentRatingFilter && !paidPromotionalMaterialFilter}
                  >
                    Clear
                  </Button>
                  <Button size="small">Apply</Button>
                </>
              }
            >
              <Button variant="secondary" onClick={() => null}>
                Other filters
              </Button>
            </PopoverDialog>
          </FiltersInnerContainer>

          {canClearAllFilters && (
            <Button onClick={clearAllFilters} variant="tertiary" icon={<SvgGlyphClose />}>
              Clear all
            </Button>
          )}
        </FiltersContainer>
      )}
    </Container>
  )
}

const MobileFilterDialog: React.FC<{ title: string; content: React.ReactNode } & ActionDialogProps> = ({
  title,
  content,
  ...actionDialogProps
}) => {
  return (
    <ActionDialog {...actionDialogProps}>
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      {content}
    </ActionDialog>
  )
}
