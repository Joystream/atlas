import { MainStore, store } from '@/models/MainStore'
import { Instance } from 'mobx-state-tree'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

type ContextValue =
  | {
      store: Instance<typeof MainStore>
    }
  | undefined

const StoreContext = createContext<ContextValue>(undefined)
StoreContext.displayName = 'StoreContext'

export const StoreProvider: React.FC = ({ children }) => {
  return <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
}

const useStore = () => {
  const ctx = useContext(StoreContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
