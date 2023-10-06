import { useCallback, useMemo, useState } from 'react'

import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionSell, SvgActionSettings, SvgActionShoppingCart } from '@/assets/icons'
import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'

export const NFT_STATUSES: FilterButtonOption[] = [
  {
    value: 'AuctionTypeEnglish',
    selected: false,
    applied: false,
    label: 'Timed auction',
  },
  {
    value: 'AuctionTypeOpen',
    selected: false,
    applied: false,
    label: 'Open auction',
  },
  {
    value: 'TransactionalStatusBuyNow',
    selected: false,
    applied: false,
    label: 'Fixed price',
  },
  {
    value: 'TransactionalStatusIdle',
    selected: false,
    applied: false,
    label: 'Not for sale',
  },
]

export const OTHER_FILTERS: FilterButtonOption[] = [
  { label: 'Exclude paid promotional materials', selected: false, applied: false, value: 'promotional' },
  { label: 'Exclude mature content rating', selected: false, applied: false, value: 'mature' },
]

export const FILTERS: SectionFilter[] = [
  {
    name: 'price',
    type: 'range',
    label: 'Last price',
    icon: <SvgActionSell />,
    range: { min: undefined, max: undefined },
  },
  {
    name: 'status',
    label: 'Status',
    icon: <SvgActionShoppingCart />,
    type: 'checkbox',
    options: NFT_STATUSES,
  },
  { name: 'other', type: 'checkbox', options: OTHER_FILTERS, label: 'Other', icon: <SvgActionSettings /> },
]

export const SORTING_FILTERS = [
  {
    label: 'Newest',
    value: OwnedNftOrderByInput.CreatedAtDesc,
  },
  {
    label: 'Oldest',
    value: OwnedNftOrderByInput.CreatedAtAsc,
  },
]

export const useNftSectionFilters = () => {
  const [filters, setFilters] = useState<SectionFilter[]>(FILTERS)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [order, setOrder] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)

  const mappedFilters = useMemo((): OwnedNftWhereInput => {
    const mappedStatus =
      filters
        .find((filter) => filter.name === 'status')
        ?.options?.filter((option) => option.applied)
        .map((option) => {
          if (['AuctionTypeOpen', 'AuctionTypeEnglish'].includes(option.value)) {
            return {
              auction: {
                auctionType: {
                  isTypeOf_eq: option.value,
                },
              },
            }
          }

          return { isTypeOf_eq: option.value }
        }, [] as OwnedNftWhereInput['transactionalStatus'][]) ?? []
    const otherFilters = filters.find((filter) => filter.name === 'other')
    const isMatureExcluded = otherFilters?.options?.some((option) => option.value === 'mature' && option.applied)
    const isPromotionalExcluded = otherFilters?.options?.some(
      (option) => option.value === 'promotional' && option.applied
    )
    const priceFilter = filters.find((filter) => filter.name === 'price')
    const minPrice = priceFilter?.range?.appliedMin
    const maxPrice = priceFilter?.range?.appliedMax

    setHasAppliedFilters(
      Boolean(minPrice || maxPrice || isPromotionalExcluded || isMatureExcluded || mappedStatus.length)
    )

    const commonFilters = {
      lastSalePrice_gte: minPrice ? tokenNumberToHapiBn(minPrice).toString() : undefined,
      lastSalePrice_lte: maxPrice ? tokenNumberToHapiBn(maxPrice).toString() : undefined,
      video: {
        ...publicCryptoVideoFilter,
        ...(isMatureExcluded ? { isExcluded_eq: false } : {}),
        ...(isPromotionalExcluded ? { hasMarketing_eq: false } : {}),
      },
    }
    return {
      OR: mappedStatus.length
        ? mappedStatus.map((transactionalStatus) => ({
            ...commonFilters,
            transactionalStatus,
          }))
        : [commonFilters],
    }
  }, [filters])

  const clearFilters = useCallback(() => {
    setFilters(FILTERS)
  }, [])

  return {
    ownedNftWhereInput: mappedFilters,
    rawFilters: filters,
    order,
    hasAppliedFilters,
    actions: {
      setOrder,
      onApplyFilters: setFilters,
      clearFilters,
    },
  }
}
