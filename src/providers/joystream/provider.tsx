import { web3FromAddress } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamJs } from '@/joystream-lib'
import { Logger } from '@/utils/logger'

import { useConnectionStatusStore, useUser } from '..'

type JoystreamContextValue = {
  joystream: JoystreamJs | null
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const setNodeConnection = useConnectionStatusStore((state) => state.setNodeConnection)
  const isUserConnectedToInternet = useConnectionStatusStore((state) => state.isUserConnectedToInternet)

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected && isUserConnectedToInternet ? 'connected' : 'disconnected')
    },
    [isUserConnectedToInternet, setNodeConnection]
  )

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamJs(NODE_URL)
        setJoystream(joystream)

        joystream.onNodeConnectionUpdate = handleNodeConnectionUpdate
      } catch (e) {
        handleNodeConnectionUpdate(false)
        Logger.error('Failed to create JoystreamJs instance', e)
      }
    }

    init()

    return () => {
      joystream?.destroy()
    }
  }, [handleNodeConnectionUpdate, setNodeConnection])

  useEffect(() => {
    if (!joystream || !activeAccountId || !accounts) {
      return
    }

    if (joystream.selectedAccountId === activeAccountId) {
      return
    }

    const setActiveAccount = async () => {
      if (activeAccountId) {
        const accountInjector = await web3FromAddress(activeAccountId)
        joystream.setActiveAccount(activeAccountId, accountInjector.signer)
      } else {
        joystream.setActiveAccount(activeAccountId)
      }
    }

    setActiveAccount()
  }, [joystream, activeAccountId, accounts])

  return <JoystreamContext.Provider value={{ joystream }}>{children}</JoystreamContext.Provider>
}
