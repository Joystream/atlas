import { add } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { VideoOrderByInput, VideoWhereInput } from '@/api/queries'
import { SORT_OPTIONS } from '@/config/sorting'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { PopoverDialog } from '@/shared/components/Popover'
import { RadioButton } from '@/shared/components/RadioButton'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'

import {
  FilterContentContainer,
  FiltersContainer,
  FiltersInnerContainer,
  MobileFilterContainer,
  OtherFilterStyledIcon,
  OtherFilterStyledText,
} from './FiltersBar.styles'

import { ActionDialog, ActionDialogProps } from '../ActionDialog'
import { StyledTitleText } from '../MessageDialog/MessageDialog.style'

type VideoLengthOptions = '0-to-4' | '4-to-10' | '10-to-9999'

export const FiltersBar: React.FC<ReturnType<typeof useFiltersBar>> = ({
  handleApplyFilter,
  filters: {
    setiIsFiltersOpen,
    isFiltersOpen,
    sortVideosBy,
    setSortVideosBy,
    dateUploadedFilter,
    setdateUploadedFilter,
    matureContentRatingFilter,
    setMatureContentRatingFilter,
    paidPromotionalMaterialFilter,
    setPaidPromotionalMaterialFilter,
    videoLegnthFilter,
    setVideoLegnthFilter,
    licensesFilter,
    setLicensesFilter,
  },
  canClearFilters: {
    canClearDateUploadedFilter,
    canClearVideoLegnthFilter,
    canClearOtherFilters,
    canClearAllFilters,
    clearAllFilters,
    clearDateUploadedFilter,
    clearVideoLegnthFilter,
    clearLicensesFilter,
    clearOtherFilters,
  },
}) => {
  const smMatch = useMediaMatch('sm')
  const betweenBaseAndSMMatch = !smMatch

  const handleSorting = (value?: VideoOrderByInput | null) => {
    if (value) {
      setSortVideosBy(value)
    }
  }

  const dateUploadedInputs = (
    <FilterContentContainer>
      <RadioButton
        onChange={() => {
          setdateUploadedFilter(1)
        }}
        name="date-uploaded"
        label="Last 24 hours"
        value={1}
        selectedValue={dateUploadedFilter}
      ></RadioButton>
      <RadioButton
        onChange={() => {
          setdateUploadedFilter(7)
        }}
        name="date-uploaded"
        label="Last 7 days"
        value={7}
        selectedValue={dateUploadedFilter}
      ></RadioButton>
      <RadioButton
        onChange={() => {
          setdateUploadedFilter(30)
        }}
        name="date-uploaded"
        label="Last 30 days"
        value={30}
        selectedValue={dateUploadedFilter}
      ></RadioButton>
      <RadioButton
        onChange={() => {
          setdateUploadedFilter(365)
        }}
        name="date-uploaded"
        label="Last 365 days"
        value={365}
        selectedValue={dateUploadedFilter}
      ></RadioButton>
    </FilterContentContainer>
  )
  const videoLengthInputs = (
    <FilterContentContainer>
      <RadioButton
        onChange={() => {
          setVideoLegnthFilter('0-to-4')
        }}
        name="length"
        label="Less than 4 minutes"
        value="0-to-4"
        selectedValue={videoLegnthFilter}
      />
      <RadioButton
        onChange={() => {
          setVideoLegnthFilter('4-to-10')
        }}
        name="length"
        label="4 to 10 minutes"
        value="4-to-10"
        selectedValue={videoLegnthFilter}
      />
      <RadioButton
        onChange={() => {
          setVideoLegnthFilter('10-to-9999')
        }}
        name="length"
        label="More than 10 minutes"
        value="10-to-9999"
        selectedValue={videoLegnthFilter}
      />
    </FilterContentContainer>
  )
  const licenseInputs = (
    <FilterContentContainer>
      {knownLicenses.map((license) => (
        <Checkbox
          name="license"
          key={license.code}
          label={license.name}
          value={!!licensesFilter?.includes(license.code)}
          onChange={(value) =>
            setLicensesFilter((licenses) =>
              value ? [...(licenses ?? []), license.code] : licenses?.filter((code) => code !== license.code)
            )
          }
        ></Checkbox>
      ))}
    </FilterContentContainer>
  )
  const otherFiltersInputs = (
    <FilterContentContainer>
      <Checkbox
        onChange={setPaidPromotionalMaterialFilter}
        name="other-filters"
        label="Paid promotional material"
        value={!!paidPromotionalMaterialFilter}
      ></Checkbox>
      <Checkbox
        onChange={setMatureContentRatingFilter}
        name="other-filters"
        label="Mature content rating"
        value={!!matureContentRatingFilter}
      ></Checkbox>
    </FilterContentContainer>
  )

  return (
    <>
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
                {dateUploadedInputs}
              </MobileFilterContainer>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Length
                </Text>
                {videoLengthInputs}
              </MobileFilterContainer>
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  License
                </Text>
                {licenseInputs}
              </MobileFilterContainer>
              <MobileFilterContainer>
                <OtherFilterStyledText secondary variant="overhead">
                  <OtherFilterStyledIcon />
                  Exclude:
                </OtherFilterStyledText>
                {otherFiltersInputs}
              </MobileFilterContainer>
            </>
          }
          primaryButton={{
            text: 'Apply',
            onClick: handleApplyFilter,
          }}
          secondaryButton={{
            text: 'Clear',
            disabled: canClearAllFilters === false,
            onClick: clearAllFilters,
          }}
        />
      ) : (
        <CSSTransition in={isFiltersOpen} timeout={100} classNames="filters" unmountOnExit>
          <FiltersContainer open={true}>
            <FiltersInnerContainer>
              <PopoverDialog
                content={dateUploadedInputs}
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
                    <Button size="small" onClick={handleApplyFilter}>
                      Apply
                    </Button>
                  </>
                }
              >
                <Button badge={canClearDateUploadedFilter && 1} variant="secondary" onClick={() => null}>
                  Date uploaded
                </Button>
              </PopoverDialog>
              <PopoverDialog
                content={videoLengthInputs}
                footer={
                  <>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={clearVideoLegnthFilter}
                      disabled={videoLegnthFilter?.length === 0}
                    >
                      Clear
                    </Button>
                    <Button size="small" onClick={handleApplyFilter}>
                      Apply
                    </Button>
                  </>
                }
              >
                <Button badge={canClearVideoLegnthFilter && 1} variant="secondary" onClick={() => null}>
                  Length
                </Button>
              </PopoverDialog>
              <PopoverDialog
                dividers
                content={licenseInputs}
                footer={
                  <>
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={licensesFilter?.length === 0}
                      onClick={clearLicensesFilter}
                    >
                      Clear
                    </Button>
                    <Button size="small" onClick={handleApplyFilter}>
                      Apply
                    </Button>
                  </>
                }
              >
                <Button badge={licensesFilter?.length} variant="secondary" onClick={() => null}>
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
                    {otherFiltersInputs}
                  </>
                }
                footer={
                  <>
                    <Button
                      onClick={clearOtherFilters}
                      size="small"
                      variant="secondary"
                      disabled={!canClearOtherFilters}
                    >
                      Clear
                    </Button>
                    <Button size="small" onClick={handleApplyFilter}>
                      Apply
                    </Button>
                  </>
                }
              >
                <Button
                  badge={(paidPromotionalMaterialFilter ? 1 : 0) + (matureContentRatingFilter ? 1 : 0)}
                  variant="secondary"
                  onClick={() => null}
                >
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
        </CSSTransition>
      )}
    </>
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

export const useFiltersBar = () => {
  const { id } = useParams()

  // filters
  const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>('en')
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)
  const [dateUploadedFilter, setdateUploadedFilter] = useState<number>()
  const [licensesFilter, setLicensesFilter] = useState<number[]>()
  const [videoLegnthFilter, setVideoLegnthFilter] = useState<VideoLengthOptions>()
  const [paidPromotionalMaterialFilter, setPaidPromotionalMaterialFilter] = useState<boolean>()
  const [matureContentRatingFilter, setMatureContentRatingFilter] = useState<boolean>()

  const clearSortVideosBy = () => setSortVideosBy(VideoOrderByInput.CreatedAtDesc)
  const clearDateUploadedFilter = () => setdateUploadedFilter(undefined)
  const clearVideoLegnthFilter = () => setVideoLegnthFilter(undefined)
  const clearLicensesFilter = () => setLicensesFilter(undefined)
  const clearOtherFilters = () => {
    setPaidPromotionalMaterialFilter(undefined)
    setMatureContentRatingFilter(undefined)
  }
  const clearAllFilters = () => {
    setSelectedLanguage('en')
    clearSortVideosBy()
    clearDateUploadedFilter()
    clearVideoLegnthFilter()
    clearLicensesFilter()
    clearOtherFilters()
    handleApplyFilter()
  }

  const canClearDateUploadedFilter = dateUploadedFilter !== undefined
  const canClearVideoLegnthFilter = videoLegnthFilter !== undefined
  const canClearLicensesFilter = licensesFilter !== undefined
  const canClearOtherFilters = matureContentRatingFilter !== undefined || paidPromotionalMaterialFilter !== undefined
  const canClearAllFilters =
    selectedLanguage !== 'en' ||
    sortVideosBy !== VideoOrderByInput.CreatedAtDesc ||
    canClearDateUploadedFilter ||
    canClearVideoLegnthFilter ||
    canClearLicensesFilter ||
    canClearOtherFilters

  const [isFiltersOpen, setiIsFiltersOpen] = useState(true)
  const [videoWhereInput, setVideoWhereInput] = useState<VideoWhereInput>({
    categoryId_eq: id,
    languageId_eq: 'en',
  })

  const handleApplyFilter = useCallback(() => {
    const getDurationRules = () => {
      switch (videoLegnthFilter) {
        case '0-to-4':
          return {
            duration_lte: 4 * 60 * 1000,
          }
        case '4-to-10':
          return {
            duration_gte: 4 * 60 * 1000,
            duration_lte: 10 * 60 * 1000,
          }
        case '10-to-9999':
          return {
            duration_gte: 10 * 60 * 1000,
          }
        default:
          return {}
      }
    }

    setVideoWhereInput({
      categoryId_eq: id,
      languageId_eq: selectedLanguage,
      createdAt_gte: dateUploadedFilter
        ? add(new Date(), {
            days: -dateUploadedFilter,
          })
        : undefined,
      licenseId_in: licensesFilter?.map((license) => license.toString()),
      hasMarketing_eq: paidPromotionalMaterialFilter,
      isExplicit_eq: matureContentRatingFilter,
      ...getDurationRules(),
    })
  }, [
    dateUploadedFilter,
    id,
    licensesFilter,
    matureContentRatingFilter,
    paidPromotionalMaterialFilter,
    selectedLanguage,
    videoLegnthFilter,
  ])

  useEffect(() => {
    handleApplyFilter()
    // this is ok only want to apply filters here when language changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  return {
    categoryId: id,
    handleApplyFilter,
    videoWhereInput,
    setVideoWhereInput,
    filters: {
      isFiltersOpen,
      setiIsFiltersOpen,
      setSelectedLanguage,
      selectedLanguage,
      dateUploadedFilter,
      setdateUploadedFilter,
      sortVideosBy,
      setSortVideosBy,
      videoLegnthFilter,
      setVideoLegnthFilter,
      paidPromotionalMaterialFilter,
      setPaidPromotionalMaterialFilter,
      matureContentRatingFilter,
      setMatureContentRatingFilter,
      licensesFilter,
      setLicensesFilter,
    },
    canClearFilters: {
      canClearAllFilters,
      canClearDateUploadedFilter,
      canClearVideoLegnthFilter,
      canClearLicensesFilter,
      canClearOtherFilters,
      clearAllFilters,
      clearSortVideosBy,
      clearDateUploadedFilter,
      clearVideoLegnthFilter,
      clearLicensesFilter,
      clearOtherFilters,
    },
  } as const
}
