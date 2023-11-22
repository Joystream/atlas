import { cryptoWaitReady } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { ProxyMarked, Remote, proxy, wrap } from 'comlink'
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { atlasConfig } from '@/config'
import { NODE_URL } from '@/config/env'
import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { JoystreamLib } from '@/joystream-lib/lib'
import { useEnvironmentStore } from '@/providers/environment/store'
import { useWalletStore } from '@/providers/wallet/wallet.store'
import { SentryLogger } from '@/utils/logs'

import { useConnectionStatusStore } from '../connectionStatus'

type ProxyCallbackFn = <T extends object>(callback: T) => T & ProxyMarked

export type JoystreamContextValue = {
  joystream: Remote<JoystreamLib> | undefined
  proxyCallback: ProxyCallbackFn
  chainState: ReturnType<typeof useJoystreamChainConstants>
  setApiActiveAccount: (type: 'seed' | 'address', address: string) => Promise<boolean>
} & ReturnType<typeof useJoystreamUtilFns>

export const JoystreamContext = createContext<JoystreamContextValue | undefined>(undefined)
JoystreamContext.displayName = 'JoystreamContext'

const worker = new Worker(new URL('../../utils/polkadot-worker', import.meta.url), {
  type: 'module',
})
const api = wrap<typeof JoystreamLib>(worker)

export const JoystreamProvider: FC<PropsWithChildren> = ({ children }) => {
  const { wallet } = useWalletStore()
  const { nodeOverride } = useEnvironmentStore((state) => state)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)
  const [initialized, setInitialized] = useState(false)
  const [awaitingAccount, setAwaitingAccount] = useState<['seed' | 'address', string] | null>(null)
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

  const setApiActiveAccount: JoystreamContextValue['setApiActiveAccount'] = useCallback(
    async (payloadType, payload) => {
      const instance = joystream.current
      if (!initialized || !instance) {
        setAwaitingAccount([payloadType, payload])
        return false
      }

      if (!wallet?.signer && payloadType === 'address') {
        SentryLogger.error(
          "Failed to get signer from web3FromAddress and customSigner wasn't provided",
          'JoystreamProvider'
        )
        return false
      }
      await instance.setActiveAccount(payloadType, payload, wallet?.signer ? proxy(wallet.signer) : undefined)

      return true
    },
    [initialized, wallet?.signer]
  )

  // initialize Joystream Lib
  useEffect(() => {
    const getJoystream = async () => {
      try {
        setNodeConnection('connecting')
        await cryptoWaitReady()
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
    if (initialized && awaitingAccount) {
      setApiActiveAccount(...awaitingAccount)
      setAwaitingAccount(null)
    }
  }, [awaitingAccount, initialized, setApiActiveAccount])

  return (
    <JoystreamContext.Provider
      value={{
        joystream: initialized ? joystream.current : undefined,
        proxyCallback,
        chainState,
        setApiActiveAccount,
        ...utilFns,
      }}
    >
      {children}
    </JoystreamContext.Provider>
  )
}

const useJoystreamUtilFns = () => {
  const [tokenPrice, setTokenPrice] = useState<number | undefined>()

  // fetch token price from the status server
  useEffect(() => {
    const getPrice = async () => {
      if (!atlasConfig.joystream.tokenPriceFeedUrl) {
        return
      }
      try {
        const data = await fetch(atlasConfig.joystream.tokenPriceFeedUrl)
        const json = await data.json()
        setTokenPrice(json.price)
      } catch (e) {
        SentryLogger.error(`Failed to fetch ${atlasConfig.joystream.tokenTicker} price`, e)
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
    minBidStep: new BN(0),
    minCashoutAllowed: new BN(0),
    maxCashoutAllowed: new BN(0),
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
        minBidStep: new BN(chainConstants.minBidStep),
        minCashoutAllowed: new BN(chainConstants.minCashoutAllowed),
        maxCashoutAllowed: new BN(chainConstants.maxCashoutAllowed),
      })
    )
  }, [joystream])

  return chainConstant
}

export const useJoystream = (): JoystreamContextValue => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }
  return ctx
}
