import { web3FromAddress } from '@polkadot/extension-dapp'
import React, { useCallback, useEffect, useState } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamJs } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { SentryLogger } from '@/utils/logs'

import { useConnectionStatusStore } from '../connectionStatus'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: JoystreamJs | null
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

const ATTEMPT_DELAY = 2000

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const { nodeOverride } = useEnvironmentStore((state) => state)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0)

  const [joystream, setJoystream] = useState<JoystreamJs | null>(null)

  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      if (connected) {
        setNodeConnection('connected')
        setReconnectAttempts(0)
        return
      }
      // disconnected
      if (reconnectAttempts === 0) {
        setReconnectAttempts((attempts) => attempts + 1)
      } else {
        // disconnect only after second attempt, i.e reconnectAttempts needs to be 1
        setNodeConnection('disconnected')
      }
    },
    [reconnectAttempts, setNodeConnection]
  )

  useEffect(() => {
    let joystream: JoystreamJs

    const init = async () => {
      try {
        setNodeConnection('connecting')
        joystream = new JoystreamJs(nodeOverride || NODE_URL)
        setJoystream(joystream)

        joystream.onNodeConnectionUpdate = handleNodeConnectionUpdate
      } catch (e) {
        handleNodeConnectionUpdate(false)
        SentryLogger.error('Failed to create JoystreamJS instance', 'JoystreamProvider', e)
      }
    }

    init()

    if (!reconnectAttempts) {
      return
    }
    const timeout = window.setTimeout(() => {
      init()
    }, ATTEMPT_DELAY)

    return () => {
      joystream?.destroy()
      window.clearTimeout(timeout)
    }
  }, [handleNodeConnectionUpdate, nodeOverride, reconnectAttempts, setNodeConnection])

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
