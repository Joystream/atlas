import React, { useEffect, useMemo, useState } from 'react'

import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null

  setCurrentAction: React.Dispatch<React.SetStateAction<NftAction | null>>
  setCurrentNftId: React.Dispatch<React.SetStateAction<string | null>>
}

export const NftActionsContext = React.createContext<ContextValue | undefined>(undefined)
NftActionsContext.displayName = 'NftActionsContext'

type NftAction = 'putOnSale' | 'purchase' | 'settle'

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

  const value = useMemo(
    () => ({
      currentAction,
      currentNftId,
      setCurrentAction,
      setCurrentNftId,
    }),
    [currentAction, currentNftId]
  )

  return <NftActionsContext.Provider value={value}>{children}</NftActionsContext.Provider>
}
