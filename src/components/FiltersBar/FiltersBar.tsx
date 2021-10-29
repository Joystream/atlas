import { add } from 'date-fns'
import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useCategories } from '@/api/hooks'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button, ButtonProps } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { PopoverDialog, TippyInstance } from '@/shared/components/Popover'
import { RadioButton } from '@/shared/components/RadioButton'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ActionDialogHeader,
  ClearAllButton,
  FilterContentContainer,
  FiltersContainer,
  FiltersInnerContainer,
  MobileFilterContainer,
  OtherFilterStyledIcon,
  OtherFilterStyledText,
  StyledActionDialog,
  StyledTitleText,
} from './FiltersBar.styles'
import { VideoLengthOptions, useFiltersBar } from './useFiltersBar'

import { ActionDialogProps } from '../ActionDialog'

type FiltersBarProps = {
  variant?: 'default' | 'secondary'
  hasCategories?: boolean
  mobileLanguageSelector?: boolean
}

export const FiltersBar: React.FC<ReturnType<typeof useFiltersBar> & FiltersBarProps> = ({
  setVideoWhereInput,
  videoWhereInput,
  variant = 'default',
  hasCategories,
  mobileLanguageSelector,
  filters: {
    setIsFiltersOpen,
    isFiltersOpen,
    dateUploadedFilter,
    setDateUploadedFilter,
    matureContentRatingFilter,
    setMatureContentRatingFilter,
    paidPromotionalMaterialFilter,
    setPaidPromotionalMaterialFilter,
    videoLengthFilter,
    setVideoLengthFilter,
    licensesFilter,
    setLicensesFilter,
    categoriesFilter,
    setCategoriesFilter,
    language,
    setLanguage,
  },
  canClearFilters: {
    canClearDateUploadedFilter,
    canClearVideoLengthFilter,
    canClearAllFilters,
    clearCategoriesFilter,
    clearAllFilters,
    clearDateUploadedFilter,
    clearVideoLengthFilter,
    clearLicensesFilter,
    clearOtherFilters,
    canClearCategoriesFilter,
  },
}) => {
  const smMatch = useMediaMatch('sm')
  const betweenBaseAndSMMatch = !smMatch
  const { categories } = useCategories()
  const categoriesPopoverRef = useRef<TippyInstance>()
  const datePopoverRef = useRef<TippyInstance>()
  const lengthPopoverRef = useRef<TippyInstance>()
  const licensePopoverRef = useRef<TippyInstance>()
  const othersPopoverRef = useRef<TippyInstance>()

  const categoriesInputs = (
    <FilterContentContainer>
      {categories &&
        categories.map((category) => (
          <Checkbox
            name="category-filter"
            label={category.name as string}
            key={`category-filter-${category.id}`}
            value={!!categoriesFilter?.includes(category.id)}
            onChange={(value) => {
              setCategoriesFilter((categories) =>
                value ? [...(categories ?? []), category.id] : categories?.filter((id) => id !== category.id)
              )
            }}
          />
        ))}
    </FilterContentContainer>
  )

  const dateUploadedInputs = (
    <FilterContentContainer>
      <RadioButton
        onChange={() => {
          setDateUploadedFilter(1)
        }}
        name="date-uploaded"
        label="Last 24 hours"
        value={1}
        selectedValue={dateUploadedFilter}
      />
      <RadioButton
        onChange={() => {
          setDateUploadedFilter(7)
        }}
        name="date-uploaded"
        label="Last 7 days"
        value={7}
        selectedValue={dateUploadedFilter}
      />
      <RadioButton
        onChange={() => {
          setDateUploadedFilter(30)
        }}
        name="date-uploaded"
        label="Last 30 days"
        value={30}
        selectedValue={dateUploadedFilter}
      />
      <RadioButton
        onChange={() => {
          setDateUploadedFilter(365)
        }}
        name="date-uploaded"
        label="Last 365 days"
        value={365}
        selectedValue={dateUploadedFilter}
      />
    </FilterContentContainer>
  )
  const videoLengthInputs = (
    <FilterContentContainer>
      <RadioButton
        onChange={() => {
          setVideoLengthFilter('0-to-4')
        }}
        name="length"
        label="Less than 4 minutes"
        value="0-to-4"
        selectedValue={videoLengthFilter}
      />
      <RadioButton
        onChange={() => {
          setVideoLengthFilter('4-to-10')
        }}
        name="length"
        label="4 to 10 minutes"
        value="4-to-10"
        selectedValue={videoLengthFilter}
      />
      <RadioButton
        onChange={() => {
          setVideoLengthFilter('10-to-9999')
        }}
        name="length"
        label="More than 10 minutes"
        value="10-to-9999"
        selectedValue={videoLengthFilter}
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
        />
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
      />
      <Checkbox
        onChange={setMatureContentRatingFilter}
        name="other-filters"
        label="Mature content rating"
        value={!!matureContentRatingFilter}
      />
    </FilterContentContainer>
  )

  if (betweenBaseAndSMMatch) {
    return (
      <MobileFilterDialog
        onExitClick={() => setIsFiltersOpen(false)}
        showDialog={isFiltersOpen}
        title="Filters"
        content={
          <>
            {mobileLanguageSelector && (
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Language
                </Text>
                <Select
                  items={languages}
                  placeholder="Any language"
                  size="small"
                  value={language}
                  onChange={setLanguage}
                />
              </MobileFilterContainer>
            )}
            {hasCategories && (
              <MobileFilterContainer>
                <Text secondary variant="overhead">
                  Categories
                </Text>
                {categoriesInputs}
              </MobileFilterContainer>
            )}
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
          onClick: () => {
            setVideoWhereInput((value) => ({
              ...value,
              createdAt_gte: dateUploadedFilter
                ? add(new Date(), {
                    days: -dateUploadedFilter,
                  })
                : undefined,
              licenseId_in: licensesFilter?.map((license) => license.toString()),
              hasMarketing_eq: paidPromotionalMaterialFilter,
              isExplicit_eq: matureContentRatingFilter,
              categoryId_in: categoriesFilter,
              languageId_eq: language as string,
              ...getDurationRules(),
            }))
            setIsFiltersOpen(false)
          },
        }}
        secondaryButton={{
          text: 'Clear',
          disabled: !canClearAllFilters,
          onClick: () => {
            clearAllFilters()
            setIsFiltersOpen(false)
          },
        }}
      />
    )
  }
  return (
    <CSSTransition
      in={isFiltersOpen}
      timeout={parseInt(transitions.timings.routing)}
      classNames="filters"
      mountOnEnter
      unmountOnExit
    >
      <FiltersContainer open={true}>
        <FiltersInnerContainer>
          {hasCategories && (
            <PopoverDialog
              instanceRef={categoriesPopoverRef}
              content={categoriesInputs}
              dividers
              footer={
                <FilterPopoverFooter
                  clearButtonProps={{
                    onClick: clearCategoriesFilter,
                    disabled: categoriesFilter === undefined,
                  }}
                  applyButtonProps={{
                    disabled: !categoriesFilter || !categoriesFilter.length,
                    onClick: () => {
                      categoriesPopoverRef.current?.hide()
                      setVideoWhereInput((value) => ({
                        ...value,
                        categoryId_in: categoriesFilter,
                      }))
                    },
                  }}
                />
              }
            >
              <Button variant="secondary" badge={canClearCategoriesFilter && categoriesFilter?.length}>
                Categories
              </Button>
            </PopoverDialog>
          )}
          <PopoverDialog
            instanceRef={datePopoverRef}
            content={dateUploadedInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearDateUploadedFilter,
                  disabled: dateUploadedFilter === undefined,
                }}
                applyButtonProps={{
                  disabled: !dateUploadedFilter,
                  onClick: () => {
                    datePopoverRef.current?.hide()
                    setVideoWhereInput((value) => ({
                      ...value,
                      createdAt_gte: dateUploadedFilter
                        ? add(new Date(), {
                            days: -dateUploadedFilter,
                          })
                        : undefined,
                    }))
                  },
                }}
              />
            }
          >
            <Button badge={canClearDateUploadedFilter} variant="secondary">
              Date uploaded
            </Button>
          </PopoverDialog>
          <PopoverDialog
            instanceRef={lengthPopoverRef}
            content={videoLengthInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearVideoLengthFilter,
                  disabled: videoLengthFilter === undefined,
                }}
                applyButtonProps={{
                  disabled: !videoLengthFilter,
                  onClick: () => {
                    lengthPopoverRef.current?.hide()
                    setVideoWhereInput((value) => ({
                      ...value,
                      ...getDurationRules(videoLengthFilter),
                    }))
                  },
                }}
              />
            }
          >
            <Button badge={canClearVideoLengthFilter} variant="secondary">
              Length
            </Button>
          </PopoverDialog>
          <PopoverDialog
            instanceRef={licensePopoverRef}
            dividers
            content={licenseInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearLicensesFilter,
                  disabled: licensesFilter === undefined || licensesFilter?.length === 0,
                }}
                applyButtonProps={{
                  disabled: !licensesFilter || !licensesFilter.length,
                  onClick: () => {
                    licensePopoverRef.current?.hide()
                    setVideoWhereInput((value) => ({
                      ...value,
                      licenseId_in: licensesFilter?.map((license) => license.toString()),
                    }))
                  },
                }}
              />
            }
          >
            <Button badge={videoWhereInput?.licenseId_in?.length} variant="secondary">
              License
            </Button>
          </PopoverDialog>
          <PopoverDialog
            instanceRef={othersPopoverRef}
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
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearOtherFilters,
                  disabled: !paidPromotionalMaterialFilter && !matureContentRatingFilter,
                }}
                applyButtonProps={{
                  disabled: !paidPromotionalMaterialFilter && !matureContentRatingFilter,
                  onClick: () => {
                    othersPopoverRef.current?.hide()
                    setVideoWhereInput((value) => ({
                      ...value,
                      hasMarketing_eq: paidPromotionalMaterialFilter,
                      isExplicit_eq: matureContentRatingFilter,
                    }))
                  },
                }}
              />
            }
          >
            <Button badge={+!!videoWhereInput?.hasMarketing_eq + +!!videoWhereInput?.isExplicit_eq} variant="secondary">
              Other filters
            </Button>
          </PopoverDialog>
        </FiltersInnerContainer>

        {canClearAllFilters && (
          <ClearAllButton
            onClick={clearAllFilters}
            filtersVariant={variant}
            variant="tertiary"
            icon={<SvgGlyphClose />}
          >
            Clear all
          </ClearAllButton>
        )}
      </FiltersContainer>
    </CSSTransition>
  )
}

type FilterPopoverFooterProps = {
  applyButtonProps: ButtonProps
  clearButtonProps: ButtonProps
}
const FilterPopoverFooter: React.FC<FilterPopoverFooterProps> = ({ applyButtonProps, clearButtonProps }) => (
  <>
    <Button size="small" variant="secondary" {...clearButtonProps}>
      Clear
    </Button>
    <Button size="small" {...applyButtonProps}>
      Apply
    </Button>
  </>
)

const MobileFilterDialog: React.FC<{ title: string; content: React.ReactNode } & ActionDialogProps> = ({
  title,
  content,
  ...actionDialogProps
}) => {
  return (
    <StyledActionDialog {...actionDialogProps}>
      {title && (
        <ActionDialogHeader>
          <StyledTitleText variant="h5">{title}</StyledTitleText>
        </ActionDialogHeader>
      )}
      {content}
    </StyledActionDialog>
  )
}

const getDurationRules = (duration?: VideoLengthOptions) => {
  switch (duration) {
    case '0-to-4':
      return {
        duration_lte: 4 * 60,
      }
    case '4-to-10':
      return {
        duration_gte: 4 * 60,
        duration_lte: 10 * 60,
      }
    case '10-to-9999':
      return {
        duration_gte: 10 * 60,
      }
    default:
      return {}
  }
}
