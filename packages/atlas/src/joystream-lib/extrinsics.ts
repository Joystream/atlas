import {
  ChannelCreationParameters,
  ChannelUpdateParameters,
  ContentActor,
  VideoCreationParameters,
  VideoUpdateParameters,
} from '@joystream/types/content'
import { MemberId as RuntimeMemberId } from '@joystream/types/members'
import { DataObjectId } from '@joystream/types/storage'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { BTreeSet, Option, GenericAccountId as RuntimeAccountId } from '@polkadot/types'

import { SentryLogger } from '@/utils/logs'

import { JoystreamLibError } from './errors'
import {
  extractChannelResultAssetsIds,
  extractVideoResultAssetsIds,
  getInputDataObjectsIds,
  sendExtrinsicAndParseEvents,
} from './helpers'
import { parseChannelExtrinsicInput, parseVideoExtrinsicInput } from './metadata'
import {
  AccountId,
  ChannelExtrinsicResult,
  ChannelId,
  ChannelInputAssets,
  ChannelInputMetadata,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  GetEventDataFn,
  MemberId,
  SendExtrinsicResult,
  VideoExtrinsicResult,
  VideoId,
  VideoInputAssets,
  VideoInputMetadata,
} from './types'

import { MemberExtrisincResult } from '.'

type AccountIdAccessor = () => AccountId | null

export class JoystreamLibExtrinsics {
  readonly api: PolkadotApi
  readonly getAccount: AccountIdAccessor

  constructor(api: PolkadotApi, getAccount: AccountIdAccessor) {
    this.api = api
    this.getAccount = getAccount
  }

  private async sendExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<SendExtrinsicResult> {
    const account = this.getAccount()
    if (!account) {
      throw new JoystreamLibError({ name: 'AccountNotSelectedError' })
    }

    try {
      cb?.(ExtrinsicStatus.Unsigned)

      const { events, blockHash } = await sendExtrinsicAndParseEvents(tx, account, this.api.registry, cb)

      const blockHeader = await this.api.rpc.chain.getHeader(blockHash)

      const getEventData: GetEventDataFn = (section, method) => {
        const event = events.find((event) => event.section === section && event.method === method)

        if (!event) {
          throw new JoystreamLibError({
            name: 'MissingRequiredEventError',
            message: `Required event ${section}.${method} not found in extrinsic`,
          })
        }

        return event.data as ReturnType<GetEventDataFn>
      }

      return { events, block: blockHeader.number.toNumber(), getEventData }
    } catch (error) {
      if (error?.message === 'Cancelled') {
        throw new JoystreamLibError({ name: 'SignCancelledError' })
      }
      throw error
    }
  }

  private async ensureApi() {
    try {
      await this.api.isReady
    } catch (e) {
      SentryLogger.error('Failed to initialize Polkadot API', 'JoystreamLib', e)
      throw new JoystreamLibError({ name: 'ApiNotConnectedError' })
    }
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)
    const creationParameters = new ChannelCreationParameters(this.api.registry, {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: new BTreeSet(this.api.registry, RuntimeMemberId),
      reward_account: new Option<RuntimeAccountId>(this.api.registry, RuntimeAccountId),
    })

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.createChannel(contentActor, creationParameters)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated')[1]

    return {
      channelId: channelId.toString(),
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
    }
  }

  async updateChannel(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)
    const updateParameters = new ChannelUpdateParameters(this.api.registry, {
      new_meta: channelMetadata,
      assets_to_upload: channelAssets,
      assets_to_remove: new BTreeSet(this.api.registry, DataObjectId, getInputDataObjectsIds(inputAssets)),
      collaborators: new Option<BTreeSet<RuntimeMemberId>>(this.api.registry, BTreeSet),
      reward_account: new Option<Option<RuntimeAccountId>>(this.api.registry, Option),
    })

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.updateChannel(contentActor, channelId, updateParameters)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
    }
  }

  async createVideo(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)
    const creationParameters = new VideoCreationParameters(this.api.registry, {
      meta: videoMetadata,
      assets: videoAssets,
    })

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.createVideo(contentActor, channelId, creationParameters)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const videoId = getEventData('content', 'VideoCreated')[2]

    return {
      videoId: videoId.toString(),
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  async updateVideo(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)
    const updateParameters = new VideoUpdateParameters(this.api.registry, {
      new_meta: videoMetadata,
      assets_to_upload: videoAssets,
      assets_to_remove: new BTreeSet(this.api.registry, DataObjectId, getInputDataObjectsIds(inputAssets)),
    })

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.updateVideo(contentActor, videoId, updateParameters)

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  async deleteVideo(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<Omit<VideoExtrinsicResult, 'assetsIds'>> {
    await this.ensureApi()

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.deleteVideo(contentActor, videoId, new BTreeSet(this.api.registry, DataObjectId))
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
    }
  }
  async updateMember(
    memberId: MemberId,
    handle: string | null,
    avatarUri: string | null,
    about: string | null,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MemberExtrisincResult> {
    await this.ensureApi()
    const tx = this.api.tx.members.updateMembership(memberId, handle, avatarUri, about)

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      memberId,
    }
  }
}
