import { createStore } from '@/utils/store'

const LOCAL_STORAGE_KEY = 'environment'

export type EnvironmentState = {
  targetDevEnv: string
  nodeOverride: string | null
}

const INITIAL_STATE: EnvironmentState = {
  targetDevEnv: 'production',
  nodeOverride: null,
}

export type EnvironmentStoreActions = {
  setTargetDevEnv: (env: string) => void
  setNodeOverride: (node: string | null) => void
  reset: () => void
  getInitialState: () => EnvironmentState
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
      reset: () => {
        set(() => INITIAL_STATE)
      },
      getInitialState: () => INITIAL_STATE,
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
