import React, { useEffect, useMemo, useState } from 'react'

import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  isPlaceBidOpen: boolean
  setIsPlaceBidOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const PlaceBidContext = React.createContext<ContextValue | undefined>(undefined)
PlaceBidContext.displayName = 'PlaceBidContext'

export const PlaceBidProvider: React.FC = ({ children }) => {
  // TODO: default open for preview purposes
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(true)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    if (isPlaceBidOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount, incrementOverlaysOpenCount, isPlaceBidOpen])

  const value = useMemo(
    () => ({
      isPlaceBidOpen,
      setIsPlaceBidOpen,
    }),
    [isPlaceBidOpen]
  )

  return <PlaceBidContext.Provider value={value}>{children}</PlaceBidContext.Provider>
}
