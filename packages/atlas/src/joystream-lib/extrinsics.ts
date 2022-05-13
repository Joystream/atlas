import {
  ChannelOwnerRemarked,
  IChannelOwnerRemarked,
  IMemberRemarked,
  MemberRemarked,
  ReactVideo,
} from '@joystream/metadata-protobuf'
import { MemberId as RuntimeMemberId } from '@joystream/types/common'
import {
  ChannelCreationParameters,
  ChannelUpdateParameters,
  ContentActor,
  NftIssuanceParameters,
  VideoCreationParameters,
  VideoUpdateParameters,
} from '@joystream/types/content'
import { DataObjectId } from '@joystream/types/storage'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { BTreeSet, Bytes, Option, Raw, GenericAccountId as RuntimeAccountId, bool } from '@polkadot/types'
import Long from 'long'

import { SentryLogger } from '@/utils/logs'

import { JoystreamLibError } from './errors'
import {
  createNftEnglishAuctionParams,
  createNftIssuanceParameters,
  createNftOpenAuctionParams,
  extractChannelResultAssetsIds,
  extractVideoResultAssetsIds,
  getInputDataObjectsIds,
  sendExtrinsicAndParseEvents,
} from './helpers'
import { parseChannelExtrinsicInput, parseMemberExtrinsicInput, parseVideoExtrinsicInput } from './metadata'
import {
  AccountId,
  ChannelExtrinsicResult,
  ChannelId,
  ChannelInputAssets,
  ChannelInputMetadata,
  CommentReaction,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  GetEventDataFn,
  MemberExtrinsicResult,
  MemberId,
  MemberInputMetadata,
  MetaprotcolExtrinsicResult,
  NftAuctionType,
  NftExtrinsicResult,
  NftIssuanceInputMetadata,
  NftSaleInputMetadata,
  NftSaleType,
  SendExtrinsicResult,
  VideoExtrinsicResult,
  VideoId,
  VideoInputAssets,
  VideoInputMetadata,
  VideoReaction,
} from './types'

type AccountIdAccessor = () => AccountId | null

export class JoystreamLibExtrinsics {
  readonly api: PolkadotApi
  readonly getAccount: AccountIdAccessor
  readonly endpoint: string

  constructor(api: PolkadotApi, getAccount: AccountIdAccessor, endpoint: string) {
    this.api = api
    this.getAccount = getAccount
    this.endpoint = endpoint
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

      const { events, blockHash } = await sendExtrinsicAndParseEvents(tx, account, this.api.registry, this.endpoint, cb)

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
      collaborators: new BTreeSet(this.api.registry, RuntimeMemberId, [memberId]),
      moderators: new BTreeSet(this.api.registry, RuntimeMemberId, [memberId]),
      reward_account: new Option<RuntimeAccountId>(this.api.registry, RuntimeAccountId, inputMetadata.ownerAccount),
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
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(this.api.registry, nftInputMetadata)

    const creationParameters = new VideoCreationParameters(this.api.registry, {
      meta: videoMetadata,
      assets: videoAssets,
      enable_comments: new bool(this.api.registry, false),
      auto_issue_nft: new Option(this.api.registry, NftIssuanceParameters, nftIssuanceParameters),
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
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(this.api.registry, nftInputMetadata)

    const updateParameters = new VideoUpdateParameters(this.api.registry, {
      new_meta: videoMetadata,
      assets_to_upload: videoAssets,
      assets_to_remove: new BTreeSet(this.api.registry, DataObjectId, getInputDataObjectsIds(inputAssets)),
      enable_comments: new Option(this.api.registry, bool),
      auto_issue_nft: new Option(this.api.registry, NftIssuanceParameters, nftIssuanceParameters),
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

  async issueNft(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftIssuanceInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const nftIssuanceParameters = createNftIssuanceParameters(this.api.registry, inputMetadata)

    if (!nftIssuanceParameters) {
      throw new JoystreamLibError({
        name: 'FailedError',
        message: 'Failed to construct NftIssuanceParameters',
      })
    }

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.issueNft(contentActor, videoId, nftIssuanceParameters)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async putNftOnSale(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftSaleInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx =
      inputMetadata.type === 'buyNow'
        ? this.api.tx.content.sellNft(videoId, contentActor, inputMetadata.buyNowPrice)
        : inputMetadata.type === 'open'
        ? this.api.tx.content.startOpenAuction(
            contentActor,
            videoId,
            createNftOpenAuctionParams(this.api.registry, inputMetadata)
          )
        : this.api.tx.content.startEnglishAuction(
            contentActor,
            videoId,
            createNftEnglishAuctionParams(this.api.registry, inputMetadata)
          )

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async changeNftPrice(memberId: MemberId, videoId: VideoId, price: number, cb?: ExtrinsicStatusCallbackFn) {
    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx = this.api.tx.content.updateBuyNowPrice(contentActor, videoId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async cancelNftSale(
    videoId: VideoId,
    memberId: MemberId,
    saleType: NftSaleType,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const contentActor = new ContentActor(this.api.registry, {
      member: memberId,
    })
    const tx =
      saleType === 'buyNow'
        ? this.api.tx.content.cancelBuyNow(contentActor, videoId)
        : saleType === 'open'
        ? this.api.tx.content.cancelOpenAuction(contentActor, videoId)
        : this.api.tx.content.cancelEnglishAuction(contentActor, videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async buyNftNow(
    videoId: VideoId,
    memberId: MemberId,
    priceCommitment: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, new RuntimeMemberId(this.api.registry, memberId), priceCommitment)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async makeNftBid(
    videoId: VideoId,
    memberId: MemberId,
    bidPrice: number,
    auctionType: NftAuctionType,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx =
      auctionType === 'open'
        ? this.api.tx.content.makeOpenAuctionBid(new RuntimeMemberId(this.api.registry, memberId), videoId, bidPrice)
        : this.api.tx.content.makeEnglishAuctionBid(new RuntimeMemberId(this.api.registry, memberId), videoId, bidPrice)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async cancelNftBid(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx = this.api.tx.content.cancelOpenAuctionBid(new RuntimeMemberId(this.api.registry, memberId), videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async acceptNftBid(
    ownerId: MemberId,
    videoId: VideoId,
    bidderId: MemberId,
    price: string,
    cb?: ExtrinsicStatusCallbackFn
  ) {
    await this.ensureApi()
    const contentActor = new ContentActor(this.api.registry, {
      member: ownerId,
    })
    const tx = this.api.tx.content.pickOpenAuctionWinner(contentActor, videoId, bidderId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async settleEnglishAuction(videoId: VideoId, cb?: ExtrinsicStatusCallbackFn): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async updateMember(
    memberId: MemberId,
    handle: string | null,
    inputMetadata: MemberInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MemberExtrinsicResult> {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      memberId,
    }
  }

  private async sendMetaprotocolMemberExtrinsic(
    memberId: MemberId,
    msg: IMemberRemarked,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    await this.ensureApi()

    const serializedMetadata = MemberRemarked.encode(msg).finish()
    const metadataRaw = new Raw(this.api.registry, serializedMetadata)
    const metadataBytes = new Bytes(this.api.registry, metadataRaw)

    const tx = this.api.tx.members.memberRemark(memberId, metadataBytes)
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
    }
  }

  private async sendMetaprotocolChannelExtrinsic(
    memberId: MemberId,
    channelId: ChannelId,
    msg: IChannelOwnerRemarked,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    await this.ensureApi()

    const serializedMetadata = ChannelOwnerRemarked.encode(msg).finish()
    const metadataRaw = new Raw(this.api.registry, serializedMetadata)
    const metadataBytes = new Bytes(this.api.registry, metadataRaw)

    const tx = this.api.tx.content.channelOwnerRemark({ Member: memberId }, channelId, metadataBytes)
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
    }
  }

  async reactToVideo(memberId: MemberId, videoId: VideoId, reaction: VideoReaction, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromString(videoId),
        reaction: reaction === 'like' ? ReactVideo.Reaction.LIKE : ReactVideo.Reaction.UNLIKE,
      },
    }
    return this.sendMetaprotocolMemberExtrinsic(memberId, msg, cb)
  }

  async createVideoComment(
    memberId: MemberId,
    videoId: VideoId,
    commentBody: string,
    parentCommentId: string | null,
    cb?: ExtrinsicStatusCallbackFn
  ) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      createComment: {
        videoId: Long.fromString(videoId),
        body: commentBody,
        parentCommentId,
      },
    }
    return this.sendMetaprotocolMemberExtrinsic(memberId, msg, cb)
  }

  async editVideoComment(memberId: MemberId, commentId: string, newBody: string, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      editComment: {
        commentId,
        newBody,
      },
    }

    return this.sendMetaprotocolMemberExtrinsic(memberId, msg, cb)
  }

  async deleteVideoComment(memberId: MemberId, commentId: string, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      deleteComment: {
        commentId,
      },
    }
    return this.sendMetaprotocolMemberExtrinsic(memberId, msg, cb)
  }

  async moderateComment(memberId: MemberId, channelId: MemberId, commentId: string, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const msg: IChannelOwnerRemarked = {
      moderateComment: {
        commentId,
        rationale: 'I want to delete this comment',
      },
    }
    return this.sendMetaprotocolChannelExtrinsic(memberId, channelId, msg, cb)
  }

  async reactToVideoComment(
    memberId: MemberId,
    commentId: string,
    reactionId: CommentReaction,
    cb?: ExtrinsicStatusCallbackFn
  ) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      reactComment: {
        commentId,
        reactionId,
      },
    }
    return this.sendMetaprotocolMemberExtrinsic(memberId, msg, cb)
  }
}
