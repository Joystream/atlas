import styled from '@emotion/styled'
import { useMemo } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Member', accessor: 'member' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'Vested', accessor: 'vested' },
]

type CrtHolder = {
  memberId: string
  total: number
  vested: number
}

export type CrtHoldersTableProps = {
  data: CrtHolder[]
  isLoading: boolean
}

export const CrtHoldersTable = ({ isLoading, data }: CrtHoldersTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        member: <MemberRow memberId={row.memberId} />,
        total: (
          <RightAlignedCell>
            <FlexBox alignItems="center" gap={1}>
              <NumberFormat format="short" value={row.vested} as="p" variant="t200-strong" />
              <Text variant="t200-strong" as="p" color="colorText">
                (20%)
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
    [data]
  )

  if (isLoading) {
    return null
  }

  return <StyledTable columns={COLUMNS} data={mappedData} />
}

const MemberRow = ({ memberId }: { memberId: string }) => {
  const { loading, memberships } = useMemberships({
    where: {
      id_eq: memberId,
    },
  })

  if (loading) {
    return (
      <FlexBox alignItems="center" gap={2}>
        <SkeletonLoader rounded width={32} height={32} />
        <SkeletonLoader height={16} width="40%" />
      </FlexBox>
    )
  }

  const member = memberships?.[0]
  const { urls, isLoadingAsset } = getMemberAvatar(member)

  return (
    <FlexBox alignItems="center" gap={2}>
      <Avatar loading={isLoadingAsset} assetUrls={urls} />
      <Text variant="t200-strong" as="p" color="colorText">
        {member?.handle ?? 'Unknown'}
      </Text>
    </FlexBox>
  )
}

export const StyledTable = styled(Table)`
  th:nth-child(n + 3),
  th:nth-child(n + 2) {
    justify-content: end;
  }

  th:nth-child(n + 3),
  th:nth-child(n + 2) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`

export const RightAlignedCell = styled.div`
  margin-left: auto;
`
