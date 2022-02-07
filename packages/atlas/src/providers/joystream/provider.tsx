import { web3FromAddress } from '@polkadot/extension-dapp'
import { ProxyMarked, Remote, proxy, wrap } from 'comlink'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamLib } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { SentryLogger } from '@/utils/logs'
import JoystreamJsWorker from '@/utils/polkadot-worker?worker'

import { useConnectionStatusStore } from '../connectionStatus'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: Remote<JoystreamLib> | undefined
  proxyCallback: <T extends object>(callback: T) => T & ProxyMarked
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'
const worker = new JoystreamJsWorker()
const api = wrap<typeof JoystreamLib>(worker)

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const { nodeOverride } = useEnvironmentStore((state) => state)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)
  const [initialized, setInitialized] = useState(false)
  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )
  const joystream = useRef<Remote<JoystreamLib> | undefined>()

  const proxyCallback = useCallback(<T extends object>(callback: T) => proxy(callback), [])

  useEffect(() => {
    const getJoystream = async () => {
      try {
        setNodeConnection('connecting')
        joystream.current = await new api(nodeOverride ?? NODE_URL, proxy(handleNodeConnectionUpdate))
        setInitialized(true)
      } catch (e) {
        handleNodeConnectionUpdate(false)
        SentryLogger.error('Failed to create JoystreamJS instance', 'JoystreamProvider', e)
      }
    }
    getJoystream()

    return () => {
      joystream.current?.destroy()
    }
  }, [handleNodeConnectionUpdate, nodeOverride, setNodeConnection])

  useEffect(() => {
    if (!initialized) {
      return
    }
    const init = async () => {
      const instance = joystream.current
      if (!instance || !activeAccountId || !accounts) {
        return
      }

      const accountId = await instance?.selectedAccountId
      if (accountId === activeAccountId) {
        return
      }

      const setActiveAccount = async () => {
        if (activeAccountId) {
          const { signer } = await web3FromAddress(activeAccountId)
          if (!signer) {
            SentryLogger.error('Failed to get signer from web3FromAddress', 'JoystreamProvider')
            return
          }
          await instance.setActiveAccount(activeAccountId, proxy(signer))
        } else {
          await instance.setActiveAccount(activeAccountId)
        }
      }

      setActiveAccount()
    }
    init()
  }, [activeAccountId, accounts, initialized])

  return (
    <JoystreamContext.Provider value={{ joystream: initialized ? joystream.current : undefined, proxyCallback }}>
      {children}
    </JoystreamContext.Provider>
  )
}
