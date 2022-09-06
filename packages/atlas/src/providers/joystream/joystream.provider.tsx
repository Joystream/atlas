import BN from 'bn.js'
import { ProxyMarked, Remote, proxy, wrap } from 'comlink'
import { FC, PropsWithChildren, createContext, useCallback, useEffect, useRef, useState } from 'react'

import { JOY_PRICE_SERVICE_URL, NODE_URL } from '@/config/env'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { JoystreamLib } from '@/joystream-lib'
import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { useEnvironmentStore } from '@/providers/environment/store'
import { useUserStore } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { useConnectionStatusStore } from '../connectionStatus'

type ProxyCallbackFn = <T extends object>(callback: T) => T & ProxyMarked

export type JoystreamContextValue = {
  joystream: Remote<JoystreamLib> | undefined
  proxyCallback: ProxyCallbackFn
  chainState: ReturnType<typeof useJoystreamChainConstants>
} & ReturnType<typeof useJoystreamUtilFns>

export const JoystreamContext = createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

const worker = new Worker(new URL('../../utils/polkadot-worker', import.meta.url), {
  type: 'module',
})
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
  const chainState = useJoystreamChainConstants(joystream.current)

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
  const [tokenPrice, setTokenPrice] = useState<undefined>()

  // fetch token price from the status server
  useEffect(() => {
    const getPrice = async () => {
      if (!JOY_PRICE_SERVICE_URL) {
        return
      }
      try {
        const data = await fetch(JOY_PRICE_SERVICE_URL)
        const json = await data.json()
        setTokenPrice(json.price)
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

type RawJoystreamChainConstants = Awaited<ReturnType<JoystreamLib['getChainConstants']>>
type JoystreamChainConstants = {
  [p in keyof RawJoystreamChainConstants]: RawJoystreamChainConstants[p] extends string
    ? BN
    : RawJoystreamChainConstants[p]
}
const useJoystreamChainConstants = (joystream: Remote<JoystreamLib> | undefined) => {
  const [chainConstant, setChainConstant] = useState<JoystreamChainConstants>({
    dataObjectPerMegabyteFee: new BN(0),
    dataObjectStateBloatBondValue: new BN(0),
    videoStateBloatBondValue: new BN(0),
    channelStateBloatBondValue: new BN(0),
    nftMinStartingPrice: new BN(HAPI_TO_JOY_RATE),
    nftMaxStartingPrice: new BN('200000000000000000'),
    nftMaxAuctionDuration: 1_296_000,
    nftAuctionStartsAtMaxDelta: 432_000,
    nftMaxCreatorRoyaltyPercentage: 50,
    nftMinCreatorRoyaltyPercentage: 1,
    nftPlatformFeePercentage: 1,
  })

  useEffect(() => {
    if (!joystream) return

    joystream.getChainConstants().then((chainConstants) =>
      setChainConstant({
        dataObjectPerMegabyteFee: new BN(chainConstants.dataObjectPerMegabyteFee),
        dataObjectStateBloatBondValue: new BN(chainConstants.dataObjectStateBloatBondValue),
        videoStateBloatBondValue: new BN(chainConstants.videoStateBloatBondValue),
        channelStateBloatBondValue: new BN(chainConstants.channelStateBloatBondValue),
        nftMinStartingPrice: BN.max(new BN(chainConstants.nftMinStartingPrice), new BN(HAPI_TO_JOY_RATE)),
        nftMaxStartingPrice: new BN(chainConstants.nftMaxStartingPrice),
        nftMaxAuctionDuration: chainConstants.nftMaxAuctionDuration,
        nftAuctionStartsAtMaxDelta: chainConstants.nftAuctionStartsAtMaxDelta,
        nftMaxCreatorRoyaltyPercentage: chainConstants.nftMaxCreatorRoyaltyPercentage,
        nftMinCreatorRoyaltyPercentage: chainConstants.nftMinCreatorRoyaltyPercentage,
        nftPlatformFeePercentage: chainConstants.nftPlatformFeePercentage,
      })
    )
  }, [joystream])

  return chainConstant
}
