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
  VideoId as RuntimeVideoId,
  VideoCreationParameters,
  VideoUpdateParameters,
} from '@joystream/types/content'
import { ContentId, ContentParameters } from '@joystream/types/storage'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types'
import {
  Bytes,
  GenericEvent,
  Option,
  Raw,
  GenericAccountId as RuntimeAccountId,
  TypeRegistry,
  u64 as U64,
  Vec,
} from '@polkadot/types'
import BN from 'bn.js'

import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { JoystreamLibError } from './errors'
import { sendExtrinsicAndParseEvents } from './helpers'
import {
  AccountId,
  AssetMetadata,
  ChannelAssets,
  ChannelId,
  CreateChannelMetadata,
  CreateVideoMetadata,
  ExtrinsicChannelContentIds,
  ExtrinsicResult,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  ExtrinsicVideoContentIds,
  InputAssets,
  MemberId,
  VideoAssets,
  VideoId,
} from './types'

export class JoystreamJs {
  readonly api: ApiPromise

  private _selectedAccountId: AccountId | null = null
  get selectedAccountId() {
    return this._selectedAccountId
  }

  /* Lifecycle */
  constructor(endpoint: string, onNodeConnectionUpdate: (connected: boolean) => void) {
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
  }

  destroy() {
    this.api.disconnect()
    ConsoleLogger.log('[JoystreamJs] Destroyed')
  }

  private async ensureApi() {
    try {
      await this.api.isReady
    } catch (e) {
      SentryLogger.error('Failed to initialize Polkadot API', 'JoystreamJs', e)
      throw new JoystreamLibError({ name: 'ApiNotConnectedError' })
    }
  }

  private async logConnectionData(endpoint: string) {
    await this.ensureApi()
    const chain = await this.api.rpc.system.chain()
    ConsoleLogger.log(`[JoystreamJs] Connected to chain "${chain}" via "${endpoint}"`)
  }

  private async sendExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<GenericEvent[]>> {
    if (!this.selectedAccountId) {
      throw new JoystreamLibError({ name: 'AccountNotSelectedError' })
    }

    try {
      cb?.(ExtrinsicStatus.Unsigned)

      const { events, blockHash } = await sendExtrinsicAndParseEvents(
        tx,
        this.selectedAccountId,
        this.api.registry as TypeRegistry,
        cb
      )

      const blockHeader = await this.api.rpc.chain.getHeader(blockHash)

      return { data: events, block: blockHeader.number.toNumber() }
    } catch (error) {
      if (error?.message === 'Cancelled') {
        throw new JoystreamLibError({ name: 'SignCancelledError' })
      }
      throw error
    }
  }

  private async _createOrUpdateVideo(
    updatedVideoId: VideoId | null = null,
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: VideoAssets,
    contentIds?: ExtrinsicVideoContentIds,
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
      contentIds,
    }
  }

  private async _createOrUpdateChannel(
    updatedChannelId: ChannelId | null = null,
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: ChannelAssets,
    contentIds?: ExtrinsicChannelContentIds,
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
      contentIds,
    }
  }

  /* Public */
  async setActiveAccount(accountId: AccountId | null, signer?: Signer) {
    if (!accountId) {
      this._selectedAccountId = null
      this.api.setSigner({})
      return
    } else if (!signer) {
      SentryLogger.error('Missing signer for setActiveAccount', 'JoystreamJs')
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

  private _createFileAsset({ ipfsContentId, size }: AssetMetadata): [NewAsset, string] {
    const contentId = ContentId.generate(this.api.registry)
    const b = new Bytes(this.api.registry, ipfsContentId)
    const content = new ContentParameters(this.api.registry, {
      content_id: contentId,
      // hardcoded type_id - it's not used but needs to be one of the allowed values
      type_id: new U64(this.api.registry, 1),
      size: new U64(this.api.registry, size),
      ipfs_content_id: b,
    })
    return [new NewAsset(this.api.registry, { upload: content }), contentId.encode()]
  }

  private _prepareChannelAssets(inputAssets: InputAssets) {
    return {
      avatarContent: inputAssets.avatar && this._createFileAsset(inputAssets.avatar),
      coverContent: inputAssets.cover && this._createFileAsset(inputAssets.cover),
    }
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: InputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<ChannelId>> {
    const { avatarContent, coverContent } = this._prepareChannelAssets(inputAssets)
    const assets: { [field: string]: [NewAsset, string] | undefined } = {
      avatarAsset: avatarContent || undefined,
      coverAsset: coverContent || undefined,
    }
    const contentIds = {
      avatarId: assets.avatarAsset ? assets.avatarAsset[1] : '',
      coverId: assets.coverAsset ? assets.coverAsset[1] : '',
    }
    await this.ensureApi()

    return this._createOrUpdateChannel(
      null,
      memberId,
      inputMetadata,
      { avatar: assets.avatarAsset && assets.avatarAsset[0], cover: assets.coverAssets && assets.coverAssets[0] },
      contentIds,
      cb
    )
  }

  async updateChannel(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: CreateChannelMetadata,
    inputAssets: InputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<ChannelId>> {
    const { avatarContent, coverContent } = this._prepareChannelAssets(inputAssets)
    const assets: { [field: string]: [NewAsset, string] | undefined } = {
      avatarAsset: avatarContent || undefined,
      coverAsset: coverContent || undefined,
    }
    const contentIds = {
      avatarId: assets.avatarAsset ? assets.avatarAsset[1] : '',
      coverId: assets.coverAsset ? assets.coverAsset[1] : '',
    }
    await this.ensureApi()

    return this._createOrUpdateChannel(
      channelId,
      memberId,
      inputMetadata,
      { avatar: assets.avatarAsset && assets.avatarAsset[0], cover: assets.coverAssets && assets.coverAssets[0] },
      contentIds,
      cb
    )
  }

  private _prepareVideoAssets(inputAssets: InputAssets) {
    return {
      videoContent: inputAssets.video ? this._createFileAsset(inputAssets.video) : [],
      thumbnailContent: inputAssets.thumbnail ? this._createFileAsset(inputAssets.thumbnail) : [],
    }
  }

  async createVideo(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: InputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    const {
      videoContent: [video, videoId],
      thumbnailContent: [thumbnail, thumbnailId],
    } = this._prepareVideoAssets(inputAssets)

    return this._createOrUpdateVideo(
      null,
      memberId,
      channelId,
      inputMetadata,
      { video, thumbnail },
      { videoId, thumbnailId },
      cb
    )
  }

  async updateVideo(
    updatedVideoId: VideoId,
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: CreateVideoMetadata,
    inputAssets: InputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ExtrinsicResult<VideoId>> {
    const { videoContent, thumbnailContent } = this._prepareVideoAssets(inputAssets)
    const assets: { [field: string]: [NewAsset, string] | never[] } = {
      videoAsset: videoContent || [],
      thumbnailAsset: thumbnailContent || [],
    }
    const contentIds = {
      videoId: assets.videoAsset ? assets.videoAsset[1] : '',
      thumbnailId: assets.thumbnailAsset ? assets.thumbnailAsset[1] : '',
    }
    await this.ensureApi()

    return this._createOrUpdateVideo(
      updatedVideoId,
      memberId,
      channelId,
      inputMetadata,
      {
        video: assets.videoAsset && assets.videoAsset[0],
        thumbnail: assets.thumbnailAsset && assets.thumbnailAsset[0],
      },
      contentIds,
      cb
    )
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
