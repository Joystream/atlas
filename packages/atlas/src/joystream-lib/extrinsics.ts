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
import Long from 'long'

import { SentryLogger } from '@/utils/logs'

import { JoystreamLibError } from './errors'
import {
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
  VideoExtrinsicResult,
  VideoId,
  VideoInputAssets,
  VideoInputMetadata,
  VideoReaction,
} from './types'

type AccountIdAccessor = () => AccountId | null

const BILLION = 1_000_000_000

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

  private async createChannelTx(
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets
  ) {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)

    const dataObjectStateBloatBond = await this.api.query.storage.dataObjectStateBloatBondValue()
    const channelStateBloatBond = await this.api.query.content.channelStateBloatBondValue()

    const creationParameters = createType('PalletContentChannelCreationParametersRecord', {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: createType('BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>', {}),
      storageBuckets: createType('BTreeSet<u64>', inputBuckets.storage),
      distributionBuckets: createType('BTreeSet<PalletStorageDistributionBucketIdRecord>', inputBuckets.distribution),
      expectedDataObjectStateBloatBond: dataObjectStateBloatBond,
      expectedChannelStateBloatBond: channelStateBloatBond,
    })

    const channelOwner = createType('PalletContentChannelOwner', { Member: parseInt(memberId) })
    const tx = this.api.tx.content.createChannel(channelOwner, creationParameters)
    return tx
  }

  private async getFee(tx: SubmittableExtrinsic<'promise'>, address: string) {
    return (await tx.paymentInfo(address)).partialFee.toNumber() / BILLION
  }

  async getCreateChannelFee(
    address: string,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets
  ) {
    const tx = await this.createChannelTx(memberId, inputMetadata, inputAssets, inputBuckets)

    return this.getFee(tx, address)
  }

  async createChannel(
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    const tx = await this.createChannelTx(memberId, inputMetadata, inputAssets, inputBuckets)

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated')[1]

    return {
      channelId: channelId.toString(),
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
    }
  }

  private async updateChannelTx(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets
  ) {
    await this.ensureApi()

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)
    const updateParameters = createType('PalletContentChannelUpdateParametersRecord', {
      newMeta: channelMetadata,
      assetsToUpload: channelAssets,
      assetsToRemove: createType('BTreeSet<u64>', getReplacedDataObjectsIds(inputAssets)),
      collaborators: createType('Option<BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>>', null),
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.updateChannel(actor, channelId, updateParameters)
    return tx
  }

  async getUpdateChannelFee(
    address: string,
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets
  ) {
    const tx = await this.updateChannelTx(channelId, memberId, inputMetadata, inputAssets)
    return this.getFee(tx, address)
  }

  async updateChannel(
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    const tx = await this.updateChannelTx(channelId, memberId, inputMetadata, inputAssets)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData, true),
    }
  }

  private async createVideoTx(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets
  ) {
    await this.ensureApi()

    const dataObjectStateBloatBond = await this.api.query.storage.dataObjectStateBloatBondValue()
    const videoStateBloatBond = await this.api.query.content.videoStateBloatBondValue()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const creationParameters = createType('PalletContentVideoCreationParametersRecord', {
      meta: videoMetadata,
      assets: videoAssets,
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: dataObjectStateBloatBond,
      expectedVideoStateBloatBond: videoStateBloatBond,
    })

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.createVideo(actor, channelId, creationParameters)

    return tx
  }

  async getCreateVideoFee(
    address: string,
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets
  ) {
    const tx = await this.createVideoTx(memberId, channelId, inputMetadata, nftInputMetadata, inputAssets)

    return this.getFee(tx, address)
  }

  async createVideo(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    const tx = await this.createVideoTx(memberId, channelId, inputMetadata, nftInputMetadata, inputAssets)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const videoId = getEventData('content', 'VideoCreated')[2]

    return {
      videoId: videoId.toString(),
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  private async updateVideoTx(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets
  ) {
    await this.ensureApi()

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const updateParameters = createType('PalletContentVideoUpdateParametersRecord', {
      newMeta: videoMetadata,
      assetsToUpload: videoAssets,
      assetsToRemove: getReplacedDataObjectsIds(inputAssets),
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.updateVideo(actor, videoId, updateParameters)
    return tx
  }

  async getUpdateVideoFee(
    address: string,
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets
  ) {
    const tx = await this.updateVideoTx(videoId, memberId, inputMetadata, nftInputMetadata, inputAssets)

    return this.getFee(tx, address)
  }

  async updateVideo(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    const tx = await this.updateVideoTx(videoId, memberId, inputMetadata, nftInputMetadata, inputAssets)

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  private async deleteVideoTx(videoId: VideoId, memberId: MemberId) {
    await this.ensureApi()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.deleteVideo(actor, videoId, 2) // all videos should have 2 assets (media + thumbnail)

    return tx
  }

  async getDeleteVideoFee(address: string, videoId: VideoId, memberId: MemberId) {
    const tx = await this.deleteVideoTx(videoId, memberId)

    return this.getFee(tx, address)
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

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.issueNft(actor, videoId, nftIssuanceParameters)

    return tx
  }

  async getIssueNftFee(address: string, videoId: VideoId, memberId: MemberId, inputMetadata: NftIssuanceInputMetadata) {
    const tx = await this.issueNftTx(videoId, memberId, inputMetadata)

    return this.getFee(tx, address)
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

  private async putNftOnSaleTx(videoId: VideoId, memberId: MemberId, inputMetadata: NftSaleInputMetadata) {
    await this.ensureApi()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx =
      inputMetadata.type === 'buyNow'
        ? this.api.tx.content.sellNft(videoId, actor, inputMetadata.buyNowPrice)
        : inputMetadata.type === 'open'
        ? this.api.tx.content.startOpenAuction(actor, videoId, createNftOpenAuctionParams(inputMetadata))
        : this.api.tx.content.startEnglishAuction(actor, videoId, createNftEnglishAuctionParams(inputMetadata))

    return tx
  }

  async getPutNftOnSaleFee(address: string, videoId: VideoId, memberId: MemberId, inputMetadata: NftSaleInputMetadata) {
    const tx = await this.putNftOnSaleTx(videoId, memberId, inputMetadata)

    return this.getFee(tx, address)
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

  private async changeNftPriceTx(memberId: MemberId, videoId: VideoId, price: number) {
    await this.ensureApi()
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.updateBuyNowPrice(actor, videoId, price)

    return tx
  }

  async getChangeNftPriceFee(address: string, memberId: MemberId, videoId: VideoId, price: number) {
    const tx = await this.changeNftPriceTx(memberId, videoId, price)

    return this.getFee(tx, address)
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

  private async cancelNftSaleTx(videoId: VideoId, memberId: MemberId, saleType: NftSaleType) {
    await this.ensureApi()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx =
      saleType === 'buyNow'
        ? this.api.tx.content.cancelBuyNow(actor, videoId)
        : saleType === 'open'
        ? this.api.tx.content.cancelOpenAuction(actor, videoId)
        : this.api.tx.content.cancelEnglishAuction(actor, videoId)

    return tx
  }

  async getCancelNftSaleFee(address: string, videoId: VideoId, memberId: MemberId, saleType: NftSaleType) {
    const tx = await this.cancelNftSaleTx(videoId, memberId, saleType)

    return this.getFee(tx, address)
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

  private async buyNftNowTx(videoId: VideoId, memberId: MemberId, priceCommitment: number) {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, memberId, priceCommitment)
    return tx
  }

  async getBuyNftNowFee(address: string, videoId: VideoId, memberId: MemberId, priceCommitment: number) {
    const tx = await this.buyNftNowTx(videoId, memberId, priceCommitment)
    return this.getFee(tx, address)
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

  private async makeNftBidTx(videoId: VideoId, memberId: MemberId, bidPrice: number, auctionType: NftAuctionType) {
    await this.ensureApi()

    const tx =
      auctionType === 'open'
        ? this.api.tx.content.makeOpenAuctionBid(memberId, videoId, bidPrice)
        : this.api.tx.content.makeEnglishAuctionBid(memberId, videoId, bidPrice)

    return tx
  }
  async getMakeNftBidFee(
    address: string,
    videoId: VideoId,
    memberId: MemberId,
    bidPrice: number,
    auctionType: NftAuctionType
  ) {
    const tx = await this.makeNftBidTx(videoId, memberId, bidPrice, auctionType)

    return this.getFee(tx, address)
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

  private async cancelNftBidTx(videoId: VideoId, memberId: MemberId) {
    await this.ensureApi()

    const tx = this.api.tx.content.cancelOpenAuctionBid(memberId, videoId)
    return tx
  }

  async getCancelNftBidFee(address: string, videoId: VideoId, memberId: MemberId) {
    const tx = await this.cancelNftBidTx(memberId, videoId)
    return this.getFee(tx, address)
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

  private async acceptNftBidTx(ownerId: MemberId, videoId: VideoId, bidderId: MemberId, price: string) {
    await this.ensureApi()
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(ownerId),
    })
    const tx = this.api.tx.content.pickOpenAuctionWinner(actor, videoId, bidderId, price)
    return tx
  }

  async getAcceptNftBidFee(address: string, ownerId: MemberId, videoId: VideoId, bidderId: MemberId, price: string) {
    const tx = await this.acceptNftBidTx(ownerId, videoId, bidderId, price)
    return this.getFee(tx, address)
  }

  async acceptNftBid(
    ownerId: MemberId,
    videoId: VideoId,
    bidderId: MemberId,
    price: string,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const tx = await this.acceptNftBidTx(ownerId, videoId, bidderId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  private async settleEnglishAuctionTx(videoId: VideoId) {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)
    return tx
  }

  async getSettleEnglishAuctionFee(address: string, videoId: VideoId) {
    const tx = await this.settleEnglishAuctionTx(videoId)
    return this.getFee(tx, address)
  }

  async settleEnglishAuction(videoId: VideoId, cb?: ExtrinsicStatusCallbackFn): Promise<NftExtrinsicResult> {
    const tx = await this.settleEnglishAuctionTx(videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  private async updateMemberTx(memberId: MemberId, handle: string | null, inputMetadata: MemberInputMetadata) {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)
    return tx
  }

  async getUpdateMemberFee(
    address: string,
    memberId: MemberId,
    handle: string | null,
    inputMetadata: MemberInputMetadata
  ) {
    const tx = await this.updateMemberTx(memberId, handle, inputMetadata)

    return this.getFee(tx, address)
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

  private async metaprotocolMemberExtrinsicTx(memberId: MemberId, msg: IMemberRemarked) {
    await this.ensureApi()

    const metadata = wrapMetadata(MemberRemarked.encode(msg).finish()).unwrap()

    const tx = this.api.tx.members.memberRemark(memberId, metadata)
    return tx
  }

  private async sendMetaprotocolMemberExtrinsic(
    memberId: MemberId,
    msg: IMemberRemarked,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    const { block, transactionHash } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      transactionHash,
    }
  }

  private async metaprotocolChannelExtrinsicTx(channelId: MemberId, msg: IChannelOwnerRemarked) {
    await this.ensureApi()

    const metadata = wrapMetadata(ChannelOwnerRemarked.encode(msg).finish()).unwrap()

    const tx = this.api.tx.content.channelOwnerRemark(channelId, metadata)
    return tx
  }

  private async sendMetaprotocolChannelExtrinsic(
    channelId: ChannelId,
    msg: IChannelOwnerRemarked,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    const tx = await this.metaprotocolChannelExtrinsicTx(channelId, msg)
    const { block, transactionHash } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      transactionHash,
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
  async getReactToVideoFee(address: string, memberId: MemberId, videoId: VideoId, reaction: VideoReaction) {
    const msg: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromString(videoId),
        reaction: reaction === 'like' ? ReactVideo.Reaction.LIKE : ReactVideo.Reaction.UNLIKE,
      },
    }
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    return this.getFee(tx, address)
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

  async getCreateVideoCommentFee(
    address: string,
    memberId: MemberId,
    videoId: VideoId,
    commentBody: string,
    parentCommentId: string | null
  ) {
    const msg: IMemberRemarked = {
      createComment: {
        videoId: Long.fromString(videoId),
        body: commentBody,
        parentCommentId,
      },
    }
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    return this.getFee(tx, address)
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

  async getEditVideoCommentFee(address: string, memberId: MemberId, commentId: string, newBody: string) {
    const msg: IMemberRemarked = {
      editComment: {
        commentId,
        newBody,
      },
    }
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    return this.getFee(tx, address)
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

  async getDeleteVideoCommentFee(address: string, memberId: MemberId, commentId: string) {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      deleteComment: {
        commentId,
      },
    }
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    return this.getFee(tx, address)
  }

  async moderateComment(channelId: MemberId, commentId: string, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const msg: IChannelOwnerRemarked = {
      moderateComment: {
        commentId,
        rationale: '',
      },
    }
    return this.sendMetaprotocolChannelExtrinsic(channelId, msg, cb)
  }

  async getModerateCommentFee(address: string, channelId: MemberId, commentId: string) {
    const msg: IChannelOwnerRemarked = {
      moderateComment: {
        commentId,
        rationale: '',
      },
    }
    const tx = await this.metaprotocolChannelExtrinsicTx(channelId, msg)
    return this.getFee(tx, address)
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
  async getReactToVideoCommentFee(address: string, memberId: MemberId, commentId: string, reactionId: CommentReaction) {
    const msg: IMemberRemarked = {
      reactComment: {
        commentId,
        reactionId,
      },
    }
    const tx = await this.metaprotocolMemberExtrinsicTx(memberId, msg)
    return this.getFee(tx, address)
  }
}
