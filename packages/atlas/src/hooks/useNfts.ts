import { QueryHookOptions } from '@apollo/client'

import {
  GetNftsQuery,
  GetNftsQueryVariables,
  useGetNftsConnectionQuery,
  useGetNftsQuery,
} from '@/api/queries/__generated__/nfts.generated'
import { nftFilter } from '@/config/contentFilter'

export const useNfts = (baseOptions?: QueryHookOptions<GetNftsQuery, GetNftsQueryVariables>) => {
  const { data: paginationData } = useGetNftsConnectionQuery({
    variables: {
      ...baseOptions?.variables,
      where: { ...baseOptions?.variables?.where, ...(nftFilter ? nftFilter : {}) },
    },
  })

  const { data: nftData, ...rest } = useGetNftsQuery(baseOptions)

  return {
    nfts: nftData?.ownedNfts,
    totalCount: paginationData?.ownedNftsConnection.totalCount,
    ...rest,
  }
}
