// load type augments
import '@joystream/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Signer } from '@polkadot/api/types'
import { proxy } from 'comlink'

import { NFT_PERBILL_PERCENT } from '@/joystream-lib/config'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { hapiBnToTokenNumber } from '@/utils/number'

import { JoystreamLibError } from './errors'
import { JoystreamLibExtrinsics } from './extrinsics'
import { AccountId } from './types'

export class JoystreamLib {
  readonly api: ApiPromise
  readonly extrinsics: JoystreamLibExtrinsics

  private _selectedAccountId: AccountId | null = null
  get selectedAccountId() {
    return this._selectedAccountId
  }

  // if needed these could become some kind of event emitter

  /* Lifecycle */
  constructor(endpoint: string, onNodeConnectionUpdate?: (connected: boolean) => unknown) {
    const provider = new WsProvider(endpoint)
    provider.on('connected', () => {
      this.logConnectionData(endpoint)
      onNodeConnectionUpdate?.(true)
    })
    provider.on('disconnected', () => {
      onNodeConnectionUpdate?.(false)
    })
    provider.on('error', () => {
      onNodeConnectionUpdate?.(false)
    })

    this.api = new ApiPromise({ provider })
    const extrinsics = new JoystreamLibExtrinsics(this.api, () => this.selectedAccountId, endpoint)
    this.extrinsics = proxy(extrinsics)
  }

  destroy() {
    this.api.disconnect()
    ConsoleLogger.log('[JoystreamLib] Destroyed')
  }

  private async ensureApi() {
    try {
      await this.api.isReady
    } catch (e) {
      SentryLogger.error('Failed to initialize Polkadot API', 'JoystreamLib', e)
      throw new JoystreamLibError({ name: 'ApiNotConnectedError' })
    }
  }

  private async logConnectionData(endpoint: string) {
    await this.ensureApi()
    const chain = await this.api.rpc.system.chain()
    ConsoleLogger.log(`[JoystreamLib] Connected to chain "${chain}" via "${endpoint}"`)
  }

  /* Public */
  async setActiveAccount(accountId: AccountId | null, signer?: Signer) {
    if (!accountId) {
      this._selectedAccountId = null
      this.api.setSigner({})
      return
    } else if (!signer) {
      SentryLogger.error('Missing signer for setActiveAccount', 'JoystreamLib')
      return
    }

    this._selectedAccountId = accountId
    this.api.setSigner(signer)
  }

  async getCurrentBlock(): Promise<number> {
    await this.ensureApi()
    const header = await this.api.rpc.chain.getHeader()
    const { number } = header
    return number.toNumber()
  }

  async subscribeAccountBalance(accountId: AccountId, callback: (balance: number) => void) {
    await this.ensureApi()

    const unsubscribe = await this.api.derive.balances.all(accountId, ({ availableBalance }) => {
      callback(availableBalance.toNumber())
    })

    return proxy(unsubscribe)
  }

  async subscribeCurrentBlock(callback: (currentBlock: number) => void) {
    await this.ensureApi()
    const unsubscribe = await this.api.rpc.chain.subscribeNewHeads((result) => {
      const { number } = result
      callback(number.toNumber())
    })
    return proxy(unsubscribe)
  }

  async getNftChainState() {
    await this.ensureApi()

    const [
      dataObjectPerMegabyteFee,
      dataObjectStateBloatBondValue,
      videoStateBloatBondValue,
      channelStateBloatBondValue,
      maxAuctionDuration,
      minStartingPrice,
      maxStartingPrice,
      auctionStartsAtMaxDelta,
      maxCreatorRoyalty,
      minCreatorRoyalty,
      platformFeePercentage,
    ] = await Promise.all([
      this.api.query.storage.dataObjectPerMegabyteFee(),
      this.api.query.storage.dataObjectStateBloatBondValue(),
      this.api.query.content.videoStateBloatBondValue(),
      this.api.query.content.channelStateBloatBondValue(),
      this.api.query.content.maxAuctionDuration(),
      this.api.query.content.minStartingPrice(),
      this.api.query.content.maxStartingPrice(),
      this.api.query.content.auctionStartsAtMaxDelta(),
      this.api.query.content.maxCreatorRoyalty(),
      this.api.query.content.minCreatorRoyalty(),
      this.api.query.content.platfromFeePercentage(),
    ])

    return {
      dataObjectPerMegabyteFee: dataObjectPerMegabyteFee.toNumber(),
      dataObjectStateBloatBondValue: dataObjectStateBloatBondValue.toNumber(),
      videoStateBloatBondValue: videoStateBloatBondValue.toNumber(),
      channelStateBloatBondValue: channelStateBloatBondValue.toNumber(),
      maxAuctionDuration: maxAuctionDuration.toNumber(),
      minStartingPrice: hapiBnToTokenNumber(minStartingPrice),
      maxStartingPrice: hapiBnToTokenNumber(maxStartingPrice),
      auctionStartsAtMaxDelta: auctionStartsAtMaxDelta.toNumber(),
      maxCreatorRoyalty: maxCreatorRoyalty.toNumber() / NFT_PERBILL_PERCENT,
      minCreatorRoyalty: minCreatorRoyalty.toNumber() / NFT_PERBILL_PERCENT,
      platformFeePercentage: platformFeePercentage.toNumber() / NFT_PERBILL_PERCENT,
    }
  }

  async getDynamicBagCreationPolicies() {
    await this.ensureApi()

    const { numberOfStorageBuckets, families } = await this.api.query.storage.dynamicBagCreationPolicies('Channel')
    const transformedFamilies = Object.fromEntries(families)
    Object.keys(transformedFamilies).forEach((key) => {
      transformedFamilies[key] = transformedFamilies[key].toNumber()
    })

    return {
      numberOfStorageBuckets: numberOfStorageBuckets.toNumber(),
      families: transformedFamilies,
    }
  }
}
