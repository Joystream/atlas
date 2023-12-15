import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'

import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { formatNumberShort } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersTable, CrtHoldersTableProps } from '@/components/_crt/CrtHoldersTable/CrtHoldersTable'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useHoldersPagination } from '@/hooks/useHoldersPagination'
import { cVar, sizes } from '@/styles'

export type HoldersWidgetProps = {
  ownerId: string
  tokenId: string
  totalSupply: number
  totalHolders: number
}

const TILES_PER_PAGE = 5

export const HoldersWidget = ({ tokenId, ownerId, totalSupply, totalHolders }: HoldersWidgetProps) => {
  const [showModal, setShowModal] = useState(false)
  const {
    holders: _holders,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
  } = useHoldersPagination(tokenId, { pageSize: TILES_PER_PAGE })

  const holders = useMemo(
    () =>
      _holders?.map((holder) => ({
        memberId: holder?.member?.id ?? '',
        total: +holder.totalAmount,
        allocation: +formatNumberShort((+holder.totalAmount / totalSupply) * 100),
        vested: +(holder.vestingSchedules[0]?.totalVestingAmount ?? 0),
      })) ?? [],
    [_holders, totalSupply]
  )
  const [firstPageHolders, setFirstPageHolders] = useState<typeof holders>([])

  useEffect(() => {
    if (currentPage === 0 && holders.length && !firstPageHolders.length) {
      setFirstPageHolders(holders)
    }
  }, [currentPage, firstPageHolders.length, holders])

  return (
    <Box>
      <CrtHoldersTableModal
        data={holders}
        ownerId={ownerId}
        isLoading={isLoading}
        show={showModal}
        onExitClick={() => setShowModal(false)}
        pagination={{
          totalCount,
          itemsPerPage: TILES_PER_PAGE,
          page: currentPage,
          onChangePage: setCurrentPage,
        }}
      />
      <FlexBox alignItems="center" justifyContent="space-between">
        <Text variant="h500" as="span">
          Holders{' '}
          <Text variant="h500" as="span" color="colorText">
            ({totalHolders})
          </Text>
        </Text>
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right" onClick={() => setShowModal(true)}>
          Show all holders
        </TextButton>
      </FlexBox>
      <CrtHoldersTable
        pageSize={5}
        data={firstPageHolders}
        ownerId={ownerId}
        isLoading={isLoading && !firstPageHolders.length}
      />
    </Box>
  )
}

const Box = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};

  > *:nth-child(1) {
    padding: ${sizes(6)};
  }
`

const StyledHoldersTable = styled(CrtHoldersTable)`
  margin-top: ${sizes(6)};
  background-color: transparent;

  .table-header {
    background-color: #343d44;
  }
`

type CrtHoldersTableModalProps = {
  show: boolean
  onExitClick: () => void
} & CrtHoldersTableProps

const CrtHoldersTableModal = ({ data, onExitClick, show, pagination, isLoading }: CrtHoldersTableModalProps) => {
  return (
    <DialogModal onExitClick={onExitClick} show={show} noContentPadding title="Holders">
      <StyledHoldersTable data={data} isLoading={isLoading} pagination={pagination} />
    </DialogModal>
  )
}
