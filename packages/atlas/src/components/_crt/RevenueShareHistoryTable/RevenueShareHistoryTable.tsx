import styled from '@emotion/styled'
import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, TokenAmount } from '@/components/Table/Table.cells'
import { Text } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
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
    claimed: number
    stakers: FullCreatorTokenFragment['revenueShares'][number]['stakers']
  }[]
}

export const RevenueShareHistoryTable = ({ data }: RevenueShareHistoryTableProps) => {
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const { memberId } = useUser()

  const mappedData = useMemo(() => {
    return data.map((row) => {
      const memberStake = +(row.stakers.find((staker) => staker.account.member.id === memberId)?.stakedAmount ?? 0)
      return {
        endDate: <DateBlockCell date={new Date(convertBlockToMsTimestamp(row.endsAtBlock) ?? 0)} />,
        participants: (
          <Text variant="t100" as="span">
            {row.stakers.length}/x
            <Text variant="t100" as="p" color="colorText">
              (x%)
            </Text>
          </Text>
        ),
        total: <TokenAmount tokenAmount={row.claimed} />,
        userClaimed: <TokenAmount tokenAmount={memberStake} />,
        holdersClaimed: <TokenAmount tokenAmount={row.claimed - memberStake} />,
        unclaimed: 'N/A',
      }
    })
  }, [convertBlockToMsTimestamp, data, memberId])

  return <StyledTable columns={COLUMNS} data={mappedData} />
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
