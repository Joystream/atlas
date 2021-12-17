import { web3FromAddress } from '@polkadot/extension-dapp'
import { Remote, proxy, wrap } from 'comlink'
import React, { useCallback, useEffect, useMemo } from 'react'

import { NODE_URL } from '@/config/urls'
import { JoystreamJs } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { SentryLogger } from '@/utils/logs'
import JoystreamJsWorker from '@/web-workers/polkadot?worker'

import { useConnectionStatusStore } from '../connectionStatus'
import { useUser } from '../user'

type JoystreamContextValue = {
  joystream: Promise<Remote<JoystreamJs> | undefined>
}
export const JoystreamContext = React.createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'
const worker = new JoystreamJsWorker()
const api = wrap<typeof JoystreamJs>(worker)

export const JoystreamProvider: React.FC = ({ children }) => {
  const { activeAccountId, accounts } = useUser()
  const { nodeOverride } = useEnvironmentStore((state) => state)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)
  const handleNodeConnectionUpdate = useCallback(
    (connected: boolean) => {
      setNodeConnection(connected ? 'connected' : 'disconnected')
    },
    [setNodeConnection]
  )

  const joystream = useMemo(() => {
    const getInstance = async () => {
      try {
        setNodeConnection('connecting')
        return await new api(nodeOverride ?? NODE_URL, proxy(handleNodeConnectionUpdate))
      } catch (e) {
        handleNodeConnectionUpdate(false)
        SentryLogger.error('Failed to create JoystreamJS instance', 'JoystreamProvider', e)
      }
    }
    return getInstance()
  }, [handleNodeConnectionUpdate, nodeOverride, setNodeConnection])

  useEffect(() => {
    return () => {
      const destroy = async () => {
        const instance = await joystream
        if (instance) {
          await instance.destroy()
        }
      }
      destroy()
    }
  }, [joystream])

  useEffect(() => {
    const init = async () => {
      const instance = await joystream
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
  }, [activeAccountId, accounts, joystream])

  return <JoystreamContext.Provider value={{ joystream }}>{children}</JoystreamContext.Provider>
}
