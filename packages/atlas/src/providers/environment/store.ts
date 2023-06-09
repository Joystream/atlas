import { getEnvName } from '@/utils/envVariables'
import { createStore } from '@/utils/store'

const LOCAL_STORAGE_KEY = 'environment'

export type EnvironmentState = {
  defaultDataEnv: string
  nodeOverride: string | null
}

export const ENV_PREFIX = 'VITE'

const INITIAL_STATE: EnvironmentState = {
  defaultDataEnv: import.meta.env[getEnvName('DEFAULT_DATA_ENV')] || import.meta.env[getEnvName('ENV')] || 'production',
  nodeOverride: null,
}

export type EnvironmentStoreActions = {
  setDefaultDataEnv: (env: string) => void
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
      setDefaultDataEnv: (env) => {
        set((state) => {
          state.defaultDataEnv = env
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
      whitelist: ['nodeOverride', 'defaultDataEnv'],
      migrate: () => null,
    },
  }
)
