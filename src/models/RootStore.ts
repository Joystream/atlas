import localForage from 'localforage'
import { persist } from 'mst-persist'
import { types } from 'mobx-state-tree'
import { mstLog } from 'mst-log'
import { UploadsManagerStore } from './UploadsManagerStore'

export const RootStore = types.model('RootStore', {
  uploadsManagerStore: types.optional(UploadsManagerStore, {}),
})

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
