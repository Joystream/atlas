import BN from 'bn.js'
import { FC, useState } from 'react'

import { DialogModal } from '@/components/_overlays/DialogModal'

import { Bid, SelectedBid } from './AcceptBidDialog.types'
import { AcceptBidList } from './AcceptBidList'

type AcceptBidDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  bids: Bid[]
  onAcceptBid: (ownerId: string, videoId: string, bidderId: string, price: BN) => void
  nftId: string | null
  ownerId?: string
}

export const AcceptBidDialog: FC<AcceptBidDialogProps> = ({
  onModalClose,
  isOpen,
  bids,
  onAcceptBid,
  nftId,
  ownerId,
}) => {
  const [selectedBid, setSelectedBid] = useState<SelectedBid | undefined>()

  const handleModalClose = () => {
    setSelectedBid(undefined)
    onModalClose()
  }

  const handleAcceptBid = () => {
    if (!selectedBid || !nftId || !ownerId) {
      return
    }
    onAcceptBid(ownerId, nftId, selectedBid.bidderId, selectedBid.amount)
    handleModalClose()
  }

  return (
    <DialogModal
      title="Accept bid"
      show={isOpen}
      dividers
      noContentPadding
      primaryButton={{
        text: 'Accept bid',
        disabled: !selectedBid,
        onClick: handleAcceptBid,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleModalClose,
      }}
    >
      <AcceptBidList items={bids} onSelect={(value) => setSelectedBid(value)} selectedBid={selectedBid} />
    </DialogModal>
  )
}
