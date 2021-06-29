import React, { useCallback, useEffect, useRef } from 'react'
import create from 'zustand'

import { useSnackbar } from '@/providers/snackbars'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

type ConnectionStatusValue = {
  nodeConnectionStatus: ConnectionStatus
  isUserConnectedToInternet: boolean
  setNodeConnection: (connection: ConnectionStatus) => void
  setInternetConnection: (value: boolean) => void
}

const SNACKBAR_TIMEOUT = 15000

export const useConnectionStatusStore = create<ConnectionStatusValue>((set) => ({
  isUserConnectedToInternet: true,
  nodeConnectionStatus: 'connecting',
  setNodeConnection: (connection) => {
    set((state) => {
      state.nodeConnectionStatus = connection
    })
  },
  setInternetConnection: (value) => {
    set((state) => {
      state.isUserConnectedToInternet = value
    })
  },
}))

export const ConnectionStatusManager: React.FC = () => {
  const isUserConnectedToInternet = useConnectionStatusStore((state) => state.isUserConnectedToInternet)
  const setInternetConnection = useConnectionStatusStore((state) => state.setInternetConnection)
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
        setInternetConnection(true)
      }
    } catch (error) {
      setInternetConnection(false)
    }
  }, [setInternetConnection])

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

  return null
}

const withTimeout = async <T,>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('Timed out!')), timeout))
  return await Promise.race([timeoutPromise, promise])
}
