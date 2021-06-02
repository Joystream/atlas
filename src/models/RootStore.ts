import localForage from 'localforage'
import { persist } from 'mst-persist'
import { Instance, types } from 'mobx-state-tree'
import { mstLog } from 'mst-log'
import { UploadsManagerStore } from './UploadsManagerStore'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NavigateFunction } from 'react-router'
import { SnackbarStore } from './SnackbarStore'

export const RootStore = types.model('RootStore', {
  uploadsManagerStore: types.optional(UploadsManagerStore, {}),
  snackbarStore: types.optional(SnackbarStore, {}),
  // provitional store to pass down things that as of now live only in hooks
  hooks: types.optional(
    types
      .model('hooks')
      .volatile((self) => {
        const client: Partial<ApolloClient<NormalizedCacheObject>> = {}
        const navigate: NavigateFunction = () => ({})
        return { client, navigate }
      })
      .actions((self) => ({
        setHooks(hooks: { client: ApolloClient<NormalizedCacheObject>; navigate: NavigateFunction }) {
          self.client = hooks.client
          self.navigate = hooks.navigate
        },
      })),
    {}
  ),
})

export type RootStoreIntance = Instance<typeof RootStore>

export const store = RootStore.create(
  {},
  {
    alert: (m: string) => console.log(m),
  }
)

// will print all actions on the console
// addMiddleware(store, mstLog())

// Save stores in local storage and also rehydrates them
persist('store', store, {
  storage: localForage,
  jsonify: false,
  whitelist: ['uploadsManagerStore'],
}).then(() => console.log('store has been hydrated'))

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore for playing around with the console on development
  window.store = store
}
