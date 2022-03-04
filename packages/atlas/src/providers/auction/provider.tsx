import React, { useEffect, useMemo, useState } from 'react'

import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  isAuctionOpen: boolean
  setAuctionOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuctionContext = React.createContext<ContextValue | undefined>(undefined)
AuctionContext.displayName = 'AuctionContext'

export const AuctionProvider: React.FC = ({ children }) => {
  const [isAuctionOpen, setAuctionOpen] = useState(false)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    if (isAuctionOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount, incrementOverlaysOpenCount, isAuctionOpen])

  const value = useMemo(
    () => ({
      isAuctionOpen,
      setAuctionOpen,
    }),
    [isAuctionOpen]
  )

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}
