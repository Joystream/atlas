import { Draft, enableMapSet, produce } from 'immer'
import create, { GetState, State, StateCreator, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'

import { SentryLogger } from '@/utils/logs'

export type CommonStore<TState, TActions> = {
  actions: TActions
} & TState

type CommonStoreInit<TState extends object, TActions extends object> = {
  state: TState
  actionsFactory: (
    set: (fn: (state: Draft<CommonStore<TState, TActions>>) => void) => void,
    get: GetState<CommonStore<TState, TActions>>,
    api: StoreApi<CommonStore<TState, TActions>>
  ) => TActions
}

type CommonStorePersistOpts<TState> = {
  key: string
  whitelist: (keyof TState)[]
  // version of persisted data, for compatibility purposes, should start at 1
  version: number
  // we can't really know what the previous value is, may be different than the current TState
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrate: (oldState: any, oldVersion: number, storageValue: any) => any // TODO: provide better return value
  onRehydrateStorage?: (state: TState) => void
}

type CommonStoreOpts<TState extends object> = {
  persist?: CommonStorePersistOpts<TState>
}

// enable immer support for Map and Set
enableMapSet()
const immer =
  <T extends State>(config: StateCreator<T, (fn: (state: Draft<T>) => void) => void>): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

export const createStore = <TState extends object, TActions extends object>(
  initialStore: CommonStoreInit<TState, TActions>,
  opts: CommonStoreOpts<TState> = {}
) => {
  let storeConfig = immer<CommonStore<TState, TActions>>((set, get, api) => ({
    ...initialStore.state,
    actions: initialStore.actionsFactory(set, get, api),
  }))

  if (opts.persist) {
    const config = opts.persist
    storeConfig = persist(storeConfig, {
      name: config.key,
      whitelist: config.whitelist,
      version: config.version,
      migrate: (oldState, oldVersion) => {
        const rawStorageValue = window.localStorage.getItem(config.key)
        const storageValue = rawStorageValue ? JSON.parse(rawStorageValue) : {}
        try {
          return config.migrate(oldState, oldVersion, storageValue) as CommonStore<TState, TActions>
        } catch (e) {
          SentryLogger.error(`Failed to migrate store "${config.key}"`, 'createStore', e)
          return {} as CommonStore<TState, TActions>
        }
      },
      onRehydrateStorage: (state) => {
        return config.onRehydrateStorage?.(state)
      },
    })
  }

  return create(storeConfig)
}
