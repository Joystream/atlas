import { add } from 'date-fns'
import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { DialogModal, DialogModalProps } from '@/components/DialogModal'
import { languages } from '@/config/languages'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { DialogPopover } from '@/shared/components/DialogPopover'
import { PopoverImperativeHandle } from '@/shared/components/Popover'
import { RadioButton } from '@/shared/components/RadioButton'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { SvgGlyphClose } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ClearAllButton,
  FilterContentContainer,
  FiltersContainer,
  FiltersInnerContainer,
  MobileFilterContainer,
  OtherFilterStyledIcon,
  OtherFilterStyledText,
} from './FiltersBar.styles'
import { VideoLengthOptions, useFiltersBar } from './useFiltersBar'

type FilterCategory = {
  id: string
  name?: string | null
}

export type FiltersBarProps = {
  categories?: FilterCategory[]
  mobileLanguageSelector?: boolean
}

export const FiltersBar: React.FC<ReturnType<typeof useFiltersBar> & FiltersBarProps> = ({
  setVideoWhereInput,
  videoWhereInput,
  categories,
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
    canClearOtherFilters,
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
  const categoriesPopoverRef = useRef<PopoverImperativeHandle>(null)
  const datePopoverRef = useRef<PopoverImperativeHandle>(null)
  const lengthPopoverRef = useRef<PopoverImperativeHandle>(null)
  const licensePopoverRef = useRef<PopoverImperativeHandle>(null)
  const othersPopoverRef = useRef<PopoverImperativeHandle>(null)

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
        show={isFiltersOpen}
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
            {categories && (
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
          {categories && (
            <DialogPopover
              ref={categoriesPopoverRef}
              trigger={
                <Button variant="secondary" badge={canClearCategoriesFilter && categoriesFilter?.length}>
                  Categories
                </Button>
              }
              dividers
              primaryButton={{
                text: 'Apply',
                disabled: (!categoriesFilter || !categoriesFilter.length) && !canClearCategoriesFilter,
                onClick: () => {
                  categoriesPopoverRef.current?.hide()
                  setVideoWhereInput((value) => ({
                    ...value,
                    categoryId_in: categoriesFilter,
                  }))
                },
              }}
              secondaryButton={{
                text: 'Clear',
                onClick: clearCategoriesFilter,
                disabled: categoriesFilter === undefined,
              }}
            >
              {categoriesInputs}
            </DialogPopover>
          )}
          <DialogPopover
            ref={datePopoverRef}
            trigger={
              <Button badge={canClearDateUploadedFilter} variant="secondary">
                Date uploaded
              </Button>
            }
            primaryButton={{
              text: 'Apply',
              disabled: !dateUploadedFilter && !canClearDateUploadedFilter,
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
            secondaryButton={{
              text: 'Clear',
              onClick: clearDateUploadedFilter,
              disabled: dateUploadedFilter === undefined,
            }}
          >
            {dateUploadedInputs}
          </DialogPopover>
          <DialogPopover
            ref={lengthPopoverRef}
            trigger={
              <Button badge={canClearVideoLengthFilter} variant="secondary">
                Length
              </Button>
            }
            primaryButton={{
              text: 'Apply',
              disabled: !videoLengthFilter && !canClearVideoLengthFilter,
              onClick: () => {
                lengthPopoverRef.current?.hide()
                setVideoWhereInput((value) => ({
                  ...value,
                  ...getDurationRules(videoLengthFilter),
                }))
              },
            }}
            secondaryButton={{
              text: 'Clear',
              onClick: clearVideoLengthFilter,
              disabled: videoLengthFilter === undefined,
            }}
          >
            {videoLengthInputs}
          </DialogPopover>
          <DialogPopover
            ref={licensePopoverRef}
            dividers
            trigger={
              <Button badge={videoWhereInput?.licenseId_in?.length} variant="secondary">
                License
              </Button>
            }
            primaryButton={{
              text: 'Apply',
              disabled: (!licensesFilter || !licensesFilter.length) && !clearLicensesFilter,
              onClick: () => {
                licensePopoverRef.current?.hide()
                setVideoWhereInput((value) => ({
                  ...value,
                  licenseId_in: licensesFilter?.map((license) => license.toString()),
                }))
              },
            }}
            secondaryButton={{
              text: 'Clear',
              onClick: clearLicensesFilter,
              disabled: licensesFilter === undefined || licensesFilter?.length === 0,
            }}
          >
            {licenseInputs}
          </DialogPopover>
          <DialogPopover
            ref={othersPopoverRef}
            trigger={
              <Button
                badge={+!!videoWhereInput?.hasMarketing_eq + +!!videoWhereInput?.isExplicit_eq}
                variant="secondary"
              >
                Other filters
              </Button>
            }
            primaryButton={{
              text: 'Apply',
              disabled: !paidPromotionalMaterialFilter && !matureContentRatingFilter && !canClearOtherFilters,
              onClick: () => {
                othersPopoverRef.current?.hide()
                setVideoWhereInput((value) => ({
                  ...value,
                  hasMarketing_eq: paidPromotionalMaterialFilter,
                  isExplicit_eq: matureContentRatingFilter,
                }))
              },
            }}
            secondaryButton={{
              text: 'Clear',
              onClick: clearOtherFilters,
              disabled: !paidPromotionalMaterialFilter && !matureContentRatingFilter,
            }}
          >
            <OtherFilterStyledText secondary variant="overhead">
              <OtherFilterStyledIcon />
              Exclude:
            </OtherFilterStyledText>
            {otherFiltersInputs}
          </DialogPopover>
        </FiltersInnerContainer>

        {canClearAllFilters && (
          <ClearAllButton onClick={clearAllFilters} variant="tertiary" icon={<SvgGlyphClose />}>
            Clear all
          </ClearAllButton>
        )}
      </FiltersContainer>
    </CSSTransition>
  )
}

const MobileFilterDialog: React.FC<{ content: React.ReactNode } & DialogModalProps> = ({
  content,
  ...dialogModalProps
}) => {
  return (
    <DialogModal {...dialogModalProps} dividers>
      {content}
    </DialogModal>
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
