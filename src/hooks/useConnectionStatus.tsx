import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useSnackbar } from '@/hooks/useSnackbar'

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
  const [showSnackbar, setShowSnackbar] = useState(false)
  const { displaySnackbar } = useSnackbar()

  const checkConnection = useCallback(async () => {
    try {
      const res = await withTimeout(
        fetch('https://google.com', {
          method: 'HEAD',
          mode: 'no-cors',
        }),
        4000
      )
      if (res) {
        setIsUserConnectedToInternet((previousState) => {
          if (previousState === false) {
            setShowSnackbar(true)
          }
          return true
        })
      }
    } catch (error) {
      setIsUserConnectedToInternet(false)
      displaySnackbar({ title: 'No network connection', iconType: 'error' })
    }
  }, [displaySnackbar])

  useEffect(() => {
    // ping google every three seconds to check if user is connected to internet
    const interval = setInterval(() => {
      checkConnection()
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [checkConnection])

  useEffect(() => {
    if (showSnackbar) {
      displaySnackbar({ title: 'Network connection restored', iconType: 'success' })
      setShowSnackbar(false)
    }
  }, [displaySnackbar, showSnackbar])

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
