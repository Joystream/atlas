import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'
import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null

  setCurrentAction: React.Dispatch<React.SetStateAction<NftAction | null>>
  setCurrentNftId: React.Dispatch<React.SetStateAction<string | null>>
  closeNftAction: () => void
}

export const NftActionsContext = React.createContext<ContextValue | undefined>(undefined)
NftActionsContext.displayName = 'NftActionsContext'

type NftAction = 'putOnSale' | 'purchase' | 'settle' | 'accept-bid' | 'change-price'

export const NftActionsProvider: React.FC = ({ children }) => {
  const [currentAction, setCurrentAction] = useState<NftAction | null>(null)
  const [currentNftId, setCurrentNftId] = useState<string | null>(null)

  // TODO: remove following code once NftPurchaseView uses BottomDrawer
  // --START--
  const [cachedCurrentAction, setCachedCurrentAction] = useState<NftAction | null>(null)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    if (currentAction === cachedCurrentAction) {
      return
    }
    setCachedCurrentAction(currentAction)

    if (currentAction === 'purchase') {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [cachedCurrentAction, currentAction, decrementOverlaysOpenCount, incrementOverlaysOpenCount])
  // --END--

  const closeNftAction = useCallback(() => {
    setCurrentAction(null)
  }, [setCurrentAction])

  const value = useMemo(
    () => ({
      currentAction,
      currentNftId,
      setCurrentAction,
      setCurrentNftId,
      closeNftAction,
    }),
    [closeNftAction, currentAction, currentNftId]
  )

  return (
    <NftActionsContext.Provider value={value}>
      <AcceptBidDialog isOpen={currentAction === 'accept-bid'} onModalClose={closeNftAction} />
      {children}
    </NftActionsContext.Provider>
  )
}
