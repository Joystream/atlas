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
  Date: Date
}

export enum Language {
  Chinese = 'Chinese',
  English = 'English',
  Arabic = 'Arabic',
  Portugese = 'Portugese',
  French = 'French',
}

export type Member = {
  __typename: 'Member'
  id: Scalars['ID']
  handle: Scalars['String']
}

export type Channel = {
  __typename: 'Channel'
  id: Scalars['ID']
  createdAt: Scalars['Date']
  handle: Scalars['String']
  description: Scalars['String']
  coverPhotoUrl?: Maybe<Scalars['String']>
  avatarPhotoUrl?: Maybe<Scalars['String']>
  owner: Member
  isPublic: Scalars['Boolean']
  isCurated: Scalars['Boolean']
  language?: Maybe<Language>
  videos: Array<Video>
  follows?: Maybe<Scalars['Int']>
}

export type Category = {
  __typename: 'Category'
  id: Scalars['ID']
  name: Scalars['String']
  videos?: Maybe<Array<Video>>
}

export type JoystreamMediaLocation = {
  __typename: 'JoystreamMediaLocation'
  dataObjectId: Scalars['String']
}

export type HttpMediaLocation = {
  __typename: 'HttpMediaLocation'
  url: Scalars['String']
}

export type MediaLocation = JoystreamMediaLocation | HttpMediaLocation

export type KnownLicense = {
  __typename: 'KnownLicense'
  code: Scalars['String']
  name?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

export type UserDefinedLicense = {
  __typename: 'UserDefinedLicense'
  content: Scalars['String']
}

export type License = UserDefinedLicense | KnownLicense

export type LicenseEntity = {
  __typename: 'LicenseEntity'
  id: Scalars['ID']
  type: License
  attribution?: Maybe<Scalars['String']>
  videoLicense?: Maybe<Array<Video>>
}

export type VideoMedia = {
  __typename: 'VideoMedia'
  id: Scalars['ID']
  pixelWidth: Scalars['Int']
  pixelHeight: Scalars['Int']
  size?: Maybe<Scalars['Float']>
  location: MediaLocation
}

export type Video = {
  __typename: 'Video'
  id: Scalars['ID']
  channel: Channel
  category: Category
  title: Scalars['String']
  description: Scalars['String']
  views?: Maybe<Scalars['Int']>
  duration: Scalars['Int']
  skippableIntroDuration?: Maybe<Scalars['Int']>
  thumbnailUrl: Scalars['String']
  Language?: Maybe<Language>
  media: VideoMedia
  hasMarketing?: Maybe<Scalars['Boolean']>
  createdAt: Scalars['Date']
  createdAtBlockHeight: Scalars['Float']
  publishedBeforeJoystream?: Maybe<Scalars['String']>
  isPublic: Scalars['Boolean']
  isCurated: Scalars['Boolean']
  isExplicit: Scalars['Boolean']
  license: LicenseEntity
}

export type CoverVideo = {
  __typename: 'CoverVideo'
  id: Scalars['ID']
  video: Video
  coverDescription: Scalars['String']
  coverCutMedia: VideoMedia
}

export type FeaturedVideo = {
  __typename: 'FeaturedVideo'
  id: Scalars['ID']
  video: Video
}

export type SearchResult = Video | Channel

export type SearchFtsOutput = {
  __typename: 'SearchFTSOutput'
  item: SearchResult
  rank: Scalars['Float']
  isTypeOf: Scalars['String']
  highlight: Scalars['String']
}

export type PageInfo = {
  __typename: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

export type ChannelWhereInput = {
  isCurated_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
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
  __typename: 'ChannelEdge'
  node: Channel
  cursor: Scalars['String']
}

export type ChannelConnection = {
  __typename: 'ChannelConnection'
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CategoryWhereUniqueInput = {
  id: Scalars['ID']
}

export type VideoWhereInput = {
  categoryId_eq?: Maybe<Scalars['ID']>
  channelId_in?: Maybe<Array<Maybe<Scalars['ID']>>>
  channelId_eq?: Maybe<Scalars['ID']>
  createdAt_gte?: Maybe<Scalars['Date']>
  isCurated_eq?: Maybe<Scalars['Boolean']>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  id_in?: Maybe<Array<Scalars['ID']>>
}

export type VideoWhereUniqueInput = {
  id: Scalars['ID']
}

export enum VideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type VideoEdge = {
  __typename: 'VideoEdge'
  node: Video
  cursor: Scalars['String']
}

export type VideoConnection = {
  __typename: 'VideoConnection'
  edges: Array<VideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum FeaturedVideoOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
}

export type Query = {
  __typename: 'Query'
  /** Get follows counts for a list of channels */
  batchedChannelFollows: Array<Maybe<ChannelFollowsInfo>>
  /** Get views counts for a list of channels */
  batchedChannelsViews: Array<Maybe<EntityViewsInfo>>
  /** Get views counts for a list of videos */
  batchedVideoViews: Array<Maybe<EntityViewsInfo>>
  categories: Array<Category>
  category?: Maybe<Category>
  channel?: Maybe<Channel>
  /** Get follows count for a single channel */
  channelFollows?: Maybe<ChannelFollowsInfo>
  /** Get views count for a single channel */
  channelViews?: Maybe<EntityViewsInfo>
  channels: Array<Channel>
  channelsConnection: ChannelConnection
  coverVideo: CoverVideo
  featuredVideos: Array<FeaturedVideo>
  search: Array<SearchFtsOutput>
  video?: Maybe<Video>
  /** Get views count for a single video */
  videoViews?: Maybe<EntityViewsInfo>
  videos: Array<Video>
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
  where: CategoryWhereUniqueInput
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
  where?: Maybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  where?: Maybe<VideoWhereInput>
  orderBy?: Maybe<VideoOrderByInput>
}

export type ChannelFollowsInfo = {
  __typename: 'ChannelFollowsInfo'
  follows: Scalars['Int']
  id: Scalars['ID']
}

export type EntityViewsInfo = {
  __typename: 'EntityViewsInfo'
  id: Scalars['ID']
  views: Scalars['Int']
}

export type Mutation = {
  __typename: 'Mutation'
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
