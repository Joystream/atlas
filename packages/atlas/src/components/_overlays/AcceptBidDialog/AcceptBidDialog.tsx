import React, { useState } from 'react'

import { DialogModal } from '@/components/_overlays/DialogModal'

import { Bid } from './AcceptBidDialog.types'
import { AcceptBidList } from './AcceptBidList'

type AcceptBidDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  bids: Bid[]
  onAcceptBid: (bidderId: string, id: string) => void
  nftId: string | null
}

export const AcceptBidDialog: React.FC<AcceptBidDialogProps> = ({ onModalClose, isOpen, bids, onAcceptBid, nftId }) => {
  const [selectedBidder, setSelectedBidder] = useState<string | undefined>()

  const handleModalClose = () => {
    setSelectedBidder(undefined)
    onModalClose()
  }

  const handleAcceptBid = () => {
    if (!selectedBidder || !nftId) {
      return
    }
    onAcceptBid(selectedBidder, nftId)
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
