import { useCallback, useMemo, useState } from 'react'

import { CreatorTokenOrderByInput, CreatorTokenWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionShoppingCart } from '@/assets/icons'
import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'

export const CRT_STATUSES: FilterButtonOption[] = [
  {
    value: 'market',
    selected: false,
    applied: false,
    label: 'On market',
  },
  // {
  //   value: 'sale',
  //   selected: false,
  //   applied: false,
  //   label: 'On sale',
  // },
  {
    value: 'inactive',
    selected: false,
    applied: false,
    label: 'No active sale',
  },
]

export const OTHER_FILTERS: FilterButtonOption[] = [
  { label: 'Exclude tokens with a whitelist', selected: false, applied: false, value: 'open' },
]

export const FILTERS: SectionFilter[] = [
  {
    name: 'status',
    label: 'Status',
    icon: <SvgActionShoppingCart />,
    type: 'checkbox',
    options: CRT_STATUSES,
  },
  // { name: 'other', type: 'checkbox', options: OTHER_FILTERS, label: 'Other', icon: <SvgActionSettings /> },
]

export const SORTING_FILTERS = [
  {
    label: 'Newest',
    value: CreatorTokenOrderByInput.CreatedAtDesc,
  },
  {
    label: 'Oldest',
    value: CreatorTokenOrderByInput.CreatedAtAsc,
  },
]

export const useCrtSectionFilters = () => {
  const [filters, setFilters] = useState<SectionFilter[]>(FILTERS)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [order, setOrder] = useState<CreatorTokenOrderByInput>(CreatorTokenOrderByInput.CreatedAtDesc)

  const mappedFilters = useMemo((): CreatorTokenWhereInput => {
    const mappedStatus =
      filters
        .find((filter) => filter.name === 'status')
        ?.options?.filter((option) => option.applied)
        .map((option) => {
          switch (option.value) {
            case 'market':
              return {
                currentAmmSale_isNull: false,
              }
            case 'sale':
              return {
                currentSale_isNull: false,
              }
            case 'inactive':
              return {
                currentSale_isNull: true,
                currentAmmSale_isNull: true,
              }
            default:
              return {}
          }
        }, [] as CreatorTokenWhereInput[]) ?? []

    const otherFilters = filters.find((filter) => filter.name === 'other')
    const isWhitelistedExcluded = otherFilters?.options?.some((option) => option.value === 'open' && option.applied)

    setHasAppliedFilters(Boolean(isWhitelistedExcluded || mappedStatus.length))

    const commonFilters: CreatorTokenWhereInput = {
      ...(isWhitelistedExcluded ? { isInviteOnly_eq: false } : {}),
    }

    return {
      OR: mappedStatus.length
        ? mappedStatus.map((saleStatus) => ({
            ...commonFilters,
            ...saleStatus,
          }))
        : [commonFilters],
    }
  }, [filters])

  const clearFilters = useCallback(() => {
    setFilters(FILTERS)
  }, [])

  return {
    creatorTokenWhereInput: mappedFilters,
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
