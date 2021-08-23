import React, { useContext } from 'react'

import { EnvironmentState, EnvironmentStoreActions, useEnvironmentStore } from './store'

type EnvironmentContextValue = EnvironmentStoreActions & EnvironmentState

const EnvironmentContext = React.createContext<undefined | EnvironmentContextValue>(undefined)
EnvironmentContext.displayName = 'EnvironmentContext'

export const EnvironmentProvider: React.FC = ({ children }) => {
  const { setSelectedNode, selectedNode, setTargetEnv, targetEnv } = useEnvironmentStore((state) => ({
    ...state.actions,
    ...state,
  }))

  const contextValue: EnvironmentContextValue = {
    selectedNode,
    setSelectedNode,
    setTargetEnv,
    targetEnv,
  }

  return <EnvironmentContext.Provider value={contextValue}>{children}</EnvironmentContext.Provider>
}

const useEnvironmentContext = () => {
  const ctx = useContext(EnvironmentContext)
  if (ctx === undefined) {
    throw new Error('useEnvironmentContext must be used within a EnvironmentProvider')
  }
  return ctx
}

export const useTargetEnv = () => {
  const { setTargetEnv, targetEnv } = useEnvironmentContext()
  return { setTargetEnv, targetEnv }
}

export const useNode = () => {
  const { setSelectedNode, selectedNode } = useEnvironmentContext()
  return { setSelectedNode, selectedNode }
}
