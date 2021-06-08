import {
  ChannelMetadata,
  License,
  MediaType,
  PublishedBeforeJoystream,
  VideoMetadata,
} from '@joystream/content-metadata-protobuf'
import { types } from '@joystream/types'
import { ChannelId as RuntimeChannelId } from '@joystream/types/common'
import {
  ChannelCreationParameters,
  ChannelUpdateParameters,
  ContentActor,
  NewAsset,
  VideoCreationParameters,
  VideoUpdateParameters,
  VideoId as RuntimeVideoId,
} from '@joystream/types/content'
import { ContentId } from '@joystream/types/media'
import { ContentParameters } from '@joystream/types/storage'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types'
import {
  GenericAccountId as RuntimeAccountId,
  Bytes,
  GenericEvent,
  Raw,
  Option,
  Vec,
  TypeRegistry,
  u64 as U64,
} from '@polkadot/types'
import { DispatchError } from '@polkadot/types/interfaces/system'
import BN from 'bn.js'

import {
  AccountNotSelectedError,
  ApiNotConnectedError,
  ExtrinsicSignCancelledError,
  ExtrinsicFailedError,
  ExtrinsicUnknownError,
} from './errors'
import {
  AccountId,
  AssetMetadata,
  ChannelAssets,
  ChannelId,
  VideoId,
  CreateChannelMetadata,
  ExtrinsicResult,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  MemberId,
  CreateVideoMetadata,
  VideoAssets,
} from './types'

export class JoystreamJs {
  readonly api: ApiPromise

  private _selectedAccountId: AccountId | null = null
  get selectedAccountId() {
    return this._selectedAccountId
  }

  // if needed these could become some kind of event emitter
  public onNodeConnectionUpdate?: (connected: boolean) => unknown

  /* Lifecycle */
  constructor(endpoint: string) {
    const provider = new WsProvider(endpoint)
    provider.on('connected', () => {
      this.logConnectionData(endpoint)
      this.onNodeConnectionUpdate?.(true)
    })
    provider.on('disconnected', () => {
      this.onNodeConnectionUpdate?.(false)
    })
    provider.on('error', () => {
      this.onNodeConnectionUpdate?.(false)
    })

    this.api = new ApiPromise({ provider, types })
  }

  destroy() {
    this.api.disconnect()
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

  private async ensureApi() {
    try {
      await this.api.isReady
    } catch (e) {
      console.error('Polkadot API init error', e)
      throw new ApiNotConnectedError()
    }
  }

  private async logConnectionData(endpoint: string) {
    await this.ensureApi()
    const chain = await this.api.rpc.system.chain()
    this.log(`Connected to chain "${chain}" via "${endpoint}"`)
  }

  private async sendExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<GenericEvent[]>> {
    // async executor necessary here since we're listening for a callback
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ExtrinsicResult<GenericEvent[]>>(async (resolve, reject) => {
      if (!this.selectedAccountId) {
        reject(new AccountNotSelectedError())
        return
      }
      try {
        cb?.(ExtrinsicStatus.Unsigned)
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
                      // Need to assert that registry is of TypeRegistry type, since Registry interface
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
                  const blockHash = status.asFinalized
                  this.api.rpc.chain
                    .getHeader(blockHash)
                    .then(({ number }) => resolve({ block: number.toNumber(), data: unpackedEvents }))
                    .catch((reason) => reject(new ExtrinsicFailedError(reason)))
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
          reject(new ExtrinsicSignCancelledError())
          return
        }
        this.logError(`Unknown sendExtrinsic error: ${e}`)
        reject(e)
      }
    })
  }

  private async _createOrUpdateVideo(
    updatedVideoId: VideoId | null = null,
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: VideoAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    const newVideo = updatedVideoId === null

    // === video assets ===
    // first video, then thumbnail
    const newAssetsList: NewAsset[] = [
      ...(inputAssets.video ? [inputAssets.video] : []),
      ...(inputAssets.thumbnail ? [inputAssets.thumbnail] : []),
    ]

    // === video metadata ===
    const protoMeta = new VideoMetadata()
    if (inputMetadata.title != null) {
      protoMeta.setTitle(inputMetadata.title)
    }
    if (inputMetadata.description != null) {
      protoMeta.setDescription(inputMetadata.description)
    }
    if (inputMetadata.isPublic != null) {
      protoMeta.setIsPublic(inputMetadata.isPublic)
    }
    if (inputMetadata.language != null) {
      protoMeta.setLanguage(inputMetadata.language)
    }
    if (inputMetadata.isExplicit != null) {
      protoMeta.setIsExplicit(inputMetadata.isExplicit)
    }
    if (inputMetadata.category != null) {
      protoMeta.setCategory(inputMetadata.category)
    }
    if (inputMetadata.duration != null) {
      protoMeta.setDuration(inputMetadata.duration)
    }
    if (inputMetadata.mediaPixelHeight != null) {
      protoMeta.setMediaPixelHeight(inputMetadata.mediaPixelHeight)
    }
    if (inputMetadata.mediaPixelWidth != null) {
      protoMeta.setMediaPixelWidth(inputMetadata.mediaPixelWidth)
    }
    if (inputMetadata.hasMarketing != null) {
      protoMeta.setHasMarketing(inputMetadata.hasMarketing)
    }

    if (inputMetadata.license) {
      const protoLicenseType = new License()
      if (inputMetadata.license.code != null) {
        protoLicenseType.setCode(inputMetadata.license.code)
      }
      if (inputMetadata.license.attribution != null) {
        protoLicenseType.setAttribution(inputMetadata.license.attribution)
      }
      if (inputMetadata.license.customText != null) {
        protoLicenseType.setCustomText(inputMetadata.license.customText)
      }
      protoMeta.setLicense(protoLicenseType)
    }

    if (inputMetadata.mimeMediaType != null) {
      const protoMediaType = new MediaType()
      protoMediaType.setMimeMediaType(inputMetadata.mimeMediaType)
      protoMeta.setMediaType(protoMediaType)
    }

    if (inputMetadata.publishedBeforeJoystream != null) {
      const protoPublishedBeforeJoystream = new PublishedBeforeJoystream()
      protoPublishedBeforeJoystream.setIsPublished(true)
      protoPublishedBeforeJoystream.setDate(inputMetadata.publishedBeforeJoystream)
      protoMeta.setPublishedBeforeJoystream(protoPublishedBeforeJoystream)
    }

    if (inputAssets.video) {
      protoMeta.setVideo(0)
    }
    if (inputAssets.thumbnail) {
      protoMeta.setThumbnailPhoto(inputAssets.video ? 1 : 0)
    }

    const serializedProtoMeta = protoMeta.serializeBinary()
    const metaRaw = new Raw(this.api.registry, serializedProtoMeta)
    const metaBytes = new Bytes(this.api.registry, metaRaw)

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    let tx: SubmittableExtrinsic<'promise'>

    if (newVideo) {
      const assets = new Vec<NewAsset>(this.api.registry, NewAsset, newAssetsList)

      const params = new VideoCreationParameters(this.api.registry, {
        meta: metaBytes,
        assets: assets,
      })

      tx = this.api.tx.content.createVideo(contentActor, channelId, params)
    } else {
      const optionalMetaBytes = new Option<Bytes>(this.api.registry, Bytes, metaBytes)
      class OptionalAssetsVec extends Option.with(Vec.with(NewAsset)) {}
      const optionalAssets = new OptionalAssetsVec(this.api.registry, newAssetsList)

      const params = new VideoUpdateParameters(this.api.registry, {
        new_meta: optionalMetaBytes,
        assets: optionalAssets,
      })

      const videoId = new RuntimeVideoId(this.api.registry, updatedVideoId)
      tx = this.api.tx.content.updateVideo(contentActor, videoId, params)
    }

    const { data: events, block } = await this.sendExtrinsic(tx, cb)

    const contentEvents = events.filter((event) => event.section === 'content')
    const videoId = contentEvents[0].data[newVideo ? 2 : 1]
    return {
      data: new BN(videoId as never).toString(),
      block,
    }
  }

  private async _createOrUpdateChannel(
    updatedChannelId: ChannelId | null = null,
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: ChannelAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<ChannelId>> {
    const newChannel = updatedChannelId == null

    // === channel assets ===
    // first avatar, then cover photo
    const newAssetsList: NewAsset[] = [
      ...(inputAssets.avatar ? [inputAssets.avatar] : []),
      ...(inputAssets.cover ? [inputAssets.cover] : []),
    ]

    // === channel metadata ===
    const protoMeta = new ChannelMetadata()
    if (inputMetadata.title != null) {
      protoMeta.setTitle(inputMetadata.title)
    }
    if (inputMetadata.description != null) {
      protoMeta.setDescription(inputMetadata.description)
    }
    if (inputMetadata.isPublic != null) {
      protoMeta.setIsPublic(inputMetadata.isPublic)
    }
    if (inputMetadata.language != null) {
      protoMeta.setLanguage(inputMetadata.language)
    }
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

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    let tx: SubmittableExtrinsic<'promise'>

    if (newChannel) {
      const assets = new Vec<NewAsset>(this.api.registry, NewAsset, newAssetsList)

      const params = new ChannelCreationParameters(this.api.registry, {
        meta: metaBytes,
        assets: assets,
        reward_account: new Option<RuntimeAccountId>(this.api.registry, RuntimeAccountId),
      })

      tx = this.api.tx.content.createChannel(contentActor, params)
    } else {
      const optionalMetaBytes = new Option<Bytes>(this.api.registry, Bytes, metaBytes)
      class OptionalAssetsVec extends Option.with(Vec.with(NewAsset)) {}
      const optionalAssets = new OptionalAssetsVec(this.api.registry, newAssetsList)
      const optionalRewardAccount = new Option<Option<RuntimeAccountId>>(this.api.registry, Option)

      const params = new ChannelUpdateParameters(this.api.registry, {
        new_meta: optionalMetaBytes,
        assets: optionalAssets,
        reward_account: optionalRewardAccount,
      })

      const channelId = new RuntimeChannelId(this.api.registry, updatedChannelId)

      tx = this.api.tx.content.updateChannel(contentActor, channelId, params)
    }

    const { data: events, block } = await this.sendExtrinsic(tx, cb)

    const contentEvents = events.filter((event) => event.section === 'content')
    const channelId = contentEvents[0].data[1]
    return {
      data: new BN(channelId as never).toString(),
      block,
    }
  }

  /* Public */
  async setActiveAccount(accountId: AccountId | null, signer?: Signer) {
    if (!accountId) {
      this._selectedAccountId = null
      this.api.setSigner({})
      return
    } else if (!signer) {
      this.logError('Missing signer on active account set')
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

  createFileAsset({ ipfsContentId, size }: AssetMetadata): [NewAsset, string] {
    const contentId = ContentId.generate(this.api.registry)
    const content = new ContentParameters(this.api.registry, {
      content_id: contentId,
      // hardcoded type_id - it's not used but needs to be one of the allowed values
      type_id: new U64(this.api.registry, 1),
      size: new U64(this.api.registry, size),
      ipfs_content_id: new Bytes(this.api.registry, ipfsContentId),
    })
    return [new NewAsset(this.api.registry, { upload: content }), contentId.encode()]
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: ChannelAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<ChannelId>> {
    await this.ensureApi()

    return this._createOrUpdateChannel(null, memberId, inputMetadata, inputAssets, cb)
  }

  async updateChannel(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: ChannelAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<ChannelId>> {
    await this.ensureApi()

    return this._createOrUpdateChannel(channelId, memberId, inputMetadata, inputAssets, cb)
  }

  async createVideo(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: VideoAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    await this.ensureApi()

    return this._createOrUpdateVideo(null, memberId, channelId, inputMetadata, inputAssets, cb)
  }

  async updateVideo(
    videoId: VideoId,
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: VideoAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    await this.ensureApi()

    return this._createOrUpdateVideo(videoId, memberId, channelId, inputMetadata, inputAssets, cb)
  }

  async deleteVideo(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    await this.ensureApi()

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.deleteVideo(contentActor, videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      data: videoId,
    }
  }
}
