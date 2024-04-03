import { useState } from 'react'

import { TokenAccountOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  useGetCreatorTokenHoldersCountQuery,
  useGetCreatorTokenHoldersQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SentryLogger } from '@/utils/logs'
import { usePagination } from '@/views/viewer/ChannelView/ChannelView.hooks'

export const useHoldersPagination = (tokenId: string, { initialPageSize = 10 }: { initialPageSize?: number }) => {
  const pagination = usePagination(0)
  const [perPage, setPerPage] = useState(initialPageSize)
  const { data, loading } = useGetCreatorTokenHoldersQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      offset: pagination.currentPage * perPage,
      orderBy: [TokenAccountOrderByInput.TotalAmountDesc],
      limit: perPage,
      where: {
        token: {
          id_eq: tokenId,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token holders query', 'useHoldersPagination', error)
    },
  })

  const { data: holdersCountData, loading: loadingCount } = useGetCreatorTokenHoldersCountQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token holders count query', 'useHoldersPagination', error)
    },
  })

  return {
    ...pagination,
    holders: data?.tokenAccounts,
    totalCount: holdersCountData?.tokenAccountsConnection.totalCount ?? 0,
    isLoading: loading || loadingCount,
    setPerPage,
    perPage,
  }
}
