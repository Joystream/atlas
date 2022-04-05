import React, { useState } from 'react'

import { DialogModal } from '@/components/_overlays/DialogModal'

import { Bid } from './AcceptBidDialog.types'
import { AcceptBidList } from './AcceptBidList'

type AcceptBidDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  bids: Bid[]
  onAcceptBid: (ownerId: string, videoId: string, bidderId: string, price: string) => void
  nftId: string | null
  ownerId?: string
}

type SelectedBidder = {
  id: string
  amount: string
}

export const AcceptBidDialog: React.FC<AcceptBidDialogProps> = ({
  onModalClose,
  isOpen,
  bids,
  onAcceptBid,
  nftId,
  ownerId,
}) => {
  const [selectedBidder, setSelectedBidder] = useState<SelectedBidder | undefined>()

  const handleModalClose = () => {
    setSelectedBidder(undefined)
    onModalClose()
  }

  const handleAcceptBid = () => {
    if (!selectedBidder || !nftId || !ownerId) {
      return
    }
    onAcceptBid(ownerId, nftId, selectedBidder.id, selectedBidder.amount)
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
        disabled: !selectedBidder,
        onClick: handleAcceptBid,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleModalClose,
      }}
    >
      <AcceptBidList items={bids} onSelect={(value) => setSelectedBidder(value)} selectedBidder={selectedBidder} />
    </DialogModal>
  )
}
