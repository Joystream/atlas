import React, { useCallback, useEffect, useRef } from 'react'

import { useSnackbar } from '@/providers/snackbars'
import { createStore } from '@/store'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

type ConnectionStatusStoreState = {
  nodeConnectionStatus: ConnectionStatus
  internetConnectionStatus: ConnectionStatus
}

type ConnectionStatusStoreActions = {
  setNodeConnection: (connection: ConnectionStatus) => void
  setInternetConnection: (connection: ConnectionStatus) => void
}

const SNACKBAR_TIMEOUT = 15000

export const useConnectionStatusStore = createStore<ConnectionStatusStoreState, ConnectionStatusStoreActions>({
  state: { internetConnectionStatus: 'connected', nodeConnectionStatus: 'connecting' },
  actionsFactory: (set) => ({
    setNodeConnection: (connection) => {
      set((state) => {
        state.nodeConnectionStatus = connection
      })
    },
    setInternetConnection: (connection) => {
      set((state) => {
        state.internetConnectionStatus = connection
      })
    },
  }),
})

export const ConnectionStatusManager: React.FC = () => {
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const setInternetConnection = useConnectionStatusStore((state) => state.actions.setInternetConnection)
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
        setInternetConnection('connected')
      }
    } catch (error) {
      setInternetConnection('disconnected')
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
      if (internetConnectionStatus === 'connected') {
        displaySnackbar({ title: 'Network connection restored', iconType: 'success', timeout: SNACKBAR_TIMEOUT })
      } else {
        displaySnackbar({ title: 'Network connection lost', iconType: 'error', timeout: SNACKBAR_TIMEOUT })
      }
    }
  }, [displaySnackbar, internetConnectionStatus])

  return null
}

const withTimeout = async <T,>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new Error('Timed out!')), timeout))
  return await Promise.race([timeoutPromise, promise])
}
