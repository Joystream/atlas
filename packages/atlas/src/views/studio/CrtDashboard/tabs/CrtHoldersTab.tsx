import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { HoldersTable } from '@/components/_crt/HoldersTable/HoldersTable'
import { absoluteRoutes } from '@/config/routes'
import { useHoldersPagination } from '@/hooks/useHoldersPagination'
import { useUser } from '@/providers/user/user.hooks'

type CrtHoldersTabProps = {
  token: FullCreatorTokenFragment
}

const TILES_PER_PAGE = 10

export const CrtHoldersTab = ({ token }: CrtHoldersTabProps) => {
  const { memberId } = useUser()
  const { holders, currentPage, setCurrentPage, isLoading, totalCount, setPerPage, perPage } = useHoldersPagination(
    token.id,
    {
      initialPageSize: TILES_PER_PAGE,
    }
  )

  const mappedData = useMemo(
    () =>
      holders
        ? holders.map((holder) => ({
            member: holder.member,
            tokenId: token.id,
            allocation: (+holder.totalAmount / +token.totalSupply) * 100,
            total: +holder.totalAmount,
            staked: +holder.stakedAmount,
          }))
        : [],
    [holders, token.id, token.totalSupply]
  )

  return (
    <HoldersTable
      data={mappedData}
      getRowTo={(idx) => absoluteRoutes.viewer.memberById(mappedData[idx]?.member.id ?? '')}
      interactive
      isLoading={isLoading}
      currentMemberId={memberId ?? ''}
      symbol={token.symbol ?? 'N/A'}
      pageSize={perPage}
      pagination={{
        setPerPage,
        totalCount,
        itemsPerPage: perPage,
        page: currentPage,
        onChangePage: setCurrentPage,
      }}
    />
  )
}
