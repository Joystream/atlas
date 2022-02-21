import { IChannelMetadata, IMembershipMetadata, IVideoMetadata } from '@joystream/metadata-protobuf'
import { AugmentedEvent, AugmentedEvents } from '@polkadot/api/types/events'
import { GenericEvent } from '@polkadot/types'

export type AccountId = string
export type MemberId = string
export type ChannelId = string
export type VideoId = string

export type DataObjectMetadata = {
  size: number
  ipfsHash: string
  replacedDataObjectId?: string
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
  VoucherSizeLimitExceeded,
}
export type ExtrinsicStatusCallbackFn = (status: ExtrinsicStatus.Unsigned | ExtrinsicStatus.Signed) => void
export type ExtrinsicResult<T = undefined> = T extends undefined
  ? {
      block: number
    }
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
export type ChannelInputMetadata = Omit<IChannelMetadata, 'coverPhoto' | 'avatarPhoto' | 'category'>
export type MemberInputMetadata = Omit<IMembershipMetadata, 'avatarObject'>

type NftBuyNowInputMetadata = {
  type: 'buyNow'
  buyNowPrice: number
}
type NftCommonAuctionInputMetadata = Partial<Omit<NftBuyNowInputMetadata, 'type'>> & {
  startingPrice: number
  minimalBidStep: number
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
export type NftIssuanceInputMetadata = {
  royalty?: number
  sale?: NftSaleInputMetadata
}

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
export type SendExtrinsicResult = ExtrinsicResult<{ events: GenericEvent[]; getEventData: GetEventDataFn }>
export type ChannelExtrinsicResult = ExtrinsicResult<{ channelId: ChannelId; assetsIds: ChannelAssetsIds }>
export type VideoExtrinsicResult = ExtrinsicResult<{ videoId: ChannelId; assetsIds: VideoAssetsIds }>
export type MemberExtrinsicResult = ExtrinsicResult<{ memberId: MemberId }>
export type NftExtrinsicResult = ExtrinsicResult
