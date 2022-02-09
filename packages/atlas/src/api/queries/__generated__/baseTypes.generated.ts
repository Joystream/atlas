export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
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
  /** GraphQL representation of BigInt */
  BigInt: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: Date
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
}

export type BaseGraphQlObject = {
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type BaseModel = BaseGraphQlObject & {
  __typename?: 'BaseModel'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type BaseModelUuid = BaseGraphQlObject & {
  __typename?: 'BaseModelUUID'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type BaseWhereInput = {
  createdAt_eq?: InputMaybe<Scalars['String']>
  createdAt_gt?: InputMaybe<Scalars['String']>
  createdAt_gte?: InputMaybe<Scalars['String']>
  createdAt_lt?: InputMaybe<Scalars['String']>
  createdAt_lte?: InputMaybe<Scalars['String']>
  createdById_eq?: InputMaybe<Scalars['String']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['String']>
  deletedAt_gt?: InputMaybe<Scalars['String']>
  deletedAt_gte?: InputMaybe<Scalars['String']>
  deletedAt_lt?: InputMaybe<Scalars['String']>
  deletedAt_lte?: InputMaybe<Scalars['String']>
  deletedById_eq?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  updatedAt_eq?: InputMaybe<Scalars['String']>
  updatedAt_gt?: InputMaybe<Scalars['String']>
  updatedAt_gte?: InputMaybe<Scalars['String']>
  updatedAt_lt?: InputMaybe<Scalars['String']>
  updatedAt_lte?: InputMaybe<Scalars['String']>
  updatedById_eq?: InputMaybe<Scalars['String']>
}

export type CategoryFeaturedVideos = {
  __typename?: 'CategoryFeaturedVideos'
  category: VideoCategory
  categoryFeaturedVideos: Array<FeaturedVideo>
  categoryId: Scalars['ID']
}

export type Channel = BaseGraphQlObject & {
  __typename?: 'Channel'
  avatarPhoto?: Maybe<StorageDataObject>
  avatarPhotoId?: Maybe<Scalars['String']>
  category?: Maybe<ChannelCategory>
  categoryId?: Maybe<Scalars['String']>
  collaborators: Array<Membership>
  coverPhoto?: Maybe<StorageDataObject>
  coverPhotoId?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Number of the block the channel was created in */
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** The description of a Channel */
  description?: Maybe<Scalars['String']>
  follows: Scalars['Int']
  id: Scalars['ID']
  /** Flag signaling whether a channel is censored. */
  isCensored: Scalars['Boolean']
  /** Flag signaling whether a channel is public. */
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Language>
  languageId?: Maybe<Scalars['String']>
  ownerCuratorGroup?: Maybe<CuratorGroup>
  ownerCuratorGroupId?: Maybe<Scalars['String']>
  ownerMember?: Maybe<Membership>
  ownerMemberId?: Maybe<Scalars['String']>
  /** Reward account where revenue is sent if set. */
  rewardAccount?: Maybe<Scalars['String']>
  /** The title of the Channel */
  title?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videos: Array<Video>
  views: Scalars['Int']
}

export type ChannelCategoriesByNameFtsOutput = {
  __typename?: 'ChannelCategoriesByNameFTSOutput'
  highlight: Scalars['String']
  isTypeOf: Scalars['String']
  item: ChannelCategoriesByNameSearchResult
  rank: Scalars['Float']
}

export type ChannelCategoriesByNameSearchResult = ChannelCategory

/** Category of media channel */
export type ChannelCategory = BaseGraphQlObject & {
  __typename?: 'ChannelCategory'
  channels: Array<Channel>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** The name of the category */
  name?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type ChannelCategoryConnection = {
  __typename?: 'ChannelCategoryConnection'
  edges: Array<ChannelCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelCategoryCreateInput = {
  createdInBlock: Scalars['Float']
  name?: InputMaybe<Scalars['String']>
}

export type ChannelCategoryEdge = {
  __typename?: 'ChannelCategoryEdge'
  cursor: Scalars['String']
  node: ChannelCategory
}

export enum ChannelCategoryOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type ChannelCategoryUpdateInput = {
  createdInBlock?: InputMaybe<Scalars['Float']>
  name?: InputMaybe<Scalars['String']>
}

export type ChannelCategoryWhereInput = {
  AND?: InputMaybe<Array<ChannelCategoryWhereInput>>
  OR?: InputMaybe<Array<ChannelCategoryWhereInput>>
  channels_every?: InputMaybe<ChannelWhereInput>
  channels_none?: InputMaybe<ChannelWhereInput>
  channels_some?: InputMaybe<ChannelWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  name_contains?: InputMaybe<Scalars['String']>
  name_endsWith?: InputMaybe<Scalars['String']>
  name_eq?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type ChannelCategoryWhereUniqueInput = {
  id: Scalars['ID']
}

export type ChannelConnection = {
  __typename?: 'ChannelConnection'
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelCreateInput = {
  avatarPhoto?: InputMaybe<Scalars['ID']>
  category?: InputMaybe<Scalars['ID']>
  coverPhoto?: InputMaybe<Scalars['ID']>
  createdInBlock: Scalars['Float']
  description?: InputMaybe<Scalars['String']>
  isCensored: Scalars['Boolean']
  isPublic?: InputMaybe<Scalars['Boolean']>
  language?: InputMaybe<Scalars['ID']>
  ownerCuratorGroup?: InputMaybe<Scalars['ID']>
  ownerMember?: InputMaybe<Scalars['ID']>
  rewardAccount?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type ChannelEdge = {
  __typename?: 'ChannelEdge'
  cursor: Scalars['String']
  node: Channel
}

export type ChannelFollowsInfo = {
  __typename?: 'ChannelFollowsInfo'
  follows: Scalars['Int']
  id: Scalars['ID']
}

export enum ChannelOrderByInput {
  AvatarPhotoAsc = 'avatarPhoto_ASC',
  AvatarPhotoDesc = 'avatarPhoto_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  CoverPhotoAsc = 'coverPhoto_ASC',
  CoverPhotoDesc = 'coverPhoto_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  OwnerCuratorGroupAsc = 'ownerCuratorGroup_ASC',
  OwnerCuratorGroupDesc = 'ownerCuratorGroup_DESC',
  OwnerMemberAsc = 'ownerMember_ASC',
  OwnerMemberDesc = 'ownerMember_DESC',
  RewardAccountAsc = 'rewardAccount_ASC',
  RewardAccountDesc = 'rewardAccount_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type ChannelUpdateInput = {
  avatarPhoto?: InputMaybe<Scalars['ID']>
  category?: InputMaybe<Scalars['ID']>
  coverPhoto?: InputMaybe<Scalars['ID']>
  createdInBlock?: InputMaybe<Scalars['Float']>
  description?: InputMaybe<Scalars['String']>
  isCensored?: InputMaybe<Scalars['Boolean']>
  isPublic?: InputMaybe<Scalars['Boolean']>
  language?: InputMaybe<Scalars['ID']>
  ownerCuratorGroup?: InputMaybe<Scalars['ID']>
  ownerMember?: InputMaybe<Scalars['ID']>
  rewardAccount?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type ChannelWhereInput = {
  AND?: InputMaybe<Array<ChannelWhereInput>>
  OR?: InputMaybe<Array<ChannelWhereInput>>
  avatarPhoto?: InputMaybe<StorageDataObjectWhereInput>
  category?: InputMaybe<ChannelCategoryWhereInput>
  collaborators_every?: InputMaybe<MembershipWhereInput>
  collaborators_none?: InputMaybe<MembershipWhereInput>
  collaborators_some?: InputMaybe<MembershipWhereInput>
  coverPhoto?: InputMaybe<StorageDataObjectWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_startsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  isCensored_eq?: InputMaybe<Scalars['Boolean']>
  isCensored_in?: InputMaybe<Array<Scalars['Boolean']>>
  isPublic_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_in?: InputMaybe<Array<Scalars['Boolean']>>
  language?: InputMaybe<LanguageWhereInput>
  ownerCuratorGroup?: InputMaybe<CuratorGroupWhereInput>
  ownerMember?: InputMaybe<MembershipWhereInput>
  rewardAccount_contains?: InputMaybe<Scalars['String']>
  rewardAccount_endsWith?: InputMaybe<Scalars['String']>
  rewardAccount_eq?: InputMaybe<Scalars['String']>
  rewardAccount_in?: InputMaybe<Array<Scalars['String']>>
  rewardAccount_startsWith?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_endsWith?: InputMaybe<Scalars['String']>
  title_eq?: InputMaybe<Scalars['String']>
  title_in?: InputMaybe<Array<Scalars['String']>>
  title_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videos_every?: InputMaybe<VideoWhereInput>
  videos_none?: InputMaybe<VideoWhereInput>
  videos_some?: InputMaybe<VideoWhereInput>
}

export type ChannelWhereUniqueInput = {
  id: Scalars['ID']
}

export enum Continent {
  Af = 'AF',
  An = 'AN',
  As = 'AS',
  Eu = 'EU',
  Na = 'NA',
  Oc = 'OC',
  Sa = 'SA',
}

export type CuratorGroup = BaseGraphQlObject & {
  __typename?: 'CuratorGroup'
  channels: Array<Channel>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Curators belonging to this group */
  curatorIds: Array<Scalars['Int']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Is group active or not */
  isActive: Scalars['Boolean']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type CuratorGroupConnection = {
  __typename?: 'CuratorGroupConnection'
  edges: Array<CuratorGroupEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CuratorGroupCreateInput = {
  curatorIds: Array<Scalars['Int']>
  isActive: Scalars['Boolean']
}

export type CuratorGroupEdge = {
  __typename?: 'CuratorGroupEdge'
  cursor: Scalars['String']
  node: CuratorGroup
}

export enum CuratorGroupOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type CuratorGroupUpdateInput = {
  curatorIds?: InputMaybe<Array<Scalars['Int']>>
  isActive?: InputMaybe<Scalars['Boolean']>
}

export type CuratorGroupWhereInput = {
  AND?: InputMaybe<Array<CuratorGroupWhereInput>>
  OR?: InputMaybe<Array<CuratorGroupWhereInput>>
  channels_every?: InputMaybe<ChannelWhereInput>
  channels_none?: InputMaybe<ChannelWhereInput>
  channels_some?: InputMaybe<ChannelWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  curatorIds_containsAll?: InputMaybe<Array<Scalars['Int']>>
  curatorIds_containsAny?: InputMaybe<Array<Scalars['Int']>>
  curatorIds_containsNone?: InputMaybe<Array<Scalars['Int']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  isActive_eq?: InputMaybe<Scalars['Boolean']>
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type CuratorGroupWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectType =
  | DataObjectTypeChannelAvatar
  | DataObjectTypeChannelCoverPhoto
  | DataObjectTypeUnknown
  | DataObjectTypeVideoMedia
  | DataObjectTypeVideoThumbnail

export type DataObjectTypeChannelAvatar = {
  __typename?: 'DataObjectTypeChannelAvatar'
  /** Related channel entity */
  channel?: Maybe<Channel>
}

export type DataObjectTypeChannelCoverPhoto = {
  __typename?: 'DataObjectTypeChannelCoverPhoto'
  /** Related channel entity */
  channel?: Maybe<Channel>
}

export type DataObjectTypeUnknown = {
  __typename?: 'DataObjectTypeUnknown'
  phantom?: Maybe<Scalars['Int']>
}

export type DataObjectTypeVideoMedia = {
  __typename?: 'DataObjectTypeVideoMedia'
  /** Related video entity */
  video?: Maybe<Video>
}

export type DataObjectTypeVideoThumbnail = {
  __typename?: 'DataObjectTypeVideoThumbnail'
  /** Related video entity */
  video?: Maybe<Video>
}

export type DeleteResponse = {
  id: Scalars['ID']
}

export type DistributionBucket = BaseGraphQlObject & {
  __typename?: 'DistributionBucket'
  /** Whether the bucket is accepting any new bags */
  acceptingNewBags: Scalars['Boolean']
  bags: Array<StorageBag>
  /** Bucket index within the family */
  bucketIndex: Scalars['Int']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** Whether the bucket is currently distributing content */
  distributing: Scalars['Boolean']
  family: DistributionBucketFamily
  familyId: Scalars['String']
  id: Scalars['ID']
  operators: Array<DistributionBucketOperator>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type DistributionBucketConnection = {
  __typename?: 'DistributionBucketConnection'
  edges: Array<DistributionBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketCreateInput = {
  acceptingNewBags: Scalars['Boolean']
  bucketIndex: Scalars['Float']
  distributing: Scalars['Boolean']
  family: Scalars['ID']
}

export type DistributionBucketEdge = {
  __typename?: 'DistributionBucketEdge'
  cursor: Scalars['String']
  node: DistributionBucket
}

export type DistributionBucketFamily = BaseGraphQlObject & {
  __typename?: 'DistributionBucketFamily'
  buckets: Array<DistributionBucket>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  metadata?: Maybe<DistributionBucketFamilyMetadata>
  metadataId?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type DistributionBucketFamilyConnection = {
  __typename?: 'DistributionBucketFamilyConnection'
  edges: Array<DistributionBucketFamilyEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamilyCreateInput = {
  metadata?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketFamilyEdge = {
  __typename?: 'DistributionBucketFamilyEdge'
  cursor: Scalars['String']
  node: DistributionBucketFamily
}

export type DistributionBucketFamilyGeographicArea = BaseGraphQlObject & {
  __typename?: 'DistributionBucketFamilyGeographicArea'
  /** Geographical area (continent / country / subdivision) */
  area: GeographicalArea
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  distributionBucketFamilyMetadata: DistributionBucketFamilyMetadata
  distributionBucketFamilyMetadataId: Scalars['String']
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type DistributionBucketFamilyGeographicAreaConnection = {
  __typename?: 'DistributionBucketFamilyGeographicAreaConnection'
  edges: Array<DistributionBucketFamilyGeographicAreaEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamilyGeographicAreaCreateInput = {
  area: Scalars['JSONObject']
  distributionBucketFamilyMetadata: Scalars['ID']
}

export type DistributionBucketFamilyGeographicAreaEdge = {
  __typename?: 'DistributionBucketFamilyGeographicAreaEdge'
  cursor: Scalars['String']
  node: DistributionBucketFamilyGeographicArea
}

export enum DistributionBucketFamilyGeographicAreaOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DistributionBucketFamilyMetadataAsc = 'distributionBucketFamilyMetadata_ASC',
  DistributionBucketFamilyMetadataDesc = 'distributionBucketFamilyMetadata_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DistributionBucketFamilyGeographicAreaUpdateInput = {
  area?: InputMaybe<Scalars['JSONObject']>
  distributionBucketFamilyMetadata?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketFamilyGeographicAreaWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketFamilyGeographicAreaWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketFamilyGeographicAreaWhereInput>>
  area_json?: InputMaybe<Scalars['JSONObject']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionBucketFamilyMetadata?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type DistributionBucketFamilyGeographicAreaWhereUniqueInput = {
  id: Scalars['ID']
}

export type DistributionBucketFamilyMetadata = BaseGraphQlObject & {
  __typename?: 'DistributionBucketFamilyMetadata'
  areas: Array<DistributionBucketFamilyGeographicArea>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** Optional, more specific description of the region covered by the family */
  description?: Maybe<Scalars['String']>
  distributionbucketfamilymetadata?: Maybe<Array<DistributionBucketFamily>>
  id: Scalars['ID']
  /** List of targets (hosts/ips) best suited latency measurements for the family */
  latencyTestTargets?: Maybe<Array<Scalars['String']>>
  /** Name of the geographical region covered by the family (ie.: us-east-1) */
  region?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type DistributionBucketFamilyMetadataConnection = {
  __typename?: 'DistributionBucketFamilyMetadataConnection'
  edges: Array<DistributionBucketFamilyMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamilyMetadataCreateInput = {
  description?: InputMaybe<Scalars['String']>
  latencyTestTargets?: InputMaybe<Array<Scalars['String']>>
  region?: InputMaybe<Scalars['String']>
}

export type DistributionBucketFamilyMetadataEdge = {
  __typename?: 'DistributionBucketFamilyMetadataEdge'
  cursor: Scalars['String']
  node: DistributionBucketFamilyMetadata
}

export enum DistributionBucketFamilyMetadataOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  RegionAsc = 'region_ASC',
  RegionDesc = 'region_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DistributionBucketFamilyMetadataUpdateInput = {
  description?: InputMaybe<Scalars['String']>
  latencyTestTargets?: InputMaybe<Array<Scalars['String']>>
  region?: InputMaybe<Scalars['String']>
}

export type DistributionBucketFamilyMetadataWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  areas_every?: InputMaybe<DistributionBucketFamilyGeographicAreaWhereInput>
  areas_none?: InputMaybe<DistributionBucketFamilyGeographicAreaWhereInput>
  areas_some?: InputMaybe<DistributionBucketFamilyGeographicAreaWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_startsWith?: InputMaybe<Scalars['String']>
  distributionbucketfamilymetadata_every?: InputMaybe<DistributionBucketFamilyWhereInput>
  distributionbucketfamilymetadata_none?: InputMaybe<DistributionBucketFamilyWhereInput>
  distributionbucketfamilymetadata_some?: InputMaybe<DistributionBucketFamilyWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  latencyTestTargets_containsAll?: InputMaybe<Array<Scalars['String']>>
  latencyTestTargets_containsAny?: InputMaybe<Array<Scalars['String']>>
  latencyTestTargets_containsNone?: InputMaybe<Array<Scalars['String']>>
  region_contains?: InputMaybe<Scalars['String']>
  region_endsWith?: InputMaybe<Scalars['String']>
  region_eq?: InputMaybe<Scalars['String']>
  region_in?: InputMaybe<Array<Scalars['String']>>
  region_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type DistributionBucketFamilyMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export enum DistributionBucketFamilyOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DistributionBucketFamilyUpdateInput = {
  metadata?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketFamilyWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketFamilyWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketFamilyWhereInput>>
  buckets_every?: InputMaybe<DistributionBucketWhereInput>
  buckets_none?: InputMaybe<DistributionBucketWhereInput>
  buckets_some?: InputMaybe<DistributionBucketWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  metadata?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type DistributionBucketFamilyWhereUniqueInput = {
  id: Scalars['ID']
}

export type DistributionBucketOperator = BaseGraphQlObject & {
  __typename?: 'DistributionBucketOperator'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  distributionBucket: DistributionBucket
  distributionBucketId: Scalars['String']
  id: Scalars['ID']
  metadata?: Maybe<DistributionBucketOperatorMetadata>
  metadataId?: Maybe<Scalars['String']>
  /** Current operator status */
  status: DistributionBucketOperatorStatus
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  /** ID of the distribution group worker */
  workerId: Scalars['Int']
}

export type DistributionBucketOperatorConnection = {
  __typename?: 'DistributionBucketOperatorConnection'
  edges: Array<DistributionBucketOperatorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketOperatorCreateInput = {
  distributionBucket: Scalars['ID']
  metadata?: InputMaybe<Scalars['ID']>
  status: DistributionBucketOperatorStatus
  workerId: Scalars['Float']
}

export type DistributionBucketOperatorEdge = {
  __typename?: 'DistributionBucketOperatorEdge'
  cursor: Scalars['String']
  node: DistributionBucketOperator
}

export type DistributionBucketOperatorMetadata = BaseGraphQlObject & {
  __typename?: 'DistributionBucketOperatorMetadata'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  distributionbucketoperatormetadata?: Maybe<Array<DistributionBucketOperator>>
  /** Additional information about the node/operator */
  extra?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Root distributor node api endpoint */
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
  nodeLocationId?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type DistributionBucketOperatorMetadataConnection = {
  __typename?: 'DistributionBucketOperatorMetadataConnection'
  edges: Array<DistributionBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketOperatorMetadataCreateInput = {
  extra?: InputMaybe<Scalars['String']>
  nodeEndpoint?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketOperatorMetadataEdge = {
  __typename?: 'DistributionBucketOperatorMetadataEdge'
  cursor: Scalars['String']
  node: DistributionBucketOperatorMetadata
}

export enum DistributionBucketOperatorMetadataOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationAsc = 'nodeLocation_ASC',
  NodeLocationDesc = 'nodeLocation_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DistributionBucketOperatorMetadataUpdateInput = {
  extra?: InputMaybe<Scalars['String']>
  nodeEndpoint?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketOperatorMetadataWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionbucketoperatormetadata_every?: InputMaybe<DistributionBucketOperatorWhereInput>
  distributionbucketoperatormetadata_none?: InputMaybe<DistributionBucketOperatorWhereInput>
  distributionbucketoperatormetadata_some?: InputMaybe<DistributionBucketOperatorWhereInput>
  extra_contains?: InputMaybe<Scalars['String']>
  extra_endsWith?: InputMaybe<Scalars['String']>
  extra_eq?: InputMaybe<Scalars['String']>
  extra_in?: InputMaybe<Array<Scalars['String']>>
  extra_startsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  nodeEndpoint_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_startsWith?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<NodeLocationMetadataWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type DistributionBucketOperatorMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export enum DistributionBucketOperatorOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DistributionBucketAsc = 'distributionBucket_ASC',
  DistributionBucketDesc = 'distributionBucket_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  WorkerIdAsc = 'workerId_ASC',
  WorkerIdDesc = 'workerId_DESC',
}

export enum DistributionBucketOperatorStatus {
  Active = 'ACTIVE',
  Invited = 'INVITED',
}

export type DistributionBucketOperatorUpdateInput = {
  distributionBucket?: InputMaybe<Scalars['ID']>
  metadata?: InputMaybe<Scalars['ID']>
  status?: InputMaybe<DistributionBucketOperatorStatus>
  workerId?: InputMaybe<Scalars['Float']>
}

export type DistributionBucketOperatorWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketOperatorWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketOperatorWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionBucket?: InputMaybe<DistributionBucketWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  metadata?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
  status_eq?: InputMaybe<DistributionBucketOperatorStatus>
  status_in?: InputMaybe<Array<DistributionBucketOperatorStatus>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  workerId_eq?: InputMaybe<Scalars['Int']>
  workerId_gt?: InputMaybe<Scalars['Int']>
  workerId_gte?: InputMaybe<Scalars['Int']>
  workerId_in?: InputMaybe<Array<Scalars['Int']>>
  workerId_lt?: InputMaybe<Scalars['Int']>
  workerId_lte?: InputMaybe<Scalars['Int']>
}

export type DistributionBucketOperatorWhereUniqueInput = {
  id: Scalars['ID']
}

export enum DistributionBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  BucketIndexAsc = 'bucketIndex_ASC',
  BucketIndexDesc = 'bucketIndex_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DistributingAsc = 'distributing_ASC',
  DistributingDesc = 'distributing_DESC',
  FamilyAsc = 'family_ASC',
  FamilyDesc = 'family_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DistributionBucketUpdateInput = {
  acceptingNewBags?: InputMaybe<Scalars['Boolean']>
  bucketIndex?: InputMaybe<Scalars['Float']>
  distributing?: InputMaybe<Scalars['Boolean']>
  family?: InputMaybe<Scalars['ID']>
}

export type DistributionBucketWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketWhereInput>>
  acceptingNewBags_eq?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_in?: InputMaybe<Array<Scalars['Boolean']>>
  bags_every?: InputMaybe<StorageBagWhereInput>
  bags_none?: InputMaybe<StorageBagWhereInput>
  bags_some?: InputMaybe<StorageBagWhereInput>
  bucketIndex_eq?: InputMaybe<Scalars['Int']>
  bucketIndex_gt?: InputMaybe<Scalars['Int']>
  bucketIndex_gte?: InputMaybe<Scalars['Int']>
  bucketIndex_in?: InputMaybe<Array<Scalars['Int']>>
  bucketIndex_lt?: InputMaybe<Scalars['Int']>
  bucketIndex_lte?: InputMaybe<Scalars['Int']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributing_eq?: InputMaybe<Scalars['Boolean']>
  distributing_in?: InputMaybe<Array<Scalars['Boolean']>>
  family?: InputMaybe<DistributionBucketFamilyWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  operators_every?: InputMaybe<DistributionBucketOperatorWhereInput>
  operators_none?: InputMaybe<DistributionBucketOperatorWhereInput>
  operators_some?: InputMaybe<DistributionBucketOperatorWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type DistributionBucketWhereUniqueInput = {
  id: Scalars['ID']
}

export type EntityViewsInfo = {
  __typename?: 'EntityViewsInfo'
  id: Scalars['ID']
  views: Scalars['Int']
}

export type FeaturedVideo = {
  __typename?: 'FeaturedVideo'
  video: Video
  videoCutUrl?: Maybe<Scalars['String']>
  videoId: Scalars['ID']
}

export type FeaturedVideoInput = {
  videoCutUrl?: InputMaybe<Scalars['String']>
  videoId: Scalars['ID']
}

export type GeoCoordinates = BaseGraphQlObject & {
  __typename?: 'GeoCoordinates'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  latitude: Scalars['Float']
  longitude: Scalars['Float']
  nodelocationmetadatacoordinates?: Maybe<Array<NodeLocationMetadata>>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type GeoCoordinatesConnection = {
  __typename?: 'GeoCoordinatesConnection'
  edges: Array<GeoCoordinatesEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type GeoCoordinatesCreateInput = {
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

export type GeoCoordinatesEdge = {
  __typename?: 'GeoCoordinatesEdge'
  cursor: Scalars['String']
  node: GeoCoordinates
}

export enum GeoCoordinatesOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  LatitudeAsc = 'latitude_ASC',
  LatitudeDesc = 'latitude_DESC',
  LongitudeAsc = 'longitude_ASC',
  LongitudeDesc = 'longitude_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type GeoCoordinatesUpdateInput = {
  latitude?: InputMaybe<Scalars['Float']>
  longitude?: InputMaybe<Scalars['Float']>
}

export type GeoCoordinatesWhereInput = {
  AND?: InputMaybe<Array<GeoCoordinatesWhereInput>>
  OR?: InputMaybe<Array<GeoCoordinatesWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  latitude_eq?: InputMaybe<Scalars['Float']>
  latitude_gt?: InputMaybe<Scalars['Float']>
  latitude_gte?: InputMaybe<Scalars['Float']>
  latitude_in?: InputMaybe<Array<Scalars['Float']>>
  latitude_lt?: InputMaybe<Scalars['Float']>
  latitude_lte?: InputMaybe<Scalars['Float']>
  longitude_eq?: InputMaybe<Scalars['Float']>
  longitude_gt?: InputMaybe<Scalars['Float']>
  longitude_gte?: InputMaybe<Scalars['Float']>
  longitude_in?: InputMaybe<Array<Scalars['Float']>>
  longitude_lt?: InputMaybe<Scalars['Float']>
  longitude_lte?: InputMaybe<Scalars['Float']>
  nodelocationmetadatacoordinates_every?: InputMaybe<NodeLocationMetadataWhereInput>
  nodelocationmetadatacoordinates_none?: InputMaybe<NodeLocationMetadataWhereInput>
  nodelocationmetadatacoordinates_some?: InputMaybe<NodeLocationMetadataWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type GeoCoordinatesWhereUniqueInput = {
  id: Scalars['ID']
}

export type GeographicalArea = GeographicalAreaContinent | GeographicalAreaCountry | GeographicalAreaSubdivistion

export type GeographicalAreaContinent = {
  __typename?: 'GeographicalAreaContinent'
  code?: Maybe<Continent>
}

export type GeographicalAreaContinentCreateInput = {
  code?: InputMaybe<Continent>
}

export type GeographicalAreaContinentUpdateInput = {
  code?: InputMaybe<Continent>
}

export type GeographicalAreaContinentWhereInput = {
  AND?: InputMaybe<Array<GeographicalAreaContinentWhereInput>>
  OR?: InputMaybe<Array<GeographicalAreaContinentWhereInput>>
  code_eq?: InputMaybe<Continent>
  code_in?: InputMaybe<Array<Continent>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type GeographicalAreaContinentWhereUniqueInput = {
  id: Scalars['ID']
}

export type GeographicalAreaCountry = {
  __typename?: 'GeographicalAreaCountry'
  /** ISO 3166-1 alpha-2 country code */
  code?: Maybe<Scalars['String']>
}

export type GeographicalAreaSubdivistion = {
  __typename?: 'GeographicalAreaSubdivistion'
  /** ISO 3166-2 subdivision code */
  code?: Maybe<Scalars['String']>
}

export type Language = BaseGraphQlObject & {
  __typename?: 'Language'
  channellanguage?: Maybe<Array<Channel>>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Language identifier ISO 639-1 */
  iso: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videolanguage?: Maybe<Array<Video>>
}

export type LanguageConnection = {
  __typename?: 'LanguageConnection'
  edges: Array<LanguageEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type LanguageCreateInput = {
  createdInBlock: Scalars['Float']
  iso: Scalars['String']
}

export type LanguageEdge = {
  __typename?: 'LanguageEdge'
  cursor: Scalars['String']
  node: Language
}

export enum LanguageOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  IsoAsc = 'iso_ASC',
  IsoDesc = 'iso_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type LanguageUpdateInput = {
  createdInBlock?: InputMaybe<Scalars['Float']>
  iso?: InputMaybe<Scalars['String']>
}

export type LanguageWhereInput = {
  AND?: InputMaybe<Array<LanguageWhereInput>>
  OR?: InputMaybe<Array<LanguageWhereInput>>
  channellanguage_every?: InputMaybe<ChannelWhereInput>
  channellanguage_none?: InputMaybe<ChannelWhereInput>
  channellanguage_some?: InputMaybe<ChannelWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  iso_contains?: InputMaybe<Scalars['String']>
  iso_endsWith?: InputMaybe<Scalars['String']>
  iso_eq?: InputMaybe<Scalars['String']>
  iso_in?: InputMaybe<Array<Scalars['String']>>
  iso_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videolanguage_every?: InputMaybe<VideoWhereInput>
  videolanguage_none?: InputMaybe<VideoWhereInput>
  videolanguage_some?: InputMaybe<VideoWhereInput>
}

export type LanguageWhereUniqueInput = {
  id: Scalars['ID']
}

export type License = BaseGraphQlObject & {
  __typename?: 'License'
  /** Attribution (if required by the license) */
  attribution?: Maybe<Scalars['String']>
  /** License code defined by Joystream */
  code?: Maybe<Scalars['Int']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Custom license content */
  customText?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videolicense?: Maybe<Array<Video>>
}

export type LicenseConnection = {
  __typename?: 'LicenseConnection'
  edges: Array<LicenseEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type LicenseCreateInput = {
  attribution?: InputMaybe<Scalars['String']>
  code?: InputMaybe<Scalars['Float']>
  customText?: InputMaybe<Scalars['String']>
}

export type LicenseEdge = {
  __typename?: 'LicenseEdge'
  cursor: Scalars['String']
  node: License
}

export enum LicenseOrderByInput {
  AttributionAsc = 'attribution_ASC',
  AttributionDesc = 'attribution_DESC',
  CodeAsc = 'code_ASC',
  CodeDesc = 'code_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CustomTextAsc = 'customText_ASC',
  CustomTextDesc = 'customText_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type LicenseUpdateInput = {
  attribution?: InputMaybe<Scalars['String']>
  code?: InputMaybe<Scalars['Float']>
  customText?: InputMaybe<Scalars['String']>
}

export type LicenseWhereInput = {
  AND?: InputMaybe<Array<LicenseWhereInput>>
  OR?: InputMaybe<Array<LicenseWhereInput>>
  attribution_contains?: InputMaybe<Scalars['String']>
  attribution_endsWith?: InputMaybe<Scalars['String']>
  attribution_eq?: InputMaybe<Scalars['String']>
  attribution_in?: InputMaybe<Array<Scalars['String']>>
  attribution_startsWith?: InputMaybe<Scalars['String']>
  code_eq?: InputMaybe<Scalars['Int']>
  code_gt?: InputMaybe<Scalars['Int']>
  code_gte?: InputMaybe<Scalars['Int']>
  code_in?: InputMaybe<Array<Scalars['Int']>>
  code_lt?: InputMaybe<Scalars['Int']>
  code_lte?: InputMaybe<Scalars['Int']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  customText_contains?: InputMaybe<Scalars['String']>
  customText_endsWith?: InputMaybe<Scalars['String']>
  customText_eq?: InputMaybe<Scalars['String']>
  customText_in?: InputMaybe<Array<Scalars['String']>>
  customText_startsWith?: InputMaybe<Scalars['String']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videolicense_every?: InputMaybe<VideoWhereInput>
  videolicense_none?: InputMaybe<VideoWhereInput>
  videolicense_some?: InputMaybe<VideoWhereInput>
}

export type LicenseWhereUniqueInput = {
  id: Scalars['ID']
}

export type MembersByHandleFtsOutput = {
  __typename?: 'MembersByHandleFTSOutput'
  highlight: Scalars['String']
  isTypeOf: Scalars['String']
  item: MembersByHandleSearchResult
  rank: Scalars['Float']
}

export type MembersByHandleSearchResult = Membership

/** Stored information about a registered user */
export type Membership = BaseGraphQlObject & {
  __typename?: 'Membership'
  /** Short text chosen by member to share information about themselves */
  about?: Maybe<Scalars['String']>
  /** A Url to member's Avatar image */
  avatarUri?: Maybe<Scalars['String']>
  channels: Array<Channel>
  collaboratorInChannels: Array<Channel>
  /** Member's controller account id */
  controllerAccount: Scalars['String']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Blocknumber when member was registered */
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** How the member was registered */
  entry: MembershipEntryMethod
  /** The unique handle chosen by member */
  handle: Scalars['String']
  id: Scalars['ID']
  /** Member's root account id */
  rootAccount: Scalars['String']
  /** The type of subscription the member has purchased if any. */
  subscription?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type MembershipConnection = {
  __typename?: 'MembershipConnection'
  edges: Array<MembershipEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MembershipCreateInput = {
  about?: InputMaybe<Scalars['String']>
  avatarUri?: InputMaybe<Scalars['String']>
  controllerAccount: Scalars['String']
  createdInBlock: Scalars['Float']
  entry: MembershipEntryMethod
  handle: Scalars['String']
  rootAccount: Scalars['String']
  subscription?: InputMaybe<Scalars['Float']>
}

export type MembershipEdge = {
  __typename?: 'MembershipEdge'
  cursor: Scalars['String']
  node: Membership
}

export enum MembershipEntryMethod {
  Genesis = 'GENESIS',
  Paid = 'PAID',
  Screening = 'SCREENING',
}

export enum MembershipOrderByInput {
  AboutAsc = 'about_ASC',
  AboutDesc = 'about_DESC',
  AvatarUriAsc = 'avatarUri_ASC',
  AvatarUriDesc = 'avatarUri_DESC',
  ControllerAccountAsc = 'controllerAccount_ASC',
  ControllerAccountDesc = 'controllerAccount_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  EntryAsc = 'entry_ASC',
  EntryDesc = 'entry_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  RootAccountAsc = 'rootAccount_ASC',
  RootAccountDesc = 'rootAccount_DESC',
  SubscriptionAsc = 'subscription_ASC',
  SubscriptionDesc = 'subscription_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type MembershipUpdateInput = {
  about?: InputMaybe<Scalars['String']>
  avatarUri?: InputMaybe<Scalars['String']>
  controllerAccount?: InputMaybe<Scalars['String']>
  createdInBlock?: InputMaybe<Scalars['Float']>
  entry?: InputMaybe<MembershipEntryMethod>
  handle?: InputMaybe<Scalars['String']>
  rootAccount?: InputMaybe<Scalars['String']>
  subscription?: InputMaybe<Scalars['Float']>
}

export type MembershipWhereInput = {
  AND?: InputMaybe<Array<MembershipWhereInput>>
  OR?: InputMaybe<Array<MembershipWhereInput>>
  about_contains?: InputMaybe<Scalars['String']>
  about_endsWith?: InputMaybe<Scalars['String']>
  about_eq?: InputMaybe<Scalars['String']>
  about_in?: InputMaybe<Array<Scalars['String']>>
  about_startsWith?: InputMaybe<Scalars['String']>
  avatarUri_contains?: InputMaybe<Scalars['String']>
  avatarUri_endsWith?: InputMaybe<Scalars['String']>
  avatarUri_eq?: InputMaybe<Scalars['String']>
  avatarUri_in?: InputMaybe<Array<Scalars['String']>>
  avatarUri_startsWith?: InputMaybe<Scalars['String']>
  channels_every?: InputMaybe<ChannelWhereInput>
  channels_none?: InputMaybe<ChannelWhereInput>
  channels_some?: InputMaybe<ChannelWhereInput>
  collaboratorInChannels_every?: InputMaybe<ChannelWhereInput>
  collaboratorInChannels_none?: InputMaybe<ChannelWhereInput>
  collaboratorInChannels_some?: InputMaybe<ChannelWhereInput>
  controllerAccount_contains?: InputMaybe<Scalars['String']>
  controllerAccount_endsWith?: InputMaybe<Scalars['String']>
  controllerAccount_eq?: InputMaybe<Scalars['String']>
  controllerAccount_in?: InputMaybe<Array<Scalars['String']>>
  controllerAccount_startsWith?: InputMaybe<Scalars['String']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  entry_eq?: InputMaybe<MembershipEntryMethod>
  entry_in?: InputMaybe<Array<MembershipEntryMethod>>
  handle_contains?: InputMaybe<Scalars['String']>
  handle_endsWith?: InputMaybe<Scalars['String']>
  handle_eq?: InputMaybe<Scalars['String']>
  handle_in?: InputMaybe<Array<Scalars['String']>>
  handle_startsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  rootAccount_contains?: InputMaybe<Scalars['String']>
  rootAccount_endsWith?: InputMaybe<Scalars['String']>
  rootAccount_eq?: InputMaybe<Scalars['String']>
  rootAccount_in?: InputMaybe<Array<Scalars['String']>>
  rootAccount_startsWith?: InputMaybe<Scalars['String']>
  subscription_eq?: InputMaybe<Scalars['Int']>
  subscription_gt?: InputMaybe<Scalars['Int']>
  subscription_gte?: InputMaybe<Scalars['Int']>
  subscription_in?: InputMaybe<Array<Scalars['Int']>>
  subscription_lt?: InputMaybe<Scalars['Int']>
  subscription_lte?: InputMaybe<Scalars['Int']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type MembershipWhereUniqueInput = {
  handle?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
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
  categoryId?: InputMaybe<Scalars['ID']>
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

export type NodeLocationMetadata = BaseGraphQlObject & {
  __typename?: 'NodeLocationMetadata'
  /** City name */
  city?: Maybe<Scalars['String']>
  coordinates?: Maybe<GeoCoordinates>
  coordinatesId?: Maybe<Scalars['String']>
  /** ISO 3166-1 alpha-2 country code (2 letters) */
  countryCode?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  distributionbucketoperatormetadatanodeLocation?: Maybe<Array<DistributionBucketOperatorMetadata>>
  id: Scalars['ID']
  storagebucketoperatormetadatanodeLocation?: Maybe<Array<StorageBucketOperatorMetadata>>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type NodeLocationMetadataConnection = {
  __typename?: 'NodeLocationMetadataConnection'
  edges: Array<NodeLocationMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NodeLocationMetadataCreateInput = {
  city?: InputMaybe<Scalars['String']>
  coordinates?: InputMaybe<Scalars['ID']>
  countryCode?: InputMaybe<Scalars['String']>
}

export type NodeLocationMetadataEdge = {
  __typename?: 'NodeLocationMetadataEdge'
  cursor: Scalars['String']
  node: NodeLocationMetadata
}

export enum NodeLocationMetadataOrderByInput {
  CityAsc = 'city_ASC',
  CityDesc = 'city_DESC',
  CoordinatesAsc = 'coordinates_ASC',
  CoordinatesDesc = 'coordinates_DESC',
  CountryCodeAsc = 'countryCode_ASC',
  CountryCodeDesc = 'countryCode_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type NodeLocationMetadataUpdateInput = {
  city?: InputMaybe<Scalars['String']>
  coordinates?: InputMaybe<Scalars['ID']>
  countryCode?: InputMaybe<Scalars['String']>
}

export type NodeLocationMetadataWhereInput = {
  AND?: InputMaybe<Array<NodeLocationMetadataWhereInput>>
  OR?: InputMaybe<Array<NodeLocationMetadataWhereInput>>
  city_contains?: InputMaybe<Scalars['String']>
  city_endsWith?: InputMaybe<Scalars['String']>
  city_eq?: InputMaybe<Scalars['String']>
  city_in?: InputMaybe<Array<Scalars['String']>>
  city_startsWith?: InputMaybe<Scalars['String']>
  coordinates?: InputMaybe<GeoCoordinatesWhereInput>
  countryCode_contains?: InputMaybe<Scalars['String']>
  countryCode_endsWith?: InputMaybe<Scalars['String']>
  countryCode_eq?: InputMaybe<Scalars['String']>
  countryCode_in?: InputMaybe<Array<Scalars['String']>>
  countryCode_startsWith?: InputMaybe<Scalars['String']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionbucketoperatormetadatanodeLocation_every?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
  distributionbucketoperatormetadatanodeLocation_none?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
  distributionbucketoperatormetadatanodeLocation_some?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  storagebucketoperatormetadatanodeLocation_every?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
  storagebucketoperatormetadatanodeLocation_none?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
  storagebucketoperatormetadatanodeLocation_some?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type NodeLocationMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['String']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
}

export type ProcessorState = {
  __typename?: 'ProcessorState'
  chainHead: Scalars['Float']
  indexerHead: Scalars['Float']
  lastCompleteBlock: Scalars['Float']
  lastProcessedEvent: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  /** Get featured videos for all categories */
  allCategoriesFeaturedVideos: Array<CategoryFeaturedVideos>
  /** Get featured videos for a given video category */
  categoryFeaturedVideos: Array<FeaturedVideo>
  channelByUniqueInput?: Maybe<Channel>
  channelCategories: Array<ChannelCategory>
  channelCategoriesByName: Array<ChannelCategoriesByNameFtsOutput>
  channelCategoriesConnection: ChannelCategoryConnection
  channelCategoryByUniqueInput?: Maybe<ChannelCategory>
  channels: Array<Channel>
  channelsConnection: ChannelConnection
  curatorGroupByUniqueInput?: Maybe<CuratorGroup>
  curatorGroups: Array<CuratorGroup>
  curatorGroupsConnection: CuratorGroupConnection
  /** Get list of 15 most followed channels out of 100 newest channels in random order */
  discoverChannels: Array<Channel>
  distributionBucketByUniqueInput?: Maybe<DistributionBucket>
  distributionBucketFamilies: Array<DistributionBucketFamily>
  distributionBucketFamiliesConnection: DistributionBucketFamilyConnection
  distributionBucketFamilyByUniqueInput?: Maybe<DistributionBucketFamily>
  distributionBucketFamilyGeographicAreaByUniqueInput?: Maybe<DistributionBucketFamilyGeographicArea>
  distributionBucketFamilyGeographicAreas: Array<DistributionBucketFamilyGeographicArea>
  distributionBucketFamilyGeographicAreasConnection: DistributionBucketFamilyGeographicAreaConnection
  distributionBucketFamilyMetadata: Array<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataByUniqueInput?: Maybe<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataConnection: DistributionBucketFamilyMetadataConnection
  distributionBucketOperatorByUniqueInput?: Maybe<DistributionBucketOperator>
  distributionBucketOperatorMetadata: Array<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataByUniqueInput?: Maybe<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataConnection: DistributionBucketOperatorMetadataConnection
  distributionBucketOperators: Array<DistributionBucketOperator>
  distributionBucketOperatorsConnection: DistributionBucketOperatorConnection
  distributionBuckets: Array<DistributionBucket>
  distributionBucketsConnection: DistributionBucketConnection
  geoCoordinates: Array<GeoCoordinates>
  geoCoordinatesByUniqueInput?: Maybe<GeoCoordinates>
  geoCoordinatesConnection: GeoCoordinatesConnection
  languageByUniqueInput?: Maybe<Language>
  languages: Array<Language>
  languagesConnection: LanguageConnection
  licenseByUniqueInput?: Maybe<License>
  licenses: Array<License>
  licensesConnection: LicenseConnection
  membersByHandle: Array<MembersByHandleFtsOutput>
  membershipByUniqueInput?: Maybe<Membership>
  memberships: Array<Membership>
  membershipsConnection: MembershipConnection
  /** Get connection of most followed channels in a given period or of all time */
  mostFollowedChannelsConnection: ChannelConnection
  /** Get list of most viewed categories in a given time period */
  mostViewedCategories?: Maybe<Array<EntityViewsInfo>>
  /** Get list of most viewed categories of all time */
  mostViewedCategoriesAllTime?: Maybe<Array<EntityViewsInfo>>
  /** Get connection of most viewed channels in a given period or of all time */
  mostViewedChannelsConnection: ChannelConnection
  /** Get connection of most viewed videos in a given period or of all time */
  mostViewedVideosConnection: VideoConnection
  nodeLocationMetadata: Array<NodeLocationMetadata>
  nodeLocationMetadataByUniqueInput?: Maybe<NodeLocationMetadata>
  nodeLocationMetadataConnection: NodeLocationMetadataConnection
  /** Get list of 15 most watched channels in random order */
  popularChannels: Array<Channel>
  /** Get list of 15 most watched channels out of 100 newest channels in random order */
  promisingChannels: Array<Channel>
  search: Array<SearchFtsOutput>
  storageBagByUniqueInput?: Maybe<StorageBag>
  storageBags: Array<StorageBag>
  storageBagsConnection: StorageBagConnection
  storageBucketByUniqueInput?: Maybe<StorageBucket>
  storageBucketOperatorMetadata: Array<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataByUniqueInput?: Maybe<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataConnection: StorageBucketOperatorMetadataConnection
  storageBuckets: Array<StorageBucket>
  storageBucketsConnection: StorageBucketConnection
  storageDataObjectByUniqueInput?: Maybe<StorageDataObject>
  storageDataObjects: Array<StorageDataObject>
  storageDataObjectsConnection: StorageDataObjectConnection
  storageSystemParameters: Array<StorageSystemParameters>
  storageSystemParametersByUniqueInput?: Maybe<StorageSystemParameters>
  storageSystemParametersConnection: StorageSystemParametersConnection
  /** Get list of 10 most followed channels of all time */
  top10Channels: Array<Channel>
  /** Get list of 10 most watched videos in last month */
  top10VideosThisMonth: Array<Video>
  /** Get list of 10 most watched videos in last week */
  top10VideosThisWeek: Array<Video>
  videoByUniqueInput?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  videoCategoriesByName: Array<VideoCategoriesByNameFtsOutput>
  videoCategoriesConnection: VideoCategoryConnection
  videoCategoryByUniqueInput?: Maybe<VideoCategory>
  /** Get current video hero */
  videoHero: VideoHero
  videoMediaEncodingByUniqueInput?: Maybe<VideoMediaEncoding>
  videoMediaEncodings: Array<VideoMediaEncoding>
  videoMediaEncodingsConnection: VideoMediaEncodingConnection
  videoMediaMetadata: Array<VideoMediaMetadata>
  videoMediaMetadataByUniqueInput?: Maybe<VideoMediaMetadata>
  videoMediaMetadataConnection: VideoMediaMetadataConnection
  videos: Array<Video>
  videosConnection: VideoConnection
  workerByUniqueInput?: Maybe<Worker>
  workers: Array<Worker>
  workersConnection: WorkerConnection
}

export type QueryAllCategoriesFeaturedVideosArgs = {
  videosLimit: Scalars['Int']
}

export type QueryCategoryFeaturedVideosArgs = {
  categoryId: Scalars['ID']
}

export type QueryChannelByUniqueInputArgs = {
  where: ChannelWhereUniqueInput
}

export type QueryChannelCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelCategoryOrderByInput>>
  where?: InputMaybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoriesByNameArgs = {
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  text: Scalars['String']
  whereChannelCategory?: InputMaybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelCategoryOrderByInput>>
  where?: InputMaybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoryByUniqueInputArgs = {
  where: ChannelCategoryWhereUniqueInput
}

export type QueryChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryCuratorGroupByUniqueInputArgs = {
  where: CuratorGroupWhereUniqueInput
}

export type QueryCuratorGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorGroupOrderByInput>>
  where?: InputMaybe<CuratorGroupWhereInput>
}

export type QueryCuratorGroupsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorGroupOrderByInput>>
  where?: InputMaybe<CuratorGroupWhereInput>
}

export type QueryDiscoverChannelsArgs = {
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryDistributionBucketByUniqueInputArgs = {
  where: DistributionBucketWhereUniqueInput
}

export type QueryDistributionBucketFamiliesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamiliesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamilyByUniqueInputArgs = {
  where: DistributionBucketFamilyWhereUniqueInput
}

export type QueryDistributionBucketFamilyGeographicAreaByUniqueInputArgs = {
  where: DistributionBucketFamilyGeographicAreaWhereUniqueInput
}

export type QueryDistributionBucketFamilyGeographicAreasArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyGeographicAreaOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyGeographicAreaWhereInput>
}

export type QueryDistributionBucketFamilyGeographicAreasConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyGeographicAreaOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyGeographicAreaWhereInput>
}

export type QueryDistributionBucketFamilyMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketFamilyMetadataByUniqueInputArgs = {
  where: DistributionBucketFamilyMetadataWhereUniqueInput
}

export type QueryDistributionBucketFamilyMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketOperatorByUniqueInputArgs = {
  where: DistributionBucketOperatorWhereUniqueInput
}

export type QueryDistributionBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
}

export type QueryDistributionBucketOperatorMetadataByUniqueInputArgs = {
  where: DistributionBucketOperatorMetadataWhereUniqueInput
}

export type QueryDistributionBucketOperatorMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
}

export type QueryDistributionBucketOperatorsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorWhereInput>
}

export type QueryDistributionBucketOperatorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorWhereInput>
}

export type QueryDistributionBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOrderByInput>>
  where?: InputMaybe<DistributionBucketWhereInput>
}

export type QueryDistributionBucketsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOrderByInput>>
  where?: InputMaybe<DistributionBucketWhereInput>
}

export type QueryGeoCoordinatesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<GeoCoordinatesOrderByInput>>
  where?: InputMaybe<GeoCoordinatesWhereInput>
}

export type QueryGeoCoordinatesByUniqueInputArgs = {
  where: GeoCoordinatesWhereUniqueInput
}

export type QueryGeoCoordinatesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<GeoCoordinatesOrderByInput>>
  where?: InputMaybe<GeoCoordinatesWhereInput>
}

export type QueryLanguageByUniqueInputArgs = {
  where: LanguageWhereUniqueInput
}

export type QueryLanguagesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LanguageOrderByInput>>
  where?: InputMaybe<LanguageWhereInput>
}

export type QueryLanguagesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LanguageOrderByInput>>
  where?: InputMaybe<LanguageWhereInput>
}

export type QueryLicenseByUniqueInputArgs = {
  where: LicenseWhereUniqueInput
}

export type QueryLicensesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LicenseOrderByInput>>
  where?: InputMaybe<LicenseWhereInput>
}

export type QueryLicensesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LicenseOrderByInput>>
  where?: InputMaybe<LicenseWhereInput>
}

export type QueryMembersByHandleArgs = {
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  text: Scalars['String']
  whereMembership?: InputMaybe<MembershipWhereInput>
}

export type QueryMembershipByUniqueInputArgs = {
  where: MembershipWhereUniqueInput
}

export type QueryMembershipsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MembershipOrderByInput>>
  where?: InputMaybe<MembershipWhereInput>
}

export type QueryMembershipsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MembershipOrderByInput>>
  where?: InputMaybe<MembershipWhereInput>
}

export type QueryMostFollowedChannelsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  periodDays?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryMostViewedCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostViewedCategoriesAllTimeArgs = {
  limit: Scalars['Int']
}

export type QueryMostViewedChannelsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  periodDays?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryMostViewedVideosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  periodDays?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryNodeLocationMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NodeLocationMetadataOrderByInput>>
  where?: InputMaybe<NodeLocationMetadataWhereInput>
}

export type QueryNodeLocationMetadataByUniqueInputArgs = {
  where: NodeLocationMetadataWhereUniqueInput
}

export type QueryNodeLocationMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NodeLocationMetadataOrderByInput>>
  where?: InputMaybe<NodeLocationMetadataWhereInput>
}

export type QueryPopularChannelsArgs = {
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryPromisingChannelsArgs = {
  where?: InputMaybe<ChannelWhereInput>
}

export type QuerySearchArgs = {
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  text: Scalars['String']
  whereChannel?: InputMaybe<ChannelWhereInput>
  whereVideo?: InputMaybe<VideoWhereInput>
}

export type QueryStorageBagByUniqueInputArgs = {
  where: StorageBagWhereUniqueInput
}

export type QueryStorageBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBagOrderByInput>>
  where?: InputMaybe<StorageBagWhereInput>
}

export type QueryStorageBagsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBagOrderByInput>>
  where?: InputMaybe<StorageBagWhereInput>
}

export type QueryStorageBucketByUniqueInputArgs = {
  where: StorageBucketWhereUniqueInput
}

export type QueryStorageBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
}

export type QueryStorageBucketOperatorMetadataByUniqueInputArgs = {
  where: StorageBucketOperatorMetadataWhereUniqueInput
}

export type QueryStorageBucketOperatorMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
}

export type QueryStorageBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOrderByInput>>
  where?: InputMaybe<StorageBucketWhereInput>
}

export type QueryStorageBucketsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOrderByInput>>
  where?: InputMaybe<StorageBucketWhereInput>
}

export type QueryStorageDataObjectByUniqueInputArgs = {
  where: StorageDataObjectWhereUniqueInput
}

export type QueryStorageDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageDataObjectOrderByInput>>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type QueryStorageDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageDataObjectOrderByInput>>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type QueryStorageSystemParametersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageSystemParametersOrderByInput>>
  where?: InputMaybe<StorageSystemParametersWhereInput>
}

export type QueryStorageSystemParametersByUniqueInputArgs = {
  where: StorageSystemParametersWhereUniqueInput
}

export type QueryStorageSystemParametersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageSystemParametersOrderByInput>>
  where?: InputMaybe<StorageSystemParametersWhereInput>
}

export type QueryTop10ChannelsArgs = {
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryTop10VideosThisMonthArgs = {
  where?: InputMaybe<VideoWhereInput>
}

export type QueryTop10VideosThisWeekArgs = {
  where?: InputMaybe<VideoWhereInput>
}

export type QueryVideoByUniqueInputArgs = {
  where: VideoWhereUniqueInput
}

export type QueryVideoCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoCategoryOrderByInput>>
  where?: InputMaybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesByNameArgs = {
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  text: Scalars['String']
  whereVideoCategory?: InputMaybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoCategoryOrderByInput>>
  where?: InputMaybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoryByUniqueInputArgs = {
  where: VideoCategoryWhereUniqueInput
}

export type QueryVideoMediaEncodingByUniqueInputArgs = {
  where: VideoMediaEncodingWhereUniqueInput
}

export type QueryVideoMediaEncodingsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaEncodingOrderByInput>>
  where?: InputMaybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaEncodingsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaEncodingOrderByInput>>
  where?: InputMaybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaMetadataOrderByInput>>
  where?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoMediaMetadataByUniqueInputArgs = {
  where: VideoMediaMetadataWhereUniqueInput
}

export type QueryVideoMediaMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaMetadataOrderByInput>>
  where?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type QueryVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryWorkerByUniqueInputArgs = {
  where: WorkerWhereUniqueInput
}

export type QueryWorkersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<WorkerOrderByInput>>
  where?: InputMaybe<WorkerWhereInput>
}

export type QueryWorkersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<WorkerOrderByInput>>
  where?: InputMaybe<WorkerWhereInput>
}

export type SearchFtsOutput = {
  __typename?: 'SearchFTSOutput'
  highlight: Scalars['String']
  isTypeOf: Scalars['String']
  item: SearchSearchResult
  rank: Scalars['Float']
}

export type SearchSearchResult = Channel | Video

export type StandardDeleteResponse = {
  __typename?: 'StandardDeleteResponse'
  id: Scalars['ID']
}

export type StorageBag = BaseGraphQlObject & {
  __typename?: 'StorageBag'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  distributionBuckets: Array<DistributionBucket>
  id: Scalars['ID']
  objects: Array<StorageDataObject>
  /** Owner of the storage bag */
  owner: StorageBagOwner
  storageBuckets: Array<StorageBucket>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type StorageBagConnection = {
  __typename?: 'StorageBagConnection'
  edges: Array<StorageBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBagCreateInput = {
  owner: Scalars['JSONObject']
}

export type StorageBagEdge = {
  __typename?: 'StorageBagEdge'
  cursor: Scalars['String']
  node: StorageBag
}

export enum StorageBagOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type StorageBagOwner =
  | StorageBagOwnerChannel
  | StorageBagOwnerCouncil
  | StorageBagOwnerDao
  | StorageBagOwnerMember
  | StorageBagOwnerWorkingGroup

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

export type StorageBagUpdateInput = {
  owner?: InputMaybe<Scalars['JSONObject']>
}

export type StorageBagWhereInput = {
  AND?: InputMaybe<Array<StorageBagWhereInput>>
  OR?: InputMaybe<Array<StorageBagWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionBuckets_every?: InputMaybe<DistributionBucketWhereInput>
  distributionBuckets_none?: InputMaybe<DistributionBucketWhereInput>
  distributionBuckets_some?: InputMaybe<DistributionBucketWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  objects_every?: InputMaybe<StorageDataObjectWhereInput>
  objects_none?: InputMaybe<StorageDataObjectWhereInput>
  objects_some?: InputMaybe<StorageDataObjectWhereInput>
  owner_json?: InputMaybe<Scalars['JSONObject']>
  storageBuckets_every?: InputMaybe<StorageBucketWhereInput>
  storageBuckets_none?: InputMaybe<StorageBucketWhereInput>
  storageBuckets_some?: InputMaybe<StorageBucketWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type StorageBagWhereUniqueInput = {
  id: Scalars['ID']
}

export type StorageBucket = BaseGraphQlObject & {
  __typename?: 'StorageBucket'
  /** Whether the bucket is accepting any new storage bags */
  acceptingNewBags: Scalars['Boolean']
  bags: Array<StorageBag>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Bucket's data object count limit */
  dataObjectCountLimit: Scalars['BigInt']
  /** Number of assigned data objects */
  dataObjectsCount: Scalars['BigInt']
  /** Total size of assigned data objects */
  dataObjectsSize: Scalars['BigInt']
  /** Bucket's data object size limit in bytes */
  dataObjectsSizeLimit: Scalars['BigInt']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  operatorMetadata?: Maybe<StorageBucketOperatorMetadata>
  operatorMetadataId?: Maybe<Scalars['String']>
  /** Current bucket operator status */
  operatorStatus: StorageBucketOperatorStatus
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type StorageBucketConnection = {
  __typename?: 'StorageBucketConnection'
  edges: Array<StorageBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketCreateInput = {
  acceptingNewBags: Scalars['Boolean']
  dataObjectCountLimit: Scalars['String']
  dataObjectsCount: Scalars['String']
  dataObjectsSize: Scalars['String']
  dataObjectsSizeLimit: Scalars['String']
  operatorMetadata?: InputMaybe<Scalars['ID']>
  operatorStatus: Scalars['JSONObject']
}

export type StorageBucketEdge = {
  __typename?: 'StorageBucketEdge'
  cursor: Scalars['String']
  node: StorageBucket
}

export type StorageBucketOperatorMetadata = BaseGraphQlObject & {
  __typename?: 'StorageBucketOperatorMetadata'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** Additional information about the node/operator */
  extra?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Root node endpoint */
  nodeEndpoint?: Maybe<Scalars['String']>
  nodeLocation?: Maybe<NodeLocationMetadata>
  nodeLocationId?: Maybe<Scalars['String']>
  storagebucketoperatorMetadata?: Maybe<Array<StorageBucket>>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type StorageBucketOperatorMetadataConnection = {
  __typename?: 'StorageBucketOperatorMetadataConnection'
  edges: Array<StorageBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketOperatorMetadataCreateInput = {
  extra?: InputMaybe<Scalars['String']>
  nodeEndpoint?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<Scalars['ID']>
}

export type StorageBucketOperatorMetadataEdge = {
  __typename?: 'StorageBucketOperatorMetadataEdge'
  cursor: Scalars['String']
  node: StorageBucketOperatorMetadata
}

export enum StorageBucketOperatorMetadataOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationAsc = 'nodeLocation_ASC',
  NodeLocationDesc = 'nodeLocation_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type StorageBucketOperatorMetadataUpdateInput = {
  extra?: InputMaybe<Scalars['String']>
  nodeEndpoint?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<Scalars['ID']>
}

export type StorageBucketOperatorMetadataWhereInput = {
  AND?: InputMaybe<Array<StorageBucketOperatorMetadataWhereInput>>
  OR?: InputMaybe<Array<StorageBucketOperatorMetadataWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  extra_contains?: InputMaybe<Scalars['String']>
  extra_endsWith?: InputMaybe<Scalars['String']>
  extra_eq?: InputMaybe<Scalars['String']>
  extra_in?: InputMaybe<Array<Scalars['String']>>
  extra_startsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  nodeEndpoint_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_startsWith?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<NodeLocationMetadataWhereInput>
  storagebucketoperatorMetadata_every?: InputMaybe<StorageBucketWhereInput>
  storagebucketoperatorMetadata_none?: InputMaybe<StorageBucketWhereInput>
  storagebucketoperatorMetadata_some?: InputMaybe<StorageBucketWhereInput>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type StorageBucketOperatorMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export type StorageBucketOperatorStatus =
  | StorageBucketOperatorStatusActive
  | StorageBucketOperatorStatusInvited
  | StorageBucketOperatorStatusMissing

export type StorageBucketOperatorStatusActive = {
  __typename?: 'StorageBucketOperatorStatusActive'
  transactorAccountId: Scalars['String']
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

export enum StorageBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DataObjectCountLimitAsc = 'dataObjectCountLimit_ASC',
  DataObjectCountLimitDesc = 'dataObjectCountLimit_DESC',
  DataObjectsCountAsc = 'dataObjectsCount_ASC',
  DataObjectsCountDesc = 'dataObjectsCount_DESC',
  DataObjectsSizeLimitAsc = 'dataObjectsSizeLimit_ASC',
  DataObjectsSizeLimitDesc = 'dataObjectsSizeLimit_DESC',
  DataObjectsSizeAsc = 'dataObjectsSize_ASC',
  DataObjectsSizeDesc = 'dataObjectsSize_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  OperatorMetadataAsc = 'operatorMetadata_ASC',
  OperatorMetadataDesc = 'operatorMetadata_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type StorageBucketUpdateInput = {
  acceptingNewBags?: InputMaybe<Scalars['Boolean']>
  dataObjectCountLimit?: InputMaybe<Scalars['String']>
  dataObjectsCount?: InputMaybe<Scalars['String']>
  dataObjectsSize?: InputMaybe<Scalars['String']>
  dataObjectsSizeLimit?: InputMaybe<Scalars['String']>
  operatorMetadata?: InputMaybe<Scalars['ID']>
  operatorStatus?: InputMaybe<Scalars['JSONObject']>
}

export type StorageBucketWhereInput = {
  AND?: InputMaybe<Array<StorageBucketWhereInput>>
  OR?: InputMaybe<Array<StorageBucketWhereInput>>
  acceptingNewBags_eq?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_in?: InputMaybe<Array<Scalars['Boolean']>>
  bags_every?: InputMaybe<StorageBagWhereInput>
  bags_none?: InputMaybe<StorageBagWhereInput>
  bags_some?: InputMaybe<StorageBagWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  dataObjectCountLimit_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectCountLimit_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsCount_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSizeLimit_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSize_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_lte?: InputMaybe<Scalars['BigInt']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  operatorMetadata?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
  operatorStatus_json?: InputMaybe<Scalars['JSONObject']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type StorageBucketWhereUniqueInput = {
  id: Scalars['ID']
}

export type StorageDataObject = BaseGraphQlObject & {
  __typename?: 'StorageDataObject'
  channelavatarPhoto?: Maybe<Array<Channel>>
  channelcoverPhoto?: Maybe<Array<Channel>>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** Prize for removing the data object */
  deletionPrize: Scalars['BigInt']
  id: Scalars['ID']
  /** IPFS content hash */
  ipfsHash: Scalars['String']
  /** Whether the data object was uploaded and accepted by the storage provider */
  isAccepted: Scalars['Boolean']
  /** Data object size in bytes */
  size: Scalars['BigInt']
  storageBag: StorageBag
  storageBagId: Scalars['String']
  /** The type of the asset that the data object represents (if known) */
  type: DataObjectType
  /** If the object is no longer used as an asset - the time at which it was unset (if known) */
  unsetAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videomedia?: Maybe<Array<Video>>
  videothumbnailPhoto?: Maybe<Array<Video>>
}

export type StorageDataObjectConnection = {
  __typename?: 'StorageDataObjectConnection'
  edges: Array<StorageDataObjectEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageDataObjectCreateInput = {
  deletionPrize: Scalars['String']
  ipfsHash: Scalars['String']
  isAccepted: Scalars['Boolean']
  size: Scalars['String']
  storageBag: Scalars['ID']
  type: Scalars['JSONObject']
  unsetAt?: InputMaybe<Scalars['DateTime']>
}

export type StorageDataObjectEdge = {
  __typename?: 'StorageDataObjectEdge'
  cursor: Scalars['String']
  node: StorageDataObject
}

export enum StorageDataObjectOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DeletionPrizeAsc = 'deletionPrize_ASC',
  DeletionPrizeDesc = 'deletionPrize_DESC',
  IpfsHashAsc = 'ipfsHash_ASC',
  IpfsHashDesc = 'ipfsHash_DESC',
  IsAcceptedAsc = 'isAccepted_ASC',
  IsAcceptedDesc = 'isAccepted_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  StorageBagAsc = 'storageBag_ASC',
  StorageBagDesc = 'storageBag_DESC',
  UnsetAtAsc = 'unsetAt_ASC',
  UnsetAtDesc = 'unsetAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type StorageDataObjectUpdateInput = {
  deletionPrize?: InputMaybe<Scalars['String']>
  ipfsHash?: InputMaybe<Scalars['String']>
  isAccepted?: InputMaybe<Scalars['Boolean']>
  size?: InputMaybe<Scalars['String']>
  storageBag?: InputMaybe<Scalars['ID']>
  type?: InputMaybe<Scalars['JSONObject']>
  unsetAt?: InputMaybe<Scalars['DateTime']>
}

export type StorageDataObjectWhereInput = {
  AND?: InputMaybe<Array<StorageDataObjectWhereInput>>
  OR?: InputMaybe<Array<StorageDataObjectWhereInput>>
  channelavatarPhoto_every?: InputMaybe<ChannelWhereInput>
  channelavatarPhoto_none?: InputMaybe<ChannelWhereInput>
  channelavatarPhoto_some?: InputMaybe<ChannelWhereInput>
  channelcoverPhoto_every?: InputMaybe<ChannelWhereInput>
  channelcoverPhoto_none?: InputMaybe<ChannelWhereInput>
  channelcoverPhoto_some?: InputMaybe<ChannelWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  deletionPrize_eq?: InputMaybe<Scalars['BigInt']>
  deletionPrize_gt?: InputMaybe<Scalars['BigInt']>
  deletionPrize_gte?: InputMaybe<Scalars['BigInt']>
  deletionPrize_in?: InputMaybe<Array<Scalars['BigInt']>>
  deletionPrize_lt?: InputMaybe<Scalars['BigInt']>
  deletionPrize_lte?: InputMaybe<Scalars['BigInt']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  ipfsHash_contains?: InputMaybe<Scalars['String']>
  ipfsHash_endsWith?: InputMaybe<Scalars['String']>
  ipfsHash_eq?: InputMaybe<Scalars['String']>
  ipfsHash_in?: InputMaybe<Array<Scalars['String']>>
  ipfsHash_startsWith?: InputMaybe<Scalars['String']>
  isAccepted_eq?: InputMaybe<Scalars['Boolean']>
  isAccepted_in?: InputMaybe<Array<Scalars['Boolean']>>
  size_eq?: InputMaybe<Scalars['BigInt']>
  size_gt?: InputMaybe<Scalars['BigInt']>
  size_gte?: InputMaybe<Scalars['BigInt']>
  size_in?: InputMaybe<Array<Scalars['BigInt']>>
  size_lt?: InputMaybe<Scalars['BigInt']>
  size_lte?: InputMaybe<Scalars['BigInt']>
  storageBag?: InputMaybe<StorageBagWhereInput>
  type_json?: InputMaybe<Scalars['JSONObject']>
  unsetAt_eq?: InputMaybe<Scalars['DateTime']>
  unsetAt_gt?: InputMaybe<Scalars['DateTime']>
  unsetAt_gte?: InputMaybe<Scalars['DateTime']>
  unsetAt_lt?: InputMaybe<Scalars['DateTime']>
  unsetAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videomedia_every?: InputMaybe<VideoWhereInput>
  videomedia_none?: InputMaybe<VideoWhereInput>
  videomedia_some?: InputMaybe<VideoWhereInput>
  videothumbnailPhoto_every?: InputMaybe<VideoWhereInput>
  videothumbnailPhoto_none?: InputMaybe<VideoWhereInput>
  videothumbnailPhoto_some?: InputMaybe<VideoWhereInput>
}

export type StorageDataObjectWhereUniqueInput = {
  id: Scalars['ID']
}

/** Global storage system parameters */
export type StorageSystemParameters = BaseGraphQlObject & {
  __typename?: 'StorageSystemParameters'
  /** Blacklisted content hashes */
  blacklist: Array<Scalars['String']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Additional fee for storing 1 MB of data */
  dataObjectFeePerMb: Scalars['BigInt']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** How many buckets can be assigned to distribute a bag */
  distributionBucketsPerBagLimit: Scalars['Int']
  id: Scalars['ID']
  /** ID of the next data object when created */
  nextDataObjectId: Scalars['BigInt']
  /** Global max. number of objects a storage bucket can store (can also be further limitted the provider) */
  storageBucketMaxObjectsCountLimit: Scalars['BigInt']
  /** Global max. size of objects a storage bucket can store (can also be further limitted the provider) */
  storageBucketMaxObjectsSizeLimit: Scalars['BigInt']
  /** How many buckets can be assigned to store a bag */
  storageBucketsPerBagLimit: Scalars['Int']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  /** Whether the uploading is globally blocked */
  uploadingBlocked: Scalars['Boolean']
  version: Scalars['Int']
}

export type StorageSystemParametersConnection = {
  __typename?: 'StorageSystemParametersConnection'
  edges: Array<StorageSystemParametersEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageSystemParametersCreateInput = {
  blacklist: Array<Scalars['String']>
  dataObjectFeePerMb: Scalars['String']
  distributionBucketsPerBagLimit: Scalars['Float']
  nextDataObjectId: Scalars['String']
  storageBucketMaxObjectsCountLimit: Scalars['String']
  storageBucketMaxObjectsSizeLimit: Scalars['String']
  storageBucketsPerBagLimit: Scalars['Float']
  uploadingBlocked: Scalars['Boolean']
}

export type StorageSystemParametersEdge = {
  __typename?: 'StorageSystemParametersEdge'
  cursor: Scalars['String']
  node: StorageSystemParameters
}

export enum StorageSystemParametersOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DataObjectFeePerMbAsc = 'dataObjectFeePerMb_ASC',
  DataObjectFeePerMbDesc = 'dataObjectFeePerMb_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DistributionBucketsPerBagLimitAsc = 'distributionBucketsPerBagLimit_ASC',
  DistributionBucketsPerBagLimitDesc = 'distributionBucketsPerBagLimit_DESC',
  NextDataObjectIdAsc = 'nextDataObjectId_ASC',
  NextDataObjectIdDesc = 'nextDataObjectId_DESC',
  StorageBucketMaxObjectsCountLimitAsc = 'storageBucketMaxObjectsCountLimit_ASC',
  StorageBucketMaxObjectsCountLimitDesc = 'storageBucketMaxObjectsCountLimit_DESC',
  StorageBucketMaxObjectsSizeLimitAsc = 'storageBucketMaxObjectsSizeLimit_ASC',
  StorageBucketMaxObjectsSizeLimitDesc = 'storageBucketMaxObjectsSizeLimit_DESC',
  StorageBucketsPerBagLimitAsc = 'storageBucketsPerBagLimit_ASC',
  StorageBucketsPerBagLimitDesc = 'storageBucketsPerBagLimit_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  UploadingBlockedAsc = 'uploadingBlocked_ASC',
  UploadingBlockedDesc = 'uploadingBlocked_DESC',
}

export type StorageSystemParametersUpdateInput = {
  blacklist?: InputMaybe<Array<Scalars['String']>>
  dataObjectFeePerMb?: InputMaybe<Scalars['String']>
  distributionBucketsPerBagLimit?: InputMaybe<Scalars['Float']>
  nextDataObjectId?: InputMaybe<Scalars['String']>
  storageBucketMaxObjectsCountLimit?: InputMaybe<Scalars['String']>
  storageBucketMaxObjectsSizeLimit?: InputMaybe<Scalars['String']>
  storageBucketsPerBagLimit?: InputMaybe<Scalars['Float']>
  uploadingBlocked?: InputMaybe<Scalars['Boolean']>
}

export type StorageSystemParametersWhereInput = {
  AND?: InputMaybe<Array<StorageSystemParametersWhereInput>>
  OR?: InputMaybe<Array<StorageSystemParametersWhereInput>>
  blacklist_containsAll?: InputMaybe<Array<Scalars['String']>>
  blacklist_containsAny?: InputMaybe<Array<Scalars['String']>>
  blacklist_containsNone?: InputMaybe<Array<Scalars['String']>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  dataObjectFeePerMb_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectFeePerMb_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectFeePerMb_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectFeePerMb_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectFeePerMb_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectFeePerMb_lte?: InputMaybe<Scalars['BigInt']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  distributionBucketsPerBagLimit_eq?: InputMaybe<Scalars['Int']>
  distributionBucketsPerBagLimit_gt?: InputMaybe<Scalars['Int']>
  distributionBucketsPerBagLimit_gte?: InputMaybe<Scalars['Int']>
  distributionBucketsPerBagLimit_in?: InputMaybe<Array<Scalars['Int']>>
  distributionBucketsPerBagLimit_lt?: InputMaybe<Scalars['Int']>
  distributionBucketsPerBagLimit_lte?: InputMaybe<Scalars['Int']>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  nextDataObjectId_eq?: InputMaybe<Scalars['BigInt']>
  nextDataObjectId_gt?: InputMaybe<Scalars['BigInt']>
  nextDataObjectId_gte?: InputMaybe<Scalars['BigInt']>
  nextDataObjectId_in?: InputMaybe<Array<Scalars['BigInt']>>
  nextDataObjectId_lt?: InputMaybe<Scalars['BigInt']>
  nextDataObjectId_lte?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsCountLimit_eq?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsCountLimit_gt?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsCountLimit_gte?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsCountLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  storageBucketMaxObjectsCountLimit_lt?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsCountLimit_lte?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsSizeLimit_eq?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsSizeLimit_gt?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsSizeLimit_gte?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsSizeLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  storageBucketMaxObjectsSizeLimit_lt?: InputMaybe<Scalars['BigInt']>
  storageBucketMaxObjectsSizeLimit_lte?: InputMaybe<Scalars['BigInt']>
  storageBucketsPerBagLimit_eq?: InputMaybe<Scalars['Int']>
  storageBucketsPerBagLimit_gt?: InputMaybe<Scalars['Int']>
  storageBucketsPerBagLimit_gte?: InputMaybe<Scalars['Int']>
  storageBucketsPerBagLimit_in?: InputMaybe<Array<Scalars['Int']>>
  storageBucketsPerBagLimit_lt?: InputMaybe<Scalars['Int']>
  storageBucketsPerBagLimit_lte?: InputMaybe<Scalars['Int']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  uploadingBlocked_eq?: InputMaybe<Scalars['Boolean']>
  uploadingBlocked_in?: InputMaybe<Array<Scalars['Boolean']>>
}

export type StorageSystemParametersWhereUniqueInput = {
  id: Scalars['ID']
}

export type Subscription = {
  __typename?: 'Subscription'
  stateSubscription: ProcessorState
}

export type Video = BaseGraphQlObject & {
  __typename?: 'Video'
  category?: Maybe<VideoCategory>
  categoryId?: Maybe<Scalars['String']>
  channel: Channel
  channelId: Scalars['String']
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  /** The description of the Video */
  description?: Maybe<Scalars['String']>
  /** Video duration in seconds */
  duration?: Maybe<Scalars['Int']>
  /** Whether or not Video contains marketing */
  hasMarketing?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  /** Flag signaling whether a video is censored. */
  isCensored: Scalars['Boolean']
  /** Whether the Video contains explicit material. */
  isExplicit?: Maybe<Scalars['Boolean']>
  /** Is video featured or not */
  isFeatured: Scalars['Boolean']
  /** Whether the Video is supposed to be publically displayed */
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Language>
  languageId?: Maybe<Scalars['String']>
  license?: Maybe<License>
  licenseId?: Maybe<Scalars['String']>
  media?: Maybe<StorageDataObject>
  mediaId?: Maybe<Scalars['String']>
  mediaMetadata?: Maybe<VideoMediaMetadata>
  mediaMetadataId?: Maybe<Scalars['String']>
  /** If the Video was published on other platform before beeing published on Joystream - the original publication date */
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  thumbnailPhoto?: Maybe<StorageDataObject>
  thumbnailPhotoId?: Maybe<Scalars['String']>
  /** The title of the video */
  title?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  views: Scalars['Int']
}

export type VideoCategoriesByNameFtsOutput = {
  __typename?: 'VideoCategoriesByNameFTSOutput'
  highlight: Scalars['String']
  isTypeOf: Scalars['String']
  item: VideoCategoriesByNameSearchResult
  rank: Scalars['Float']
}

export type VideoCategoriesByNameSearchResult = VideoCategory

export type VideoCategory = BaseGraphQlObject & {
  __typename?: 'VideoCategory'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** The name of the category */
  name?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videos: Array<Video>
}

export type VideoCategoryConnection = {
  __typename?: 'VideoCategoryConnection'
  edges: Array<VideoCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoCategoryCreateInput = {
  createdInBlock: Scalars['Float']
  name?: InputMaybe<Scalars['String']>
}

export type VideoCategoryEdge = {
  __typename?: 'VideoCategoryEdge'
  cursor: Scalars['String']
  node: VideoCategory
}

export enum VideoCategoryOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type VideoCategoryUpdateInput = {
  createdInBlock?: InputMaybe<Scalars['Float']>
  name?: InputMaybe<Scalars['String']>
}

export type VideoCategoryWhereInput = {
  AND?: InputMaybe<Array<VideoCategoryWhereInput>>
  OR?: InputMaybe<Array<VideoCategoryWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  name_contains?: InputMaybe<Scalars['String']>
  name_endsWith?: InputMaybe<Scalars['String']>
  name_eq?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videos_every?: InputMaybe<VideoWhereInput>
  videos_none?: InputMaybe<VideoWhereInput>
  videos_some?: InputMaybe<VideoWhereInput>
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

export type VideoCreateInput = {
  category?: InputMaybe<Scalars['ID']>
  channel: Scalars['ID']
  createdInBlock: Scalars['Float']
  description?: InputMaybe<Scalars['String']>
  duration?: InputMaybe<Scalars['Float']>
  hasMarketing?: InputMaybe<Scalars['Boolean']>
  isCensored: Scalars['Boolean']
  isExplicit?: InputMaybe<Scalars['Boolean']>
  isFeatured: Scalars['Boolean']
  isPublic?: InputMaybe<Scalars['Boolean']>
  language?: InputMaybe<Scalars['ID']>
  license?: InputMaybe<Scalars['ID']>
  media?: InputMaybe<Scalars['ID']>
  mediaMetadata?: InputMaybe<Scalars['ID']>
  publishedBeforeJoystream?: InputMaybe<Scalars['DateTime']>
  thumbnailPhoto?: InputMaybe<Scalars['ID']>
  title?: InputMaybe<Scalars['String']>
}

export type VideoEdge = {
  __typename?: 'VideoEdge'
  cursor: Scalars['String']
  node: Video
}

export type VideoHero = {
  __typename?: 'VideoHero'
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  heroVideoCutUrl: Scalars['String']
  video: Video
  videoId: Scalars['ID']
}

export type VideoHeroInput = {
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  heroVideoCutUrl: Scalars['String']
  videoId: Scalars['ID']
}

export type VideoMediaEncoding = BaseGraphQlObject & {
  __typename?: 'VideoMediaEncoding'
  /** Encoding of the video media object */
  codecName?: Maybe<Scalars['String']>
  /** Media container format */
  container?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Content MIME type */
  mimeMediaType?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videomediametadataencoding?: Maybe<Array<VideoMediaMetadata>>
}

export type VideoMediaEncodingConnection = {
  __typename?: 'VideoMediaEncodingConnection'
  edges: Array<VideoMediaEncodingEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaEncodingCreateInput = {
  codecName?: InputMaybe<Scalars['String']>
  container?: InputMaybe<Scalars['String']>
  mimeMediaType?: InputMaybe<Scalars['String']>
}

export type VideoMediaEncodingEdge = {
  __typename?: 'VideoMediaEncodingEdge'
  cursor: Scalars['String']
  node: VideoMediaEncoding
}

export enum VideoMediaEncodingOrderByInput {
  CodecNameAsc = 'codecName_ASC',
  CodecNameDesc = 'codecName_DESC',
  ContainerAsc = 'container_ASC',
  ContainerDesc = 'container_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  MimeMediaTypeAsc = 'mimeMediaType_ASC',
  MimeMediaTypeDesc = 'mimeMediaType_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type VideoMediaEncodingUpdateInput = {
  codecName?: InputMaybe<Scalars['String']>
  container?: InputMaybe<Scalars['String']>
  mimeMediaType?: InputMaybe<Scalars['String']>
}

export type VideoMediaEncodingWhereInput = {
  AND?: InputMaybe<Array<VideoMediaEncodingWhereInput>>
  OR?: InputMaybe<Array<VideoMediaEncodingWhereInput>>
  codecName_contains?: InputMaybe<Scalars['String']>
  codecName_endsWith?: InputMaybe<Scalars['String']>
  codecName_eq?: InputMaybe<Scalars['String']>
  codecName_in?: InputMaybe<Array<Scalars['String']>>
  codecName_startsWith?: InputMaybe<Scalars['String']>
  container_contains?: InputMaybe<Scalars['String']>
  container_endsWith?: InputMaybe<Scalars['String']>
  container_eq?: InputMaybe<Scalars['String']>
  container_in?: InputMaybe<Array<Scalars['String']>>
  container_startsWith?: InputMaybe<Scalars['String']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  mimeMediaType_contains?: InputMaybe<Scalars['String']>
  mimeMediaType_endsWith?: InputMaybe<Scalars['String']>
  mimeMediaType_eq?: InputMaybe<Scalars['String']>
  mimeMediaType_in?: InputMaybe<Array<Scalars['String']>>
  mimeMediaType_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  videomediametadataencoding_every?: InputMaybe<VideoMediaMetadataWhereInput>
  videomediametadataencoding_none?: InputMaybe<VideoMediaMetadataWhereInput>
  videomediametadataencoding_some?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type VideoMediaEncodingWhereUniqueInput = {
  id: Scalars['ID']
}

export type VideoMediaMetadata = BaseGraphQlObject & {
  __typename?: 'VideoMediaMetadata'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  encoding?: Maybe<VideoMediaEncoding>
  encodingId?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Video media height in pixels */
  pixelHeight?: Maybe<Scalars['Int']>
  /** Video media width in pixels */
  pixelWidth?: Maybe<Scalars['Int']>
  /** Video media size in bytes */
  size?: Maybe<Scalars['BigInt']>
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  video?: Maybe<Video>
}

export type VideoMediaMetadataConnection = {
  __typename?: 'VideoMediaMetadataConnection'
  edges: Array<VideoMediaMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaMetadataCreateInput = {
  createdInBlock: Scalars['Float']
  encoding?: InputMaybe<Scalars['ID']>
  pixelHeight?: InputMaybe<Scalars['Float']>
  pixelWidth?: InputMaybe<Scalars['Float']>
  size?: InputMaybe<Scalars['String']>
}

export type VideoMediaMetadataEdge = {
  __typename?: 'VideoMediaMetadataEdge'
  cursor: Scalars['String']
  node: VideoMediaMetadata
}

export enum VideoMediaMetadataOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  EncodingAsc = 'encoding_ASC',
  EncodingDesc = 'encoding_DESC',
  PixelHeightAsc = 'pixelHeight_ASC',
  PixelHeightDesc = 'pixelHeight_DESC',
  PixelWidthAsc = 'pixelWidth_ASC',
  PixelWidthDesc = 'pixelWidth_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type VideoMediaMetadataUpdateInput = {
  createdInBlock?: InputMaybe<Scalars['Float']>
  encoding?: InputMaybe<Scalars['ID']>
  pixelHeight?: InputMaybe<Scalars['Float']>
  pixelWidth?: InputMaybe<Scalars['Float']>
  size?: InputMaybe<Scalars['String']>
}

export type VideoMediaMetadataWhereInput = {
  AND?: InputMaybe<Array<VideoMediaMetadataWhereInput>>
  OR?: InputMaybe<Array<VideoMediaMetadataWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  encoding?: InputMaybe<VideoMediaEncodingWhereInput>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  pixelHeight_eq?: InputMaybe<Scalars['Int']>
  pixelHeight_gt?: InputMaybe<Scalars['Int']>
  pixelHeight_gte?: InputMaybe<Scalars['Int']>
  pixelHeight_in?: InputMaybe<Array<Scalars['Int']>>
  pixelHeight_lt?: InputMaybe<Scalars['Int']>
  pixelHeight_lte?: InputMaybe<Scalars['Int']>
  pixelWidth_eq?: InputMaybe<Scalars['Int']>
  pixelWidth_gt?: InputMaybe<Scalars['Int']>
  pixelWidth_gte?: InputMaybe<Scalars['Int']>
  pixelWidth_in?: InputMaybe<Array<Scalars['Int']>>
  pixelWidth_lt?: InputMaybe<Scalars['Int']>
  pixelWidth_lte?: InputMaybe<Scalars['Int']>
  size_eq?: InputMaybe<Scalars['BigInt']>
  size_gt?: InputMaybe<Scalars['BigInt']>
  size_gte?: InputMaybe<Scalars['BigInt']>
  size_in?: InputMaybe<Array<Scalars['BigInt']>>
  size_lt?: InputMaybe<Scalars['BigInt']>
  size_lte?: InputMaybe<Scalars['BigInt']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  video?: InputMaybe<VideoWhereInput>
}

export type VideoMediaMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export enum VideoOrderByInput {
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  ChannelAsc = 'channel_ASC',
  ChannelDesc = 'channel_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  DurationAsc = 'duration_ASC',
  DurationDesc = 'duration_DESC',
  HasMarketingAsc = 'hasMarketing_ASC',
  HasMarketingDesc = 'hasMarketing_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsExplicitAsc = 'isExplicit_ASC',
  IsExplicitDesc = 'isExplicit_DESC',
  IsFeaturedAsc = 'isFeatured_ASC',
  IsFeaturedDesc = 'isFeatured_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  LicenseAsc = 'license_ASC',
  LicenseDesc = 'license_DESC',
  MediaMetadataAsc = 'mediaMetadata_ASC',
  MediaMetadataDesc = 'mediaMetadata_DESC',
  MediaAsc = 'media_ASC',
  MediaDesc = 'media_DESC',
  PublishedBeforeJoystreamAsc = 'publishedBeforeJoystream_ASC',
  PublishedBeforeJoystreamDesc = 'publishedBeforeJoystream_DESC',
  ThumbnailPhotoAsc = 'thumbnailPhoto_ASC',
  ThumbnailPhotoDesc = 'thumbnailPhoto_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type VideoUpdateInput = {
  category?: InputMaybe<Scalars['ID']>
  channel?: InputMaybe<Scalars['ID']>
  createdInBlock?: InputMaybe<Scalars['Float']>
  description?: InputMaybe<Scalars['String']>
  duration?: InputMaybe<Scalars['Float']>
  hasMarketing?: InputMaybe<Scalars['Boolean']>
  isCensored?: InputMaybe<Scalars['Boolean']>
  isExplicit?: InputMaybe<Scalars['Boolean']>
  isFeatured?: InputMaybe<Scalars['Boolean']>
  isPublic?: InputMaybe<Scalars['Boolean']>
  language?: InputMaybe<Scalars['ID']>
  license?: InputMaybe<Scalars['ID']>
  media?: InputMaybe<Scalars['ID']>
  mediaMetadata?: InputMaybe<Scalars['ID']>
  publishedBeforeJoystream?: InputMaybe<Scalars['DateTime']>
  thumbnailPhoto?: InputMaybe<Scalars['ID']>
  title?: InputMaybe<Scalars['String']>
}

export type VideoWhereInput = {
  AND?: InputMaybe<Array<VideoWhereInput>>
  OR?: InputMaybe<Array<VideoWhereInput>>
  category?: InputMaybe<VideoCategoryWhereInput>
  channel?: InputMaybe<ChannelWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_startsWith?: InputMaybe<Scalars['String']>
  duration_eq?: InputMaybe<Scalars['Int']>
  duration_gt?: InputMaybe<Scalars['Int']>
  duration_gte?: InputMaybe<Scalars['Int']>
  duration_in?: InputMaybe<Array<Scalars['Int']>>
  duration_lt?: InputMaybe<Scalars['Int']>
  duration_lte?: InputMaybe<Scalars['Int']>
  hasMarketing_eq?: InputMaybe<Scalars['Boolean']>
  hasMarketing_in?: InputMaybe<Array<Scalars['Boolean']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  isCensored_eq?: InputMaybe<Scalars['Boolean']>
  isCensored_in?: InputMaybe<Array<Scalars['Boolean']>>
  isExplicit_eq?: InputMaybe<Scalars['Boolean']>
  isExplicit_in?: InputMaybe<Array<Scalars['Boolean']>>
  isFeatured_eq?: InputMaybe<Scalars['Boolean']>
  isFeatured_in?: InputMaybe<Array<Scalars['Boolean']>>
  isPublic_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_in?: InputMaybe<Array<Scalars['Boolean']>>
  language?: InputMaybe<LanguageWhereInput>
  license?: InputMaybe<LicenseWhereInput>
  media?: InputMaybe<StorageDataObjectWhereInput>
  mediaMetadata?: InputMaybe<VideoMediaMetadataWhereInput>
  publishedBeforeJoystream_eq?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_gt?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_gte?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_lt?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_lte?: InputMaybe<Scalars['DateTime']>
  thumbnailPhoto?: InputMaybe<StorageDataObjectWhereInput>
  title_contains?: InputMaybe<Scalars['String']>
  title_endsWith?: InputMaybe<Scalars['String']>
  title_eq?: InputMaybe<Scalars['String']>
  title_in?: InputMaybe<Array<Scalars['String']>>
  title_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
}

export type VideoWhereUniqueInput = {
  id: Scalars['ID']
}

export type Worker = BaseGraphQlObject & {
  __typename?: 'Worker'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Sign of worker still being active */
  isActive: Scalars['Boolean']
  /** Custom metadata set by provider */
  metadata?: Maybe<Scalars['String']>
  /** Associated working group */
  type: WorkerType
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  /** Runtime identifier */
  workerId: Scalars['String']
}

export type WorkerConnection = {
  __typename?: 'WorkerConnection'
  edges: Array<WorkerEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type WorkerCreateInput = {
  isActive: Scalars['Boolean']
  metadata?: InputMaybe<Scalars['String']>
  type: WorkerType
  workerId: Scalars['String']
}

export type WorkerEdge = {
  __typename?: 'WorkerEdge'
  cursor: Scalars['String']
  node: Worker
}

export enum WorkerOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  MetadataAsc = 'metadata_ASC',
  MetadataDesc = 'metadata_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  WorkerIdAsc = 'workerId_ASC',
  WorkerIdDesc = 'workerId_DESC',
}

export enum WorkerType {
  Gateway = 'GATEWAY',
  Storage = 'STORAGE',
}

export type WorkerUpdateInput = {
  isActive?: InputMaybe<Scalars['Boolean']>
  metadata?: InputMaybe<Scalars['String']>
  type?: InputMaybe<WorkerType>
  workerId?: InputMaybe<Scalars['String']>
}

export type WorkerWhereInput = {
  AND?: InputMaybe<Array<WorkerWhereInput>>
  OR?: InputMaybe<Array<WorkerWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdById_eq?: InputMaybe<Scalars['ID']>
  createdById_in?: InputMaybe<Array<Scalars['ID']>>
  deletedAt_all?: InputMaybe<Scalars['Boolean']>
  deletedAt_eq?: InputMaybe<Scalars['DateTime']>
  deletedAt_gt?: InputMaybe<Scalars['DateTime']>
  deletedAt_gte?: InputMaybe<Scalars['DateTime']>
  deletedAt_lt?: InputMaybe<Scalars['DateTime']>
  deletedAt_lte?: InputMaybe<Scalars['DateTime']>
  deletedById_eq?: InputMaybe<Scalars['ID']>
  deletedById_in?: InputMaybe<Array<Scalars['ID']>>
  id_eq?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  isActive_eq?: InputMaybe<Scalars['Boolean']>
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>
  metadata_contains?: InputMaybe<Scalars['String']>
  metadata_endsWith?: InputMaybe<Scalars['String']>
  metadata_eq?: InputMaybe<Scalars['String']>
  metadata_in?: InputMaybe<Array<Scalars['String']>>
  metadata_startsWith?: InputMaybe<Scalars['String']>
  type_eq?: InputMaybe<WorkerType>
  type_in?: InputMaybe<Array<WorkerType>>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedById_eq?: InputMaybe<Scalars['ID']>
  updatedById_in?: InputMaybe<Array<Scalars['ID']>>
  workerId_contains?: InputMaybe<Scalars['String']>
  workerId_endsWith?: InputMaybe<Scalars['String']>
  workerId_eq?: InputMaybe<Scalars['String']>
  workerId_in?: InputMaybe<Array<Scalars['String']>>
  workerId_startsWith?: InputMaybe<Scalars['String']>
}

export type WorkerWhereUniqueInput = {
  id: Scalars['ID']
}
