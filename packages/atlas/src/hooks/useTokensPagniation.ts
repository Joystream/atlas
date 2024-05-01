import { useState } from 'react'

import { CreatorTokenOrderByInput, CreatorTokenWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  useGetBasicCreatorTokensQuery,
  useGetCreatorTokensCountQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SentryLogger } from '@/utils/logs'
import { usePagination } from '@/views/viewer/ChannelView/ChannelView.hooks'

export const useTokensPagination = ({
  where,
  orderBy,
  initialPageSize = 10,
}: {
  where?: CreatorTokenWhereInput
  orderBy?: CreatorTokenOrderByInput
  initialPageSize?: number
}) => {
  const pagination = usePagination(0)
  const [perPage, setPerPage] = useState(initialPageSize)

  const { data, loading } = useGetBasicCreatorTokensQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where,
      orderBy,
      offset: pagination.currentPage * perPage,
      limit: perPage,
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch tokens query', 'useTokensPagination', error)
    },
  })
  const { data: countData, loading: loadingCount } = useGetCreatorTokensCountQuery({
    variables: {
      where,
    },
  })

  return {
    ...pagination,
    tokens: data?.creatorTokens,
    totalCount: countData?.creatorTokensConnection.totalCount ?? 0,
    isLoading: loading || loadingCount,
    setPerPage,
    perPage,
  }
}
