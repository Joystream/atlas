import { store } from '@/models/RootStore'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Instance } from 'mobx-state-tree'
import React, { useEffect, createContext, useContext } from 'react'
import { useSnackbar } from '.'
import { useNavigate } from 'react-router'

const StoreContext = createContext<Instance<typeof store>>(store)
StoreContext.displayName = 'StoreContext'

export const StoreProvider: React.FC<{ client: ApolloClient<NormalizedCacheObject> }> = ({ children, client }) => {
  const navigate = useNavigate()
  useEffect(() => {
    store.hooks.setHooks({ client, navigate })
  }, [client, navigate])

  return <StoreContext.Provider value={{ ...store }}>{children}</StoreContext.Provider>
}

export const useMST = () => {
  const ctx = useContext(StoreContext)
  if (ctx === undefined) {
    throw new Error('useMST must be used within a StoreProvider')
  }
  return ctx
}
