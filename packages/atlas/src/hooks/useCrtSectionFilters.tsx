import { useCallback, useMemo, useState } from 'react'

import {
  MarketplaceTokenOrderByInput,
  MarketplaceTokenWhereInput,
} from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionShoppingCart } from '@/assets/icons'
import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'

import { useDebounceValue } from './useDebounceValue'

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
    value: MarketplaceTokenOrderByInput.CreatedAtDesc,
  },
  {
    label: 'Oldest',
    value: MarketplaceTokenOrderByInput.CreatedAtAsc,
  },
]

export const sortMappings: Record<string, [MarketplaceTokenOrderByInput, MarketplaceTokenOrderByInput]> = {
  token: [MarketplaceTokenOrderByInput.SymbolDesc, MarketplaceTokenOrderByInput.SymbolAsc],
  createdAt: [MarketplaceTokenOrderByInput.CreatedAtDesc, MarketplaceTokenOrderByInput.CreatedAtAsc],
  dailyPriceChange: [
    MarketplaceTokenOrderByInput.LastDayPriceChangeDesc,
    MarketplaceTokenOrderByInput.LastDayPriceChangeAsc,
  ],
  price: [MarketplaceTokenOrderByInput.LastPriceDesc, MarketplaceTokenOrderByInput.LastPriceAsc],
  liquidityChange: [MarketplaceTokenOrderByInput.WeeklyLiqChangeDesc, MarketplaceTokenOrderByInput.WeeklyLiqChangeAsc],
  liquidity: [MarketplaceTokenOrderByInput.LiquidityDesc, MarketplaceTokenOrderByInput.LiquidityAsc],
  tradingVolume: [MarketplaceTokenOrderByInput.AmmVolumeDesc, MarketplaceTokenOrderByInput.AmmVolumeAsc],
  marketCap: [MarketplaceTokenOrderByInput.MarketCapDesc, MarketplaceTokenOrderByInput.MarketCapAsc],
  totalRevenue: [MarketplaceTokenOrderByInput.CumulativeRevenueDesc, MarketplaceTokenOrderByInput.CumulativeRevenueAsc],
  holders: [MarketplaceTokenOrderByInput.AccountsNumDesc, MarketplaceTokenOrderByInput.AccountsNumAsc],
}

export const useCrtSectionFilters = ({
  orderBy,
  setOrderBy: _setOrder,
}: {
  orderBy?: MarketplaceTokenOrderByInput
  setOrderBy: (val: MarketplaceTokenOrderByInput) => void
}) => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<SectionFilter[]>(FILTERS)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const debouncedSearch = useDebounceValue(search, 400)

  const mappedFilters = useMemo((): MarketplaceTokenWhereInput => {
    const mappedStatus =
      filters
        .find((filter) => filter.name === 'status')
        ?.options?.filter((option) => option.applied)
        .map((option) => {
          switch (option.value) {
            case 'market':
              return {
                currentAmmSaleId_isNull: false,
              }
            case 'sale':
              return {
                currentSaleId_isNull: false,
              }
            case 'inactive':
              return {
                currentSaleId_isNull: true,
                currentAmmSaleId_isNull: true,
              }
            default:
              return {}
          }
        }, [] as MarketplaceTokenWhereInput[]) ?? []

    const otherFilters = filters.find((filter) => filter.name === 'other')
    const isWhitelistedExcluded = otherFilters?.options?.some((option) => option.value === 'open' && option.applied)

    setHasAppliedFilters(Boolean(isWhitelistedExcluded || mappedStatus.length))

    const commonFilters: MarketplaceTokenWhereInput = {
      ...(isWhitelistedExcluded ? { isInviteOnly_eq: false } : {}),
      symbol_containsInsensitive: debouncedSearch,
    }

    return {
      OR: mappedStatus.length
        ? mappedStatus.map((saleStatus) => ({
            ...commonFilters,
            ...saleStatus,
          }))
        : [commonFilters],
    }
  }, [filters, debouncedSearch])

  const setOrder = useCallback(
    (row?: { id: string; desc: boolean }) => {
      if (row && row.id in sortMappings) {
        const options = sortMappings[row.id]
        _setOrder(options[row.desc ? 0 : 1])
        return
      }

      _setOrder(MarketplaceTokenOrderByInput.CreatedAtDesc)
    },
    [_setOrder]
  )

  const clearFilters = useCallback(() => {
    setFilters(FILTERS)
  }, [])

  return {
    creatorTokenWhereInput: mappedFilters,
    rawFilters: filters,
    orderBy,
    hasAppliedFilters,
    sortMappings,
    search,
    actions: {
      setSearch,
      setOrder,
      onApplyFilters: setFilters,
      clearFilters,
    },
  }
}
