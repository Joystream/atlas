import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, TokenAmount } from '@/components/Table/Table.cells'
import { Text } from '@/components/Text'
import { useUser } from '@/providers/user/user.hooks'

const COLUMNS: TableProps['columns'] = [
  { Header: 'End Date', accessor: 'endDate' },
  { Header: 'Participants', accessor: 'participants' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'You claimed', accessor: 'userClaimed' },
  { Header: 'Holders claimed', accessor: 'holdersClaimed' },
  { Header: 'Unclaimed', accessor: 'unclaimed' },
]

export type RevenueShareHistoryTableProps = {
  data: {
    endsAtBlock: number
    totalParticipants: number
    potentialParticipants: number | null
    claimed: BN
    allocation: BN
    stakers: FullCreatorTokenFragment['revenueShares'][number]['stakers']
  }[]
}

export const RevenueShareHistoryTable = ({ data }: RevenueShareHistoryTableProps) => {
  const { memberId } = useUser()

  const mappedData = useMemo(() => {
    return data.map((row) => {
      const memberStake = new BN(row.stakers.find((staker) => staker.account.member.id === memberId)?.earnings ?? 0)
      const potentialParticipants = row.potentialParticipants
      return {
        endDate: <DateBlockCell type="block" block={row.endsAtBlock} />,
        participants: (
          <Text variant="t100" as="span">
            {row.stakers.length}/{potentialParticipants ?? 'N/A'}
            <Text variant="t100" as="p" color="colorText">
              {potentialParticipants ? `(${row.stakers.length / potentialParticipants}%)` : ''}
            </Text>
          </Text>
        ),
        total: <TokenAmount tokenAmount={row.claimed} />,
        userClaimed: <TokenAmount tokenAmount={memberStake} />,
        holdersClaimed: <TokenAmount tokenAmount={row.claimed.sub(memberStake)} />,
        unclaimed: <TokenAmount tokenAmount={row.allocation.sub(row.claimed)} />,
      }
    })
  }, [data, memberId])

  return <StyledTable minWidth={900} title="Revenue share history" columns={COLUMNS} data={mappedData} />
}

const StyledTable = styled(Table)`
  th:not(:nth-child(1)) {
    justify-content: end;
  }

  td:not(:nth-child(1)) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
