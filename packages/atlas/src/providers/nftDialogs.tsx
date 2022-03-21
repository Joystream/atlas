import React, { useContext, useState } from 'react'

import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'

type Dialogs = 'accept-bid' | 'change-price' | 'sign-in'

type ContextValue = {
  setOpenedDialog: React.Dispatch<React.SetStateAction<Dialogs | undefined>>
}

export const NftDialogsContext = React.createContext<ContextValue | undefined>(undefined)
NftDialogsContext.displayName = 'NftDialogsContext'

export const NftDialogsProvider: React.FC = ({ children }) => {
  const [openedDialog, setOpenedDialog] = useState<Dialogs>()

  const handleDialogClose = () => {
    setOpenedDialog(undefined)
  }

  return (
    <NftDialogsContext.Provider value={{ setOpenedDialog }}>
      <AcceptBidDialog isOpen={openedDialog === 'accept-bid'} onModalClose={handleDialogClose} />
      {children}
    </NftDialogsContext.Provider>
  )
}

export const useNftDialog = () => {
  const ctx = useContext(NftDialogsContext)
  if (ctx === undefined) {
    throw new Error('useNftDialog must be used within a NftDialogsProvider')
  }

  return ctx
}
