import { TARGET_DEV_ENV, availableEnvs } from '@/config/envs'
import { createStore } from '@/store'

const LOCAL_STORAGE_KEY = 'environment'
const env: 'development' | 'production' | 'mocking' = availableEnvs().includes(TARGET_DEV_ENV) ? TARGET_DEV_ENV : null

const DEFAULT_NODE = {
  development: 'wss://sumer-dev-2.joystream.app/rpc',
  production: 'wss://rome-rpc-endpoint.joystream.org:9944',
  mocking: 'ws://127.0.0.1:9944',
}

export type EnvironmentState = {
  selectedNode: string
  targetEnv: string
}

const INITIAL_STATE: EnvironmentState = {
  selectedNode: DEFAULT_NODE[env],
  targetEnv: env,
}

export type EnvironmentStoreActions = {
  setSelectedNode: (node: string) => void
  setTargetEnv: (env: string) => void
}

export const useEnvironmentStore = createStore<EnvironmentState, EnvironmentStoreActions>(
  {
    state: INITIAL_STATE,
    actionsFactory: (set) => ({
      setSelectedNode: (node) => {
        set((state) => {
          state.selectedNode = node || state.selectedNode
        })
      },
      setTargetEnv: (env) => {
        set((state) => {
          state.targetEnv = env || state.targetEnv
        })
      },
    }),
  },
  {
    persist: {
      key: LOCAL_STORAGE_KEY,
      version: 0,
      whitelist: ['selectedNode', 'targetEnv'],
      migrate: () => null,
    },
  }
)
