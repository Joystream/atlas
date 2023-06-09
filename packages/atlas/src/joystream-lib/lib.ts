// load type augments
import '@joystream/types'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { QueryableStorageMultiArg } from '@polkadot/api-base/types/storage'
import { Signer } from '@polkadot/api/types'
import { Keyring } from '@polkadot/keyring'
import { getSpecTypes } from '@polkadot/types-known'
import { Codec, SignerPayloadRawBase } from '@polkadot/types/types'
import { base64Encode } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { proxy } from 'comlink'

import { PERBILL_ONE_PERCENT } from '@/joystream-lib/config'
import { parseAccountBalance } from '@/joystream-lib/utils'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { JoystreamLibError } from './errors'
import { JoystreamLibExtrinsics } from './extrinsics'
import { AccountId, AtlasSigner } from './types'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export class JoystreamLib {
  readonly api: ApiPromise
  readonly extrinsics: JoystreamLibExtrinsics

  private _selectedAccountId: AtlasSigner | null = null
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
  async setActiveAccount(payloadType: 'address' | 'seed', payload: string | null, signer?: Signer) {
    if (!payload) {
      this._selectedAccountId = null
      this.api.setSigner({})
      return
    } else if (!signer && payloadType === 'address') {
      SentryLogger.error('Missing signer for setActiveAccount', 'JoystreamLib')
      return
    }

    if (payloadType === 'seed') {
      this._selectedAccountId = keyring.addFromMnemonic(payload)
    } else {
      this._selectedAccountId = payload
    }

    if (signer) {
      this.api.setSigner(signer)
    }
  }

  signMessage = async (signerPayload: SignerPayloadRawBase) => {
    await this.ensureApi()
    if (!this.selectedAccountId) {
      SentryLogger.error('Missing signer for signMessage', 'JoystreamLib')
      return
    }
    const signature = await this.api.sign(this.selectedAccountId, signerPayload)

    return signature
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
    return (await this.api.query.system.account.at(blockHash, accountId)).data.free.toString()
  }

  async subscribeAccountBalance(
    accountId: AccountId,
    callback: (balances: { availableBalance: string; lockedBalance: string; totalInvitationLock: string }) => void
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
      this.api.query.content.minBidStep as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.minCashoutAllowed as QueryableStorageMultiArg<'promise'>,
      this.api.query.content.maxCashoutAllowed as QueryableStorageMultiArg<'promise'>,
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
      minBidStep,
      minCashoutAllowed,
      maxCashoutAllowed,
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
      minBidStep: asStringifiedBN(minBidStep),
      minCashoutAllowed: asStringifiedBN(minCashoutAllowed),
      maxCashoutAllowed: asStringifiedBN(maxCashoutAllowed),
    } as const
  }

  async getDynamicBagCreationPolicies(): Promise<{
    storageBucketsCount: number
    distributionBucketsCountPerFamily: Record<string, number>
  }> {
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

  async getChainMetadata() {
    await this.ensureApi()
    const systemChain = await this.api.rpc.system.chain()

    return {
      icon: 'substrate',
      chainType: 'substrate',
      chain: systemChain.toString(),
      metaCalls: base64Encode(this.api.runtimeMetadata.asCallsOnly.toU8a()),
      types: getSpecTypes(
        this.api.registry,
        systemChain.toString(),
        this.api.runtimeVersion.specName.toString(),
        this.api.runtimeVersion.specVersion
      ),
      specVersion: this.api.runtimeVersion.specVersion.toNumber(),
      ss58Format: this.api.registry.chainSS58 ?? 0,
      tokenDecimals: this.api.registry.chainDecimals[0],
      tokenSymbol: this.api.registry.chainTokens[0],
      genesisHash: this.api.genesisHash.toHex(),
    }
  }
}
