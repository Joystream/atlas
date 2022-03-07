import React, { useEffect, useMemo, useState } from 'react'

import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  isNftPurchaseOpen: boolean
  setIsNftPurchaseOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const NftPurchaseContext = React.createContext<ContextValue | undefined>(undefined)
NftPurchaseContext.displayName = 'NftPurchaseContext'

export const NftPurchaseProvider: React.FC = ({ children }) => {
  const [isNftPurchaseOpen, setIsNftPurchaseOpen] = useState(false)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    if (isNftPurchaseOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount, incrementOverlaysOpenCount, isNftPurchaseOpen])

  const value = useMemo(
    () => ({
      isNftPurchaseOpen,
      setIsNftPurchaseOpen,
    }),
    [isNftPurchaseOpen]
  )

  return <NftPurchaseContext.Provider value={value}>{children}</NftPurchaseContext.Provider>
}
