import { MarketplaceTokenOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  useGetMarketplaceTokensCountQuery,
  useGetMarketplaceTokensQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SentryLogger } from '@/utils/logs'

import { useCrtSectionFilters } from './useCrtSectionFilters'
import { useQueryTableState } from './useQueryTableState'

export const useTokensPagination = ({ initialPageSize = 10 }: { initialPageSize?: number }) => {
  // TODO: we should add where clause to url params as well, but currently they are so small that it was omitted
  const pagination = useQueryTableState<MarketplaceTokenOrderByInput>({
    initialPerPage: initialPageSize,
    initialOrderBy: MarketplaceTokenOrderByInput.LiquidityDesc,
  })
  const { setOrderBy, orderBy } = pagination

  const {
    creatorTokenWhereInput,
    hasAppliedFilters,
    rawFilters,
    sortMappings,
    search,
    actions: { onApplyFilters, setOrder, clearFilters, setSearch },
  } = useCrtSectionFilters({ orderBy, setOrderBy })

  const { data, loading } = useGetMarketplaceTokensQuery({
    variables: {
      where: creatorTokenWhereInput,
      orderBy: [orderBy ?? ''],
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      SentryLogger.error('Failed to fetch tokens query', 'useTokensPagination', error)
    },
  })
  const { data: countData, loading: loadingCount } = useGetMarketplaceTokensCountQuery({
    variables: {
      where: creatorTokenWhereInput,
    },
  })

  return {
    ...pagination,
    search,
    setSearch,
    tokens: data?.getMarketplaceTokens,
    totalCount: countData?.getMarketplaceTokensCount.count ?? 0,
    isLoading: loading || loadingCount,
    creatorTokenWhereInput,
    order: orderBy,
    hasAppliedFilters,
    rawFilters,
    sortMappings,
    onApplyFilters,
    setOrder,
    clearFilters,
  }
}
