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
  { Header: 'Member', accessor: 'member', width: 2 },
  { Header: 'Total', accessor: 'total', width: 1 },
  { Header: 'Vested', accessor: 'vested', width: 1 },
]

type CrtHolder = {
  memberId: string
  total: number
  vested: number
}

export type CrtHoldersTableProps = {
  data: CrtHolder[]
  isLoading: boolean
  className?: string
  ownerId?: string
}

export const CrtHoldersTable = ({ isLoading, data, className, ownerId }: CrtHoldersTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        member: <MemberRow memberId={row.memberId} isOwner={row.memberId === ownerId} />,
        total: (
          <RightAlignedCell>
            <FlexBox alignItems="center" gap={1}>
              <NumberFormat format="short" value={row.vested} as="p" variant="t200-strong" />
              <Text variant="t200" as="p" color="colorText">
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
    [data, ownerId]
  )

  if (isLoading) {
    return null
  }

  return <StyledTable columns={COLUMNS} data={mappedData} className={className} />
}

const MemberRow = ({ memberId, isOwner }: { memberId: string; isOwner: boolean }) => {
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
      <HandleContainer flow="column" gap={0}>
        <Text variant="t200-strong" as="p" color="colorText" truncate>
          {member?.handle ?? 'Unknown'}
        </Text>
        {isOwner && (
          <Text variant="t100" as="p" color="colorTextMuted">
            Creator
          </Text>
        )}
      </HandleContainer>
    </FlexBox>
  )
}

const HandleContainer = styled(FlexBox)`
  overflow: hidden;

  > * {
    width: 100%;
  }
`

export const StyledTable = styled(Table)`
  th:nth-child(n + 2),
  th:nth-child(n + 3) {
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
