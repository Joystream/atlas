import { add } from 'date-fns'
import React from 'react'
import { CSSTransition } from 'react-transition-group'

import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button, ButtonProps } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { PopoverDialog } from '@/shared/components/Popover'
import { RadioButton } from '@/shared/components/RadioButton'
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
import { VideoLengthOptions, useFiltersBar } from './useFiltersBar'

import { ActionDialog, ActionDialogProps } from '../ActionDialog'
import { StyledTitleText } from '../MessageDialog/MessageDialog.style'

export const FiltersBar: React.FC<ReturnType<typeof useFiltersBar>> = ({
  setVideoWhereInput,
  videoWhereInput,
  filters: {
    setiIsFiltersOpen,
    isFiltersOpen,
    dateUploadedFilter,
    setDateUploadedFilter,
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
        onExitClick={() => setiIsFiltersOpen(false)}
        showDialog={isFiltersOpen}
        title="Filters"
        content={
          <>
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
          onClick: () =>
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
              ...getDurationRules(),
            })),
        }}
        secondaryButton={{
          text: 'Clear',
          disabled: canClearAllFilters === false,
          onClick: clearAllFilters,
        }}
      />
    )
  }
  return (
    <CSSTransition in={isFiltersOpen} timeout={100} classNames="filters" unmountOnExit>
      <FiltersContainer open={true}>
        <FiltersInnerContainer>
          <PopoverDialog
            content={dateUploadedInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearDateUploadedFilter,
                  disabled: dateUploadedFilter === undefined,
                }}
                applyButtonProps={{
                  onClick: () =>
                    setVideoWhereInput((value) => ({
                      ...value,
                      createdAt_gte: dateUploadedFilter
                        ? add(new Date(), {
                            days: -dateUploadedFilter,
                          })
                        : undefined,
                    })),
                }}
              />
            }
          >
            <Button badge={canClearDateUploadedFilter} variant="secondary">
              Date uploaded
            </Button>
          </PopoverDialog>
          <PopoverDialog
            content={videoLengthInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearVideoLegnthFilter,
                  disabled: videoLegnthFilter === undefined,
                }}
                applyButtonProps={{
                  onClick: () =>
                    setVideoWhereInput((value) => ({
                      ...value,
                      ...getDurationRules(videoLegnthFilter),
                    })),
                }}
              />
            }
          >
            <Button badge={canClearVideoLegnthFilter} variant="secondary">
              Length
            </Button>
          </PopoverDialog>
          <PopoverDialog
            dividers
            content={licenseInputs}
            footer={
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearLicensesFilter,
                  disabled: licensesFilter === undefined || licensesFilter?.length === 0,
                }}
                applyButtonProps={{
                  onClick: () =>
                    setVideoWhereInput((value) => ({
                      ...value,
                      licenseId_in: licensesFilter?.map((license) => license.toString()),
                    })),
                }}
              />
            }
          >
            <Button badge={videoWhereInput?.licenseId_in?.length} variant="secondary">
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
              <FilterPopoverFooter
                clearButtonProps={{
                  onClick: clearOtherFilters,
                  disabled: !paidPromotionalMaterialFilter && !matureContentRatingFilter,
                }}
                applyButtonProps={{
                  onClick: () =>
                    setVideoWhereInput((value) => ({
                      ...value,
                      hasMarketing_eq: paidPromotionalMaterialFilter,
                      isExplicit_eq: matureContentRatingFilter,
                    })),
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
          <Button onClick={clearAllFilters} variant="tertiary" icon={<SvgGlyphClose />}>
            Clear all
          </Button>
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
    <ActionDialog {...actionDialogProps}>
      {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
      {content}
    </ActionDialog>
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
