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

  async createChannelTx(memberId: MemberId, inputMetadata: ChannelInputMetadata, inputAssets: ChannelInputAssets) {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, inputAssets)

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const creationParameters = createType('PalletContentChannelCreationParametersRecord', {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: createType('BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>', {}),
      storageBuckets: createType('BTreeSet<u64>', []), // TODO: provide values
      distributionBuckets: createType('BTreeSet<PalletStorageDistributionBucketIdRecord>', []), // TODO: provide values
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const channelOwner = createType('PalletContentChannelOwner', { Member: parseInt(memberId) })
    const tx = this.api.tx.content.createChannel(channelOwner, creationParameters)
    return tx
  }

  async sendCreateChannelTx(
    tx: SubmittableExtrinsic<'promise'>,
    inputAssets: ChannelInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ) {
    await this.ensureApi()
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated')[1]

    return {
      channelId: channelId.toString(),
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
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

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const creationParameters = createType('PalletContentChannelCreationParametersRecord', {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: createType('BTreeMap<u64, BTreeSet<PalletContentChannelActionPermission>>', {}),
      storageBuckets: createType('BTreeSet<u64>', []), // TODO: provide values
      distributionBuckets: createType('BTreeSet<PalletStorageDistributionBucketIdRecord>', []), // TODO: provide values
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const channelOwner = createType('PalletContentChannelOwner', { Member: parseInt(memberId) })
    const tx = this.api.tx.content.createChannel(channelOwner, creationParameters)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated')[1]

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

  async sendUpdateChannelTx(
    tx: SubmittableExtrinsic<'promise'>,
    channelId: ChannelId,
    inputAssets: ChannelInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<ChannelExtrinsicResult> {
    await this.ensureApi()
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
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
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
      block,
      assetsIds: extractChannelResultAssetsIds(inputAssets, getEventData),
    }
  }

  async createVideoTx(
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets
  ) {
    await this.ensureApi()

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const creationParameters = createType('PalletContentVideoCreationParametersRecord', {
      meta: videoMetadata,
      assets: videoAssets,
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.createVideo(actor, channelId, creationParameters)

    return tx
  }

  async sendCreateVideoTx(
    tx: SubmittableExtrinsic<'promise'>,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const videoId = getEventData('content', 'VideoCreated')[2]

    return {
      videoId: videoId.toString(),
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
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

    const dataObjectStateBloatBondFee = await this.api.query.storage.dataObjectStateBloatBondValue()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, inputAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const creationParameters = createType('PalletContentVideoCreationParametersRecord', {
      meta: videoMetadata,
      assets: videoAssets,
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: dataObjectStateBloatBondFee,
    })

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.createVideo(actor, channelId, creationParameters)
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

  async sendUpdateVideoTx(
    tx: SubmittableExtrinsic<'promise'>,
    videoId: VideoId,
    inputAssets: VideoInputAssets,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<VideoExtrinsicResult> {
    await this.ensureApi()
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
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

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  async deleteVideoTx(videoId: VideoId, memberId: MemberId) {
    await this.ensureApi()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.deleteVideo(actor, videoId, 2) // all videos should have 2 assets (media + thumbnail)

    return tx
  }

  async sendDeleteVideoTx(tx: SubmittableExtrinsic<'promise'>, videoId: VideoId, cb?: ExtrinsicStatusCallbackFn) {
    await this.ensureApi()

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
    }
  }

  async deleteVideo(
    videoId: VideoId,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<Omit<VideoExtrinsicResult, 'assetsIds'>> {
    await this.ensureApi()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.deleteVideo(actor, videoId, 2) // all videos should have 2 assets (media + thumbnail)
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
    }
  }

  async sendNftTx(tx: SubmittableExtrinsic<'promise'>, cb?: ExtrinsicStatusCallbackFn): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
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

  async issueNft(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftIssuanceInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const nftIssuanceParameters = createNftIssuanceParameters(inputMetadata).unwrap()

    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.issueNft(actor, videoId, nftIssuanceParameters)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async putNftOnSaleTx(videoId: VideoId, memberId: MemberId, inputMetadata: NftSaleInputMetadata) {
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

  async putNftOnSale(
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: NftSaleInputMetadata,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
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

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async changeNftPriceTx(memberId: MemberId, videoId: VideoId, price: number) {
    await this.ensureApi()
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.updateBuyNowPrice(actor, videoId, price)

    return tx
  }

  async changeNftPrice(
    memberId: MemberId,
    videoId: VideoId,
    price: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(memberId),
    })
    const tx = this.api.tx.content.updateBuyNowPrice(actor, videoId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async cancelNftSaleTx(videoId: VideoId, memberId: MemberId, saleType: NftSaleType) {
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

  async cancelNftSale(
    videoId: VideoId,
    memberId: MemberId,
    saleType: NftSaleType,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
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

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async buyNftNowTx(videoId: VideoId, memberId: MemberId, priceCommitment: number) {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, memberId, priceCommitment)
    return tx
  }

  async buyNftNow(
    videoId: VideoId,
    memberId: MemberId,
    priceCommitment: number,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, memberId, priceCommitment)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async makeNftBidTx(videoId: VideoId, memberId: MemberId, bidPrice: number, auctionType: NftAuctionType) {
    await this.ensureApi()

    const tx =
      auctionType === 'open'
        ? this.api.tx.content.makeOpenAuctionBid(memberId, videoId, bidPrice)
        : this.api.tx.content.makeEnglishAuctionBid(memberId, videoId, bidPrice)

    return tx
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
        ? this.api.tx.content.makeOpenAuctionBid(memberId, videoId, bidPrice)
        : this.api.tx.content.makeEnglishAuctionBid(memberId, videoId, bidPrice)

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
    await this.ensureApi()

    const tx = this.api.tx.content.cancelOpenAuctionBid(memberId, videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async acceptNftBidTx(ownerId: MemberId, videoId: VideoId, bidderId: MemberId, price: string) {
    await this.ensureApi()
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(ownerId),
    })
    const tx = this.api.tx.content.pickOpenAuctionWinner(actor, videoId, bidderId, price)
    return tx
  }

  async acceptNftBid(
    ownerId: MemberId,
    videoId: VideoId,
    bidderId: MemberId,
    price: string,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<NftExtrinsicResult> {
    await this.ensureApi()
    const actor = createType('PalletContentPermissionsContentActor', {
      Member: parseInt(ownerId),
    })
    const tx = this.api.tx.content.pickOpenAuctionWinner(actor, videoId, bidderId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async settleEnglishAuctionTx(videoId: VideoId) {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)
    return tx
  }

  async settleEnglishAuction(videoId: VideoId, cb?: ExtrinsicStatusCallbackFn): Promise<NftExtrinsicResult> {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  async updateMemberTx(memberId: MemberId, handle: string | null, inputMetadata: MemberInputMetadata) {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)
    return tx
  }

  async sendUpdateMemberTx(
    tx: SubmittableExtrinsic<'promise'>,
    memberId: MemberId,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MemberExtrinsicResult> {
    await this.ensureApi()

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      memberId,
    }
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

    const metadata = wrapMetadata(MemberRemarked.encode(msg).finish()).unwrap()

    const tx = this.api.tx.members.memberRemark(memberId, metadata)
    const { block, transactionHash } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      transactionHash,
    }
  }

  private async sendMetaprotocolChannelExtrinsic(
    channelId: ChannelId,
    msg: IChannelOwnerRemarked,
    cb?: ExtrinsicStatusCallbackFn
  ): Promise<MetaprotcolExtrinsicResult> {
    await this.ensureApi()

    const metadata = wrapMetadata(ChannelOwnerRemarked.encode(msg).finish()).unwrap()

    const tx = this.api.tx.content.channelOwnerRemark(channelId, metadata)
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
