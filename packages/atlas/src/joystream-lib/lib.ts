// load type augments
import '@joystream/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { QueryableStorageMultiArg } from '@polkadot/api-base/types/storage'
import { Signer } from '@polkadot/api/types'
import { Codec } from '@polkadot/types/types'
import BN from 'bn.js'
import { proxy } from 'comlink'

import { PERBILL_ONE_PERCENT } from '@/joystream-lib/config'
import { parseAccountBalance } from '@/joystream-lib/utils'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

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

  async getAccountBalance(accountId: AccountId) {
    await this.ensureApi()

    const balances = await this.api.derive.balances.all(accountId)
    return parseAccountBalance(balances)
  }

  async getAccountBalanceAtBlock(block: number | BN | string, accountId: AccountId) {
    await this.ensureApi()

    const blockHash = await this.api.rpc.chain.getBlockHash(block)
    console.log(block, blockHash.toString())
    return (await this.api.query.system.account.at(blockHash, accountId)).data.free.toString()
  }

  async subscribeAccountBalance(
    accountId: AccountId,
    callback: (balances: { availableBalance: string; lockedBalance: string }) => void
  ) {
    await this.ensureApi()

    const unsubscribe = await this.api.derive.balances.all(accountId, (balances) => {
      callback(parseAccountBalance(balances))
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

  async getContentCommitment() {
    await this.ensureApi()

    return (await this.api.query.content.commitment()).toString()
  }

  async getChainConstants() {
    await this.ensureApi()

    // use queryMulti for better performance
    // there are some type mismatches so we need to assert type of each query
    const results = await this.api.queryMulti([
      this.api.query.storage.dataObjectPerMegabyteFee as QueryableStorageMultiArg<'promise'>,
      this.api.query.storage.dataObjectStateBloatBondValue as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.videoStateBloatBondValue as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.channelStateBloatBondValue as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.maxAuctionDuration as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.minStartingPrice as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.maxStartingPrice as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.auctionStartsAtMaxDelta as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.maxCreatorRoyalty as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.minCreatorRoyalty as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.platfromFeePercentage as QueryableStorageMultiArg<'promise'>,
    ])

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
    ] = results

    const asStringifiedBN = (raw: Codec) => {
      const bn = new BN(raw.toString())
      return bn.toString()
    }

    const asNumber = (raw: Codec) => {
      return parseInt(raw.toString())
    }

    const asPercentage = (raw: Codec) => {
      return asNumber(raw) / PERBILL_ONE_PERCENT
    }

    return {
      dataObjectPerMegabyteFee: asStringifiedBN(dataObjectPerMegabyteFee),
      dataObjectStateBloatBondValue: asStringifiedBN(dataObjectStateBloatBondValue),
      videoStateBloatBondValue: asStringifiedBN(videoStateBloatBondValue),
      channelStateBloatBondValue: asStringifiedBN(channelStateBloatBondValue),
      nftMinStartingPrice: asStringifiedBN(minStartingPrice),
      nftMaxStartingPrice: asStringifiedBN(maxStartingPrice),
      nftMaxAuctionDuration: asNumber(maxAuctionDuration),
      nftAuctionStartsAtMaxDelta: asNumber(auctionStartsAtMaxDelta),
      nftMaxCreatorRoyaltyPercentage: asPercentage(maxCreatorRoyalty),
      nftMinCreatorRoyaltyPercentage: asPercentage(minCreatorRoyalty),
      nftPlatformFeePercentage: asPercentage(platformFeePercentage),
    } as const
  }

  async getDynamicBagCreationPolicies() {
    await this.ensureApi()

    const { numberOfStorageBuckets, families } = await this.api.query.storage.dynamicBagCreationPolicies('Channel')
    const transformedFamilies = Object.fromEntries(families)
    Object.keys(transformedFamilies).forEach((key) => {
      transformedFamilies[key] = transformedFamilies[key].toNumber()
    })

    return {
      storageBucketsCount: numberOfStorageBuckets.toNumber(),
      distributionBucketsCountPerFamily: transformedFamilies,
    }
  }
}
