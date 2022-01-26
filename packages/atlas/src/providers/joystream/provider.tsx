import { web3FromAddress } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamLib } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { SentryLogger } from '@/utils/logs'

import { useConnectionStatusStore } from '../connectionStatus'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: JoystreamLib | null
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const { nodeOverride } = useEnvironmentStore((state) => state)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)

  const [joystream, setJoystream] = useState<JoystreamLib | null>(null)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )

  useEffect(() => {
    let joystream: JoystreamLib

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamLib(nodeOverride || NODE_URL)
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
  }, [handleNodeConnectionUpdate, nodeOverride, setNodeConnection])

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
