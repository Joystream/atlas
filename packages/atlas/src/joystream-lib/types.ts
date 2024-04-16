import { IChannelMetadata, IMembershipMetadata, ISubtitleMetadata, IVideoMetadata } from '@joystream/metadata-protobuf'
import { AugmentedEvent, AugmentedEvents } from '@polkadot/api/types/events'
import { GenericEvent } from '@polkadot/types'
import { IKeyringPair } from '@polkadot/types/types/interfaces'

import { JoystreamLibExtrinsics } from './extrinsics'

export type StringifiedNumber = string

export type AtlasSigner = IKeyringPair | string
export type AccountId = string
export type MemberId = string
export type ChannelId = string
export type VideoId = string
export type CategoryId = string
export type TokenId = string

export type AccountBalanceInfo = {
  // transferable balance account
  availableBalance: StringifiedNumber
  // locked balance (e.g. invitation lock) on top of `availableBalance`
  lockedBalance: StringifiedNumber
  // total invitation lock amount
  totalInvitationLock: StringifiedNumber
}

export type DataObjectMetadata = {
  size: number
  ipfsHash: string
  id?: string
}

export type RawMetadataProcessorFn = (rawMeta: Uint8Array, assets: Uint8Array) => Promise<Uint8Array>

export type VideoAssets<T> = {
  thumbnailPhoto?: T
  media?: T
  subtitles?: T[]
}
export type VideoInputAssets = VideoAssets<DataObjectMetadata>
export type VideoAssetsIds = VideoAssets<string>

export type ChannelAssets<T> = {
  coverPhoto?: T
  avatarPhoto?: T
}
export type ChannelInputAssets = ChannelAssets<DataObjectMetadata>
export type ChannelInputBuckets = {
  storage: number[]
  distribution: { distributionBucketFamilyId: number; distributionBucketIndex: number }[]
}
export type ChannelAssetsIds = ChannelAssets<string>

export enum ExtrinsicStatus {
  ProcessingAssets,
  Unsigned,
  Signed,
  Syncing,
  Completed,
  Error,
}
export type ExtrinsicStatusCallbackFn = (status: ExtrinsicStatus.Unsigned | ExtrinsicStatus.Signed) => void
export type ExtrinsicResult<T = undefined> = T extends undefined
  ? {
      block: number
      transactionHash?: string
      metaprotocol?: true
    }
  : T extends { transactionHash: string; metaprotocol: true }
  ? { block: number; transactionHash: string; metaprotocol: true } & T
  : { block: number } & T

type VideoInputMetadataSubtitle = Omit<ISubtitleMetadata, 'newAsset'> & {
  id: string
}

export type VideoInputMetadata = Omit<
  IVideoMetadata,
  'thumbnailPhoto' | 'video' | 'personsList' | 'mediaType' | 'publishedBeforeJoystream' | 'subtitles'
> & {
  publishedBeforeJoystream?: string
  mimeMediaType?: string
  nft?: NftIssuanceInputMetadata
  subtitles?: VideoInputMetadataSubtitle[]
}
export type ChannelInputMetadata = Omit<IChannelMetadata, 'coverPhoto' | 'avatarPhoto' | 'category'> & {
  ownerAccount: AccountId
}
export type MemberInputMetadata = Omit<IMembershipMetadata, 'avatarObject'>

export type NftBuyNowInputMetadata = {
  type: 'buyNow'
  buyNowPrice: StringifiedNumber
}
type NftCommonAuctionInputMetadata = {
  startingPrice: StringifiedNumber
  minimalBidStep: StringifiedNumber
  buyNowPrice?: StringifiedNumber
  // if startsAtBlock is empty, current block (in which extrinsic is processed) will be used
  startsAtBlock?: number
  whitelistedMembersIds?: string[]
}
export type NftOpenAuctionInputMetadata = NftCommonAuctionInputMetadata & {
  type: 'open'
  bidLockDuration?: number
}
export type NftEnglishAuctionInputMetadata = NftCommonAuctionInputMetadata & {
  type: 'english'
  auctionDurationBlocks: number
  extensionPeriodBlocks?: number
}
export type NftAuctionInputMetadata = NftOpenAuctionInputMetadata | NftEnglishAuctionInputMetadata
export type NftSaleInputMetadata = NftBuyNowInputMetadata | NftAuctionInputMetadata
export type NftAuctionType = NftAuctionInputMetadata['type']
export type NftSaleType = NftSaleInputMetadata['type']
export type NftIssuanceInputMetadata = {
  royalty?: number
  sale?: NftSaleInputMetadata
}

export type VideoReaction = 'like' | 'dislike'
export type CommentReaction = number

type JoystreamEvents = AugmentedEvents<'promise'>
type JoystreamEventData<TEvent> = TEvent extends AugmentedEvent<'promise', infer X> ? X : never
export type GetEventDataFn = <TSection extends keyof JoystreamEvents, TMethod extends keyof JoystreamEvents[TSection]>(
  section: TSection,
  method: TMethod
) => JoystreamEventData<JoystreamEvents[TSection][TMethod]>
export type ExtractChannelResultsAssetsIdsFn = (
  inputAssets: ChannelInputAssets,
  getEventData: GetEventDataFn,
  update?: boolean
) => ChannelAssetsIds
export type ExtractVideoResultsAssetsIdsFn = (
  inputAssets: VideoInputAssets,
  getEventData: GetEventDataFn,
  update?: boolean
) => VideoAssetsIds
export type SendExtrinsicResult = ExtrinsicResult<{
  events: GenericEvent[]
  getEventData: GetEventDataFn
  transactionHash: string
}>
export type ChannelExtrinsicResult = ExtrinsicResult<{
  channelId: ChannelId
  assetsIds: ChannelAssetsIds
}>
export type VideoExtrinsicResult = ExtrinsicResult<{
  videoId: ChannelId
  assetsIds: VideoAssetsIds
}>
export type MemberExtrinsicResult = ExtrinsicResult<{ memberId: MemberId }>
export type NftExtrinsicResult = ExtrinsicResult
export type MetaprotcolExtrinsicResult = ExtrinsicResult<{ metaprotocol: true; transactionHash: string }>
export type ExitRevenueSplitResult = {
  amount: string
} & ExtrinsicResult
export type JoinRevenueSplitResult = {
  dividendAmount: string
  stakedAmount: string
} & ExtrinsicResult
export type TokenIssuedResult = {
  tokenId: TokenId
} & ExtrinsicResult
export type TokenAMMSoldResult = {
  receivedAmount: string
} & ExtrinsicResult

type TxMethodsFromClass<T> = T extends `${infer _}Tx` ? T : never

export type TxMethodName = TxMethodsFromClass<keyof JoystreamLibExtrinsics>
