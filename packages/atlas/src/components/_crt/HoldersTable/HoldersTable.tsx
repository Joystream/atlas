import styled from '@emotion/styled'
import { useMemo } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Member', accessor: 'member' },
  { Header: 'Transferable', accessor: 'transferable' },
  { Header: 'Vested', accessor: 'vested' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'Allocation', accessor: 'allocation' },
]

export type HoldersTableProps = {
  data: {
    member: BasicMembershipFieldsFragment
    transferable: number
    vested: number
    total: number
    allocation: number
  }[]
  isLoading: boolean
  currentMemberId: string
}

export const HoldersTable = ({ data, currentMemberId }: HoldersTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        member: <MemberCell member={row.member} isCurrentMember={row.member.id === currentMemberId} />,
        transferable: <NumberFormat value={row.transferable} as="p" withToken customTicker="$JBC" />,
        vested: <NumberFormat value={row.vested} as="p" withToken customTicker="$JBC" />,
        total: <NumberFormat value={row.total} as="p" withToken customTicker="$JBC" />,
        allocation: <NumberFormat value={row.allocation} as="p" format="short" withToken customTicker="%" />,
      })),
    [currentMemberId, data]
  )
  return <StyledTable columns={COLUMNS} data={mappedData} />
}

const MemberCell = ({
  member,
  isCurrentMember,
}: {
  member: BasicMembershipFieldsFragment
  isCurrentMember: boolean
}) => {
  const { urls } = getMemberAvatar(member)
  return (
    <FlexBox alignItems="center" gap={2}>
      <Avatar assetUrls={urls} />
      <Text variant="t100" as="p">
        {member.handle ?? 'Unknown'}
      </Text>
      {isCurrentMember && <Pill label="You" />}
    </FlexBox>
  )
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
