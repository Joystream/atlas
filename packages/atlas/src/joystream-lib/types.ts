import { IChannelMetadata, IMembershipMetadata, IVideoMetadata } from '@joystream/metadata-protobuf'
import { AugmentedEvent, AugmentedEvents } from '@polkadot/api/types/events'
import { GenericEvent } from '@polkadot/types'
import BN from 'bn.js'

export type AccountId = string
export type MemberId = string
export type ChannelId = string
export type VideoId = string

export type DataObjectMetadata = {
  size: number
  ipfsHash: string
  replacedDataObjectId?: BN
}

type VideoAssetsKey = 'thumbnailPhoto' | 'media'
export type VideoAssets<T> = {
  [key in VideoAssetsKey]?: T
}
export type VideoInputAssets = VideoAssets<DataObjectMetadata>
export type VideoAssetsIds = VideoAssets<string>

type ChannelAssetsKey = 'coverPhoto' | 'avatarPhoto'
export type ChannelAssets<T> = {
  [key in ChannelAssetsKey]?: T
}
export type ChannelInputAssets = ChannelAssets<DataObjectMetadata>
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
    }
  : T extends { transactionHash: string }
  ? { block: number; transactionHash: string } & T
  : { block: number } & T

export type VideoInputMetadata = Omit<
  IVideoMetadata,
  'thumbnailPhoto' | 'video' | 'personsList' | 'mediaType' | 'publishedBeforeJoystream' | 'category'
> & {
  publishedBeforeJoystream?: string
  mimeMediaType?: string
  category?: number
  nft?: NftIssuanceInputMetadata
}
export type ChannelInputMetadata = Omit<IChannelMetadata, 'coverPhoto' | 'avatarPhoto' | 'category'> & {
  ownerAccount: AccountId
}
export type MemberInputMetadata = Omit<IMembershipMetadata, 'avatarObject'>

type NftBuyNowInputMetadata = {
  type: 'buyNow'
  buyNowPrice: number
}
type NftCommonAuctionInputMetadata = {
  startingPrice: number
  minimalBidStep: number
  buyNowPrice?: number
  // if startsAtBlock is empty, current block (in which extrinsic is processed) will be used
  startsAtBlock?: number
  whitelistedMembersIds?: BN[]
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
  getEventData: GetEventDataFn
) => ChannelAssetsIds
export type ExtractVideoResultsAssetsIdsFn = (
  inputAssets: VideoInputAssets,
  getEventData: GetEventDataFn
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
export type MetaprotcolExtrinsicResult = ExtrinsicResult<{ transactionHash: string }>
