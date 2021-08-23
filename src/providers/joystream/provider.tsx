import { web3FromAddress } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'

import { JoystreamJs } from '@/joystream-lib'
import { SentryLogger } from '@/utils/logs'

import { useConnectionStatusStore } from '../connectionStatus'
import { useNode } from '../environment'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: JoystreamJs | null
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const { selectedNode } = useNode()
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamJs(selectedNode)
        setJoystream(joystream)

        joystream.onNodeConnectionUpdate = handleNodeConnectionUpdate
      } catch (e) {
        handleNodeConnectionUpdate(false)
        SentryLogger.error('Failed to create JoystreamJS instance', 'JoystreamProvider', e)
      }
    }

    init()

    return () => {
      joystream?.destroy()
    }
  }, [handleNodeConnectionUpdate, selectedNode, setNodeConnection])

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
