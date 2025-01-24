import { useState } from 'react'

import { useGetFullAmmCurveQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SentryLogger } from '@/utils/logs'

const separateListIntoChunks = <T>(list: Array<T>, chunkSize: number): Array<T[]> => {
  const chunks = []

  for (let index = 0; index < list.length; index += chunkSize) {
    chunks.push(list.slice(index, index + chunkSize))
  }

  return chunks
}

export const useMarketTransactionsPagination = ({
  ammId,
  initialPageSize = 10,
}: {
  ammId?: string
  initialPageSize?: number
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(initialPageSize)

  const { data, loading } = useGetFullAmmCurveQuery({
    variables: {
      where: {
        id_eq: ammId,
      },
    },
    skip: false,
    onError: (error) => {
      SentryLogger.error('Failed to fetch AMM curve', 'CrtMarketTab', error)
    },
  })

  const marketTransactions = data?.ammCurves[0].transactions ?? []

  const pages = separateListIntoChunks(
    [...marketTransactions].sort((transactionA, transactionB) => transactionB.createdIn - transactionA.createdIn),
    perPage
  )

  return {
    currentPage,
    setCurrentPage,
    marketTransactions: pages[currentPage] ?? [],
    totalCount: marketTransactions.length,
    loading,
    setPerPage,
    perPage,
  }
}
