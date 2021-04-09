import React, { useContext, useEffect, useState } from 'react'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

const ConnectionStatusContext = React.createContext<undefined | ConnectionStatusValue>(undefined)
ConnectionStatusContext.displayName = 'ConnectionStatusContext'

type ConnectionStatusValue = {
  setNodeConnection: (connection: ConnectionStatus) => void
  nodeConnectionStatus: ConnectionStatus
  isUserConnectedToInternet: boolean
}

const withTimeout = async <T,>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('Timed out!')), timeout))
  return await Promise.race([timeoutPromise, promise])
}

export const ConnectionStatusProvider: React.FC = ({ children }) => {
  const [nodeConnectionStatus, setNodeConnection] = useState<ConnectionStatus>('connecting')
  const [isUserConnectedToInternet, setIsUserConnectedToInternet] = useState(true)

  useEffect(() => {
    // ping google every three seconds to check if user is connected to internet
    const interval = setInterval(() => {
      checkConnection()
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const checkConnection = async () => {
    try {
      const res = await withTimeout(
        fetch('https://google.com', {
          method: 'HEAD',
          mode: 'no-cors',
        }),
        4000
      )
      if (res) {
        setIsUserConnectedToInternet(true)
      }
    } catch (error) {
      setIsUserConnectedToInternet(false)
    }
  }

  return (
    <ConnectionStatusContext.Provider
      value={{
        nodeConnectionStatus,
        setNodeConnection,
        isUserConnectedToInternet,
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
