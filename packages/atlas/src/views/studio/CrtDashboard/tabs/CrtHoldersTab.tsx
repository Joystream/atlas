import { useMemo } from 'react'

import { TokenAccountOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  useGetCreatorTokenHoldersCountQuery,
  useGetCreatorTokenHoldersQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { HoldersTable } from '@/components/_crt/HoldersTable/HoldersTable'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import { usePagination } from '@/views/viewer/ChannelView/ChannelView.hooks'

type CrtHoldersTabProps = {
  token: FullCreatorTokenFragment
}

const TILES_PER_PAGE = 10

export const CrtHoldersTab = ({ token }: CrtHoldersTabProps) => {
  const { memberId } = useUser()
  const { currentPage, setCurrentPage } = usePagination(0)
  const { data, loading } = useGetCreatorTokenHoldersQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      offset: currentPage * TILES_PER_PAGE,
      orderBy: [TokenAccountOrderByInput.TotalAmountDesc],
      limit: TILES_PER_PAGE,
      where: {
        token: {
          id_eq: token.id,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token holders query', 'CrtHoldersTab', error)
    },
  })
  const { data: holdersCountData } = useGetCreatorTokenHoldersCountQuery({
    variables: {
      where: {
        token: {
          id_eq: token.id,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token holders count query', 'CrtHoldersTab', error)
    },
  })

  const mappedData = useMemo(
    () =>
      data?.tokenAccounts
        ? data.tokenAccounts.map((holder) => ({
            member: holder.member,
            tokenId: token.id,
            allocation: (+holder.totalAmount / +token.totalSupply) * 100,
            total: +holder.totalAmount,
            vested: +(
              holder.vestingSchedules.find(
                (vesting) => vesting.vestingSource.__typename === 'InitialIssuanceVestingSource'
              )?.totalVestingAmount ?? 0
            ),
          }))
        : [],
    [data?.tokenAccounts, token.id, token.totalSupply]
  )

  return (
    <HoldersTable
      data={mappedData}
      isLoading={loading}
      currentMemberId={memberId ?? ''}
      symbol={token.symbol ?? 'N/A'}
      pageSize={TILES_PER_PAGE}
      pagination={{
        totalCount: holdersCountData?.tokenAccountsConnection.totalCount,
        itemsPerPage: TILES_PER_PAGE,
        page: currentPage,
        onChangePage: setCurrentPage,
      }}
    />
  )
}
