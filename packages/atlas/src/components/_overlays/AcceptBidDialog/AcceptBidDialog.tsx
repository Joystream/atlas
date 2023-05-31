import BN from 'bn.js'
import { FC, useState } from 'react'

import { Fee } from '@/components/Fee'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useFee } from '@/providers/joystream'

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
  const { fullFee, loading } = useFee(
    'acceptNftBidTx',
    nftId && ownerId ? [ownerId, nftId, selectedBid?.bidderId || '', selectedBid?.amount.toString() || ''] : undefined
  )

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
      additionalActionsNode={<Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
    >
      <AcceptBidList items={bids} onSelect={(value) => setSelectedBid(value)} selectedBid={selectedBid} />
    </DialogModal>
  )
}
