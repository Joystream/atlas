import {
  MarketplaceTokenOrderByInput,
  MarketplaceTokenWhereInput,
} from '@/api/queries/__generated__/baseTypes.generated'
import {
  useGetMarketplaceTokensCountQuery,
  useGetMarketplaceTokensQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SentryLogger } from '@/utils/logs'

import { useQueryPagination } from './usePagination'

export const useTokensPagination = ({
  where,
  orderBy,
  initialPageSize = 10,
}: {
  where?: MarketplaceTokenWhereInput
  orderBy?: MarketplaceTokenOrderByInput[]
  initialPageSize?: number
}) => {
  const pagination = useQueryPagination({ initialPerPage: initialPageSize })
  const { data, loading } = useGetMarketplaceTokensQuery({
    variables: {
      where,
      orderBy,
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch tokens query', 'useTokensPagination', error)
    },
  })
  // const data = useGetMarketplaceTokens({
  //         where,
  //     orderBy,
  //     // offset: pagination.currentPage * pagination.perPage,
  //     limit: pagination.perPage,
  // })
  // const { data, loading } = useGetBasicCreatorTokensQuery({
  //   notifyOnNetworkStatusChange: true,
  //   variables: {
  //     where,
  //     orderBy,
  //     offset: pagination.currentPage * pagination.perPage,
  //     limit: pagination.perPage,
  //   },
  //   onError: (error) => {
  //     SentryLogger.error('Failed to fetch tokens query', 'useTokensPagination', error)
  //   },
  // })
  const { data: countData, loading: loadingCount } = useGetMarketplaceTokensCountQuery({
    variables: {
      where,
    },
  })

  return {
    ...pagination,
    tokens: data?.getMarketplaceTokens,
    totalCount: countData?.getMarketplaceTokensCount.count ?? 0,
    isLoading: loading || loadingCount,
  }
}
