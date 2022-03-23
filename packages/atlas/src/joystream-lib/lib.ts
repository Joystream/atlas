import { types } from '@joystream/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import '@polkadot/api/augment'
import { Signer } from '@polkadot/api/types'
import BN from 'bn.js'
import { proxy } from 'comlink'

import { JoystreamLibError } from '@/joystream-lib/errors'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

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

    this.api = new ApiPromise({ provider, types })
    const extrinsics = new JoystreamLibExtrinsics(this.api, () => this.selectedAccountId)
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

  async getAccountBalance(accountId: AccountId): Promise<number> {
    await this.ensureApi()

    const balance = await this.api.derive.balances.account(accountId)

    return new BN(balance.freeBalance).toNumber()
  }

  async subscribeAccountBalance(accountId: AccountId, callback: (balance: number) => void) {
    await this.ensureApi()

    const unsubscribe = await this.api.query.system.account(accountId, ({ data: { free } }) => {
      callback(new BN(free).toNumber())
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

    const [maxAuctionDuration, minStartingPrice] = await Promise.all([
      this.api.query.content.maxAuctionDuration(),
      this.api.query.content.minStartingPrice(),
    ])

    return {
      maxAuctionDuration: maxAuctionDuration.toNumber(),
      minStartingPrice: minStartingPrice.toNumber(),
    }
  }
}
