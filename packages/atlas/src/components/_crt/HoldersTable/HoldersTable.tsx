import styled from '@emotion/styled'
import { useMemo } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { MemberCell } from '@/components/Table/Table.cells'

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
        member: (
          <MemberCell
            member={row.member}
            additionalNode={row.member.id === currentMemberId ? <Pill label="You" /> : null}
          />
        ),
        transferable: <NumberFormat value={row.transferable} as="p" withToken customTicker="$JBC" />,
        vested: <NumberFormat value={row.vested} as="p" withToken customTicker="$JBC" />,
        total: <NumberFormat value={row.total} as="p" withToken customTicker="$JBC" />,
        allocation: <NumberFormat value={row.allocation} as="p" format="short" withToken customTicker="%" />,
      })),
    [currentMemberId, data]
  )
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
