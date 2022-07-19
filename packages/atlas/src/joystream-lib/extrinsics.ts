import {
  ChannelOwnerRemarked,
  IChannelOwnerRemarked,
  IMemberRemarked,
  MemberRemarked,
  ReactVideo,
} from '@joystream/metadata-protobuf'
import { createType } from '@joystream/types'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { PalletContentPermissionsContentActor } from '@polkadot/types/lookup'
import BN, { isBN } from 'bn.js'
import Long from 'long'

import { SentryLogger } from '@/utils/logs'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/utils/number'

import { JoystreamLibError } from './errors'
import {
  createActor,
  createNftEnglishAuctionParams,
  createNftIssuanceParameters,
  createNftOpenAuctionParams,
  extractChannelResultAssetsIds,
  extractVideoResultAssetsIds,
  getReplacedDataObjectsIds,
  sendExtrinsicAndParseEvents,
} from './helpers'
import {
  parseChannelExtrinsicInput,
  parseMemberExtrinsicInput,
  parseVideoExtrinsicInput,
  wrapMetadata,
} from './metadata'
import {
  AccountId,
  ChannelExtrinsicResult,
  ChannelId,
  ChannelInputAssets,
  ChannelInputBuckets,
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
  TxMethodName,
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

      const { events, blockHash, transactionHash } = await sendExtrinsicAndParseEvents(
        tx,
        account,
        this.api.registry,
        this.endpoint,
        cb
      )

      const blockHeader = await this.api.rpc.chain.getHeader(blockHash)

      const getEventData: GetEventDataFn = (section, method) => {
        const event = events.find((event) => event.section === section && event.method === method)

        if (!event) {
          throw new JoystreamLibError({
            name: 'MissingRequiredEventError',
            message: `Required event ${section}.${String(method)} not found in extrinsic`,
          })
        }

        return event.data as ReturnType<GetEventDataFn>
      }

      return { events, block: blockHeader.number.toNumber(), getEventData, transactionHash }
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

  async createChannelTx(
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets,
    expectedDataObjectStateBloatBond: number,
    expectedChannelStateBloatBond: number
  ) {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)

    const creationParameters = createType('PalletContentChannelCreationParametersRecord', {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: createType('BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>', {}),
      storageBuckets: createType('BTreeSet<u64>', inputBuckets.storage),
      distributionBuckets: createType('BTreeSet<PalletStorageDistributionBucketIdRecord>', inputBuckets.distribution),
      expectedDataObjectStateBloatBond: tokenNumberToHapiBn(expectedDataObjectStateBloatBond),
      expectedChannelStateBloatBond: tokenNumberToHapiBn(expectedChannelStateBloatBond),
    })

    const channelOwner = createType('PalletContentChannelOwner', { Member: parseInt(memberId) })
    const tx = this.api.tx.content.createChannel(channelOwner, creationParameters)
    return tx
  }

  async getFee<TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
    address: string,
    method: TxMethodName,
    args: TArgs
  ) {
    // @ts-ignore Warning about not having spread argument as a tuple. We can ignore this
    const tx = await this[method](...args)
    return hapiBnToTokenNumber((await tx.paymentInfo(address)).partialFee.toBn())
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets,
    expectedDataObjectStateBloatBond: number,
    expectedChannelStateBloatBond: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    const tx = await this.createChannelTx(
      memberId,
      inputMetadata,
      inputAssets,
      inputBuckets,
      expectedDataObjectStateBloatBond,
      expectedChannelStateBloatBond
    )

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated').find((el) => isBN(el))
    if (!channelId) {
      throw new JoystreamLibError({
        name: 'FailedError',
        message: `Channel id was not returned from event data`,
      })
    }
    return {
      channelId: channelId.toString(),
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
    }
  }

  async updateChannelTx(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    expectedDataObjectStateBloatBond: number
  ) {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)
    const updateParameters = createType('PalletContentChannelUpdateParametersRecord', {
      newMeta: channelMetadata,
      assetsToUpload: channelAssets,
      assetsToRemove: createType('BTreeSet<u64>', getReplacedDataObjectsIds(inputAssets)),
      collaborators: createType('Option<BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>>', null),
      expectedDataObjectStateBloatBond: tokenNumberToHapiBn(expectedDataObjectStateBloatBond),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateChannel(actor, channelId, updateParameters)
    return tx
  }

  async updateChannel(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    expectedDataObjectStateBloatBond: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    const tx = await this.updateChannelTx(
      channelId,
      memberId,
      inputMetadata,
      inputAssets,
      expectedDataObjectStateBloatBond
    )
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData, true),
    }
  }

  async createVideoTx(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    expectedDataObjectStateBloatBond: number,
    expectedVideoStateBloatBond: number
  ) {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)
    const creationParameters = createType('PalletContentVideoCreationParametersRecord', {
      meta: videoMetadata,
      assets: videoAssets,
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: tokenNumberToHapiBn(expectedDataObjectStateBloatBond),
      expectedVideoStateBloatBond: tokenNumberToHapiBn(expectedVideoStateBloatBond),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.createVideo(actor, channelId, creationParameters)

    return tx
  }

  async createVideo(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    expectedDataObjectStateBloatBond: number,
    expectedVideoStateBloatBond: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    const tx = await this.createVideoTx(
      memberId,
      channelId,
      inputMetadata,
      nftInputMetadata,
      inputAssets,
      expectedDataObjectStateBloatBond,
      expectedVideoStateBloatBond
    )
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const videoId = getEventData('content', 'VideoCreated')[2]

    return {
      videoId: videoId.toString(),
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  async updateVideoTx(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    expectedDataObjectStateBloatBond: number
  ) {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const updateParameters = createType('PalletContentVideoUpdateParametersRecord', {
      newMeta: videoMetadata,
      assetsToUpload: videoAssets,
      assetsToRemove: getReplacedDataObjectsIds(inputAssets),
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: tokenNumberToHapiBn(expectedDataObjectStateBloatBond),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateVideo(actor, videoId, updateParameters)
    return tx
  }

  async updateVideo(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    expectedDataObjectStateBloatBond: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    const tx = await this.updateVideoTx(
      videoId,
      memberId,
      inputMetadata,
      nftInputMetadata,
      inputAssets,
      expectedDataObjectStateBloatBond
    )

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  async deleteVideoTx(videoId: VideoId, memberId: MemberId) {
    await this.ensureApi()

    const actor = createActor(memberId)
    const tx = this.api.tx.content.deleteVideo(actor, videoId, 2) // all videos should have 2 assets (media + thumbnail)

    return tx
  }

  async deleteVideo(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<Omit<VideoExtrinsicResult, 'assetsIds'>> {
    const tx = await this.deleteVideoTx(videoId, memberId)
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
    }
  }

  async issueNftTx(videoId: VideoId, memberId: MemberId, inputMetadata: NftIssuanceInputMetadata) {
    await this.ensureApi()

    const nftIssuanceParameters = createNftIssuanceParameters(inputMetadata).unwrap()

    const actor = createActor(memberId)
    const tx = this.api.tx.content.issueNft(actor, videoId, nftIssuanceParameters)

    return tx
  }

  async issueNft(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftIssuanceInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.issueNftTx(videoId, memberId, inputMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async putNftOnSaleTx(videoId: VideoId, memberId: MemberId, inputMetadata: NftSaleInputMetadata) {
    await this.ensureApi()

    const actor = createActor(memberId)
    const tx =
      inputMetadata.type === 'buyNow'
        ? this.api.tx.content.sellNft(videoId, actor, tokenNumberToHapiBn(inputMetadata.buyNowPrice))
        : inputMetadata.type === 'open'
        ? this.api.tx.content.startOpenAuction(actor, videoId, createNftOpenAuctionParams(inputMetadata))
        : this.api.tx.content.startEnglishAuction(actor, videoId, createNftEnglishAuctionParams(inputMetadata))

    return tx
  }

  async putNftOnSale(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftSaleInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.putNftOnSaleTx(videoId, memberId, inputMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async changeNftPriceTx(memberId: MemberId, videoId: VideoId, price: number) {
    await this.ensureApi()
    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateBuyNowPrice(actor, videoId, tokenNumberToHapiBn(price))

    return tx
  }

  async changeNftPrice(
    memberId: MemberId,
    videoId: VideoId,
    price: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.changeNftPriceTx(memberId, videoId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async cancelNftSaleTx(videoId: VideoId, memberId: MemberId, saleType: NftSaleType) {
    await this.ensureApi()

    const actor = createActor(memberId)
    const tx =
      saleType === 'buyNow'
        ? this.api.tx.content.cancelBuyNow(actor, videoId)
        : saleType === 'open'
        ? this.api.tx.content.cancelOpenAuction(actor, videoId)
        : this.api.tx.content.cancelEnglishAuction(actor, videoId)

    return tx
  }

  async cancelNftSale(
    videoId: VideoId,
    memberId: MemberId,
    saleType: NftSaleType,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.cancelNftSaleTx(videoId, memberId, saleType)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async buyNftNowTx(videoId: VideoId, memberId: MemberId, priceCommitment: number) {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, memberId, tokenNumberToHapiBn(priceCommitment))
    return tx
  }

  async buyNftNow(
    videoId: VideoId,
    memberId: MemberId,
    priceCommitment: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.buyNftNowTx(videoId, memberId, priceCommitment)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async makeNftBidTx(videoId: VideoId, memberId: MemberId, bidPrice: number, auctionType: NftAuctionType) {
    await this.ensureApi()

    const tx =
      auctionType === 'open'
        ? this.api.tx.content.makeOpenAuctionBid(memberId, videoId, tokenNumberToHapiBn(bidPrice))
        : this.api.tx.content.makeEnglishAuctionBid(memberId, videoId, tokenNumberToHapiBn(bidPrice))

    return tx
  }

  async makeNftBid(
    videoId: VideoId,
    memberId: MemberId,
    bidPrice: number,
    auctionType: NftAuctionType,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.makeNftBidTx(videoId, memberId, bidPrice, auctionType)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async cancelNftBidTx(videoId: VideoId, memberId: MemberId) {
    await this.ensureApi()

    const tx = this.api.tx.content.cancelOpenAuctionBid(memberId, videoId)
    return tx
  }

  async cancelNftBid(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.cancelNftBidTx(memberId, videoId)
    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async acceptNftBidTx(ownerId: MemberId, videoId: VideoId, bidderId: MemberId, price: number) {
    await this.ensureApi()
    const actor = createActor(ownerId)
    const tx = this.api.tx.content.pickOpenAuctionWinner(actor, videoId, bidderId, tokenNumberToHapiBn(price))
    return tx
  }

  async acceptNftBid(
    ownerId: MemberId,
    videoId: VideoId,
    bidderId: MemberId,
    price: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.acceptNftBidTx(ownerId, videoId, bidderId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async settleEnglishAuctionTx(videoId: VideoId) {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)
    return tx
  }

  async settleEnglishAuction(videoId: VideoId, cb?: ExtrinsicStatusCallbackFn): Promise<NftExtrinsicResult> {
    const tx = await this.settleEnglishAuctionTx(videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async updateMemberTx(memberId: MemberId, handle: string | null, inputMetadata: MemberInputMetadata) {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)
    return tx
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

  async metaprotocolMemberExtrinsicTx(memberId: MemberId, msg: IMemberRemarked) {
    await this.ensureApi()

    const metadata = wrapMetadata(MemberRemarked.encode(msg).finish()).unwrap()

    const tx = this.api.tx.members.memberRemark(memberId, metadata)
    return tx
  }

  async sendMetaprotocolMemberExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const { block, transactionHash } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      metaprotocol: true,
      transactionHash,
    }
  }

  async metaprotocolChannelExtrinsicTx(channelId: MemberId, msg: IChannelOwnerRemarked) {
    await this.ensureApi()

    const metadata = wrapMetadata(ChannelOwnerRemarked.encode(msg).finish()).unwrap()
    const tx = this.api.tx.content.channelOwnerRemark(channelId, metadata)
    return tx
  }

  async sendMetaprotocolChannelExtrinsic(
    tx: SubmittableExtrinsic<'promise'>,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const { block, transactionHash } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      metaprotocol: true,
      transactionHash,
    }
  }

  async reactToVideoTx(memberId: MemberId, videoId: VideoId, reaction: VideoReaction) {
    await this.ensureApi()
    const msg: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromString(videoId),
        reaction: reaction === 'like' ? ReactVideo.Reaction.LIKE : ReactVideo.Reaction.UNLIKE,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  async reactToVideo(
    memberId: MemberId,
    videoId: VideoId,
    reaction: VideoReaction,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.reactToVideoTx(memberId, videoId, reaction)
    return this.sendMetaprotocolMemberExtrinsic(tx, cb)
  }

  async createVideoCommentTx(
    memberId: MemberId,
    videoId: VideoId,
    commentBody: string,
    parentCommentId: string | null
  ) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      createComment: {
        videoId: Long.fromString(videoId),
        body: commentBody,
        parentCommentId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  async createVideoComment(
    memberId: MemberId,
    videoId: VideoId,
    commentBody: string,
    parentCommentId: string | null,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.createVideoCommentTx(memberId, videoId, commentBody, parentCommentId)
    return this.sendMetaprotocolMemberExtrinsic(tx, cb)
  }

  async editVideoCommentTx(memberId: MemberId, commentId: string, newBody: string) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      editComment: {
        commentId,
        newBody,
      },
    }

    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }
  async editVideoComment(
    memberId: MemberId,
    commentId: string,
    newBody: string,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.editVideoCommentTx(memberId, commentId, newBody)
    return this.sendMetaprotocolMemberExtrinsic(tx, cb)
  }

  async deleteVideoCommentTx(memberId: MemberId, commentId: string) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      deleteComment: {
        commentId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  async deleteVideoComment(
    memberId: MemberId,
    commentId: string,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.deleteVideoCommentTx(memberId, commentId)
    return this.sendMetaprotocolMemberExtrinsic(tx, cb)
  }

  async moderateCommentTx(channelId: ChannelId, commentId: string) {
    await this.ensureApi()

    const msg: IChannelOwnerRemarked = {
      moderateComment: {
        commentId,
        rationale: '',
      },
    }
    return this.metaprotocolChannelExtrinsicTx(channelId, msg)
  }

  async moderateComment(
    channelId: ChannelId,
    commentId: string,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.moderateCommentTx(channelId, commentId)
    return this.sendMetaprotocolChannelExtrinsic(tx, cb)
  }

  async reactToVideoCommentTx(memberId: MemberId, commentId: string, reactionId: CommentReaction) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      reactComment: {
        commentId,
        reactionId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  async reactToVideoComment(
    memberId: MemberId,
    commentId: string,
    reactionId: CommentReaction,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.reactToVideoCommentTx(memberId, commentId, reactionId)
    return this.sendMetaprotocolMemberExtrinsic(tx, cb)
  }

  async sendFundsTx(destinationAccount: MemberId, value: BN) {
    await this.ensureApi()

    return this.api.tx.balances.transfer(destinationAccount, value)
  }

  async sendFunds(destinationAccount: MemberId, value: BN, cb?: ExtrinsicStatusCallbackFn) {
    const tx = await this.sendFundsTx(destinationAccount, value)
    return await this.sendExtrinsic(tx, cb)
  }

  async withdrawFromChannelBalanceTx(actor: PalletContentPermissionsContentActor, channelId: string, amount: BN) {
    await this.ensureApi()

    return this.api.tx.content.withdrawFromChannelBalance(actor, channelId, amount)
  }

  async withdrawFromChannelBalance(memberId: string, channelId: string, amount: BN, cb?: ExtrinsicStatusCallbackFn) {
    const actor = createActor(memberId)
    const tx = await this.withdrawFromChannelBalanceTx(actor, channelId, amount)

    return await this.sendExtrinsic(tx, cb)
  }
}
