import React, { useCallback, useEffect, useState } from 'react'
import { Account, JoystreamJs } from '@/joystream-lib'
import { useActiveUser } from '@/hooks'

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

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [extensionConnected, setExtensionConnected] = useState(false)

  const handleAccountsUpdate = useCallback((accounts: Account[]) => {
    setAccounts(accounts)
  }, [])

  const handleExtensionConnectedUpdate = useCallback((connected: boolean) => {
    setExtensionConnected(connected)
  }, [])

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        joystream = await JoystreamJs.build(APP_NAME, NODE_URL)
        setJoystream(joystream)
        setAccounts(joystream.accounts)

        joystream.onAccountsUpdate = handleAccountsUpdate
        joystream.onExtensionConnectedUpdate = handleExtensionConnectedUpdate
      } catch (e) {
        console.error('Failed to create JoystreamJs instance', e)
      }
    }

    init()

    return () => {
      joystream?.destroy()
    }
  }, [handleAccountsUpdate, handleExtensionConnectedUpdate])

  useEffect(() => {
    if (!joystream || !activeUser) {
      return
    }

    if (joystream.selectedAccountId === activeUser.accountId) {
      return
    }

    joystream.setAccount(activeUser.accountId)
  }, [joystream, activeUser])

  return (
    <JoystreamContext.Provider value={{ accounts, joystream, extensionConnected }}>
      {children}
    </JoystreamContext.Provider>
  )
}
