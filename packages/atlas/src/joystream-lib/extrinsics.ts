import { prepareClaimChannelRewardExtrinsicArgs, verifyChannelPayoutProof } from '@joystream/js/content'
import {
  ChannelOwnerRemarked,
  CreatorTokenIssuerRemarked,
  IChannelOwnerRemarked,
  ICreatorTokenIssuerRemarked,
  IMemberRemarked,
  MemberRemarked,
  ReactVideo,
} from '@joystream/metadata-protobuf'
import { createType } from '@joystream/types'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import Long from 'long'

import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { SentryLogger } from '@/utils/logs'

import { getClaimableReward } from './channelPayouts'
import { PERMILL_PER_PERCENT } from './config'
import { JoystreamLibError } from './errors'
import {
  createActor,
  createNftEnglishAuctionParams,
  createNftIssuanceParameters,
  createNftOpenAuctionParams,
  extractChannelResultAssetsIds,
  extractVideoResultAssetsIds,
  sendExtrinsicAndParseEvents,
} from './helpers'
import {
  parseChannelExtrinsicInput,
  parseMemberExtrinsicInput,
  parseVideoExtrinsicInput,
  prepareCreatorTokenMetadata,
  wrapMetadata,
} from './metadata'
import {
  AccountId,
  AtlasSigner,
  ChannelExtrinsicResult,
  ChannelId,
  ChannelInputAssets,
  ChannelInputBuckets,
  ChannelInputMetadata,
  CommentReaction,
  ExitRevenueSplitResult,
  ExtrinsicResult,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  GetEventDataFn,
  JoinRevenueSplitResult,
  MemberExtrinsicResult,
  MemberId,
  MemberInputMetadata,
  MetaprotcolExtrinsicResult,
  NftAuctionType,
  NftExtrinsicResult,
  NftIssuanceInputMetadata,
  NftSaleInputMetadata,
  NftSaleType,
  RawMetadataProcessorFn,
  SendExtrinsicResult,
  StringifiedNumber,
  TokenAMMSoldResult,
  TokenId,
  TokenIssuedResult,
  TxMethodName,
  VideoExtrinsicResult,
  VideoId,
  VideoInputAssets,
  VideoInputMetadata,
  VideoReaction,
} from './types'

type AccountIdAccessor = () => AtlasSigner | null
type PublicExtrinsic<TxFunction, ReturnValue> = TxFunction extends (...a: infer U) => unknown
  ? (...a: [...U, ExtrinsicStatusCallbackFn | undefined]) => Promise<ReturnValue>
  : never

export class JoystreamLibExtrinsics {
  readonly api: PolkadotApi
  readonly getAccount: AccountIdAccessor
  readonly endpoint: string

  constructor(api: PolkadotApi, getAccount: AccountIdAccessor, endpoint: string) {
    this.api = api
    this.getAccount = getAccount
    this.endpoint = endpoint
  }

  /*
    ===== Helper methods =====
  */

  private async ensureApi() {
    try {
      await this.api.isReady
    } catch (e) {
      SentryLogger.error('Failed to initialize Polkadot API', 'JoystreamLib', e)
      throw new JoystreamLibError({ name: 'ApiNotConnectedError' })
    }
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
        const event = events.find((event) => {
          return event.section === section && event.method === method
        })

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
      // 1010 error.code means invalid transaction, more substrate errors here:
      // https://github.com/paritytech/substrate/blob/2951d340841523f6897e55e7a613b0fd0e1c7380/primitives/runtime/src/transaction_validity.rs#L100
      if (error.name === 'RpcError' && error.code === 1010 && error?.data.includes('balance too low')) {
        throw new JoystreamLibError({
          name: 'AccountBalanceTooLow',
          details: error,
        })
      }
      if (error?.message === 'Cancelled') {
        throw new JoystreamLibError({ name: 'SignCancelledError' })
      }
      throw error
    }
  }

  private async sendMetaprotocolExtrinsic(
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

  async metaprotocolMemberExtrinsicTx(
    memberId: MemberId,
    msg: IMemberRemarked,
    payment?: [AccountId, StringifiedNumber]
  ) {
    await this.ensureApi()

    const metadata = wrapMetadata(MemberRemarked.encode(msg).finish()).unwrap()
    const tx = this.api.tx.members.memberRemark(memberId, metadata, payment || null)
    return tx
  }

  async metaprotocolChannelExtrinsicTx(channelId: MemberId, msg: IChannelOwnerRemarked) {
    await this.ensureApi()

    const metadata = wrapMetadata(ChannelOwnerRemarked.encode(msg).finish()).unwrap()
    const tx = this.api.tx.content.channelOwnerRemark(channelId, metadata)
    return tx
  }

  async getFee<TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
    address: string,
    method: keyof this,
    args: TArgs
  ): Promise<StringifiedNumber> {
    // @ts-ignore Warning about not having spread argument as a tuple. We can ignore this
    const tx = await this[method](...args)
    const info = await tx.paymentInfo(address)
    return info.partialFee.toString()
  }

  /*
    ===== Channel extrinsics =====
  */

  createChannelTx = async (
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    inputAssets: ChannelInputAssets,
    inputBuckets: ChannelInputBuckets,
    expectedDataObjectStateBloatBond: StringifiedNumber,
    expectedChannelStateBloatBond: StringifiedNumber,
    rawMetadataProcessor?: RawMetadataProcessorFn,
    collaboratorMemberId?: MemberId | null
  ) => {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(
      this.api,
      inputMetadata,
      inputAssets,
      rawMetadataProcessor
    )

    const creationParameters = createType('PalletContentChannelCreationParametersRecord', {
      meta: channelMetadata,
      assets: channelAssets,
      collaborators: createType(
        'BTreeMap<u64, BTreeSet<PalletContentIterableEnumsChannelActionPermission>>',
        collaboratorMemberId
          ? {
              [collaboratorMemberId]: createType('BTreeSet<PalletContentIterableEnumsChannelActionPermission>', [
                'AddVideo',
                'AgentRemark',
                'UpdateChannelMetadata',
                'UpdateVideoMetadata',
              ]),
            }
          : {}
      ),
      storageBuckets: createType('BTreeSet<u64>', inputBuckets.storage),
      distributionBuckets: createType('BTreeSet<PalletStorageDistributionBucketIdRecord>', inputBuckets.distribution),
      expectedDataObjectStateBloatBond: new BN(expectedDataObjectStateBloatBond),
      expectedChannelStateBloatBond: new BN(expectedChannelStateBloatBond),
    })

    const channelOwner = createType('PalletContentChannelOwner', { Member: parseInt(memberId) })
    const tx = this.api.tx.content.createChannel(channelOwner, creationParameters)
    return tx
  }

  createChannel: PublicExtrinsic<typeof this.createChannelTx, ChannelExtrinsicResult> = async (
    memberId,
    inputMetadata,
    inputAssets,
    inputBuckets,
    expectedDataObjectStateBloatBond,
    expectedChannelStateBloatBond,
    rawMetadataProcessor,
    collaboratorMemberId,
    cb
  ) => {
    const tx = await this.createChannelTx(
      memberId,
      inputMetadata,
      inputAssets,
      inputBuckets,
      expectedDataObjectStateBloatBond,
      expectedChannelStateBloatBond,
      rawMetadataProcessor,
      collaboratorMemberId
    )

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const channelId = getEventData('content', 'ChannelCreated')[0]
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

  updateChannelTx = async (
    channelId: ChannelId,
    memberId: MemberId,
    inputMetadata: ChannelInputMetadata,
    newAssets: ChannelInputAssets,
    removedAssetsIds: StringifiedNumber[],
    expectedDataObjectStateBloatBond: StringifiedNumber,
    expectedStorageBucketsCount: StringifiedNumber,
    // null for removing collaborator
    collaboratorMemberId?: MemberId | null
  ) => {
    await this.ensureApi()

    const [channelMetadata, channelAssets] = await parseChannelExtrinsicInput(this.api, inputMetadata, newAssets)
    const updateParameters = createType('PalletContentChannelUpdateParametersRecord', {
      newMeta: channelMetadata,
      assetsToUpload: channelAssets,
      assetsToRemove: removedAssetsIds.map((id) => new BN(id)),
      collaborators: createType(
        'Option<BTreeMap<u64, BTreeSet<PalletContentIterableEnumsChannelActionPermission>>>',
        collaboratorMemberId !== undefined
          ? collaboratorMemberId
            ? {
                [collaboratorMemberId]: createType('BTreeSet<PalletContentIterableEnumsChannelActionPermission>', [
                  'AddVideo',
                  'AgentRemark',
                  'UpdateChannelMetadata',
                  'UpdateVideoMetadata',
                ]),
              }
            : {}
          : null
      ),
      expectedDataObjectStateBloatBond: new BN(expectedDataObjectStateBloatBond),
      storageBucketsNumWitness: createType('Option<u32>', new BN(expectedStorageBucketsCount)),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateChannel(actor, channelId, updateParameters)
    return tx
  }

  updateChannel: PublicExtrinsic<typeof this.updateChannelTx, ChannelExtrinsicResult> = async (
    channelId,
    memberId,
    inputMetadata,
    newAssets,
    removedAssetsIds,
    expectedDataObjectStateBloatBond,
    expectedStorageBucketsCount,
    collaboratorMemberId,
    cb
  ) => {
    const tx = await this.updateChannelTx(
      channelId,
      memberId,
      inputMetadata,
      newAssets,
      removedAssetsIds,
      expectedDataObjectStateBloatBond,
      expectedStorageBucketsCount,
      collaboratorMemberId
    )
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      channelId,
      block,
      assetsIds: extractChannelResultAssetsIds(newAssets, getEventData, true),
    }
  }

  /*
    ===== Video extrinsics =====
  */

  createVideoTx = async (
    memberId: MemberId,
    channelId: ChannelId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    inputAssets: VideoInputAssets,
    expectedDataObjectStateBloatBond: StringifiedNumber,
    expectedVideoStateBloatBond: StringifiedNumber,
    expectedStorageBucketsCount: StringifiedNumber,
    rawMetadataProcessor?: RawMetadataProcessorFn
  ) => {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(
      this.api,
      inputMetadata,
      inputAssets,
      rawMetadataProcessor
    )

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)
    const creationParameters = createType('PalletContentVideoCreationParametersRecord', {
      meta: videoMetadata,
      assets: videoAssets,
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: new BN(expectedDataObjectStateBloatBond),
      expectedVideoStateBloatBond: new BN(expectedVideoStateBloatBond),
      storageBucketsNumWitness: new BN(expectedStorageBucketsCount),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.createVideo(actor, channelId, creationParameters)

    return tx
  }

  createVideo: PublicExtrinsic<typeof this.createVideoTx, VideoExtrinsicResult> = async (
    memberId,
    channelId,
    inputMetadata,
    nftInputMetadata,
    inputAssets,
    expectedDataObjectStateBloatBond,
    expectedVideoStateBloatBond,
    expectedStorageBucketsCount,
    rawMetadataProcessor,
    cb
  ) => {
    const tx = await this.createVideoTx(
      memberId,
      channelId,
      inputMetadata,
      nftInputMetadata,
      inputAssets,
      expectedDataObjectStateBloatBond,
      expectedVideoStateBloatBond,
      expectedStorageBucketsCount,
      rawMetadataProcessor
    )
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    const videoId = getEventData('content', 'VideoCreated')[2]

    return {
      videoId: videoId.toString(),
      block,
      assetsIds: extractVideoResultAssetsIds(inputAssets, getEventData),
    }
  }

  updateVideoTx = async (
    videoId: VideoId,
    memberId: MemberId,
    inputMetadata: VideoInputMetadata,
    nftInputMetadata: NftIssuanceInputMetadata | undefined,
    newAssets: VideoInputAssets,
    removedAssetsIds: StringifiedNumber[],
    expectedDataObjectStateBloatBond: StringifiedNumber,
    expectedStorageBucketsCount: StringifiedNumber
  ) => {
    await this.ensureApi()

    const [videoMetadata, videoAssets] = await parseVideoExtrinsicInput(this.api, inputMetadata, newAssets)

    const nftIssuanceParameters = createNftIssuanceParameters(nftInputMetadata)

    const updateParameters = createType('PalletContentVideoUpdateParametersRecord', {
      newMeta: videoMetadata,
      assetsToUpload: videoAssets,
      assetsToRemove: removedAssetsIds.map((id) => new BN(id)),
      autoIssueNft: nftIssuanceParameters,
      expectedDataObjectStateBloatBond: new BN(expectedDataObjectStateBloatBond),
      storageBucketsNumWitness: createType('Option<u32>', new BN(expectedStorageBucketsCount)),
    })

    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateVideo(actor, videoId, updateParameters)
    return tx
  }

  updateVideo: PublicExtrinsic<typeof this.updateVideoTx, VideoExtrinsicResult> = async (
    videoId,
    memberId,
    inputMetadata,
    nftInputMetadata,
    newAssets,
    removedAssetsIds,
    expectedDataObjectStateBloatBond,
    expectedStorageBucketsCount,
    cb
  ) => {
    const tx = await this.updateVideoTx(
      videoId,
      memberId,
      inputMetadata,
      nftInputMetadata,
      newAssets,
      removedAssetsIds,
      expectedDataObjectStateBloatBond,
      expectedStorageBucketsCount
    )

    const { block, getEventData } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
      assetsIds: extractVideoResultAssetsIds(newAssets, getEventData, true),
    }
  }

  deleteVideoTx = async (
    videoId: VideoId,
    memberId: MemberId,
    dataObjectsCount: number,
    expectedStorageBucketsCount: StringifiedNumber
  ) => {
    await this.ensureApi()

    const actor = createActor(memberId)
    const tx = this.api.tx.content.deleteVideo(
      actor,
      videoId,
      dataObjectsCount,
      createType('Option<u32>', new BN(expectedStorageBucketsCount))
    )

    return tx
  }

  deleteVideo: PublicExtrinsic<typeof this.deleteVideoTx, Omit<VideoExtrinsicResult, 'assetsIds'>> = async (
    videoId,
    memberId,
    dataObjectsCount,
    expectedStorageBucketsCount,
    cb
  ) => {
    const tx = await this.deleteVideoTx(videoId, memberId, dataObjectsCount, expectedStorageBucketsCount)
    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      videoId,
      block,
    }
  }
  /*
    === Channel payouts ===
  */

  claimRewardTx = async (
    channelId: string,
    memberId: MemberId,
    cumulativeRewardEarned: StringifiedNumber | null,
    payloadUrl: string,
    commitment: string
  ) => {
    await this.ensureApi()

    const { payoutProof, reward } = await getClaimableReward(channelId, cumulativeRewardEarned, payloadUrl)

    if (verifyChannelPayoutProof(payoutProof) !== commitment) {
      throw new JoystreamLibError({
        name: 'FailedError',
        message: `Incorrect payout proof`,
      })
    }
    const maxCashoutAllowed = await this.api.query.content.maxCashoutAllowed()
    const minCashoutAllowed = await this.api.query.content.minCashoutAllowed()

    if (reward.gt(maxCashoutAllowed)) {
      throw new JoystreamLibError({
        name: 'FailedError',
        message: `Channel cashout amount is too high to be claimed`,
      })
    }
    if (reward.lt(minCashoutAllowed)) {
      throw new JoystreamLibError({
        name: 'FailedError',
        message: `Channel cashout amount is too low to be claimed`,
      })
    }

    const { pullPayment, proofElements } = prepareClaimChannelRewardExtrinsicArgs(payoutProof)
    const actor = createActor(memberId)
    const tx = this.api.tx.content.claimChannelReward(actor, proofElements, pullPayment)
    return tx
  }

  claimReward: PublicExtrinsic<typeof this.claimRewardTx, NftExtrinsicResult> = async (
    channelId,
    memberId,
    cumulativeRewardEarned,
    payloadUrl: string,
    commitment: string,
    cb
  ) => {
    const tx = await this.claimRewardTx(channelId, memberId, cumulativeRewardEarned, payloadUrl, commitment)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }
  /*
    === NFT extrinsics ===
  */

  issueNftTx = async (videoId: VideoId, memberId: MemberId, inputMetadata: NftIssuanceInputMetadata) => {
    await this.ensureApi()

    const nftIssuanceParameters = createNftIssuanceParameters(inputMetadata).unwrap()

    const actor = createActor(memberId)
    const tx = this.api.tx.content.issueNft(actor, videoId, nftIssuanceParameters)

    return tx
  }

  issueNft: PublicExtrinsic<typeof this.issueNftTx, NftExtrinsicResult> = async (
    videoId,
    memberId,
    inputMetadata,
    cb
  ) => {
    const tx = await this.issueNftTx(videoId, memberId, inputMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  putNftOnSaleTx = async (videoId: VideoId, memberId: MemberId, inputMetadata: NftSaleInputMetadata) => {
    await this.ensureApi()

    const actor = createActor(memberId)
    const tx =
      inputMetadata.type === 'buyNow'
        ? this.api.tx.content.sellNft(videoId, actor, inputMetadata.buyNowPrice)
        : inputMetadata.type === 'open'
        ? this.api.tx.content.startOpenAuction(actor, videoId, createNftOpenAuctionParams(inputMetadata))
        : this.api.tx.content.startEnglishAuction(actor, videoId, createNftEnglishAuctionParams(inputMetadata))

    return tx
  }

  putNftOnSale: PublicExtrinsic<typeof this.putNftOnSaleTx, NftExtrinsicResult> = async (
    videoId,
    memberId,
    inputMetadata,
    cb
  ) => {
    const tx = await this.putNftOnSaleTx(videoId, memberId, inputMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  changeNftPriceTx = async (memberId: MemberId, videoId: VideoId, price: StringifiedNumber) => {
    await this.ensureApi()
    const actor = createActor(memberId)
    const tx = this.api.tx.content.updateBuyNowPrice(actor, videoId, price)

    return tx
  }

  changeNftPrice: PublicExtrinsic<typeof this.changeNftPriceTx, NftExtrinsicResult> = async (
    memberId,
    videoId,
    price,
    cb
  ) => {
    const tx = await this.changeNftPriceTx(memberId, videoId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  cancelNftSaleTx = async (videoId: VideoId, memberId: MemberId, saleType: NftSaleType) => {
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

  cancelNftSale: PublicExtrinsic<typeof this.cancelNftSaleTx, NftExtrinsicResult> = async (
    videoId,
    memberId,
    saleType,
    cb
  ) => {
    const tx = await this.cancelNftSaleTx(videoId, memberId, saleType)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  buyNftNowTx = async (videoId: VideoId, memberId: MemberId, priceCommitment: StringifiedNumber) => {
    await this.ensureApi()

    const tx = this.api.tx.content.buyNft(videoId, memberId, priceCommitment)
    return tx
  }

  buyNftNow: PublicExtrinsic<typeof this.buyNftNowTx, NftExtrinsicResult> = async (
    videoId,
    memberId,
    priceCommitment,
    cb
  ) => {
    const tx = await this.buyNftNowTx(videoId, memberId, priceCommitment)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  makeNftBidTx = async (
    videoId: VideoId,
    memberId: MemberId,
    bidPrice: StringifiedNumber,
    auctionType: NftAuctionType
  ) => {
    await this.ensureApi()

    const tx =
      auctionType === 'open'
        ? this.api.tx.content.makeOpenAuctionBid(memberId, videoId, bidPrice)
        : this.api.tx.content.makeEnglishAuctionBid(memberId, videoId, bidPrice)

    return tx
  }

  makeNftBid: PublicExtrinsic<typeof this.makeNftBidTx, NftExtrinsicResult> = async (
    videoId,
    memberId,
    bidPrice,
    auctionType,
    cb
  ) => {
    const tx = await this.makeNftBidTx(videoId, memberId, bidPrice, auctionType)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  cancelNftBidTx = async (videoId: VideoId, memberId: MemberId) => {
    await this.ensureApi()

    const tx = this.api.tx.content.cancelOpenAuctionBid(memberId, videoId)
    return tx
  }

  cancelNftBid: PublicExtrinsic<typeof this.cancelNftBidTx, NftExtrinsicResult> = async (videoId, memberId, cb) => {
    const tx = await this.cancelNftBidTx(videoId, memberId)
    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  acceptNftBidTx = async (ownerId: MemberId, videoId: VideoId, bidderId: MemberId, price: StringifiedNumber) => {
    await this.ensureApi()
    const actor = createActor(ownerId)
    const tx = this.api.tx.content.pickOpenAuctionWinner(actor, videoId, bidderId, price)
    return tx
  }

  acceptNftBid: PublicExtrinsic<typeof this.acceptNftBidTx, NftExtrinsicResult> = async (
    ownerId,
    videoId,
    bidderId,
    price,
    cb
  ) => {
    const tx = await this.acceptNftBidTx(ownerId, videoId, bidderId, price)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  settleEnglishAuctionTx = async (videoId: VideoId) => {
    await this.ensureApi()

    const tx = this.api.tx.content.settleEnglishAuction(videoId)
    return tx
  }

  settleEnglishAuction: PublicExtrinsic<typeof this.settleEnglishAuctionTx, NftExtrinsicResult> = async (
    videoId,
    cb
  ) => {
    const tx = await this.settleEnglishAuctionTx(videoId)

    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  /*
    === Misc extrinsics ===
  */

  updateMemberTx = async (memberId: MemberId, handle: string | null, inputMetadata: MemberInputMetadata) => {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)
    return tx
  }

  updateMember: PublicExtrinsic<typeof this.updateMemberTx, MemberExtrinsicResult> = async (
    memberId,
    handle,
    inputMetadata,
    cb
  ) => {
    await this.ensureApi()

    const [memberMetadata] = await parseMemberExtrinsicInput(this.api, inputMetadata, undefined)

    const tx = this.api.tx.members.updateProfile(memberId, handle, memberMetadata)

    const { block } = await this.sendExtrinsic(tx, cb)

    return {
      block,
      memberId,
    }
  }

  sendFundsTx = async (destinationAccount: MemberId, value: StringifiedNumber) => {
    await this.ensureApi()

    return this.api.tx.balances.transfer(destinationAccount, value)
  }

  sendFunds: PublicExtrinsic<typeof this.sendFundsTx, ExtrinsicResult> = async (destinationAccount, value, cb) => {
    const tx = await this.sendFundsTx(destinationAccount, value)

    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  withdrawFromChannelBalanceTx = async (memberId: MemberId, channelId: ChannelId, amount: StringifiedNumber) => {
    await this.ensureApi()
    const actor = createActor(memberId)

    return this.api.tx.content.withdrawFromChannelBalance(actor, channelId, amount)
  }

  withdrawFromChannelBalance: PublicExtrinsic<typeof this.withdrawFromChannelBalanceTx, ExtrinsicResult> = async (
    memberId,
    channelId,
    amount,
    cb
  ) => {
    const tx = await this.withdrawFromChannelBalanceTx(memberId, channelId, amount)

    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  /*
    === Metaprotocol extrinsics ===
  */

  reactToVideoTx = async (memberId: MemberId, videoId: VideoId, reaction: VideoReaction) => {
    await this.ensureApi()
    const msg: IMemberRemarked = {
      reactVideo: {
        videoId: Long.fromString(videoId),
        reaction: reaction === 'like' ? ReactVideo.Reaction.LIKE : ReactVideo.Reaction.UNLIKE,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  reactToVideo: PublicExtrinsic<typeof this.reactToVideoTx, MetaprotcolExtrinsicResult> = async (
    memberId,
    videoId,
    reaction,
    cb
  ) => {
    const tx = await this.reactToVideoTx(memberId, videoId, reaction)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  createVideoCommentTx = async (
    memberId: MemberId,
    videoId: VideoId,
    commentBody: string,
    parentCommentId: string | null,
    tip?: [AccountId, StringifiedNumber]
  ) => {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      createComment: {
        videoId: Long.fromString(videoId),
        body: commentBody,
        parentCommentId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg, tip)
  }

  createVideoComment: PublicExtrinsic<typeof this.createVideoCommentTx, MetaprotcolExtrinsicResult> = async (
    memberId,
    videoId,
    commentBody,
    parentCommentId,
    tip,
    cb
  ) => {
    const tx = await this.createVideoCommentTx(memberId, videoId, commentBody, parentCommentId, tip)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  editVideoCommentTx = async (memberId: MemberId, commentId: string, newBody: string) => {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      editComment: {
        commentId,
        newBody,
      },
    }

    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  editVideoComment: PublicExtrinsic<typeof this.editVideoCommentTx, MetaprotcolExtrinsicResult> = async (
    memberId,
    commentId,
    newBody,
    cb
  ) => {
    const tx = await this.editVideoCommentTx(memberId, commentId, newBody)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  deleteVideoCommentTx = async (memberId: MemberId, commentId: string) => {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      deleteComment: {
        commentId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  deleteVideoComment: PublicExtrinsic<typeof this.deleteVideoCommentTx, MetaprotcolExtrinsicResult> = async (
    memberId,
    commentId,
    cb
  ) => {
    const tx = await this.deleteVideoCommentTx(memberId, commentId)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  moderateCommentTx = async (channelId: ChannelId, commentId: string) => {
    await this.ensureApi()

    const msg: IChannelOwnerRemarked = {
      moderateComment: {
        commentId,
        rationale: '',
      },
    }
    return this.metaprotocolChannelExtrinsicTx(channelId, msg)
  }

  moderateComment: PublicExtrinsic<typeof this.moderateCommentTx, MetaprotcolExtrinsicResult> = async (
    channelId,
    commentId,
    cb
  ) => {
    const tx = await this.moderateCommentTx(channelId, commentId)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  reactToVideoCommentTx = async (memberId: MemberId, commentId: string, reactionId: CommentReaction) => {
    await this.ensureApi()

    const msg: IMemberRemarked = {
      reactComment: {
        commentId,
        reactionId,
      },
    }
    return this.metaprotocolMemberExtrinsicTx(memberId, msg)
  }

  reactToVideoComment: PublicExtrinsic<typeof this.reactToVideoCommentTx, MetaprotcolExtrinsicResult> = async (
    memberId,
    commentId,
    reactionId,
    cb
  ) => {
    const tx = await this.reactToVideoCommentTx(memberId, commentId, reactionId)
    return this.sendMetaprotocolExtrinsic(tx, cb)
  }

  purchaseTokenOnSaleTx = async (tokenId: TokenId, memberId: MemberId, amount: StringifiedNumber) => {
    await this.ensureApi()

    return this.api.tx.projectToken.purchaseTokensOnSale(
      parseInt(tokenId),
      parseInt(memberId),
      createType('u128', new BN(amount))
    )
  }

  purchaseTokenOnSale: PublicExtrinsic<typeof this.purchaseTokenOnSaleTx, ExtrinsicResult> = async (
    tokenId,
    memberId,
    amount,
    cb
  ) => {
    const tx = await this.purchaseTokenOnSaleTx(tokenId, memberId, amount)
    const { block } = await this.sendExtrinsic(tx, cb)

    return { block }
  }

  dustAccountTx = async (tokenId: TokenId, memberId: MemberId) => {
    await this.ensureApi()

    return this.api.tx.projectToken.dustAccount(parseInt(tokenId), parseInt(memberId))
  }

  dustAccount: PublicExtrinsic<typeof this.dustAccountTx, ExtrinsicResult> = async (tokenId, memberId, cb) => {
    const tx = await this.dustAccountTx(tokenId, memberId)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  exitRevenueSplitTx = async (tokenId: TokenId, memberId: MemberId) => {
    await this.ensureApi()

    return this.api.tx.projectToken.exitRevenueSplit(parseInt(tokenId), parseInt(memberId))
  }

  exitRevenueSplit: PublicExtrinsic<typeof this.exitRevenueSplitTx, ExitRevenueSplitResult> = async (
    tokenId,
    memberId,
    cb
  ) => {
    const tx = await this.exitRevenueSplitTx(tokenId, memberId)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)
    const amount = getEventData('projectToken', 'RevenueSplitLeft')[2]
    return { block, amount: amount.toString() }
  }

  participateInSplitTx = async (tokenId: TokenId, memberId: MemberId, amount: StringifiedNumber) => {
    await this.ensureApi()

    return this.api.tx.projectToken.participateInSplit(
      parseInt(tokenId),
      parseInt(memberId),
      createType('u128', new BN(amount))
    )
  }

  participateInSplit: PublicExtrinsic<typeof this.participateInSplitTx, JoinRevenueSplitResult> = async (
    tokenId,
    memberId,
    amount,
    cb
  ) => {
    const tx = await this.participateInSplitTx(tokenId, memberId, amount)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)
    const [, , stakedAmount, dividendAmount] = getEventData('projectToken', 'UserParticipatedInSplit')

    return { block, dividendAmount: dividendAmount.toString(), stakedAmount: stakedAmount.toString() }
  }

  issueRevenueSplitTx = async (memberId: MemberId, channelId: ChannelId, start: number, duration: number) => {
    await this.ensureApi()

    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    return this.api.tx.content.issueRevenueSplit(
      member,
      parseInt(channelId),
      createType('Option<u32>', new BN(start)),
      createType('u32', duration)
    )
  }

  issueRevenueSplit: PublicExtrinsic<typeof this.issueRevenueSplitTx, ExtrinsicResult> = async (
    memberId,
    channelId,
    start,
    duration,
    cb
  ) => {
    const tx = await this.issueRevenueSplitTx(memberId, channelId, start, duration)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  finalizeRevenueSplitTx = async (memberId: MemberId, channelId: ChannelId) => {
    await this.ensureApi()

    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    return this.api.tx.content.finalizeRevenueSplit(member, parseInt(channelId))
  }

  finalizeRevenueSplit: PublicExtrinsic<typeof this.finalizeRevenueSplitTx, ExitRevenueSplitResult> = async (
    memberId,
    channelId,
    cb
  ) => {
    const tx = await this.finalizeRevenueSplitTx(memberId, channelId)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)
    const amount = getEventData('projectToken', 'RevenueSplitFinalized')[2]
    return { block, amount: amount.toString() }
  }

  deissueCreatorTokenTx = async (memberId: MemberId, channelId: ChannelId) => {
    await this.ensureApi()

    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    return this.api.tx.content.deissueCreatorToken(member, parseInt(channelId))
  }

  deissueCreatorToken: PublicExtrinsic<typeof this.deissueCreatorTokenTx, ExtrinsicResult> = async (
    memberId,
    channelId,
    cb
  ) => {
    const tx = await this.deissueCreatorTokenTx(memberId, channelId)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  issueCreatorTokenTx = async (
    memberId: MemberId,
    channelId: ChannelId,
    symbol: string,
    patronageRate: number,
    revenueSplitRate: number,
    initialCreatorAllocation: {
      amount: StringifiedNumber
      vestingDuration: number
      blocksBeforeCliff: number
      cliffAmountPercentage: number
    }
  ) => {
    await this.ensureApi()

    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    const initialAllocation = createType('BTreeMap<u64, PalletProjectTokenTokenAllocation>', new Map())
    initialAllocation.set(
      createType('u64', new BN(memberId)),
      createType('PalletProjectTokenTokenAllocation', {
        amount: createType('u128', new BN(initialCreatorAllocation.amount)),
        vestingScheduleParams: createType('Option<PalletProjectTokenVestingScheduleParams>', {
          blocksBeforeCliff: createType('u32', new BN(initialCreatorAllocation.blocksBeforeCliff)),
          linearVestingDuration: createType('u32', new BN(initialCreatorAllocation.vestingDuration)),
          cliffAmountPercentage: createType(
            'Permill',
            new BN(initialCreatorAllocation.cliffAmountPercentage * PERMILL_PER_PERCENT)
          ),
        }),
      })
    )

    const params = createType('PalletProjectTokenTokenIssuanceParameters', {
      initialAllocation,
      patronageRate: createType('Permill', new BN(patronageRate * PERMILL_PER_PERCENT)),
      revenueSplitRate: createType('Permill', new BN(revenueSplitRate * PERMILL_PER_PERCENT)),
      transferPolicy: createType('PalletProjectTokenTransferPolicyParams', 'Permissionless'),
      metadata: prepareCreatorTokenMetadata({ symbol }),
    })
    return this.api.tx.content.issueCreatorToken(member, parseInt(channelId), params)
  }

  issueCreatorToken: PublicExtrinsic<typeof this.issueCreatorTokenTx, TokenIssuedResult> = async (
    memberId,
    channelId,
    symbol,
    patronageRate,
    initialCreatorAllocation,
    revenueSplitRate,
    cb
  ) => {
    const tx = await this.issueCreatorTokenTx(
      memberId,
      channelId,
      symbol,
      patronageRate,
      initialCreatorAllocation,
      revenueSplitRate
    )
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)
    const tokenId = getEventData('projectToken', 'TokenIssued')[0].toString()

    return { block, tokenId }
  }

  purchaseTokenOnMarketTx = async (tokenId: string, memberId: string, amount: string, slippageAmount: string) => {
    await this.ensureApi()
    const amountCast = createType('u128', new BN(amount))
    return this.api.tx.projectToken.buyOnAmm(
      parseInt(tokenId),
      parseInt(memberId),
      amountCast,
      [createType('Permill', new BN(0.5 * PERMILL_PER_PERCENT)), createType('u128', new BN(slippageAmount))] // percent, number of joy user wants to pay --- default on 0.5%
    )
  }

  purchaseTokenOnMarket: PublicExtrinsic<typeof this.purchaseTokenOnMarketTx, ExtrinsicResult> = async (
    tokenId,
    memberId,
    amount,
    slippageAmount,
    cb
  ) => {
    const tx = await this.purchaseTokenOnMarketTx(tokenId, memberId, amount, slippageAmount)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  sellTokenOnMarketTx = async (tokenId: string, memberId: string, amount: string, slippageAmount: string) => {
    await this.ensureApi()

    const amountCast = createType('u128', new BN(amount))
    return this.api.tx.projectToken.sellOnAmm(
      parseInt(tokenId),
      parseInt(memberId),
      amountCast,
      [createType('Permill', new BN(0.5 * PERMILL_PER_PERCENT)), createType('u128', new BN(slippageAmount))] // percent, number of joy user wants to pay --- default on 0.5%
    )
  }

  sellTokenOnMarket: PublicExtrinsic<typeof this.sellTokenOnMarketTx, TokenAMMSoldResult> = async (
    tokenId,
    memberId,
    amount,
    slippageAmount,
    cb
  ) => {
    const tx = await this.sellTokenOnMarketTx(tokenId, memberId, amount, slippageAmount)
    const { block, getEventData } = await this.sendExtrinsic(tx, cb)
    const receivedAmount = getEventData('projectToken', 'TokensSoldOnAmm')[3].toString()
    return { block, receivedAmount }
  }

  startAmmTx = async (memberId: MemberId, channelId: ChannelId, joySlopeNumber: number) => {
    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    return this.api.tx.content.activateAmm(member, parseInt(channelId), {
      slope: createType('u128', BN.max(new BN(HAPI_TO_JOY_RATE * joySlopeNumber), new BN(1000000))),
      intercept: createType('u128', new BN(0)),
    })
  }

  startAmm: PublicExtrinsic<typeof this.startAmmTx, ExtrinsicResult> = async (
    memberId,
    channelId,
    joySlopeNumber,
    cb
  ) => {
    const tx = await this.startAmmTx(memberId, channelId, joySlopeNumber)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  closeAmmTx = async (memberId: MemberId, channelId: ChannelId) => {
    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    return this.api.tx.content.deactivateAmm(member, parseInt(channelId))
  }

  closeAmm: PublicExtrinsic<typeof this.closeAmmTx, ExtrinsicResult> = async (memberId, channelId, cb) => {
    const tx = await this.closeAmmTx(memberId, channelId)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }

  creatorTokenIssuerRemarkTx = async (memberId: MemberId, channelId: ChannelId, msg: ICreatorTokenIssuerRemarked) => {
    await this.ensureApi()

    const member = createType('PalletContentPermissionsContentActor', { Member: parseInt(memberId) })
    const metadata = wrapMetadata(CreatorTokenIssuerRemarked.encode(msg).finish()).unwrap()
    return this.api.tx.content.creatorTokenIssuerRemark(member, parseInt(channelId), metadata)
  }

  creatorTokenIssuerRemark: PublicExtrinsic<typeof this.creatorTokenIssuerRemarkTx, ExtrinsicResult> = async (
    memberId,
    channelId,
    msg,
    cb
  ) => {
    const tx = await this.creatorTokenIssuerRemarkTx(memberId, channelId, msg)
    const { block } = await this.sendExtrinsic(tx, cb)
    return { block }
  }
}
