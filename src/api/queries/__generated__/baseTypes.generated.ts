export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: Date
}

export type Language = {
  __typename?: 'Language'
  name: Scalars['String']
}

export type Membership = {
  __typename?: 'Membership'
  id: Scalars['ID']
  handle: Scalars['String']
  avatarUri?: Maybe<Scalars['String']>
  controllerAccount: Scalars['String']
  channels: Array<Channel>
}

export enum AssetAvailability {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Invalid = 'INVALID',
}

export enum LiaisonJudgement {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
}

export type DataObject = {
  __typename?: 'DataObject'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  size: Scalars['Int']
  liaisonId: Scalars['Int']
  liaisonJudgement: LiaisonJudgement
  ipfsContentId: Scalars['String']
  joystreamContentId: Scalars['String']
}

export type Block = {
  __typename?: 'Block'
  id: Scalars['ID']
  block: Scalars['Int']
}

export type Channel = {
  __typename?: 'Channel'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  coverPhotoDataObject?: Maybe<DataObject>
  coverPhotoUrl?: Maybe<Scalars['String']>
  coverPhotoAvailability: AssetAvailability
  avatarPhotoDataObject?: Maybe<DataObject>
  avatarPhotoUrl?: Maybe<Scalars['String']>
  avatarPhotoAvailability: AssetAvailability
  owner: Member
  isPublic?: Maybe<Scalars['Boolean']>
  isCensored: Scalars['Boolean']
  language?: Maybe<Language>
  videos: Array<Video>
  follows?: Maybe<Scalars['Int']>
}

export type VideoCategory = {
  __typename?: 'VideoCategory'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  videos?: Maybe<Array<Video>>
}

export type License = {
  __typename?: 'License'
  id: Scalars['ID']
  code?: Maybe<Scalars['Int']>
  url?: Maybe<Scalars['String']>
  attribution?: Maybe<Scalars['String']>
  videoLicense?: Maybe<Array<Video>>
  customText?: Maybe<Scalars['String']>
}

export type VideoMediaMetadata = {
  __typename?: 'VideoMediaMetadata'
  id: Scalars['ID']
  pixelWidth?: Maybe<Scalars['Int']>
  pixelHeight?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Float']>
}

export type Video = {
  __typename?: 'Video'
  id: Scalars['ID']
  channel: Channel
  createdAt: Scalars['DateTime']
  updatedAt?: Maybe<Scalars['DateTime']>
  deletedAt?: Maybe<Scalars['DateTime']>
  category: VideoCategory
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['Int']>
  thumbnailDataObject?: Maybe<DataObject>
  thumbnailUrl?: Maybe<Scalars['String']>
  thumbnailAvailability: AssetAvailability
  language?: Maybe<Language>
  hasMarketing?: Maybe<Scalars['Boolean']>
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  isPublic?: Maybe<Scalars['Boolean']>
  isCensored: Scalars['Boolean']
  isExplicit?: Maybe<Scalars['Boolean']>
  mediaDataObject?: Maybe<DataObject>
  mediaUrl?: Maybe<Scalars['String']>
  mediaAvailability: AssetAvailability
  mediaMetadata: VideoMediaMetadata
  license?: Maybe<License>
  isFeatured: Scalars['Boolean']
  skippableIntroDuration?: Maybe<Scalars['Int']>
  views?: Maybe<Scalars['Int']>
}

export type CoverVideo = {
  __typename?: 'CoverVideo'
  id: Scalars['ID']
  video: Video
  coverDescription: Scalars['String']
  coverCutMediaMetadata: VideoMediaMetadata
  coverCutmediaDataObject?: Maybe<DataObject>
  coverCutmediaUrl?: Maybe<Scalars['String']>
  coverCutmediaAvailability: AssetAvailability
}

export type FeaturedVideo = {
  __typename?: 'FeaturedVideo'
  id: Scalars['ID']
  video: Video
}

export type SearchResult = Video | Channel

export type SearchFtsOutput = {
  __typename?: 'SearchFTSOutput'
  item: SearchResult
  rank: Scalars['Float']
  isTypeOf: Scalars['String']
  highlight: Scalars['String']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

export type ChannelWhereInput = {
  isCurated_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  ownerMemberId_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
}

export type ChannelWhereUniqueInput = {
  id: Scalars['ID']
}

export enum ChannelOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type ChannelEdge = {
  __typename?: 'ChannelEdge'
  node: Channel
  cursor: Scalars['String']
}

export type ChannelConnection = {
  __typename?: 'ChannelConnection'
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoCategoryWhereUniqueInput = {
  id: Scalars['ID']
}

export type VideoWhereInput = {
  categoryId_eq?: Maybe<Scalars['ID']>
  channelId_in?: Maybe<Array<Scalars['ID']>>
  channelId_eq?: Maybe<Scalars['ID']>
  thumbnailAvailability_eq?: Maybe<AssetAvailability>
  mediaAvailability_eq?: Maybe<AssetAvailability>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  isFeatured_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  id_in?: Maybe<Array<Scalars['ID']>>
}

export type VideoWhereUniqueInput = {
  id: Scalars['ID']
}

export type MembershipWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>
}

export type MembershipWhereInput = {
  controllerAccount_eq?: Maybe<Scalars['ID']>
}

export enum VideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type VideoEdge = {
  __typename?: 'VideoEdge'
  node: Video
  cursor: Scalars['String']
}

export type VideoConnection = {
  __typename?: 'VideoConnection'
  edges: Array<VideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum FeaturedVideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type Query = {
  __typename?: 'Query'
  /** Get follows counts for a list of channels */
  batchedChannelFollows: Array<Maybe<ChannelFollowsInfo>>
  /** Get views counts for a list of channels */
  batchedChannelsViews: Array<Maybe<EntityViewsInfo>>
  /** Get views counts for a list of videos */
  batchedVideoViews: Array<Maybe<EntityViewsInfo>>
  categories: Array<VideoCategory>
  category?: Maybe<VideoCategory>
  channel?: Maybe<Channel>
  /** Get follows count for a single channel */
  channelFollows?: Maybe<ChannelFollowsInfo>
  /** Get views count for a single channel */
  channelViews?: Maybe<EntityViewsInfo>
  channels: Array<Channel>
  channelsConnection: ChannelConnection
  coverVideo: CoverVideo
  featuredVideos: Array<FeaturedVideo>
  membership?: Maybe<Membership>
  memberships: Array<Membership>
  search: Array<SearchFtsOutput>
  video?: Maybe<Video>
  /** Get views count for a single video */
  videoViews?: Maybe<EntityViewsInfo>
  videos?: Maybe<Array<Video>>
  videosConnection: VideoConnection
}

export type QueryBatchedChannelFollowsArgs = {
  channelIdList: Array<Scalars['ID']>
}

export type QueryBatchedChannelsViewsArgs = {
  channelIdList: Array<Scalars['ID']>
}

export type QueryBatchedVideoViewsArgs = {
  videoIdList: Array<Scalars['ID']>
}

export type QueryCategoryArgs = {
  where: VideoCategoryWhereUniqueInput
}

export type QueryChannelArgs = {
  where: ChannelWhereUniqueInput
}

export type QueryChannelFollowsArgs = {
  channelId: Scalars['ID']
}

export type QueryChannelViewsArgs = {
  channelId: Scalars['ID']
}

export type QueryChannelsArgs = {
  where?: Maybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  where?: Maybe<ChannelWhereInput>
  orderBy?: Maybe<ChannelOrderByInput>
}

export type QueryFeaturedVideosArgs = {
  orderBy?: Maybe<FeaturedVideoOrderByInput>
}

export type QueryMembershipArgs = {
  where: MembershipWhereUniqueInput
}

export type QueryMembershipsArgs = {
  where: MembershipWhereInput
}

export type QuerySearchArgs = {
  limit?: Maybe<Scalars['Int']>
  text: Scalars['String']
}

export type QueryVideoArgs = {
  where: VideoWhereUniqueInput
}

export type QueryVideoViewsArgs = {
  videoId: Scalars['ID']
}

export type QueryVideosArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  where?: Maybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  where?: Maybe<VideoWhereInput>
  orderBy?: Maybe<VideoOrderByInput>
}

export type ChannelFollowsInfo = {
  __typename?: 'ChannelFollowsInfo'
  follows: Scalars['Int']
  id: Scalars['ID']
}

export type EntityViewsInfo = {
  __typename?: 'EntityViewsInfo'
  id: Scalars['ID']
  views: Scalars['Int']
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Add a single view to the target video's count */
  addVideoView: EntityViewsInfo
  /** Add a single follow to the target channel */
  followChannel: ChannelFollowsInfo
  /** Remove a single follow from the target channel */
  unfollowChannel: ChannelFollowsInfo
}

export type MutationAddVideoViewArgs = {
  channelId: Scalars['ID']
  videoId: Scalars['ID']
}

export type MutationFollowChannelArgs = {
  channelId: Scalars['ID']
}

export type MutationUnfollowChannelArgs = {
  channelId: Scalars['ID']
}
