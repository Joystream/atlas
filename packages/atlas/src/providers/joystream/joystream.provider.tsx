import { ProxyMarked, Remote, proxy, wrap } from 'comlink'
import { FC, PropsWithChildren, createContext, useCallback, useEffect, useRef, useState } from 'react'

import { JOY_CURRENCY_TICKER } from '@/config/token'
import { JOY_PRICE_SERVICE_URL, NODE_URL } from '@/config/urls'
import { JoystreamLib } from '@/joystream-lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { useUserStore } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'
import JoystreamJsWorker from '@/utils/polkadot-worker?worker'

import { useConnectionStatusStore } from '../connectionStatus'

type ProxyCallbackFn = <T extends object>(callback: T) => T & ProxyMarked

export type JoystreamContextValue = {
  joystream: Remote<JoystreamLib> | undefined
  proxyCallback: ProxyCallbackFn
  chainState: ReturnType<typeof useJoystreamChainState>
} & ReturnType<typeof useJoystreamUtilFns>

export const JoystreamContext = createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'
const worker = new JoystreamJsWorker()
const api = wrap<typeof JoystreamLib>(worker)

export const JoystreamProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accountId, walletAccounts, wallet } = useUserStore()
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

  const utilFns = useJoystreamUtilFns()
  const chainState = useJoystreamChainState(joystream.current)

  // initialize Joystream Lib
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

  // update Joystream Lib selected on change
  useEffect(() => {
    if (!initialized) {
      return
    }
    const init = async () => {
      const instance = joystream.current
      if (!instance || !accountId || !walletAccounts || !wallet) {
        return
      }

      const previousAccountId = await instance?.selectedAccountId
      if (accountId === previousAccountId) {
        return
      }

      const setActiveAccount = async () => {
        if (accountId) {
          const { signer } = wallet
          if (!signer) {
            SentryLogger.error('Failed to get signer from web3FromAddress', 'JoystreamProvider')
            return
          }
          await instance.setActiveAccount(accountId, proxy(signer))
        } else {
          await instance.setActiveAccount(accountId)
        }
      }

      setActiveAccount()
    }
    init()
  }, [accountId, initialized, wallet, walletAccounts])

  return (
    <JoystreamContext.Provider
      value={{ joystream: initialized ? joystream.current : undefined, proxyCallback, chainState, ...utilFns }}
    >
      {children}
    </JoystreamContext.Provider>
  )
}

const useJoystreamUtilFns = () => {
  const [tokenPrice, setTokenPrice] = useState(0)

  // fetch token price from the status server
  useEffect(() => {
    const getPrice = async () => {
      try {
        const data = await fetch(JOY_PRICE_SERVICE_URL)
        const json = await data.json()
        setTokenPrice(parseFloat(json.price))
      } catch (e) {
        SentryLogger.error(`Failed to fetch ${JOY_CURRENCY_TICKER} price`, e)
      }
    }
    getPrice()
  }, [])

  return {
    tokenPrice,
  }
}

type JoystreamChainState = {
  nftMinStartingPrice: number
  nftMaxAuctionDuration: number
  nftAuctionStartsAtMaxDelta: number
  nftMaxCreatorRoyaltyPercentage: number
  nftMinCreatorRoyaltyPercentage: number
  nftPlatformFeePercentage: number
}
const useJoystreamChainState = (joystream: Remote<JoystreamLib> | undefined) => {
  const [chainState, setChainState] = useState<JoystreamChainState>({
    nftMinStartingPrice: 1,
    nftMaxAuctionDuration: 1_296_000,
    nftAuctionStartsAtMaxDelta: 432_000,
    nftMaxCreatorRoyaltyPercentage: 50,
    nftMinCreatorRoyaltyPercentage: 1,
    nftPlatformFeePercentage: 1,
  })

  useEffect(() => {
    if (!joystream) return

    joystream.getNftChainState().then((nftChainState) =>
      setChainState({
        nftMaxAuctionDuration: nftChainState.maxAuctionDuration,
        nftMinStartingPrice: nftChainState.minStartingPrice,
        nftAuctionStartsAtMaxDelta: nftChainState.auctionStartsAtMaxDelta,
        nftMaxCreatorRoyaltyPercentage: nftChainState.maxCreatorRoyalty,
        nftMinCreatorRoyaltyPercentage: nftChainState.minCreatorRoyalty,
        nftPlatformFeePercentage: nftChainState.platformFeePercentage,
      })
    )
  }, [joystream])

  return chainState
}
