import { store } from '@/models/RootStore'
import { Instance } from 'mobx-state-tree'
import React, { createContext, useContext } from 'react'

const StoreContext = createContext<Instance<typeof store>>(store)
StoreContext.displayName = 'StoreContext'

export const StoreProvider: React.FC = ({ children }) => {
  return <StoreContext.Provider value={{ ...store }}>{children}</StoreContext.Provider>
}

export const useMST = () => {
  const ctx = useContext(StoreContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
