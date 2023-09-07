import styled from '@emotion/styled'
import { useState } from 'react'

import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersTable, CrtHoldersTableProps } from '@/components/_crt/CrtHoldersTable/CrtHoldersTable'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar, sizes } from '@/styles'

export type HoldersWidgetProps = {
  tokenId: string
}

const getTokenHolders = (_: string) => {
  return {
    holders: [
      {
        memberId: '1',
        vested: 10000,
        total: 11000,
      },
      {
        memberId: '2',
        vested: 1000,
        total: 1000,
      },
      {
        memberId: '3',
        vested: 100,
        total: 110,
      },
    ],
    ownerId: '1',
  }
}

export const HoldersWidget = ({ tokenId }: HoldersWidgetProps) => {
  const [showModal, setShowModal] = useState(false)
  const { holders, ownerId } = getTokenHolders(tokenId)
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
