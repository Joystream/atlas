import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { LoadingMemberRow } from '@/components/Table/Table.cells'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Member', accessor: 'member', width: 2 },
  { Header: 'Total', accessor: 'total', width: 1 },
  { Header: 'Vested', accessor: 'vested', width: 1 },
]

type CrtHolder = {
  memberId: string
  total: number | BN
  vested: number | BN
  allocation: number
}

export type CrtHoldersTableProps = {
  data: CrtHolder[]
  isLoading: boolean
  className?: string
  ownerId?: string
}

export const CrtHoldersTable = ({ isLoading, data, className, ownerId }: CrtHoldersTableProps) => {
  const navigate = useNavigate()
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        member: (
          <LoadingMemberRow
            memberId={row.memberId}
            flow="column"
            additionalNode={
              row.memberId === ownerId ? (
                <Text variant="t100" as="p" color="colorTextMuted">
                  Creator
                </Text>
              ) : undefined
            }
          />
        ),
        total: (
          <RightAlignedCell>
            <FlexBox alignItems="center" gap={1}>
              <NumberFormat format="short" value={row.total} as="p" variant="t200-strong" />
              <Text variant="t200" as="p" color="colorText">
                ({row.allocation}%)
              </Text>
            </FlexBox>
          </RightAlignedCell>
        ),
        vested: (
          <RightAlignedCell>
            <NumberFormat format="short" value={row.vested} as="p" variant="t200-strong" />
          </RightAlignedCell>
        ),
      })),
    [data, ownerId]
  )

  if (isLoading) {
    return null
  }

  return (
    <StyledTable
      onRowClick={(rowIdx) => {
        navigate(absoluteRoutes.viewer.member(data[rowIdx].memberId))
      }}
      columns={COLUMNS}
      data={mappedData}
      className={className}
    />
  )
}

export const StyledTable = styled(Table)`
  tr {
    cursor: pointer;
  }

  th:nth-child(n + 2) {
    justify-content: end;
    align-items: end;

    > div {
      align-items: end;
    }
  }
`

export const RightAlignedCell = styled.div`
  margin-left: auto;
`
