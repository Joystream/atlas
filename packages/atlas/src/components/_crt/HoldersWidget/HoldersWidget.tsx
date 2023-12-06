import styled from '@emotion/styled'
import { useState } from 'react'

import { BasicCreatorTokenHolderFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersTable, CrtHoldersTableProps } from '@/components/_crt/CrtHoldersTable/CrtHoldersTable'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar, sizes } from '@/styles'

export type HoldersWidgetProps = {
  ownerId: string
  holders: BasicCreatorTokenHolderFragment[]
  totalSupply: number
}

export const HoldersWidget = ({ holders: _holders, ownerId, totalSupply }: HoldersWidgetProps) => {
  const [showModal, setShowModal] = useState(false)

  const holders = _holders.map((holder) => ({
    memberId: ownerId,
    total: +holder.totalAmount,
    allocation: Math.round((+holder.totalAmount / totalSupply) * 100),
    vested: +(holder.vestingSchedules[0]?.totalVestingAmount ?? 0),
  }))

  return (
    <Box>
      <CrtHoldersTableModal
        data={holders}
        ownerId={ownerId}
        isLoading={false}
        show={showModal}
        onExitClick={() => setShowModal(false)}
      />
      <FlexBox alignItems="center" justifyContent="space-between">
        <Text variant="h500" as="span">
          Holders{' '}
          <Text variant="h500" as="span" color="colorText">
            ({holders.length})
          </Text>
        </Text>
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right" onClick={() => setShowModal(true)}>
          Show all holders
        </TextButton>
      </FlexBox>
      <CrtHoldersTable data={holders} ownerId={ownerId} isLoading={false} />
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

const CrtHoldersTableModal = ({ data, onExitClick, show }: CrtHoldersTableModalProps) => {
  return (
    <DialogModal onExitClick={onExitClick} show={show} noContentPadding title="Holders">
      <StyledHoldersTable data={data} isLoading={false} />
    </DialogModal>
  )
}
