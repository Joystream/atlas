import { add } from 'date-fns'
import { FC, ReactNode, useMemo, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useCategories } from '@/api/hooks'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionClose } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { RadioButton } from '@/components/_inputs/RadioButton'
import { Select } from '@/components/_inputs/Select'
import { DialogModal, DialogModalProps } from '@/components/_overlays/DialogModal'
import { DialogPopover } from '@/components/_overlays/DialogPopover'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { languages } from '@/config/languages'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

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

type Filters = 'date' | 'date-minted' | 'other' | 'categories' | 'length' | 'nftStatus' | 'language'

export type FiltersBarProps = {
  activeFilters: Filters[]
}

const nftStatuses = [
  {
    id: 'AuctionTypeEnglish',
    name: 'Timed auction',
  },
  {
    id: 'AuctionTypeOpen',
    name: 'Open auction',
  },
  {
    id: 'TransactionalStatusBuyNow',
    name: 'Fixed price',
  },
  {
    id: 'TransactionalStatusIdle',
    name: 'Not for sale',
  },
]

export const FiltersBar: FC<ReturnType<typeof useFiltersBar> & FiltersBarProps> = ({
  setVideoWhereInput,
  videoWhereInput,
  activeFilters,
  setOwnedNftWhereInput,
  filters: {
    setIsFiltersOpen,
    isFiltersOpen,
    dateUploadedFilter,
    setDateUploadedFilter,
    excludeMatureContentRatingFilter,
    setExcludeMatureContentRatingFilter,
    excludePaidPromotionalMaterialFilter,
    setExcludePaidPromotionalMaterialFilter,
    videoLengthFilter,
    setVideoLengthFilter,
    nftStatusFilter,
    setNftStatusFilter,
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
    canClearNftStatusFilter,
    clearNftStatusFilter,
    clearCategoriesFilter,
    clearAllFilters,
    clearDateUploadedFilter,
    clearVideoLengthFilter,
    clearOtherFilters,
    canClearCategoriesFilter,
  },
}) => {
  const smMatch = useMediaMatch('sm')
  const betweenBaseAndSMMatch = !smMatch
  const categoriesPopoverRef = useRef<PopoverImperativeHandle>(null)
  const datePopoverRef = useRef<PopoverImperativeHandle>(null)
  const lengthPopoverRef = useRef<PopoverImperativeHandle>(null)
  const othersPopoverRef = useRef<PopoverImperativeHandle>(null)
  const { categories } = useCategories()
  const nftStatusInputs = useMemo(
    () => (
      <FilterContentContainer>
        {nftStatuses.map((status) => (
          <Checkbox
            name="nft-status"
            label={status.name}
            key={`nft-status-${status.id}`}
            value={!!nftStatusFilter?.includes(status.id)}
            onChange={(value) => {
              setNftStatusFilter((statuses) =>
                value ? [...(statuses ?? []), status.id] : statuses?.filter((id) => id !== status.id)
              )
            }}
          />
        ))}
      </FilterContentContainer>
    ),
    [nftStatusFilter, setNftStatusFilter]
  )

  const categoriesInputs = useMemo(
    () => (
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
    ),
    [categories, categoriesFilter, setCategoriesFilter]
  )

  const dateUploadedInputs = useMemo(
    () => (
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
    ),
    [dateUploadedFilter, setDateUploadedFilter]
  )

  const videoLengthInputs = useMemo(
    () => (
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
    ),
    [setVideoLengthFilter, videoLengthFilter]
  )

  const otherFiltersInputs = useMemo(
    () => (
      <FilterContentContainer>
        <Checkbox
          onChange={setExcludePaidPromotionalMaterialFilter}
          name="other-filters"
          label="Paid promotional material"
          value={!!excludePaidPromotionalMaterialFilter}
        />
        <Checkbox
          onChange={setExcludeMatureContentRatingFilter}
          name="other-filters"
          label="Mature content rating"
          value={!!excludeMatureContentRatingFilter}
        />
      </FilterContentContainer>
    ),
    [
      excludeMatureContentRatingFilter,
      excludePaidPromotionalMaterialFilter,
      setExcludeMatureContentRatingFilter,
      setExcludePaidPromotionalMaterialFilter,
    ]
  )

  if (betweenBaseAndSMMatch) {
    return (
      <MobileFilterDialog
        onExitClick={() => setIsFiltersOpen(false)}
        show={isFiltersOpen}
        title="Filters"
        content={
          <>
            {activeFilters.includes('language') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Language
                </Text>
                <Select
                  items={[{ name: 'All languages', value: 'undefined' }, ...languages]}
                  placeholder="Any language"
                  size="medium"
                  value={language}
                  onChange={setLanguage}
                />
              </MobileFilterContainer>
            )}
            {activeFilters.includes('nftStatus') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Status
                </Text>
                {nftStatusInputs}
              </MobileFilterContainer>
            )}
            {categories && activeFilters.includes('categories') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Categories
                </Text>
                {categoriesInputs}
              </MobileFilterContainer>
            )}
            {activeFilters.includes('date') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Date uploaded
                </Text>
                {dateUploadedInputs}
              </MobileFilterContainer>
            )}
            {activeFilters.includes('date-minted') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Date minted
                </Text>
                {dateUploadedInputs}
              </MobileFilterContainer>
            )}
            {activeFilters.includes('length') && (
              <MobileFilterContainer>
                <Text secondary variant="h100">
                  Length
                </Text>
                {videoLengthInputs}
              </MobileFilterContainer>
            )}
            {activeFilters.includes('other') && (
              <MobileFilterContainer>
                <OtherFilterStyledText secondary variant="h100">
                  <OtherFilterStyledIcon />
                  Exclude:
                </OtherFilterStyledText>
                {otherFiltersInputs}
              </MobileFilterContainer>
            )}
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
              hasMarketing_eq: excludePaidPromotionalMaterialFilter ? !excludePaidPromotionalMaterialFilter : undefined,
              isExplicit_eq: excludeMatureContentRatingFilter ? !excludeMatureContentRatingFilter : undefined,
              category: categoriesFilter
                ? {
                    id_in: categoriesFilter,
                  }
                : undefined,
              language:
                language !== 'undefined'
                  ? {
                      iso_eq: language as string,
                    }
                  : undefined,
              ...getDurationRules(),
            }))
            setOwnedNftWhereInput((value) => {
              return {
                ...value,
                OR: [
                  nftStatusFilter?.includes('AuctionTypeEnglish')
                    ? {
                        transactionalStatusAuction: {
                          auctionType_json: { isTypeOf_eq: 'AuctionTypeEnglish' },
                        },
                      }
                    : {},
                  nftStatusFilter?.includes('AuctionTypeOpen')
                    ? {
                        transactionalStatusAuction: {
                          auctionType_json: { isTypeOf_eq: 'AuctionTypeOpen' },
                        },
                      }
                    : {},
                  nftStatusFilter?.includes('TransactionalStatusBuyNow')
                    ? {
                        transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusBuyNow' },
                      }
                    : {},
                  nftStatusFilter?.includes('TransactionalStatusIdle')
                    ? {
                        transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusIdle' },
                      }
                    : {},
                ],
              }
            })
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
          {activeFilters.includes('nftStatus') && (
            <DialogPopover
              ref={categoriesPopoverRef}
              trigger={
                <Button variant="secondary" badge={nftStatusFilter?.length}>
                  Status
                </Button>
              }
              dividers
              primaryButton={{
                text: 'Apply',
                disabled: !nftStatusFilter && !canClearNftStatusFilter,
                onClick: () => {
                  categoriesPopoverRef.current?.hide()
                  setOwnedNftWhereInput((value) => {
                    return {
                      ...value,
                      OR: [
                        nftStatusFilter?.includes('AuctionTypeEnglish')
                          ? {
                              transactionalStatusAuction: {
                                auctionType_json: { isTypeOf_eq: 'AuctionTypeEnglish' },
                              },
                            }
                          : {},
                        nftStatusFilter?.includes('AuctionTypeOpen')
                          ? {
                              transactionalStatusAuction: {
                                auctionType_json: { isTypeOf_eq: 'AuctionTypeOpen' },
                              },
                            }
                          : {},
                        nftStatusFilter?.includes('TransactionalStatusBuyNow')
                          ? {
                              transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusBuyNow' },
                            }
                          : {},
                        nftStatusFilter?.includes('TransactionalStatusIdle')
                          ? {
                              transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusIdle' },
                            }
                          : {},
                      ],
                    }
                  })
                },
              }}
              secondaryButton={{
                text: 'Clear',
                onClick: clearNftStatusFilter,
                disabled: nftStatusFilter === undefined,
              }}
            >
              {nftStatusInputs}
            </DialogPopover>
          )}
          {categories && activeFilters.includes('categories') && (
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
                    category: {
                      id_in: categoriesFilter,
                    },
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
          {activeFilters.includes('date') && (
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
          )}
          {activeFilters.includes('date-minted') && (
            <DialogPopover
              ref={datePopoverRef}
              trigger={
                <Button badge={canClearDateUploadedFilter} variant="secondary">
                  Date minted
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
          )}
          {activeFilters.includes('length') && (
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
          )}
          {activeFilters.includes('other') && (
            <DialogPopover
              ref={othersPopoverRef}
              trigger={
                <Button
                  badge={+(videoWhereInput?.hasMarketing_eq === false) + +(videoWhereInput?.isExplicit_eq === false)}
                  variant="secondary"
                >
                  Other filters
                </Button>
              }
              primaryButton={{
                text: 'Apply',
                disabled:
                  !excludePaidPromotionalMaterialFilter && !excludeMatureContentRatingFilter && !canClearOtherFilters,
                onClick: () => {
                  othersPopoverRef.current?.hide()
                  setVideoWhereInput((value) => ({
                    ...value,
                    hasMarketing_eq: excludePaidPromotionalMaterialFilter
                      ? !excludePaidPromotionalMaterialFilter
                      : undefined,
                    isExplicit_eq: excludeMatureContentRatingFilter ? !excludeMatureContentRatingFilter : undefined,
                  }))
                },
              }}
              secondaryButton={{
                text: 'Clear',
                onClick: clearOtherFilters,
                disabled: !excludePaidPromotionalMaterialFilter && !excludeMatureContentRatingFilter,
              }}
            >
              <OtherFilterStyledText secondary variant="h100">
                <OtherFilterStyledIcon />
                Exclude:
              </OtherFilterStyledText>
              {otherFiltersInputs}
            </DialogPopover>
          )}
        </FiltersInnerContainer>

        {canClearAllFilters && (
          <ClearAllButton onClick={clearAllFilters} variant="tertiary" icon={<SvgActionClose />}>
            Clear all
          </ClearAllButton>
        )}
      </FiltersContainer>
    </CSSTransition>
  )
}

const MobileFilterDialog: FC<{ content: ReactNode } & DialogModalProps> = ({ content, ...dialogModalProps }) => {
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
        duration_gte: undefined,
      }
    case '4-to-10':
      return {
        duration_gte: 4 * 60,
        duration_lte: 10 * 60,
      }
    case '10-to-9999':
      return {
        duration_gte: 10 * 60,
        duration_lte: undefined,
      }
    default:
      return {}
  }
}
