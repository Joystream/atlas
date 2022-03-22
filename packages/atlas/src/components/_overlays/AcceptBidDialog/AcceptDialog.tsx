import React, { useState } from 'react'

import { DialogModal } from '@/components/_overlays/DialogModal'
import { useTokenPrice } from '@/providers/joystream'

import { AcceptBidList } from './AcceptBidList'

type AcceptBidDialogProps = {
  onModalClose: () => void
  isOpen: boolean
}

export const AcceptBidDialog: React.FC<AcceptBidDialogProps> = ({ onModalClose, isOpen }) => {
  const [selectedBid, setSelectedBid] = useState<string | undefined>()
  const { convertToUSD } = useTokenPrice()

  const handleModalClose = () => {
    setSelectedBid(undefined)
    onModalClose()
  }

  const ITEMS = [
    {
      id: '1',
      date: new Date(),
      bid: 50,
      bidUSD: convertToUSD(50),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '2',
      date: new Date(),
      bid: 100,
      bidUSD: convertToUSD(100),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '3',
      date: new Date(),
      bid: 200,
      bidUSD: convertToUSD(200),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '4',
      date: new Date(),
      bid: 300,
      bidUSD: convertToUSD(300),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '5',
      date: new Date(),
      bid: 400,
      bidUSD: convertToUSD(400),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '6',
      date: new Date(),
      bid: 500,
      bidUSD: convertToUSD(500),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '7',
      date: new Date(),
      bid: 600,
      bidUSD: convertToUSD(600),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '8',
      date: new Date(),
      bid: 700,
      bidUSD: convertToUSD(700),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '9',
      date: new Date(),
      bid: 800,
      bidUSD: convertToUSD(800),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
    {
      id: '10',
      date: new Date(),
      bid: 900,
      bidUSD: convertToUSD(900),
      memberAvatarUri: 'https://placedog.net/40/40?random',
      memberHandle: 'Madness',
    },
  ]

  return (
    <DialogModal
      title="Accept bid"
      show={isOpen}
      dividers
      noContentPadding
      primaryButton={{
        text: 'Accept bid',
        disabled: !selectedBid,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleModalClose,
      }}
    >
      <AcceptBidList items={ITEMS} onSelect={(value) => setSelectedBid(value)} selectedBid={selectedBid} />
    </DialogModal>
  )
}
