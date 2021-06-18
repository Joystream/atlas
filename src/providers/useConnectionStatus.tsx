import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useSnackbar } from '@/providers/useSnackbar'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

const ConnectionStatusContext = React.createContext<undefined | ConnectionStatusValue>(undefined)
ConnectionStatusContext.displayName = 'ConnectionStatusContext'

type ConnectionStatusValue = {
  setNodeConnection: (connection: ConnectionStatus) => void
  nodeConnectionStatus: ConnectionStatus
  isUserConnectedToInternet: boolean
}

const SNACKBAR_TIMEOUT = 15000

export const ConnectionStatusProvider: React.FC = ({ children }) => {
  const [nodeConnectionStatus, setNodeConnection] = useState<ConnectionStatus>('connecting')
  const [isUserConnectedToInternet, setIsUserConnectedToInternet] = useState(true)
  const { displaySnackbar } = useSnackbar()

  const checkConnection = useCallback(async () => {
    try {
      const res = await withTimeout(
        fetch('https://www.google.com', {
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
  }, [])

  useEffect(() => {
    // ping google every five seconds to check if user is connected to internet
    const interval = setInterval(() => {
      checkConnection()
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [checkConnection])

  // setting initialMount ref to true to prevent displaying "Network connection restored" on entering Studio
  const isInitialMount = useRef(true)
  useEffect(() => {
    // without that condition snackbar will appear on entering the app
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      if (isUserConnectedToInternet) {
        displaySnackbar({ title: 'Network connection restored', iconType: 'success', timeout: SNACKBAR_TIMEOUT })
      } else {
        displaySnackbar({ title: 'Network connection lost', iconType: 'error', timeout: SNACKBAR_TIMEOUT })
      }
    }
  }, [displaySnackbar, isUserConnectedToInternet])

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

const withTimeout = async <T,>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('Timed out!')), timeout))
  return await Promise.race([timeoutPromise, promise])
}
