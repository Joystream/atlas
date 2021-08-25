import React from 'react'

import { EnvironmentState, EnvironmentStoreActions, useEnvironmentStore } from './store'

type EnvironmentContextValue = EnvironmentStoreActions & EnvironmentState

const EnvironmentContext = React.createContext<undefined | EnvironmentContextValue>(undefined)
EnvironmentContext.displayName = 'EnvironmentContext'

export const useTargetEnv = () => {
  const { setTargetEnv, targetEnv } = useEnvironmentStore((state) => ({
    ...state.actions,
    ...state,
  }))
  return { setTargetEnv, targetEnv }
}

export const useNode = () => {
  const { setSelectedNode, selectedNode } = useEnvironmentStore((state) => ({
    ...state.actions,
    ...state,
  }))
  return { setSelectedNode, selectedNode }
}
