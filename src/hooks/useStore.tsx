import { store } from '@/models/RootStore'
import { Instance } from 'mobx-state-tree'
import React, { useEffect, createContext, useContext } from 'react'
import { useSnackbar } from '.'

const StoreContext = createContext<Instance<typeof store>>(store)
StoreContext.displayName = 'StoreContext'

export const StoreProvider: React.FC = ({ children }) => {
  const { displaySnackbar, updateSnackbar, closeSnackbar, snackbars } = useSnackbar()
  useEffect(() => {
    store.hooks.setHooks({ snackbar: { displaySnackbar, updateSnackbar, closeSnackbar, snackbars } })
  }, [closeSnackbar, displaySnackbar, snackbars, updateSnackbar])

  return <StoreContext.Provider value={{ ...store }}>{children}</StoreContext.Provider>
}

export const useMST = () => {
  const ctx = useContext(StoreContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
