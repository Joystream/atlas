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

export enum AssetAvailability {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Invalid = 'INVALID',
}

export type Channel = {
  __typename?: 'Channel'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  ownerMember?: Maybe<Membership>
  videos: Array<Video>
  isCensored: Scalars['Boolean']
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Language>
  coverPhotoDataObject?: Maybe<DataObject>
  coverPhotoUrls: Array<Scalars['String']>
  coverPhotoAvailability: AssetAvailability
  avatarPhotoDataObject?: Maybe<DataObject>
  avatarPhotoUrls: Array<Scalars['String']>
  avatarPhotoAvailability: AssetAvailability
  follows?: Maybe<Scalars['Int']>
  views?: Maybe<Scalars['Int']>
}

export type ChannelConnection = {
  __typename?: 'ChannelConnection'
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelEdge = {
  __typename?: 'ChannelEdge'
  node: Channel
  cursor: Scalars['String']
}

export type ChannelFollowsInfo = {
  __typename?: 'ChannelFollowsInfo'
  follows: Scalars['Int']
  id: Scalars['ID']
}

export enum ChannelOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type ChannelWhereInput = {
  id_in?: Maybe<Array<Scalars['ID']>>
  ownerMemberId_eq?: Maybe<Scalars['ID']>
  isCurated_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  coverPhotoAvailability_eq?: Maybe<AssetAvailability>
  avatarPhotoAvailability_eq?: Maybe<AssetAvailability>
  languageId_eq?: Maybe<Scalars['ID']>
}

export type ChannelWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObject = {
  __typename?: 'DataObject'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  size: Scalars['Float']
  liaison?: Maybe<Worker>
  liaisonJudgement: LiaisonJudgement
  ipfsContentId: Scalars['String']
  joystreamContentId: Scalars['String']
}

export type DataObjectWhereInput = {
  joystreamContentId_eq?: Maybe<Scalars['String']>
  joystreamContentId_in?: Maybe<Array<Scalars['String']>>
}

export type EntityViewsInfo = {
  __typename?: 'EntityViewsInfo'
  id: Scalars['ID']
  views: Scalars['Int']
}

export type Language = {
  __typename?: 'Language'
  id: Scalars['ID']
  iso: Scalars['String']
}

export enum LiaisonJudgement {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
}

export type License = {
  __typename?: 'License'
  id: Scalars['ID']
  code?: Maybe<Scalars['Int']>
  attribution?: Maybe<Scalars['String']>
  customText?: Maybe<Scalars['String']>
}

export type Membership = {
  __typename?: 'Membership'
  id: Scalars['ID']
  handle: Scalars['String']
  avatarUri?: Maybe<Scalars['String']>
  controllerAccount: Scalars['String']
  about?: Maybe<Scalars['String']>
  channels: Array<Channel>
}

export type MembershipWhereInput = {
  controllerAccount_eq?: Maybe<Scalars['ID']>
  controllerAccount_in?: Maybe<Array<Scalars['ID']>>
}

export type MembershipWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>
  handle?: Maybe<Scalars['String']>
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
  categoryId?: Maybe<Scalars['ID']>
  channelId: Scalars['ID']
  videoId: Scalars['ID']
}

export type MutationFollowChannelArgs = {
  channelId: Scalars['ID']
}

export type MutationUnfollowChannelArgs = {
  channelId: Scalars['ID']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

export type ProcessorState = {
  __typename?: 'ProcessorState'
  lastCompleteBlock: Scalars['Float']
  lastProcessedEvent: Scalars['String']
  indexerHead: Scalars['Float']
  chainHead: Scalars['Float']
}

export type Query = {
  __typename?: 'Query'
  /** Get follows counts for a list of channels */
  batchedChannelFollows: Array<Maybe<ChannelFollowsInfo>>
  /** Get views counts for a list of channels */
  batchedChannelsViews: Array<Maybe<EntityViewsInfo>>
  /** Get views counts for a list of videos */
  batchedVideoViews: Array<Maybe<EntityViewsInfo>>
  channelByUniqueInput?: Maybe<Channel>
  /** Get follows count for a single channel */
  channelFollows?: Maybe<ChannelFollowsInfo>
  /** Get views count for a single channel */
  channelViews?: Maybe<EntityViewsInfo>
  channels: Array<Channel>
  channelsConnection: ChannelConnection
  dataObjects: Array<DataObject>
  membershipByUniqueInput?: Maybe<Membership>
  memberships: Array<Membership>
  /** Get list of most followed channels */
  mostFollowedChannels: Array<ChannelFollowsInfo>
  /** Get list of most followed channels of all time */
  mostFollowedChannelsAllTime?: Maybe<Array<ChannelFollowsInfo>>
  /** Get list of channels with most views in given period */
  mostViewedChannels?: Maybe<Array<EntityViewsInfo>>
  /** Get list of channels with most views of all time */
  mostViewedChannelsAllTime?: Maybe<Array<EntityViewsInfo>>
  /** Get most viewed list of videos */
  mostViewedVideos?: Maybe<Array<EntityViewsInfo>>
  /** Get most viewed list of videos of all time */
  mostViewedVideosAllTime?: Maybe<Array<EntityViewsInfo>>
  search: Array<SearchFtsOutput>
  videoByUniqueInput?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  /** Get views count for a single video */
  videoViews?: Maybe<EntityViewsInfo>
  videos?: Maybe<Array<Video>>
  videosConnection: VideoConnection
  workerByUniqueInput?: Maybe<Worker>
  workers?: Maybe<Array<Worker>>
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

export type QueryChannelByUniqueInputArgs = {
  where: ChannelWhereUniqueInput
}

export type QueryChannelFollowsArgs = {
  channelId: Scalars['ID']
}

export type QueryChannelViewsArgs = {
  channelId: Scalars['ID']
}

export type QueryChannelsArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  where?: Maybe<ChannelWhereInput>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
}

export type QueryDataObjectsArgs = {
  limit?: Maybe<Scalars['Int']>
  where?: Maybe<DataObjectWhereInput>
}

export type QueryMembershipByUniqueInputArgs = {
  where: MembershipWhereUniqueInput
}

export type QueryMembershipsArgs = {
  where: MembershipWhereInput
}

export type QueryMostFollowedChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostFollowedChannelsAllTimeArgs = {
  limit: Scalars['Int']
}

export type QueryMostViewedChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostViewedChannelsAllTimeArgs = {
  limit: Scalars['Int']
}

export type QueryMostViewedVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostViewedVideosAllTimeArgs = {
  limit: Scalars['Int']
}

export type QuerySearchArgs = {
  limit?: Maybe<Scalars['Int']>
  text: Scalars['String']
  whereVideo?: Maybe<VideoWhereInput>
  whereChannel?: Maybe<ChannelWhereInput>
}

export type QueryVideoByUniqueInputArgs = {
  where: VideoWhereUniqueInput
}

export type QueryVideoViewsArgs = {
  videoId: Scalars['ID']
}

export type QueryVideosArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  where?: Maybe<VideoWhereInput>
  orderBy?: Maybe<Array<VideoOrderByInput>>
}

export type QueryVideosConnectionArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  where?: Maybe<VideoWhereInput>
  orderBy?: Maybe<Array<VideoOrderByInput>>
}

export type QueryWorkerByUniqueInputArgs = {
  where: WorkerWhereUniqueInput
}

export type QueryWorkersArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  where?: Maybe<WorkerWhereInput>
}

export type SearchFtsOutput = {
  __typename?: 'SearchFTSOutput'
  item: SearchResult
  rank: Scalars['Float']
  isTypeOf: Scalars['String']
  highlight: Scalars['String']
}

export type SearchResult = Video | Channel

export type Subscription = {
  __typename?: 'Subscription'
  stateSubscription: ProcessorState
}

export type Video = {
  __typename?: 'Video'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  channel: Channel
  isCensored: Scalars['Boolean']
  isFeatured: Scalars['Boolean']
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  category?: Maybe<VideoCategory>
  language?: Maybe<Language>
  hasMarketing?: Maybe<Scalars['Boolean']>
  isExplicit?: Maybe<Scalars['Boolean']>
  isPublic?: Maybe<Scalars['Boolean']>
  license?: Maybe<License>
  thumbnailPhotoDataObject?: Maybe<DataObject>
  thumbnailPhotoUrls: Array<Scalars['String']>
  thumbnailPhotoAvailability: AssetAvailability
  mediaDataObject?: Maybe<DataObject>
  mediaUrls: Array<Scalars['String']>
  mediaAvailability: AssetAvailability
  mediaMetadata: VideoMediaMetadata
  duration?: Maybe<Scalars['Int']>
  skippableIntroDuration?: Maybe<Scalars['Int']>
  views?: Maybe<Scalars['Int']>
}

export type VideoCategory = {
  __typename?: 'VideoCategory'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  videos?: Maybe<Array<Video>>
}

export type VideoCategoryWhereUniqueInput = {
  id: Scalars['ID']
}

export type VideoConnection = {
  __typename?: 'VideoConnection'
  edges: Array<VideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoEdge = {
  __typename?: 'VideoEdge'
  node: Video
  cursor: Scalars['String']
}

export type VideoMediaMetadata = {
  __typename?: 'VideoMediaMetadata'
  id: Scalars['ID']
  pixelWidth?: Maybe<Scalars['Int']>
  pixelHeight?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Int']>
}

export enum VideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type VideoWhereInput = {
  categoryId_eq?: Maybe<Scalars['ID']>
  channelId_in?: Maybe<Array<Scalars['ID']>>
  channelId_eq?: Maybe<Scalars['ID']>
  thumbnailPhotoAvailability_eq?: Maybe<AssetAvailability>
  mediaAvailability_eq?: Maybe<AssetAvailability>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  isFeatured_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  id_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
}

export type VideoWhereUniqueInput = {
  id: Scalars['ID']
}

export type Worker = {
  __typename?: 'Worker'
  id: Scalars['ID']
  workerId: Scalars['String']
  type: WorkerType
  metadata?: Maybe<Scalars['String']>
  isActive: Scalars['Boolean']
}

export enum WorkerOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export enum WorkerType {
  Gateway = 'GATEWAY',
  Storage = 'STORAGE',
}

export type WorkerWhereInput = {
  metadata_contains?: Maybe<Scalars['String']>
  isActive_eq?: Maybe<Scalars['Boolean']>
  type_eq?: Maybe<WorkerType>
}

export type WorkerWhereUniqueInput = {
  id: Scalars['ID']
}
