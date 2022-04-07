import React, { useContext, useState } from 'react'

type ContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const BottomNavContext = React.createContext<ContextValue | undefined>(undefined)
BottomNavContext.displayName = 'BottomNavContext'

export const BottomNavProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  return <BottomNavContext.Provider value={{ open, setOpen }}>{children}</BottomNavContext.Provider>
}

export const useBottomNav = () => {
  const ctx = useContext(BottomNavContext)
  if (ctx === undefined) {
    throw new Error('useBottomNav must be used within BottomNavProvider')
  }
  return ctx
}
