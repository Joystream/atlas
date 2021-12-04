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
  BigInt: number
  DateTime: Date
}

export enum AssetAvailability {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Invalid = 'INVALID',
}

export type CategoryFeaturedVideos = {
  __typename?: 'CategoryFeaturedVideos'
  categoryId: Scalars['ID']
  videos: Array<FeaturedVideo>
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
  coverPhoto?: Maybe<StorageDataObject>
  avatarPhoto?: Maybe<StorageDataObject>
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
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  isCurated_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  ownerMember?: Maybe<MembershipWhereInput>
  language?: Maybe<LanguageWhereInput>
  coverPhoto?: Maybe<DataObjectWhereInput>
  avatarPhoto?: Maybe<DataObjectWhereInput>
}

export type ChannelWhereUniqueInput = {
  id: Scalars['ID']
}

export enum Continent {
  Af = 'AF',
  Na = 'NA',
  Oc = 'OC',
  An = 'AN',
  As = 'AS',
  Eu = 'EU',
  Sa = 'SA',
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
  videomediaDataObject?: Maybe<Array<Video>>
  videothumbnailPhotoDataObject?: Maybe<Array<Video>>
}

export type DataObjectType =
  | DataObjectTypeChannelAvatar
  | DataObjectTypeChannelCoverPhoto
  | DataObjectTypeVideoMedia
  | DataObjectTypeVideoThumbnail
  | DataObjectTypeUnknown

export type DataObjectTypeChannelAvatar = {
  __typename?: 'DataObjectTypeChannelAvatar'
  channel?: Maybe<Channel>
}

export type DataObjectTypeChannelCoverPhoto = {
  __typename?: 'DataObjectTypeChannelCoverPhoto'
  channel?: Maybe<Channel>
}

export type DataObjectTypeUnknown = {
  __typename?: 'DataObjectTypeUnknown'
  phantom?: Maybe<Scalars['Int']>
}

export type DataObjectTypeVideoMedia = {
  __typename?: 'DataObjectTypeVideoMedia'
  video?: Maybe<Video>
}

export type DataObjectTypeVideoThumbnail = {
  __typename?: 'DataObjectTypeVideoThumbnail'
  video?: Maybe<Video>
}

export type DataObjectWhereInput = {
  joystreamContentId_eq?: Maybe<Scalars['String']>
  joystreamContentId_in?: Maybe<Array<Scalars['String']>>
}

export type DistributionBucket = {
  __typename?: 'DistributionBucket'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  family: DistributionBucketFamily
  familyId: Scalars['String']
  operators: Array<DistributionBucketOperator>
  acceptingNewBags: Scalars['Boolean']
  distributing: Scalars['Boolean']
  bags: Array<StorageBag>
}

export type DistributionBucketFamily = {
  __typename?: 'DistributionBucketFamily'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  metadata?: Maybe<DistributionBucketFamilyMetadata>
  metadataId?: Maybe<Scalars['String']>
  buckets: Array<DistributionBucket>
}

export type DistributionBucketFamilyGeographicArea = {
  __typename?: 'DistributionBucketFamilyGeographicArea'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  area: GeographicalArea
  distributionBucketFamilyMetadata: DistributionBucketFamilyMetadata
  distributionBucketFamilyMetadataId: Scalars['String']
}

export type DistributionBucketFamilyMetadata = {
  __typename?: 'DistributionBucketFamilyMetadata'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  region?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  areas: Array<DistributionBucketFamilyGeographicArea>
  latencyTestTargets?: Maybe<Array<Scalars['String']>>
}

export type DistributionBucketOperator = {
  __typename?: 'DistributionBucketOperator'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  distributionBucket: DistributionBucket
  distributionBucketId: Scalars['String']
  workerId: Scalars['Int']
  status: DistributionBucketOperatorStatus
  metadata?: Maybe<DistributionBucketOperatorMetadata>
  metadataId?: Maybe<Scalars['String']>
}

export type DistributionBucketOperatorMetadata = {
  __typename?: 'DistributionBucketOperatorMetadata'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
  nodeLocationId?: Maybe<Scalars['String']>
  extra?: Maybe<Scalars['String']>
}

export enum DistributionBucketOperatorStatus {
  Invited = 'INVITED',
  Active = 'ACTIVE',
}

export type DistributionBucketWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  acceptingNewBags_eq?: Maybe<Scalars['Boolean']>
  distributing_eq?: Maybe<Scalars['Boolean']>
  distributing_in?: Maybe<Array<Scalars['Boolean']>>
  bags_none?: Maybe<StorageBagWhereInput>
  bags_some?: Maybe<StorageBagWhereInput>
  bags_every?: Maybe<StorageBagWhereInput>
  AND?: Maybe<Array<DistributionBucketWhereInput>>
  OR?: Maybe<Array<DistributionBucketWhereInput>>
}

export type EntityViewsInfo = {
  __typename?: 'EntityViewsInfo'
  id: Scalars['ID']
  views: Scalars['Int']
}

export type FeaturedVideo = {
  __typename?: 'FeaturedVideo'
  videoCutUrl?: Maybe<Scalars['String']>
  videoId: Scalars['ID']
}

export type FeaturedVideoInput = {
  videoCutUrl?: Maybe<Scalars['String']>
  videoId: Scalars['ID']
}

export type GeoCoordinates = {
  __typename?: 'GeoCoordinates'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

export type GeographicalArea = GeographicalAreaContinent | GeographicalAreaCountry | GeographicalAreaSubdivistion

export type GeographicalAreaContinent = {
  __typename?: 'GeographicalAreaContinent'
  code?: Maybe<Continent>
}

export type GeographicalAreaCountry = {
  __typename?: 'GeographicalAreaCountry'
  code?: Maybe<Scalars['String']>
}

export type GeographicalAreaSubdivistion = {
  __typename?: 'GeographicalAreaSubdivistion'
  code?: Maybe<Scalars['String']>
}

export type Language = {
  __typename?: 'Language'
  id: Scalars['ID']
  iso: Scalars['String']
}

export type LanguageWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  iso_eq?: Maybe<Scalars['String']>
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

export type LicenseWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  code_eq?: Maybe<Scalars['Int']>
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
  setCategoryFeaturedVideos: Array<FeaturedVideo>
  setVideoHero: VideoHero
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

export type MutationSetCategoryFeaturedVideosArgs = {
  categoryId: Scalars['ID']
  videos: Array<FeaturedVideoInput>
}

export type MutationSetVideoHeroArgs = {
  newVideoHero: VideoHeroInput
}

export type MutationUnfollowChannelArgs = {
  channelId: Scalars['ID']
}

export type NodeLocationMetadata = {
  __typename?: 'NodeLocationMetadata'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  countryCode?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  coordinates?: Maybe<GeoCoordinates>
  coordinatesId?: Maybe<Scalars['String']>
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
  /** Get featured videos for all categories */
  allCategoriesFeaturedVideos: Array<CategoryFeaturedVideos>
  /** Get follows counts for a list of channels */
  batchedChannelFollows: Array<Maybe<ChannelFollowsInfo>>
  /** Get views counts for a list of channels */
  batchedChannelsViews: Array<Maybe<EntityViewsInfo>>
  /** Get views counts for a list of videos */
  batchedVideoViews: Array<Maybe<EntityViewsInfo>>
  /** Get featured videos for a given video category */
  categoryFeaturedVideos: Array<FeaturedVideo>
  channelByUniqueInput?: Maybe<Channel>
  /** Get follows count for a single channel */
  channelFollows?: Maybe<ChannelFollowsInfo>
  /** Get views count for a single channel */
  channelViews?: Maybe<EntityViewsInfo>
  channels: Array<Channel>
  channelsConnection: ChannelConnection
  dataObjects: Array<DataObject>
  distributionBuckets: Array<DistributionBucket>
  membershipByUniqueInput?: Maybe<Membership>
  memberships: Array<Membership>
  /** Get list of most followed channels */
  mostFollowedChannels: Array<ChannelFollowsInfo>
  /** Get list of most followed channels of all time */
  mostFollowedChannelsAllTime?: Maybe<Array<ChannelFollowsInfo>>
  /** Get list of most viewed categories in a given time period */
  mostViewedCategories?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed categories of all time */
  mostViewedCategoriesAllTime?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed channels in a given time period */
  mostViewedChannels?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed channels of all time */
  mostViewedChannelsAllTime?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed videos in a given time period */
  mostViewedVideos?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed videos of all time */
  mostViewedVideosAllTime?: Maybe<Array<EntityViewsInfo>>
  search: Array<SearchFtsOutput>
  videoByUniqueInput?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  /** Get current video hero */
  videoHero: VideoHero
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

export type QueryCategoryFeaturedVideosArgs = {
  categoryId: Scalars['ID']
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

export type QueryDistributionBucketsArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  where?: Maybe<DistributionBucketWhereInput>
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

export type QueryMostViewedCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostViewedCategoriesAllTimeArgs = {
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

export type StorageBag = {
  __typename?: 'StorageBag'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  objects: Array<StorageDataObject>
  storageBuckets: Array<StorageBucket>
  distributionBuckets: Array<DistributionBucket>
  owner: StorageBagOwner
}

export type StorageBagOwner =
  | StorageBagOwnerCouncil
  | StorageBagOwnerWorkingGroup
  | StorageBagOwnerMember
  | StorageBagOwnerChannel
  | StorageBagOwnerDao

export type StorageBagOwnerChannel = {
  __typename?: 'StorageBagOwnerChannel'
  channelId?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerCouncil = {
  __typename?: 'StorageBagOwnerCouncil'
  phantom?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerDao = {
  __typename?: 'StorageBagOwnerDAO'
  daoId?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerMember = {
  __typename?: 'StorageBagOwnerMember'
  memberId?: Maybe<Scalars['Int']>
}

export type StorageBagOwnerWorkingGroup = {
  __typename?: 'StorageBagOwnerWorkingGroup'
  workingGroupId?: Maybe<Scalars['String']>
}

export type StorageBagWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  AND?: Maybe<Array<StorageBagWhereInput>>
  OR?: Maybe<Array<StorageBagWhereInput>>
}

export type StorageBucket = {
  __typename?: 'StorageBucket'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  operatorStatus: StorageBucketOperatorStatus
  operatorMetadata?: Maybe<StorageBucketOperatorMetadata>
  operatorMetadataId?: Maybe<Scalars['String']>
  acceptingNewBags: Scalars['Boolean']
  bags: Array<StorageBag>
  dataObjectsSizeLimit: Scalars['Float']
  dataObjectCountLimit: Scalars['Float']
  dataObjectsCount: Scalars['Float']
  dataObjectsSize: Scalars['Float']
}

export type StorageBucketOperatorMetadata = {
  __typename?: 'StorageBucketOperatorMetadata'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
  nodeLocationId?: Maybe<Scalars['String']>
  extra?: Maybe<Scalars['String']>
}

export type StorageBucketOperatorStatus =
  | StorageBucketOperatorStatusMissing
  | StorageBucketOperatorStatusInvited
  | StorageBucketOperatorStatusActive

export type StorageBucketOperatorStatusActive = {
  __typename?: 'StorageBucketOperatorStatusActive'
  workerId: Scalars['Int']
}

export type StorageBucketOperatorStatusInvited = {
  __typename?: 'StorageBucketOperatorStatusInvited'
  workerId: Scalars['Int']
}

export type StorageBucketOperatorStatusMissing = {
  __typename?: 'StorageBucketOperatorStatusMissing'
  phantom?: Maybe<Scalars['Int']>
}

export type StorageDataObject = {
  __typename?: 'StorageDataObject'
  id: Scalars['ID']
  createdAt: Scalars['DateTime']
  isAccepted: Scalars['Boolean']
  size: Scalars['BigInt']
  storageBag: StorageBag
  storageBagId: Scalars['String']
  ipfsHash: Scalars['String']
  type: DataObjectType
  deletionPrize: Scalars['Float']
}

export type StorageDataObjectWhereInput = {
  isAccepted_eq?: Maybe<Scalars['Boolean']>
}

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
  media?: Maybe<StorageDataObject>
  mediaMetadata?: Maybe<VideoMediaMetadata>
  thumbnailPhoto?: Maybe<StorageDataObject>
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

export type VideoCategoryWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
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

export type VideoHero = {
  __typename?: 'VideoHero'
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  heroVideoCutUrl: Scalars['String']
  videoId: Scalars['ID']
}

export type VideoHeroInput = {
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  heroVideoCutUrl: Scalars['String']
  videoId: Scalars['ID']
}

export type VideoMediaMetadata = {
  __typename?: 'VideoMediaMetadata'
  id: Scalars['ID']
  pixelWidth?: Maybe<Scalars['Int']>
  pixelHeight?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Int']>
}

export type VideoMediaMetadataWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
}

export enum VideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type VideoWhereInput = {
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  title_eq?: Maybe<Scalars['String']>
  title_contains?: Maybe<Scalars['String']>
  title_startsWith?: Maybe<Scalars['String']>
  title_endsWith?: Maybe<Scalars['String']>
  title_in?: Maybe<Array<Scalars['String']>>
  description_eq?: Maybe<Scalars['String']>
  description_contains?: Maybe<Scalars['String']>
  description_startsWith?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  duration_eq?: Maybe<Scalars['Int']>
  duration_gt?: Maybe<Scalars['Int']>
  duration_gte?: Maybe<Scalars['Int']>
  duration_lt?: Maybe<Scalars['Int']>
  duration_lte?: Maybe<Scalars['Int']>
  duration_in?: Maybe<Array<Scalars['Int']>>
  publishedBeforeJoystream_eq?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_lt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_lte?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gte?: Maybe<Scalars['DateTime']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  isExplicit_eq?: Maybe<Scalars['Boolean']>
  isFeatured_eq?: Maybe<Scalars['Boolean']>
  hasMarketing_eq?: Maybe<Scalars['Boolean']>
  channel?: Maybe<ChannelWhereInput>
  category?: Maybe<VideoCategoryWhereInput>
  thumbnailPhoto?: Maybe<StorageDataObjectWhereInput>
  language?: Maybe<LanguageWhereInput>
  license?: Maybe<LicenseWhereInput>
  media?: Maybe<StorageDataObjectWhereInput>
  mediaMetadata?: Maybe<VideoMediaMetadataWhereInput>
  AND?: Maybe<Array<VideoWhereInput>>
  OR?: Maybe<Array<VideoWhereInput>>
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
