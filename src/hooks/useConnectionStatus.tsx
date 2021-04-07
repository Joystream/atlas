import React, { useContext, useEffect, useState } from 'react'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

const ConnectionStatusContext = React.createContext<undefined | ConnectionStatusValue>(undefined)
ConnectionStatusContext.displayName = 'ConnectionStatusContext'

type ConnectionStatusValue = {
  setNodeConnection: (connection: ConnectionStatus) => void
  nodeConnectionStatus: ConnectionStatus
  isUserConnectedToInternet: boolean
}

export const ConnectionStatusProvider: React.FC = ({ children }) => {
  const [nodeConnectionStatus, setNodeConnection] = useState<ConnectionStatus>('connecting')
  const [navigatorOnline, setNavigatorOnline] = useState(true)
  const [isUserConnectedToInternet, setIsUserConnectedToInternet] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout
    const connectionHandler = () => {
      setNavigatorOnline(window.navigator.onLine)
    }

    window.addEventListener('offline', connectionHandler)
    window.addEventListener('online', connectionHandler)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      window.removeEventListener('offline', connectionHandler)
      window.removeEventListener('online', connectionHandler)
    }
  }, [])

  useEffect(() => {
    if (!navigatorOnline) {
      return
    }
    // when navigator.online ping google every three seconds to check if user is connected to internet
    const interval = setInterval(() => {
      checkConnection()
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [navigatorOnline])

  useEffect(() => {
    if (navigatorOnline) {
      return
    }
    const timeout = setTimeout(() => {
      setIsUserConnectedToInternet(false)
    }, 3000)
    return () => {
      clearInterval(timeout)
    }
  }, [navigatorOnline])

  const checkConnection = async () => {
    try {
      const res = await fetch('https://google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      })
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
