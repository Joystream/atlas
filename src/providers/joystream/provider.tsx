import { web3FromAddress } from '@polkadot/extension-dapp'
import { ProxyMarked, Remote, proxy, wrap } from 'comlink'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamJs } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { SentryLogger } from '@/utils/logs'
import JoystreamJsWorker from '@/web-workers/polkadot?worker'

import { useConnectionStatusStore } from '../connectionStatus'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: Remote<JoystreamJs> | undefined
  proxyCallback: <T extends object>(callback: T) => T & ProxyMarked
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'
const worker = new JoystreamJsWorker()
const api = wrap<typeof JoystreamJs>(worker)

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
  const joystream = useRef<Remote<JoystreamJs> | undefined>()

  const proxyCallback = <T extends object>(callback: T) => proxy(callback)

  useEffect(() => {
    const getjoystream = async () => {
      try {
        setNodeConnection('connecting')
        joystream.current = await new api(nodeOverride ?? NODE_URL, proxy(handleNodeConnectionUpdate))
        setInitialized(true)
      } catch (e) {
        handleNodeConnectionUpdate(false)
        SentryLogger.error('Failed to create JoystreamJS joystream', 'JoystreamProvider', e)
      }
    }
    getjoystream()
    return () => {
      const destroy = async () => {
        if (joystream.current) {
          await joystream.current.destroy()
        }
      }
      destroy()
    }
  }, [handleNodeConnectionUpdate, nodeOverride, setNodeConnection])

  useEffect(() => {
    if (!initialized) {
      return
    }
    const init = async () => {
      const instance = joystream.current
      const accountId = await instance?.selectedAccountId
      if (!instance || !activeAccountId || !accounts) {
        return
      }
      if (accountId === activeAccountId) {
        return
      }

      const setActiveAccount = async () => {
        if (activeAccountId) {
          const { signer } = await web3FromAddress(activeAccountId)
          if (!signer) {
            return
          }
          const { signRaw, signPayload } = signer
          await instance.setActiveAccount(
            activeAccountId,
            proxy({ signRaw: proxy(signRaw), signPayload: proxy(signPayload) })
          )
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
