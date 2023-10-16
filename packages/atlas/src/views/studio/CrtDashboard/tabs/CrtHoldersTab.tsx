import { useMemo } from 'react'

import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { HoldersTable } from '@/components/_crt/HoldersTable/HoldersTable'

type CrtHoldersTabProps = {
  token: FullCreatorTokenFragment
}

export const CrtHoldersTab = ({ token }: CrtHoldersTabProps) => {
  const { data, loading } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: token.id,
        },
      },
    },
  })

  const mappedData = useMemo(
    () =>
      data?.tokenAccounts
        ? data.tokenAccounts.map((holder) => ({
            member: holder.member,
            transferable: +holder.totalAmount - +(holder.stakedAmount ?? 0),
            allocation: Math.round((+holder.totalAmount / +token.totalSupply) * 100),
            total: +holder.totalAmount,
            vested: +(
              holder.vestingSchedules.find(
                (vesting) => vesting.vestingSource.__typename === 'InitialIssuanceVestingSource'
              )?.totalVestingAmount ?? 0
            ),
          }))
        : [],
    [data?.tokenAccounts, token.totalSupply]
  )

  return <HoldersTable data={mappedData} isLoading={loading} currentMemberId="1" />
}
