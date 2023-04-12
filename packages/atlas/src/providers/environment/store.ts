import { createStore } from '@/utils/store'

const LOCAL_STORAGE_KEY = 'environment'

export type EnvironmentState = {
  targetDevEnv: string
  nodeOverride: string | null
}

const INITIAL_STATE: EnvironmentState = {
  targetDevEnv: 'next',
  nodeOverride: null,
}

export type EnvironmentStoreActions = {
  setTargetDevEnv: (env: string) => void
  setNodeOverride: (node: string | null) => void
}

export const useEnvironmentStore = createStore<EnvironmentState, EnvironmentStoreActions>(
  {
    state: INITIAL_STATE,
    actionsFactory: (set) => ({
      setNodeOverride: (node) => {
        set((state) => {
          state.nodeOverride = node
        })
      },
      setTargetDevEnv: (env) => {
        set((state) => {
          state.targetDevEnv = env
        })
      },
    }),
  },
  {
    persist: {
      key: LOCAL_STORAGE_KEY,
      version: 0,
      whitelist: ['nodeOverride', 'targetDevEnv'],
      migrate: () => null,
    },
  }
)
