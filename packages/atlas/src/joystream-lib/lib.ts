// load type augments
import '@joystream/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Signer } from '@polkadot/api/types'
import BN from 'bn.js'
import { proxy } from 'comlink'

import { NFT_PERBILL_PERCENT } from '@/joystream-lib/config'
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

  async subscribeAccountBalance(accountId: AccountId, callback: (balance: BN) => void) {
    await this.ensureApi()

    const unsubscribe = await this.api.derive.balances.all(accountId, ({ availableBalance }) => {
      callback(availableBalance)
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
      maxAuctionDuration,
      minStartingPrice,
      auctionStartsAtMaxDelta,
      maxCreatorRoyalty,
      minCreatorRoyalty,
      platformFeePercentage,
    ] = await Promise.all([
      this.api.query.content.maxAuctionDuration(),
      this.api.query.content.minStartingPrice(),
      this.api.query.content.auctionStartsAtMaxDelta(),
      this.api.query.content.maxCreatorRoyalty(),
      this.api.query.content.minCreatorRoyalty(),
      this.api.query.content.platfromFeePercentage(),
    ])

    return {
      maxAuctionDuration: maxAuctionDuration.toNumber(),
      minStartingPrice: minStartingPrice.toNumber(),
      auctionStartsAtMaxDelta: auctionStartsAtMaxDelta.toNumber(),
      maxCreatorRoyalty: maxCreatorRoyalty.toNumber() / NFT_PERBILL_PERCENT,
      minCreatorRoyalty: minCreatorRoyalty.toNumber() / NFT_PERBILL_PERCENT,
      platformFeePercentage: platformFeePercentage.toNumber() / NFT_PERBILL_PERCENT,
    }
  }
}
