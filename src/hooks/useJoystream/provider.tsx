import React, { useCallback, useEffect, useState } from 'react'
import { Account, JoystreamJs } from '@/joystream-lib'
import { useActiveUser } from '@/hooks'
import useConnectionStatus from '../useConnectionStatus'

// TODO: provide via env variables
const NODE_URL = 'ws://127.0.0.1:9944'
const APP_NAME = 'Joystream Atlas'

type JoystreamContextValue = {
  joystream: JoystreamJs | null
  accounts: Account[]
  extensionConnected: boolean
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeUser } = useActiveUser()
  const { setNodeConnection } = useConnectionStatus()

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountsSet, setAccountsSet] = useState(false)
  const [extensionConnected, setExtensionConnected] = useState(false)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )

  const handleAccountsUpdate = useCallback((accounts: Account[]) => {
    setAccounts(accounts)
    setAccountsSet(true)
  }, [])

  const handleExtensionConnectedUpdate = useCallback((connected: boolean) => {
    setExtensionConnected(connected)
  }, [])

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamJs(NODE_URL, APP_NAME)
        setJoystream(joystream)

        setAccounts(joystream.accounts)
        joystream.onAccountsUpdate = handleAccountsUpdate
        joystream.onExtensionConnectedUpdate = handleExtensionConnectedUpdate
        joystream.onNodeConnectionUpdate = handleNodeConnectionUpdate
      } catch (e) {
        handleNodeConnectionUpdate(false)
        console.error('Failed to create JoystreamJs instance', e)
      }
    }

    init()

    return () => {
      joystream?.destroy()
    }
  }, [handleAccountsUpdate, handleExtensionConnectedUpdate, handleNodeConnectionUpdate, setNodeConnection])

  useEffect(() => {
    if (!joystream || !activeUser || !accountsSet) {
      return
    }

    if (joystream.selectedAccountId === activeUser.accountId) {
      return
    }

    joystream.setAccount(activeUser.accountId)
  }, [joystream, activeUser, accountsSet])

  return (
    <JoystreamContext.Provider value={{ accounts, joystream, extensionConnected }}>
      {children}
    </JoystreamContext.Provider>
  )
}
