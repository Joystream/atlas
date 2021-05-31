import localForage from 'localforage'
import { persist } from 'mst-persist'
import { Instance, types } from 'mobx-state-tree'
import { mstLog } from 'mst-log'
import { UploadsManagerStore } from './UploadsManagerStore'
import { SnackbarContextValue } from '@/hooks'

export const RootStore = types.model('RootStore', {
  uploadsManagerStore: types.optional(UploadsManagerStore, {}),
  hooks: types.optional(
    types
      .model('hooks')
      .volatile((self) => {
        const snackbar: Partial<SnackbarContextValue> = {}
        return { snackbar }
      })
      .actions((self) => ({
        setHooks(hooks: { snackbar: SnackbarContextValue }) {
          self.snackbar = hooks.snackbar
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

// @ts-ignore for playing around with the console remove on prod
window.store = store
