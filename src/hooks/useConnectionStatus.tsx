import React, { useCallback, useContext, useEffect, useState } from 'react'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'no-internet'

const ConnectionStatusContext = React.createContext<undefined | ConnectionStatusValue>(undefined)
ConnectionStatusContext.displayName = 'ConnectionStatusContext'

type ConnectionStatusValue = {
  setConnectionStatus: (connection: ConnectionStatus) => void
  connectionStatus: ConnectionStatus
}

export const ConnectionStatusProvider: React.FC = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    const connectionHandler = () => {
      setConnectionStatus(window.navigator.onLine ? 'connecting' : 'no-internet')
    }
    window.addEventListener('offline', connectionHandler)
    window.addEventListener('online', connectionHandler)

    return () => {
      window.removeEventListener('offline', connectionHandler)
      window.removeEventListener('online', connectionHandler)
    }
  }, [])

  const setNodeConnection = useCallback(
    (connection: ConnectionStatus) => {
      if (connectionStatus !== 'no-internet') {
        setConnectionStatus(connection)
      }
    },
    [connectionStatus]
  )

  return (
    <ConnectionStatusContext.Provider
      value={{
        connectionStatus,
        setConnectionStatus: setNodeConnection,
      }}
    >
      {children}
    </ConnectionStatusContext.Provider>
  )
}

export const useConnectionStatus = () => {
  const ctx = useContext(ConnectionStatusContext)
  if (ctx === undefined) {
    throw new Error('useConnectionStatus must be used within a ConnectionStatusProvider')
  }
  return ctx
}

export default useConnectionStatus
