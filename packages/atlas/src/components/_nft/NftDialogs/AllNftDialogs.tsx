import React from 'react'

import { AcceptBidDialog } from './AcceptBidDialog'

type AllDialogsProps = {
  openedDialog?: 'accept-bid'
  onModalClose: () => void
}

export const AllNftDialogs: React.FC<AllDialogsProps> = ({ openedDialog, onModalClose }) => {
  return <AcceptBidDialog isOpen={openedDialog === 'accept-bid'} onModalClose={onModalClose} />
}
