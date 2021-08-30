import { createStore } from '@/store'

const LOCAL_STORAGE_KEY = 'environment'

export type EnvironmentState = {
  selectedNode: string | null
  targetEnv: string
}

const INITIAL_STATE: EnvironmentState = {
  targetEnv: 'development',
  selectedNode: null,
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
