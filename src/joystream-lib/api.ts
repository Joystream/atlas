import BN from 'bn.js'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Bytes, GenericEvent, Raw, TypeRegistry } from '@polkadot/types'
import { DispatchError } from '@polkadot/types/interfaces/system'
import { web3AccountsSubscribe, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { types } from '@joystream/types'
import { ChannelCreationParameters, ContentActor, NewAsset } from '@joystream/types/content'
import { ChannelMetadata } from '@joystream/content-metadata-protobuf'

import {
  AccountNotFoundError,
  AccountNotSelectedError,
  ExtensionSignCancelledError,
  ExtensionUnknownError,
  ExtrinsicFailedError,
  ExtrinsicUnknownError,
} from './errors'
import {
  Account,
  AccountId,
  AssetMetadata,
  ChannelAssets,
  ChannelId,
  CreateChannelMetadata,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  MemberId,
} from './types'
import { ContentParameters } from '@joystream/types/storage'
import { ContentId } from '@joystream/types/media'

export class JoystreamJs {
  readonly api: ApiPromise
  private initPolkadotExtensionPromise?: Promise<boolean>

  private _selectedAccountId: AccountId | null = null
  get selectedAccountId() {
    return this._selectedAccountId
  }

  private _accounts: Account[] = []
  get accounts(): Account[] {
    return this._accounts
  }

  private unsubscribeFromAccountChanges?: () => void
  // if needed these could become some kind of event emitter
  public onAccountsUpdate?: (accounts: Account[]) => unknown
  public onExtensionConnectedUpdate?: (connected: boolean) => unknown

  /* Lifecycle */
  private constructor(api: ApiPromise, appName: string) {
    this.api = api

    this.initPolkadotExtension(appName)
  }

  public async initPolkadotExtension(appName: string) {
    this.initPolkadotExtensionPromise = this._initPolkadotExtension(appName)
  }

  private async _initPolkadotExtension(appName: string): Promise<boolean> {
    try {
      const enabledExtensions = await web3Enable(appName)

      if (!enabledExtensions.length) {
        this.logWarn('No extension detected')
        this.onExtensionConnectedUpdate?.(false)
        return false
      }

      // subscribe to changes to the accounts list
      this.unsubscribeFromAccountChanges = await web3AccountsSubscribe((accounts) => {
        this._accounts = accounts.map((a) => ({
          id: a.address,
          name: a.meta.name || 'Unnamed',
        }))
        this.onAccountsUpdate?.(this._accounts)
      })

      this.onExtensionConnectedUpdate?.(true)
      return true
    } catch (e) {
      throw new ExtensionUnknownError(e)
    }
  }

  static async build(appName: string, endpoint: string): Promise<JoystreamJs> {
    const provider = new WsProvider(endpoint)
    const api = await ApiPromise.create({ provider, types })
    await api.isReady

    const lib = new JoystreamJs(api, endpoint)
    lib.logConnectionData(endpoint)
    return lib
  }

  destroy() {
    this.api.disconnect()
    this.unsubscribeFromAccountChanges?.()
    this.log('Destroyed')
  }

  /* Private utilities */
  private log(msg: string) {
    console.log(`[JoystreamJS] ${msg}`)
  }

  private logWarn(msg: string) {
    console.warn(`[JoystreamJS] ${msg}`)
  }

  private logError(msg: string) {
    console.error(`[JoystreamJS] ${msg}`)
  }

  private async logConnectionData(endpoint: string) {
    const chain = await this.api.rpc.system.chain()
    this.log(`Connected to chain "${chain}" via "${endpoint}"`)
  }

  private async sendExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<GenericEvent[]> {
    // async executor necessary here since we're listening for a callback
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<GenericEvent[]>(async (resolve, reject) => {
      if (!this.selectedAccountId) {
        reject(new AccountNotSelectedError())
        return
      }
      try {
        const unsubscribe = await tx.signAndSend(this.selectedAccountId, (result) => {
          const { status, isError, events } = result

          if (isError) {
            reject(new ExtrinsicUnknownError('Unknown extrinsic error!'))
            unsubscribe()
            return
          }

          if (status.isFinalized) {
            unsubscribe()

            const unpackedEvents = events.map((e) => e.event)

            unpackedEvents
              .filter((event) => event.section === 'system')
              .forEach((event) => {
                if (event.method === 'ExtrinsicFailed') {
                  const dispatchError = event.data[0] as DispatchError
                  let errorMsg = dispatchError.toString()
                  if (dispatchError.isModule) {
                    try {
                      // Need to assert that registry is of TypeRegistry type, since Registry intefrace
                      // seems outdated and doesn't include DispatchErrorModule as possible argument for "findMetaError"
                      const { name, documentation } = (this.api.registry as TypeRegistry).findMetaError(
                        dispatchError.asModule
                      )
                      errorMsg = `${name} (${documentation})`
                    } catch (e) {
                      // This probably means we don't have this error in the metadata
                      // In this case - continue (we'll just display dispatchError.toString())
                    }
                  }
                  this.logError(`Extrinsic failed: "${errorMsg}"`)
                  reject(new ExtrinsicFailedError(event))
                } else if (event.method === 'ExtrinsicSuccess') {
                  resolve(unpackedEvents)
                } else {
                  console.warn('Unknown event method')
                  console.warn(event)
                }
              })
          }
        })

        // if signAndSend succeeded, report back to the caller with the update
        cb?.(ExtrinsicStatus.Signed)
      } catch (e) {
        if (e?.message === 'Cancelled') {
          reject(new ExtensionSignCancelledError())
          return
        }
        this.logError(`Unknown sendExtrinsic error: ${e}`)
        reject(e)
      }
    })
  }

  private createFileAsset({ ipfsContentId, size }: AssetMetadata): NewAsset {
    const content = new ContentParameters(this.api.registry, {
      content_id: ContentId.generate(this.api.registry),
      // hardcoded type_id - it's not used but needs to be one of the allowed values
      type_id: this.api.createType('u64', 1),
      size: this.api.createType('u64', size),
      ipfs_content_id: new Bytes(this.api.registry, ipfsContentId),
    })
    return new NewAsset(this.api.registry, { upload: content })
  }

  /* Public */
  async setAccount(accountId: AccountId | null) {
    // make sure the initialization was done already
    await this.initPolkadotExtensionPromise

    if (!accountId) {
      this._selectedAccountId = null
      this.api.setSigner({})
      return
    }

    if (!this._accounts.find((a) => a.id)) {
      throw AccountNotFoundError
    }

    const accountInjector = await web3FromAddress(accountId)
    this._selectedAccountId = accountId
    this.api.setSigner(accountInjector.signer)
  }

  async getAccountBalance(accountId: AccountId): Promise<number> {
    const balance = await this.api.derive.balances.account(accountId)

    return new BN(balance.freeBalance).toNumber()
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: ChannelAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelId> {
    // === channel assets ===
    // first avatar, then cover photo
    const inputAssetsList: AssetMetadata[] = [
      ...(inputAssets.avatar ? [inputAssets.avatar] : []),
      ...(inputAssets.cover ? [inputAssets.cover] : []),
    ]
    const newAssetsList = inputAssetsList.map((a) => this.createFileAsset(a))
    const assets = this.api.createType('Vec<NewAsset>', newAssetsList)

    // === channel metadata ===
    const protoMeta = new ChannelMetadata()
    protoMeta.setTitle(inputMetadata.title)
    protoMeta.setDescription(inputMetadata.description)
    protoMeta.setIsPublic(inputMetadata.isPublic)
    protoMeta.setLanguage(inputMetadata.language)

    // this needs to match indexes in the `assets` list
    if (inputAssets.avatar) {
      protoMeta.setAvatarPhoto(0)
    }
    if (inputAssets.cover) {
      protoMeta.setCoverPhoto(inputAssets.avatar ? 1 : 0)
    }

    const serializedProtoMeta = protoMeta.serializeBinary()
    const metaRaw = new Raw(this.api.registry, serializedProtoMeta)
    const metaBytes = new Bytes(this.api.registry, metaRaw)

    const rewardAccount = this.api.createType('Option<AccountId>')

    const params = new ChannelCreationParameters(this.api.registry, {
      meta: metaBytes,
      assets: assets,
      reward_account: rewardAccount,
    })
    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })

    const tx = this.api.tx.content.createChannel(contentActor, params)
    const events = await this.sendExtrinsic(tx, cb)

    const contentEvents = events.filter((event) => event.section === 'content')
    const channelId = contentEvents[0].data[1]
    return new BN(channelId as never).toNumber()
  }
}
