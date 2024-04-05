import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { LoadingMemberRow } from '@/components/Table/Table.cells'
import { ColumnBox } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { TransferableBalance } from '@/components/_crt/CrtPortfolioTable'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  member: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="60%" />
    </ColumnBox>
  ),
  total: <SkeletonLoader height={20} width="70%" />,
  vested: <SkeletonLoader height={20} width="100%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Member', accessor: 'member', width: 4 },
  { Header: 'Total', accessor: 'total', width: 2 },
  { Header: 'Unlocked', accessor: 'transferable', width: 3 },
]

type CrtHolder = {
  memberId: string
  total: number | BN
  tokenSymbol: string
  tokenId: string
  allocation: number
}

export type CrtHoldersTableProps = {
  data: CrtHolder[]
  isLoading: boolean
  className?: string
  ownerId?: string
} & Pick<TableProps, 'pagination' | 'pageSize'>

export const CrtHoldersTable = ({
  isLoading,
  data,
  className,
  ownerId,
  pagination,
  pageSize,
}: CrtHoldersTableProps) => {
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
          <FlexBox width="auto" alignItems="center" gap={1}>
            <NumberFormat format="short" value={row.total} as="p" variant="t200" />
            <Text variant="t200" as="span" color="colorText">
              ({row.allocation}%)
            </Text>
          </FlexBox>
        ),
        transferable: (
          <StyledTransferableBalance
            variant="t200"
            memberId={row.memberId}
            tokenId={row.tokenId}
            ticker={`${row.tokenSymbol}`}
          />
        ),
      })),
    [data, ownerId]
  )

  return (
    <StyledTable
      onRowClick={(rowIdx) => {
        navigate(absoluteRoutes.viewer.memberById(data[rowIdx].memberId))
      }}
      minWidth={350}
      columns={COLUMNS}
      data={isLoading ? tableLoadingData : mappedData}
      className={className}
      pagination={pagination}
      pageSize={pageSize}
    />
  )
}

const StyledTransferableBalance = styled(TransferableBalance)`
  text-align: right;
  white-space: nowrap;
`

export const StyledTable = styled(Table)`
  tr {
    cursor: pointer;
  }

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

export const RightAlignedCell = styled.div`
  margin-left: auto;
`
