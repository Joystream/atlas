import { enablePolkadotSnap } from '@chainsafe/metamask-polkadot-adapter'
import { MetamaskSnapApi } from '@chainsafe/metamask-polkadot-adapter/build/types'
import { SnapNetworks } from '@chainsafe/metamask-polkadot-types'
import { Signer } from '@polkadot/types/types'
import { BaseDotsamaWallet, SubscriptionFn, WalletAccount } from '@talismn/connect-wallets'

import { atlasConfig } from '@/config'
import { NODE_HTTP_URL } from '@/config/env'
import { JOY_DECIMALS } from '@/joystream-lib/config'

import { JOYSTREAM_SS58_PREFIX } from './consts'

const networkName = 'joystream' as SnapNetworks
const addressPrefix = JOYSTREAM_SS58_PREFIX
const unit = { symbol: atlasConfig.joystream.tokenTicker, decimals: JOY_DECIMALS }

export class MetamaskWallet extends BaseDotsamaWallet {
  protected _snapId: string
  protected _snapApi: MetamaskSnapApi | undefined
  protected _accounts: WalletAccount[] | undefined
  protected _txId = 0

  public get installed(): boolean {
    return '_metamask' in window.ethereum
  }

  constructor(snapId: string) {
    super()

    this.extensionName = 'Metamask'
    this.title = 'Metamask'
    this.logo = { src: 'https://metamask.io/images/metamask-logo.png', alt: 'Metamask Logo' }

    this._snapId = snapId
  }

  public enable = async (): Promise<void> => {
    const snap = await enablePolkadotSnap({ networkName, wsRpcUrl: NODE_HTTP_URL, addressPrefix, unit }, this._snapId)

    this._snapApi = await snap.getMetamaskSnapApi()
    const address = await this._snapApi.getAddress()
    this._accounts = [
      {
        name: 'Metamask account',
        address,
        source: this.extensionName,
      },
    ]

    this._snapApi.signPayloadJSON
  }

  public getAccounts = async (): Promise<WalletAccount[]> => {
    return this._accounts ?? []
  }

  public subscribeAccounts: (callback: SubscriptionFn) => Promise<() => void> = (callback) => {
    callback(this._accounts ?? [])
    return Promise.resolve(() => undefined)
  }

  public get signer(): Signer {
    return {
      signPayload: async (payload) => {
        if (!this._snapApi) {
          throw Error('Metamask was accessed before it was enabled')
        }

        const signature = (await this._snapApi.signPayloadJSON(payload)) as `0x${string}`

        return { id: this._txId++, signature }
      },

      signRaw: async (raw) => {
        if (!this._snapApi) {
          throw Error('Metamask was accessed before it was enabled')
        }

        const signature = (await this._snapApi.signPayloadRaw(raw)) as `0x${string}`

        return { id: this._txId++, signature }
      },
    }
  }
}
