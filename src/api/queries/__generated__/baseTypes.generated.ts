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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: Date
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
}

export enum AssetAvailability {
  Accepted = 'ACCEPTED',
  Invalid = 'INVALID',
  Pending = 'PENDING',
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
  createdAt_eq?: Maybe<Scalars['String']>
  createdAt_gt?: Maybe<Scalars['String']>
  createdAt_gte?: Maybe<Scalars['String']>
  createdAt_lt?: Maybe<Scalars['String']>
  createdAt_lte?: Maybe<Scalars['String']>
  createdById_eq?: Maybe<Scalars['String']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['String']>
  deletedAt_gt?: Maybe<Scalars['String']>
  deletedAt_gte?: Maybe<Scalars['String']>
  deletedAt_lt?: Maybe<Scalars['String']>
  deletedAt_lte?: Maybe<Scalars['String']>
  deletedById_eq?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['String']>
  id_in?: Maybe<Array<Scalars['String']>>
  updatedAt_eq?: Maybe<Scalars['String']>
  updatedAt_gt?: Maybe<Scalars['String']>
  updatedAt_gte?: Maybe<Scalars['String']>
  updatedAt_lt?: Maybe<Scalars['String']>
  updatedAt_lte?: Maybe<Scalars['String']>
  updatedById_eq?: Maybe<Scalars['String']>
}

export type CategoryFeaturedVideos = {
  __typename?: 'CategoryFeaturedVideos'
  category: VideoCategory
  categoryId: Scalars['ID']
  videos: Array<FeaturedVideo>
}

export type Channel = BaseGraphQlObject & {
  __typename?: 'Channel'
  /** Availability meta information */
  avatarPhotoAvailability: AssetAvailability
  avatarPhotoDataObject?: Maybe<DataObject>
  avatarPhotoDataObjectId?: Maybe<Scalars['String']>
  /** URLs where the asset content can be accessed (if any) */
  avatarPhotoUrls: Array<Scalars['String']>
  category?: Maybe<ChannelCategory>
  categoryId?: Maybe<Scalars['String']>
  /** Availability meta information */
  coverPhotoAvailability: AssetAvailability
  coverPhotoDataObject?: Maybe<DataObject>
  coverPhotoDataObjectId?: Maybe<Scalars['String']>
  /** URLs where the asset content can be accessed (if any) */
  coverPhotoUrls: Array<Scalars['String']>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
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
  name?: Maybe<Scalars['String']>
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
  createdInBlock?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type ChannelCategoryWhereInput = {
  AND?: Maybe<Array<ChannelCategoryWhereInput>>
  OR?: Maybe<Array<ChannelCategoryWhereInput>>
  channels_every?: Maybe<ChannelWhereInput>
  channels_none?: Maybe<ChannelWhereInput>
  channels_some?: Maybe<ChannelWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  name_contains?: Maybe<Scalars['String']>
  name_endsWith?: Maybe<Scalars['String']>
  name_eq?: Maybe<Scalars['String']>
  name_in?: Maybe<Array<Scalars['String']>>
  name_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
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
  avatarPhotoAvailability: AssetAvailability
  avatarPhotoDataObject?: Maybe<Scalars['ID']>
  avatarPhotoDataObjectId?: Maybe<Scalars['ID']>
  avatarPhotoUrls: Array<Scalars['String']>
  category?: Maybe<Scalars['ID']>
  categoryId?: Maybe<Scalars['ID']>
  coverPhotoAvailability: AssetAvailability
  coverPhotoDataObject?: Maybe<Scalars['ID']>
  coverPhotoDataObjectId?: Maybe<Scalars['ID']>
  coverPhotoUrls: Array<Scalars['String']>
  createdInBlock: Scalars['Float']
  description?: Maybe<Scalars['String']>
  isCensored: Scalars['Boolean']
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Scalars['ID']>
  languageId?: Maybe<Scalars['ID']>
  ownerCuratorGroup?: Maybe<Scalars['ID']>
  ownerCuratorGroupId?: Maybe<Scalars['ID']>
  ownerMember?: Maybe<Scalars['ID']>
  ownerMemberId?: Maybe<Scalars['ID']>
  rewardAccount?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
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
  AvatarPhotoAvailabilityAsc = 'avatarPhotoAvailability_ASC',
  AvatarPhotoAvailabilityDesc = 'avatarPhotoAvailability_DESC',
  AvatarPhotoDataObjectIdAsc = 'avatarPhotoDataObjectId_ASC',
  AvatarPhotoDataObjectIdDesc = 'avatarPhotoDataObjectId_DESC',
  AvatarPhotoDataObjectAsc = 'avatarPhotoDataObject_ASC',
  AvatarPhotoDataObjectDesc = 'avatarPhotoDataObject_DESC',
  CategoryIdAsc = 'categoryId_ASC',
  CategoryIdDesc = 'categoryId_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  CoverPhotoAvailabilityAsc = 'coverPhotoAvailability_ASC',
  CoverPhotoAvailabilityDesc = 'coverPhotoAvailability_DESC',
  CoverPhotoDataObjectIdAsc = 'coverPhotoDataObjectId_ASC',
  CoverPhotoDataObjectIdDesc = 'coverPhotoDataObjectId_DESC',
  CoverPhotoDataObjectAsc = 'coverPhotoDataObject_ASC',
  CoverPhotoDataObjectDesc = 'coverPhotoDataObject_DESC',
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
  LanguageIdAsc = 'languageId_ASC',
  LanguageIdDesc = 'languageId_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  OwnerCuratorGroupIdAsc = 'ownerCuratorGroupId_ASC',
  OwnerCuratorGroupIdDesc = 'ownerCuratorGroupId_DESC',
  OwnerCuratorGroupAsc = 'ownerCuratorGroup_ASC',
  OwnerCuratorGroupDesc = 'ownerCuratorGroup_DESC',
  OwnerMemberIdAsc = 'ownerMemberId_ASC',
  OwnerMemberIdDesc = 'ownerMemberId_DESC',
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
  avatarPhotoAvailability?: Maybe<AssetAvailability>
  avatarPhotoDataObject?: Maybe<Scalars['ID']>
  avatarPhotoDataObjectId?: Maybe<Scalars['ID']>
  avatarPhotoUrls?: Maybe<Array<Scalars['String']>>
  category?: Maybe<Scalars['ID']>
  categoryId?: Maybe<Scalars['ID']>
  coverPhotoAvailability?: Maybe<AssetAvailability>
  coverPhotoDataObject?: Maybe<Scalars['ID']>
  coverPhotoDataObjectId?: Maybe<Scalars['ID']>
  coverPhotoUrls?: Maybe<Array<Scalars['String']>>
  createdInBlock?: Maybe<Scalars['Float']>
  description?: Maybe<Scalars['String']>
  isCensored?: Maybe<Scalars['Boolean']>
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Scalars['ID']>
  languageId?: Maybe<Scalars['ID']>
  ownerCuratorGroup?: Maybe<Scalars['ID']>
  ownerCuratorGroupId?: Maybe<Scalars['ID']>
  ownerMember?: Maybe<Scalars['ID']>
  ownerMemberId?: Maybe<Scalars['ID']>
  rewardAccount?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type ChannelWhereInput = {
  AND?: Maybe<Array<ChannelWhereInput>>
  OR?: Maybe<Array<ChannelWhereInput>>
  avatarPhotoAvailability_eq?: Maybe<AssetAvailability>
  avatarPhotoAvailability_in?: Maybe<Array<AssetAvailability>>
  avatarPhotoDataObject?: Maybe<DataObjectWhereInput>
  avatarPhotoDataObjectId_eq?: Maybe<Scalars['ID']>
  avatarPhotoDataObjectId_in?: Maybe<Array<Scalars['ID']>>
  avatarPhotoUrls_containsAll?: Maybe<Array<Scalars['String']>>
  avatarPhotoUrls_containsAny?: Maybe<Array<Scalars['String']>>
  avatarPhotoUrls_containsNone?: Maybe<Array<Scalars['String']>>
  category?: Maybe<ChannelCategoryWhereInput>
  categoryId_eq?: Maybe<Scalars['ID']>
  categoryId_in?: Maybe<Array<Scalars['ID']>>
  coverPhotoAvailability_eq?: Maybe<AssetAvailability>
  coverPhotoAvailability_in?: Maybe<Array<AssetAvailability>>
  coverPhotoDataObject?: Maybe<DataObjectWhereInput>
  coverPhotoDataObjectId_eq?: Maybe<Scalars['ID']>
  coverPhotoDataObjectId_in?: Maybe<Array<Scalars['ID']>>
  coverPhotoUrls_containsAll?: Maybe<Array<Scalars['String']>>
  coverPhotoUrls_containsAny?: Maybe<Array<Scalars['String']>>
  coverPhotoUrls_containsNone?: Maybe<Array<Scalars['String']>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  description_contains?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_startsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  isCensored_in?: Maybe<Array<Scalars['Boolean']>>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isPublic_in?: Maybe<Array<Scalars['Boolean']>>
  language?: Maybe<LanguageWhereInput>
  languageId_eq?: Maybe<Scalars['ID']>
  languageId_in?: Maybe<Array<Scalars['ID']>>
  ownerCuratorGroup?: Maybe<CuratorGroupWhereInput>
  ownerCuratorGroupId_eq?: Maybe<Scalars['ID']>
  ownerCuratorGroupId_in?: Maybe<Array<Scalars['ID']>>
  ownerMember?: Maybe<MembershipWhereInput>
  ownerMemberId_eq?: Maybe<Scalars['ID']>
  ownerMemberId_in?: Maybe<Array<Scalars['ID']>>
  rewardAccount_contains?: Maybe<Scalars['String']>
  rewardAccount_endsWith?: Maybe<Scalars['String']>
  rewardAccount_eq?: Maybe<Scalars['String']>
  rewardAccount_in?: Maybe<Array<Scalars['String']>>
  rewardAccount_startsWith?: Maybe<Scalars['String']>
  title_contains?: Maybe<Scalars['String']>
  title_endsWith?: Maybe<Scalars['String']>
  title_eq?: Maybe<Scalars['String']>
  title_in?: Maybe<Array<Scalars['String']>>
  title_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videos_every?: Maybe<VideoWhereInput>
  videos_none?: Maybe<VideoWhereInput>
  videos_some?: Maybe<VideoWhereInput>
}

export type ChannelWhereUniqueInput = {
  id: Scalars['ID']
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
  curatorIds?: Maybe<Array<Scalars['Int']>>
  isActive?: Maybe<Scalars['Boolean']>
}

export type CuratorGroupWhereInput = {
  AND?: Maybe<Array<CuratorGroupWhereInput>>
  OR?: Maybe<Array<CuratorGroupWhereInput>>
  channels_every?: Maybe<ChannelWhereInput>
  channels_none?: Maybe<ChannelWhereInput>
  channels_some?: Maybe<ChannelWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  curatorIds_containsAll?: Maybe<Array<Scalars['Int']>>
  curatorIds_containsAny?: Maybe<Array<Scalars['Int']>>
  curatorIds_containsNone?: Maybe<Array<Scalars['Int']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  isActive_eq?: Maybe<Scalars['Boolean']>
  isActive_in?: Maybe<Array<Scalars['Boolean']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type CuratorGroupWhereUniqueInput = {
  id: Scalars['ID']
}

/** Manages content ids, type and storage provider decision about it */
export type DataObject = BaseGraphQlObject & {
  __typename?: 'DataObject'
  channelavatarPhotoDataObject?: Maybe<Array<Channel>>
  channelcoverPhotoDataObject?: Maybe<Array<Channel>>
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  /** Content added at */
  createdInBlock: Scalars['Int']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** IPFS content id */
  ipfsContentId: Scalars['String']
  /** Joystream runtime content */
  joystreamContentId: Scalars['String']
  liaison?: Maybe<Worker>
  liaisonId?: Maybe<Scalars['String']>
  /** Storage provider as liaison judgment */
  liaisonJudgement: LiaisonJudgement
  /** Content owner */
  owner: DataObjectOwner
  /** Content size in bytes */
  size: Scalars['Float']
  /** Content type id */
  typeId: Scalars['Int']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
  videomediaDataObject?: Maybe<Array<Video>>
  videothumbnailPhotoDataObject?: Maybe<Array<Video>>
}

export type DataObjectConnection = {
  __typename?: 'DataObjectConnection'
  edges: Array<DataObjectEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DataObjectCreateInput = {
  createdInBlock: Scalars['Float']
  ipfsContentId: Scalars['String']
  joystreamContentId: Scalars['String']
  liaison?: Maybe<Scalars['ID']>
  liaisonId?: Maybe<Scalars['ID']>
  liaisonJudgement: LiaisonJudgement
  owner: Scalars['JSONObject']
  size: Scalars['Float']
  typeId: Scalars['Float']
}

export type DataObjectEdge = {
  __typename?: 'DataObjectEdge'
  cursor: Scalars['String']
  node: DataObject
}

export enum DataObjectOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  IpfsContentIdAsc = 'ipfsContentId_ASC',
  IpfsContentIdDesc = 'ipfsContentId_DESC',
  JoystreamContentIdAsc = 'joystreamContentId_ASC',
  JoystreamContentIdDesc = 'joystreamContentId_DESC',
  LiaisonIdAsc = 'liaisonId_ASC',
  LiaisonIdDesc = 'liaisonId_DESC',
  LiaisonJudgementAsc = 'liaisonJudgement_ASC',
  LiaisonJudgementDesc = 'liaisonJudgement_DESC',
  LiaisonAsc = 'liaison_ASC',
  LiaisonDesc = 'liaison_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  TypeIdAsc = 'typeId_ASC',
  TypeIdDesc = 'typeId_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type DataObjectOwner =
  | DataObjectOwnerChannel
  | DataObjectOwnerCouncil
  | DataObjectOwnerDao
  | DataObjectOwnerMember
  | DataObjectOwnerWorkingGroup

export type DataObjectOwnerChannel = {
  __typename?: 'DataObjectOwnerChannel'
  /** Channel identifier */
  channel: Scalars['Int']
  /** Variant needs to have at least one property. This value is not used. */
  dummy?: Maybe<Scalars['Int']>
}

export type DataObjectOwnerChannelCreateInput = {
  channel: Scalars['Float']
  dummy?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerChannelUpdateInput = {
  channel?: Maybe<Scalars['Float']>
  dummy?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerChannelWhereInput = {
  AND?: Maybe<Array<DataObjectOwnerChannelWhereInput>>
  OR?: Maybe<Array<DataObjectOwnerChannelWhereInput>>
  channel_eq?: Maybe<Scalars['Int']>
  channel_gt?: Maybe<Scalars['Int']>
  channel_gte?: Maybe<Scalars['Int']>
  channel_in?: Maybe<Array<Scalars['Int']>>
  channel_lt?: Maybe<Scalars['Int']>
  channel_lte?: Maybe<Scalars['Int']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  dummy_eq?: Maybe<Scalars['Int']>
  dummy_gt?: Maybe<Scalars['Int']>
  dummy_gte?: Maybe<Scalars['Int']>
  dummy_in?: Maybe<Array<Scalars['Int']>>
  dummy_lt?: Maybe<Scalars['Int']>
  dummy_lte?: Maybe<Scalars['Int']>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type DataObjectOwnerChannelWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectOwnerCouncil = {
  __typename?: 'DataObjectOwnerCouncil'
  /** Variant needs to have at least one property. This value is not used. */
  dummy?: Maybe<Scalars['Int']>
}

export type DataObjectOwnerCouncilCreateInput = {
  dummy?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerCouncilUpdateInput = {
  dummy?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerCouncilWhereInput = {
  AND?: Maybe<Array<DataObjectOwnerCouncilWhereInput>>
  OR?: Maybe<Array<DataObjectOwnerCouncilWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  dummy_eq?: Maybe<Scalars['Int']>
  dummy_gt?: Maybe<Scalars['Int']>
  dummy_gte?: Maybe<Scalars['Int']>
  dummy_in?: Maybe<Array<Scalars['Int']>>
  dummy_lt?: Maybe<Scalars['Int']>
  dummy_lte?: Maybe<Scalars['Int']>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type DataObjectOwnerCouncilWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectOwnerDao = {
  __typename?: 'DataObjectOwnerDao'
  /** DAO identifier */
  dao: Scalars['Int']
}

export type DataObjectOwnerDaoCreateInput = {
  dao: Scalars['Float']
}

export type DataObjectOwnerDaoUpdateInput = {
  dao?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerDaoWhereInput = {
  AND?: Maybe<Array<DataObjectOwnerDaoWhereInput>>
  OR?: Maybe<Array<DataObjectOwnerDaoWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  dao_eq?: Maybe<Scalars['Int']>
  dao_gt?: Maybe<Scalars['Int']>
  dao_gte?: Maybe<Scalars['Int']>
  dao_in?: Maybe<Array<Scalars['Int']>>
  dao_lt?: Maybe<Scalars['Int']>
  dao_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type DataObjectOwnerDaoWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectOwnerMember = {
  __typename?: 'DataObjectOwnerMember'
  /** Variant needs to have at least one property. This value is not used. */
  dummy?: Maybe<Scalars['Int']>
  /** Member identifier */
  member: Scalars['Int']
}

export type DataObjectOwnerMemberCreateInput = {
  dummy?: Maybe<Scalars['Float']>
  member: Scalars['Float']
}

export type DataObjectOwnerMemberUpdateInput = {
  dummy?: Maybe<Scalars['Float']>
  member?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerMemberWhereInput = {
  AND?: Maybe<Array<DataObjectOwnerMemberWhereInput>>
  OR?: Maybe<Array<DataObjectOwnerMemberWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  dummy_eq?: Maybe<Scalars['Int']>
  dummy_gt?: Maybe<Scalars['Int']>
  dummy_gte?: Maybe<Scalars['Int']>
  dummy_in?: Maybe<Array<Scalars['Int']>>
  dummy_lt?: Maybe<Scalars['Int']>
  dummy_lte?: Maybe<Scalars['Int']>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  member_eq?: Maybe<Scalars['Int']>
  member_gt?: Maybe<Scalars['Int']>
  member_gte?: Maybe<Scalars['Int']>
  member_in?: Maybe<Array<Scalars['Int']>>
  member_lt?: Maybe<Scalars['Int']>
  member_lte?: Maybe<Scalars['Int']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type DataObjectOwnerMemberWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectOwnerWorkingGroup = {
  __typename?: 'DataObjectOwnerWorkingGroup'
  /** Working group identifier */
  workingGroup: Scalars['Int']
}

export type DataObjectOwnerWorkingGroupCreateInput = {
  workingGroup: Scalars['Float']
}

export type DataObjectOwnerWorkingGroupUpdateInput = {
  workingGroup?: Maybe<Scalars['Float']>
}

export type DataObjectOwnerWorkingGroupWhereInput = {
  AND?: Maybe<Array<DataObjectOwnerWorkingGroupWhereInput>>
  OR?: Maybe<Array<DataObjectOwnerWorkingGroupWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  workingGroup_eq?: Maybe<Scalars['Int']>
  workingGroup_gt?: Maybe<Scalars['Int']>
  workingGroup_gte?: Maybe<Scalars['Int']>
  workingGroup_in?: Maybe<Array<Scalars['Int']>>
  workingGroup_lt?: Maybe<Scalars['Int']>
  workingGroup_lte?: Maybe<Scalars['Int']>
}

export type DataObjectOwnerWorkingGroupWhereUniqueInput = {
  id: Scalars['ID']
}

export type DataObjectUpdateInput = {
  createdInBlock?: Maybe<Scalars['Float']>
  ipfsContentId?: Maybe<Scalars['String']>
  joystreamContentId?: Maybe<Scalars['String']>
  liaison?: Maybe<Scalars['ID']>
  liaisonId?: Maybe<Scalars['ID']>
  liaisonJudgement?: Maybe<LiaisonJudgement>
  owner?: Maybe<Scalars['JSONObject']>
  size?: Maybe<Scalars['Float']>
  typeId?: Maybe<Scalars['Float']>
}

export type DataObjectWhereInput = {
  AND?: Maybe<Array<DataObjectWhereInput>>
  OR?: Maybe<Array<DataObjectWhereInput>>
  channelavatarPhotoDataObject_every?: Maybe<ChannelWhereInput>
  channelavatarPhotoDataObject_none?: Maybe<ChannelWhereInput>
  channelavatarPhotoDataObject_some?: Maybe<ChannelWhereInput>
  channelcoverPhotoDataObject_every?: Maybe<ChannelWhereInput>
  channelcoverPhotoDataObject_none?: Maybe<ChannelWhereInput>
  channelcoverPhotoDataObject_some?: Maybe<ChannelWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  ipfsContentId_contains?: Maybe<Scalars['String']>
  ipfsContentId_endsWith?: Maybe<Scalars['String']>
  ipfsContentId_eq?: Maybe<Scalars['String']>
  ipfsContentId_in?: Maybe<Array<Scalars['String']>>
  ipfsContentId_startsWith?: Maybe<Scalars['String']>
  joystreamContentId_contains?: Maybe<Scalars['String']>
  joystreamContentId_endsWith?: Maybe<Scalars['String']>
  joystreamContentId_eq?: Maybe<Scalars['String']>
  joystreamContentId_in?: Maybe<Array<Scalars['String']>>
  joystreamContentId_startsWith?: Maybe<Scalars['String']>
  liaison?: Maybe<WorkerWhereInput>
  liaisonId_eq?: Maybe<Scalars['ID']>
  liaisonId_in?: Maybe<Array<Scalars['ID']>>
  liaisonJudgement_eq?: Maybe<LiaisonJudgement>
  liaisonJudgement_in?: Maybe<Array<LiaisonJudgement>>
  owner_json?: Maybe<Scalars['JSONObject']>
  size_eq?: Maybe<Scalars['Float']>
  size_gt?: Maybe<Scalars['Float']>
  size_gte?: Maybe<Scalars['Float']>
  size_in?: Maybe<Array<Scalars['Float']>>
  size_lt?: Maybe<Scalars['Float']>
  size_lte?: Maybe<Scalars['Float']>
  typeId_eq?: Maybe<Scalars['Int']>
  typeId_gt?: Maybe<Scalars['Int']>
  typeId_gte?: Maybe<Scalars['Int']>
  typeId_in?: Maybe<Array<Scalars['Int']>>
  typeId_lt?: Maybe<Scalars['Int']>
  typeId_lte?: Maybe<Scalars['Int']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videomediaDataObject_every?: Maybe<VideoMediaMetadataWhereInput>
  videomediaDataObject_none?: Maybe<VideoMediaMetadataWhereInput>
  videomediaDataObject_some?: Maybe<VideoMediaMetadataWhereInput>
  videothumbnailPhotoDataObject_every?: Maybe<VideoMediaMetadataWhereInput>
  videothumbnailPhotoDataObject_none?: Maybe<VideoMediaMetadataWhereInput>
  videothumbnailPhotoDataObject_some?: Maybe<VideoMediaMetadataWhereInput>
}

export type DataObjectWhereUniqueInput = {
  id: Scalars['ID']
}

export type DeleteResponse = {
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
  videoCutUrl?: Maybe<Scalars['String']>
  videoId: Scalars['ID']
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
  createdInBlock?: Maybe<Scalars['Float']>
  iso?: Maybe<Scalars['String']>
}

export type LanguageWhereInput = {
  AND?: Maybe<Array<LanguageWhereInput>>
  OR?: Maybe<Array<LanguageWhereInput>>
  channellanguage_every?: Maybe<ChannelWhereInput>
  channellanguage_none?: Maybe<ChannelWhereInput>
  channellanguage_some?: Maybe<ChannelWhereInput>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  iso_contains?: Maybe<Scalars['String']>
  iso_endsWith?: Maybe<Scalars['String']>
  iso_eq?: Maybe<Scalars['String']>
  iso_in?: Maybe<Array<Scalars['String']>>
  iso_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videolanguage_every?: Maybe<VideoWhereInput>
  videolanguage_none?: Maybe<VideoWhereInput>
  videolanguage_some?: Maybe<VideoWhereInput>
}

export type LanguageWhereUniqueInput = {
  id: Scalars['ID']
}

export enum LiaisonJudgement {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
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
  attribution?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['Float']>
  customText?: Maybe<Scalars['String']>
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
  attribution?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['Float']>
  customText?: Maybe<Scalars['String']>
}

export type LicenseWhereInput = {
  AND?: Maybe<Array<LicenseWhereInput>>
  OR?: Maybe<Array<LicenseWhereInput>>
  attribution_contains?: Maybe<Scalars['String']>
  attribution_endsWith?: Maybe<Scalars['String']>
  attribution_eq?: Maybe<Scalars['String']>
  attribution_in?: Maybe<Array<Scalars['String']>>
  attribution_startsWith?: Maybe<Scalars['String']>
  code_eq?: Maybe<Scalars['Int']>
  code_gt?: Maybe<Scalars['Int']>
  code_gte?: Maybe<Scalars['Int']>
  code_in?: Maybe<Array<Scalars['Int']>>
  code_lt?: Maybe<Scalars['Int']>
  code_lte?: Maybe<Scalars['Int']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  customText_contains?: Maybe<Scalars['String']>
  customText_endsWith?: Maybe<Scalars['String']>
  customText_eq?: Maybe<Scalars['String']>
  customText_in?: Maybe<Array<Scalars['String']>>
  customText_startsWith?: Maybe<Scalars['String']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videolanguage_every?: Maybe<VideoWhereInput>
  videolanguage_none?: Maybe<VideoWhereInput>
  videolanguage_some?: Maybe<VideoWhereInput>
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
  about?: Maybe<Scalars['String']>
  avatarUri?: Maybe<Scalars['String']>
  controllerAccount: Scalars['String']
  createdInBlock: Scalars['Float']
  entry: MembershipEntryMethod
  handle: Scalars['String']
  rootAccount: Scalars['String']
  subscription?: Maybe<Scalars['Float']>
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
  about?: Maybe<Scalars['String']>
  avatarUri?: Maybe<Scalars['String']>
  controllerAccount?: Maybe<Scalars['String']>
  createdInBlock?: Maybe<Scalars['Float']>
  entry?: Maybe<MembershipEntryMethod>
  handle?: Maybe<Scalars['String']>
  rootAccount?: Maybe<Scalars['String']>
  subscription?: Maybe<Scalars['Float']>
}

export type MembershipWhereInput = {
  AND?: Maybe<Array<MembershipWhereInput>>
  OR?: Maybe<Array<MembershipWhereInput>>
  about_contains?: Maybe<Scalars['String']>
  about_endsWith?: Maybe<Scalars['String']>
  about_eq?: Maybe<Scalars['String']>
  about_in?: Maybe<Array<Scalars['String']>>
  about_startsWith?: Maybe<Scalars['String']>
  avatarUri_contains?: Maybe<Scalars['String']>
  avatarUri_endsWith?: Maybe<Scalars['String']>
  avatarUri_eq?: Maybe<Scalars['String']>
  avatarUri_in?: Maybe<Array<Scalars['String']>>
  avatarUri_startsWith?: Maybe<Scalars['String']>
  channels_every?: Maybe<ChannelWhereInput>
  channels_none?: Maybe<ChannelWhereInput>
  channels_some?: Maybe<ChannelWhereInput>
  controllerAccount_contains?: Maybe<Scalars['String']>
  controllerAccount_endsWith?: Maybe<Scalars['String']>
  controllerAccount_eq?: Maybe<Scalars['String']>
  controllerAccount_in?: Maybe<Array<Scalars['String']>>
  controllerAccount_startsWith?: Maybe<Scalars['String']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  entry_eq?: Maybe<MembershipEntryMethod>
  entry_in?: Maybe<Array<MembershipEntryMethod>>
  handle_contains?: Maybe<Scalars['String']>
  handle_endsWith?: Maybe<Scalars['String']>
  handle_eq?: Maybe<Scalars['String']>
  handle_in?: Maybe<Array<Scalars['String']>>
  handle_startsWith?: Maybe<Scalars['String']>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  rootAccount_contains?: Maybe<Scalars['String']>
  rootAccount_endsWith?: Maybe<Scalars['String']>
  rootAccount_eq?: Maybe<Scalars['String']>
  rootAccount_in?: Maybe<Array<Scalars['String']>>
  rootAccount_startsWith?: Maybe<Scalars['String']>
  subscription_eq?: Maybe<Scalars['Int']>
  subscription_gt?: Maybe<Scalars['Int']>
  subscription_gte?: Maybe<Scalars['Int']>
  subscription_in?: Maybe<Array<Scalars['Int']>>
  subscription_lt?: Maybe<Scalars['Int']>
  subscription_lte?: Maybe<Scalars['Int']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type MembershipWhereUniqueInput = {
  handle?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
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

export type NextEntityId = BaseGraphQlObject & {
  __typename?: 'NextEntityId'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  deletedById?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Next deterministic id for entities without custom id */
  nextId: Scalars['Float']
  updatedAt?: Maybe<Scalars['DateTime']>
  updatedById?: Maybe<Scalars['String']>
  version: Scalars['Int']
}

export type NextEntityIdConnection = {
  __typename?: 'NextEntityIdConnection'
  edges: Array<NextEntityIdEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NextEntityIdCreateInput = {
  nextId: Scalars['Float']
}

export type NextEntityIdEdge = {
  __typename?: 'NextEntityIdEdge'
  cursor: Scalars['String']
  node: NextEntityId
}

export enum NextEntityIdOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DeletedAtAsc = 'deletedAt_ASC',
  DeletedAtDesc = 'deletedAt_DESC',
  NextIdAsc = 'nextId_ASC',
  NextIdDesc = 'nextId_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type NextEntityIdUpdateInput = {
  nextId?: Maybe<Scalars['Float']>
}

export type NextEntityIdWhereInput = {
  AND?: Maybe<Array<NextEntityIdWhereInput>>
  OR?: Maybe<Array<NextEntityIdWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  nextId_eq?: Maybe<Scalars['Float']>
  nextId_gt?: Maybe<Scalars['Float']>
  nextId_gte?: Maybe<Scalars['Float']>
  nextId_in?: Maybe<Array<Scalars['Float']>>
  nextId_lt?: Maybe<Scalars['Float']>
  nextId_lte?: Maybe<Scalars['Float']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type NextEntityIdWhereUniqueInput = {
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
  dataObjectByUniqueInput?: Maybe<DataObject>
  dataObjects: Array<DataObject>
  dataObjectsConnection: DataObjectConnection
  /** Get list of 15 most followed channels out of 100 newest channels in random order */
  discoverChannels: Array<Channel>
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
  nextEntityIdByUniqueInput?: Maybe<NextEntityId>
  nextEntityIds: Array<NextEntityId>
  nextEntityIdsConnection: NextEntityIdConnection
  /** Get list of 15 most watched channels in random order */
  popularChannels: Array<Channel>
  /** Get list of 15 most watched channels out of 100 newest channels in random order */
  promisingChannels: Array<Channel>
  search: Array<SearchFtsOutput>
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

export type QueryCategoryFeaturedVideosArgs = {
  categoryId: Scalars['ID']
}

export type QueryChannelByUniqueInputArgs = {
  where: ChannelWhereUniqueInput
}

export type QueryChannelCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelCategoryOrderByInput>>
  where?: Maybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoriesByNameArgs = {
  limit?: Maybe<Scalars['Int']>
  skip?: Maybe<Scalars['Int']>
  text: Scalars['String']
  whereChannelCategory?: Maybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoriesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelCategoryOrderByInput>>
  where?: Maybe<ChannelCategoryWhereInput>
}

export type QueryChannelCategoryByUniqueInputArgs = {
  where: ChannelCategoryWhereUniqueInput
}

export type QueryChannelsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  where?: Maybe<ChannelWhereInput>
}

export type QueryCuratorGroupByUniqueInputArgs = {
  where: CuratorGroupWhereUniqueInput
}

export type QueryCuratorGroupsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorGroupOrderByInput>>
  where?: Maybe<CuratorGroupWhereInput>
}

export type QueryCuratorGroupsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<CuratorGroupOrderByInput>>
  where?: Maybe<CuratorGroupWhereInput>
}

export type QueryDataObjectByUniqueInputArgs = {
  where: DataObjectWhereUniqueInput
}

export type QueryDataObjectsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DataObjectOrderByInput>>
  where?: Maybe<DataObjectWhereInput>
}

export type QueryDataObjectsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<DataObjectOrderByInput>>
  where?: Maybe<DataObjectWhereInput>
}

export type QueryDiscoverChannelsArgs = {
  where?: Maybe<ChannelWhereInput>
}

export type QueryLanguageByUniqueInputArgs = {
  where: LanguageWhereUniqueInput
}

export type QueryLanguagesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LanguageOrderByInput>>
  where?: Maybe<LanguageWhereInput>
}

export type QueryLanguagesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LanguageOrderByInput>>
  where?: Maybe<LanguageWhereInput>
}

export type QueryLicenseByUniqueInputArgs = {
  where: LicenseWhereUniqueInput
}

export type QueryLicensesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LicenseOrderByInput>>
  where?: Maybe<LicenseWhereInput>
}

export type QueryLicensesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<LicenseOrderByInput>>
  where?: Maybe<LicenseWhereInput>
}

export type QueryMembersByHandleArgs = {
  limit?: Maybe<Scalars['Int']>
  skip?: Maybe<Scalars['Int']>
  text: Scalars['String']
  whereMembership?: Maybe<MembershipWhereInput>
}

export type QueryMembershipByUniqueInputArgs = {
  where: MembershipWhereUniqueInput
}

export type QueryMembershipsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MembershipOrderByInput>>
  where?: Maybe<MembershipWhereInput>
}

export type QueryMembershipsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<MembershipOrderByInput>>
  where?: Maybe<MembershipWhereInput>
}

export type QueryMostFollowedChannelsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  periodDays?: Maybe<Scalars['Int']>
  where?: Maybe<ChannelWhereInput>
}

export type QueryMostViewedCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  timePeriodDays: Scalars['Int']
}

export type QueryMostViewedCategoriesAllTimeArgs = {
  limit: Scalars['Int']
}

export type QueryMostViewedChannelsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: Maybe<Array<ChannelOrderByInput>>
  periodDays?: Maybe<Scalars['Int']>
  where?: Maybe<ChannelWhereInput>
}

export type QueryMostViewedVideosConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy?: Maybe<Array<VideoOrderByInput>>
  periodDays?: Maybe<Scalars['Int']>
  where?: Maybe<VideoWhereInput>
}

export type QueryNextEntityIdByUniqueInputArgs = {
  where: NextEntityIdWhereUniqueInput
}

export type QueryNextEntityIdsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NextEntityIdOrderByInput>>
  where?: Maybe<NextEntityIdWhereInput>
}

export type QueryNextEntityIdsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<NextEntityIdOrderByInput>>
  where?: Maybe<NextEntityIdWhereInput>
}

export type QueryPopularChannelsArgs = {
  where?: Maybe<ChannelWhereInput>
}

export type QueryPromisingChannelsArgs = {
  where?: Maybe<ChannelWhereInput>
}

export type QuerySearchArgs = {
  limit?: Maybe<Scalars['Int']>
  skip?: Maybe<Scalars['Int']>
  text: Scalars['String']
  whereChannel?: Maybe<ChannelWhereInput>
  whereVideo?: Maybe<VideoWhereInput>
}

export type QueryTop10ChannelsArgs = {
  where?: Maybe<ChannelWhereInput>
}

export type QueryTop10VideosThisMonthArgs = {
  where?: Maybe<VideoWhereInput>
}

export type QueryTop10VideosThisWeekArgs = {
  where?: Maybe<VideoWhereInput>
}

export type QueryVideoByUniqueInputArgs = {
  where: VideoWhereUniqueInput
}

export type QueryVideoCategoriesArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoCategoryOrderByInput>>
  where?: Maybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesByNameArgs = {
  limit?: Maybe<Scalars['Int']>
  skip?: Maybe<Scalars['Int']>
  text: Scalars['String']
  whereVideoCategory?: Maybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoCategoryOrderByInput>>
  where?: Maybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoryByUniqueInputArgs = {
  where: VideoCategoryWhereUniqueInput
}

export type QueryVideoMediaEncodingByUniqueInputArgs = {
  where: VideoMediaEncodingWhereUniqueInput
}

export type QueryVideoMediaEncodingsArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaEncodingOrderByInput>>
  where?: Maybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaEncodingsConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaEncodingOrderByInput>>
  where?: Maybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaMetadataArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaMetadataOrderByInput>>
  where?: Maybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoMediaMetadataByUniqueInputArgs = {
  where: VideoMediaMetadataWhereUniqueInput
}

export type QueryVideoMediaMetadataConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoMediaMetadataOrderByInput>>
  where?: Maybe<VideoMediaMetadataWhereInput>
}

export type QueryVideosArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<VideoOrderByInput>>
  where?: Maybe<VideoWhereInput>
}

export type QueryWorkerByUniqueInputArgs = {
  where: WorkerWhereUniqueInput
}

export type QueryWorkersArgs = {
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<WorkerOrderByInput>>
  where?: Maybe<WorkerWhereInput>
}

export type QueryWorkersConnectionArgs = {
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  orderBy?: Maybe<Array<WorkerOrderByInput>>
  where?: Maybe<WorkerWhereInput>
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

export type Subscription = {
  __typename?: 'Subscription'
  stateSubscription: ProcessorState
}

export type Video = BaseGraphQlObject & {
  __typename?: 'Video'
  category?: Maybe<VideoCategory>
  categoryId?: Maybe<Scalars['String']>
  channel?: Maybe<Channel>
  channelId?: Maybe<Scalars['String']>
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
  /** Availability meta information */
  mediaAvailability: AssetAvailability
  mediaDataObject?: Maybe<DataObject>
  mediaDataObjectId?: Maybe<Scalars['String']>
  mediaMetadata?: Maybe<VideoMediaMetadata>
  mediaMetadataId?: Maybe<Scalars['String']>
  /** URLs where the asset content can be accessed (if any) */
  mediaUrls: Array<Scalars['String']>
  /** If the Video was published on other platform before beeing published on Joystream - the original publication date */
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  /** Availability meta information */
  thumbnailPhotoAvailability: AssetAvailability
  thumbnailPhotoDataObject?: Maybe<DataObject>
  thumbnailPhotoDataObjectId?: Maybe<Scalars['String']>
  /** URLs where the asset content can be accessed (if any) */
  thumbnailPhotoUrls: Array<Scalars['String']>
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
  name?: Maybe<Scalars['String']>
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
  createdInBlock?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type VideoCategoryWhereInput = {
  AND?: Maybe<Array<VideoCategoryWhereInput>>
  OR?: Maybe<Array<VideoCategoryWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  name_contains?: Maybe<Scalars['String']>
  name_endsWith?: Maybe<Scalars['String']>
  name_eq?: Maybe<Scalars['String']>
  name_in?: Maybe<Array<Scalars['String']>>
  name_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videos_every?: Maybe<VideoWhereInput>
  videos_none?: Maybe<VideoWhereInput>
  videos_some?: Maybe<VideoWhereInput>
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
  category?: Maybe<Scalars['ID']>
  categoryId?: Maybe<Scalars['ID']>
  channel?: Maybe<Scalars['ID']>
  channelId?: Maybe<Scalars['ID']>
  createdInBlock: Scalars['Float']
  description?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['Float']>
  hasMarketing?: Maybe<Scalars['Boolean']>
  isCensored: Scalars['Boolean']
  isExplicit?: Maybe<Scalars['Boolean']>
  isFeatured: Scalars['Boolean']
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Scalars['ID']>
  languageId?: Maybe<Scalars['ID']>
  license?: Maybe<Scalars['ID']>
  licenseId?: Maybe<Scalars['ID']>
  mediaAvailability: AssetAvailability
  mediaDataObject?: Maybe<Scalars['ID']>
  mediaDataObjectId?: Maybe<Scalars['ID']>
  mediaMetadata?: Maybe<Scalars['ID']>
  mediaMetadataId?: Maybe<Scalars['ID']>
  mediaUrls: Array<Scalars['String']>
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  thumbnailPhotoAvailability: AssetAvailability
  thumbnailPhotoDataObject?: Maybe<Scalars['ID']>
  thumbnailPhotoDataObjectId?: Maybe<Scalars['ID']>
  thumbnailPhotoUrls: Array<Scalars['String']>
  title?: Maybe<Scalars['String']>
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
  codecName?: Maybe<Scalars['String']>
  container?: Maybe<Scalars['String']>
  mimeMediaType?: Maybe<Scalars['String']>
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
  codecName?: Maybe<Scalars['String']>
  container?: Maybe<Scalars['String']>
  mimeMediaType?: Maybe<Scalars['String']>
}

export type VideoMediaEncodingWhereInput = {
  AND?: Maybe<Array<VideoMediaEncodingWhereInput>>
  OR?: Maybe<Array<VideoMediaEncodingWhereInput>>
  codecName_contains?: Maybe<Scalars['String']>
  codecName_endsWith?: Maybe<Scalars['String']>
  codecName_eq?: Maybe<Scalars['String']>
  codecName_in?: Maybe<Array<Scalars['String']>>
  codecName_startsWith?: Maybe<Scalars['String']>
  container_contains?: Maybe<Scalars['String']>
  container_endsWith?: Maybe<Scalars['String']>
  container_eq?: Maybe<Scalars['String']>
  container_in?: Maybe<Array<Scalars['String']>>
  container_startsWith?: Maybe<Scalars['String']>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  mimeMediaType_contains?: Maybe<Scalars['String']>
  mimeMediaType_endsWith?: Maybe<Scalars['String']>
  mimeMediaType_eq?: Maybe<Scalars['String']>
  mimeMediaType_in?: Maybe<Array<Scalars['String']>>
  mimeMediaType_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  videomediametadataencoding_every?: Maybe<VideoMediaMetadataWhereInput>
  videomediametadataencoding_none?: Maybe<VideoMediaMetadataWhereInput>
  videomediametadataencoding_some?: Maybe<VideoMediaMetadataWhereInput>
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
  size?: Maybe<Scalars['Float']>
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
  encoding?: Maybe<Scalars['ID']>
  encodingId?: Maybe<Scalars['ID']>
  pixelHeight?: Maybe<Scalars['Float']>
  pixelWidth?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
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
  EncodingIdAsc = 'encodingId_ASC',
  EncodingIdDesc = 'encodingId_DESC',
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
  createdInBlock?: Maybe<Scalars['Float']>
  encoding?: Maybe<Scalars['ID']>
  encodingId?: Maybe<Scalars['ID']>
  pixelHeight?: Maybe<Scalars['Float']>
  pixelWidth?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
}

export type VideoMediaMetadataWhereInput = {
  AND?: Maybe<Array<VideoMediaMetadataWhereInput>>
  OR?: Maybe<Array<VideoMediaMetadataWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  encoding?: Maybe<VideoMediaEncodingWhereInput>
  encodingId_eq?: Maybe<Scalars['ID']>
  encodingId_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  pixelHeight_eq?: Maybe<Scalars['Int']>
  pixelHeight_gt?: Maybe<Scalars['Int']>
  pixelHeight_gte?: Maybe<Scalars['Int']>
  pixelHeight_in?: Maybe<Array<Scalars['Int']>>
  pixelHeight_lt?: Maybe<Scalars['Int']>
  pixelHeight_lte?: Maybe<Scalars['Int']>
  pixelWidth_eq?: Maybe<Scalars['Int']>
  pixelWidth_gt?: Maybe<Scalars['Int']>
  pixelWidth_gte?: Maybe<Scalars['Int']>
  pixelWidth_in?: Maybe<Array<Scalars['Int']>>
  pixelWidth_lt?: Maybe<Scalars['Int']>
  pixelWidth_lte?: Maybe<Scalars['Int']>
  size_eq?: Maybe<Scalars['Float']>
  size_gt?: Maybe<Scalars['Float']>
  size_gte?: Maybe<Scalars['Float']>
  size_in?: Maybe<Array<Scalars['Float']>>
  size_lt?: Maybe<Scalars['Float']>
  size_lte?: Maybe<Scalars['Float']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  video?: Maybe<VideoWhereInput>
}

export type VideoMediaMetadataWhereUniqueInput = {
  id: Scalars['ID']
}

export enum VideoOrderByInput {
  CategoryIdAsc = 'categoryId_ASC',
  CategoryIdDesc = 'categoryId_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
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
  LanguageIdAsc = 'languageId_ASC',
  LanguageIdDesc = 'languageId_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  LicenseIdAsc = 'licenseId_ASC',
  LicenseIdDesc = 'licenseId_DESC',
  LicenseAsc = 'license_ASC',
  LicenseDesc = 'license_DESC',
  MediaAvailabilityAsc = 'mediaAvailability_ASC',
  MediaAvailabilityDesc = 'mediaAvailability_DESC',
  MediaDataObjectIdAsc = 'mediaDataObjectId_ASC',
  MediaDataObjectIdDesc = 'mediaDataObjectId_DESC',
  MediaDataObjectAsc = 'mediaDataObject_ASC',
  MediaDataObjectDesc = 'mediaDataObject_DESC',
  MediaMetadataIdAsc = 'mediaMetadataId_ASC',
  MediaMetadataIdDesc = 'mediaMetadataId_DESC',
  MediaMetadataAsc = 'mediaMetadata_ASC',
  MediaMetadataDesc = 'mediaMetadata_DESC',
  PublishedBeforeJoystreamAsc = 'publishedBeforeJoystream_ASC',
  PublishedBeforeJoystreamDesc = 'publishedBeforeJoystream_DESC',
  ThumbnailPhotoAvailabilityAsc = 'thumbnailPhotoAvailability_ASC',
  ThumbnailPhotoAvailabilityDesc = 'thumbnailPhotoAvailability_DESC',
  ThumbnailPhotoDataObjectIdAsc = 'thumbnailPhotoDataObjectId_ASC',
  ThumbnailPhotoDataObjectIdDesc = 'thumbnailPhotoDataObjectId_DESC',
  ThumbnailPhotoDataObjectAsc = 'thumbnailPhotoDataObject_ASC',
  ThumbnailPhotoDataObjectDesc = 'thumbnailPhotoDataObject_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type VideoUpdateInput = {
  category?: Maybe<Scalars['ID']>
  categoryId?: Maybe<Scalars['ID']>
  channel?: Maybe<Scalars['ID']>
  channelId?: Maybe<Scalars['ID']>
  createdInBlock?: Maybe<Scalars['Float']>
  description?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['Float']>
  hasMarketing?: Maybe<Scalars['Boolean']>
  isCensored?: Maybe<Scalars['Boolean']>
  isExplicit?: Maybe<Scalars['Boolean']>
  isFeatured?: Maybe<Scalars['Boolean']>
  isPublic?: Maybe<Scalars['Boolean']>
  language?: Maybe<Scalars['ID']>
  languageId?: Maybe<Scalars['ID']>
  license?: Maybe<Scalars['ID']>
  licenseId?: Maybe<Scalars['ID']>
  mediaAvailability?: Maybe<AssetAvailability>
  mediaDataObject?: Maybe<Scalars['ID']>
  mediaDataObjectId?: Maybe<Scalars['ID']>
  mediaMetadata?: Maybe<Scalars['ID']>
  mediaMetadataId?: Maybe<Scalars['ID']>
  mediaUrls?: Maybe<Array<Scalars['String']>>
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  thumbnailPhotoAvailability?: Maybe<AssetAvailability>
  thumbnailPhotoDataObject?: Maybe<Scalars['ID']>
  thumbnailPhotoDataObjectId?: Maybe<Scalars['ID']>
  thumbnailPhotoUrls?: Maybe<Array<Scalars['String']>>
  title?: Maybe<Scalars['String']>
}

export type VideoWhereInput = {
  AND?: Maybe<Array<VideoWhereInput>>
  OR?: Maybe<Array<VideoWhereInput>>
  category?: Maybe<VideoCategoryWhereInput>
  categoryId_eq?: Maybe<Scalars['ID']>
  categoryId_in?: Maybe<Array<Scalars['ID']>>
  channel?: Maybe<ChannelWhereInput>
  channelId_eq?: Maybe<Scalars['ID']>
  channelId_in?: Maybe<Array<Scalars['ID']>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  createdInBlock_eq?: Maybe<Scalars['Int']>
  createdInBlock_gt?: Maybe<Scalars['Int']>
  createdInBlock_gte?: Maybe<Scalars['Int']>
  createdInBlock_in?: Maybe<Array<Scalars['Int']>>
  createdInBlock_lt?: Maybe<Scalars['Int']>
  createdInBlock_lte?: Maybe<Scalars['Int']>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  description_contains?: Maybe<Scalars['String']>
  description_endsWith?: Maybe<Scalars['String']>
  description_eq?: Maybe<Scalars['String']>
  description_in?: Maybe<Array<Scalars['String']>>
  description_startsWith?: Maybe<Scalars['String']>
  duration_eq?: Maybe<Scalars['Int']>
  duration_gt?: Maybe<Scalars['Int']>
  duration_gte?: Maybe<Scalars['Int']>
  duration_in?: Maybe<Array<Scalars['Int']>>
  duration_lt?: Maybe<Scalars['Int']>
  duration_lte?: Maybe<Scalars['Int']>
  hasMarketing_eq?: Maybe<Scalars['Boolean']>
  hasMarketing_in?: Maybe<Array<Scalars['Boolean']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  isCensored_eq?: Maybe<Scalars['Boolean']>
  isCensored_in?: Maybe<Array<Scalars['Boolean']>>
  isExplicit_eq?: Maybe<Scalars['Boolean']>
  isExplicit_in?: Maybe<Array<Scalars['Boolean']>>
  isFeatured_eq?: Maybe<Scalars['Boolean']>
  isFeatured_in?: Maybe<Array<Scalars['Boolean']>>
  isPublic_eq?: Maybe<Scalars['Boolean']>
  isPublic_in?: Maybe<Array<Scalars['Boolean']>>
  language?: Maybe<LanguageWhereInput>
  languageId_eq?: Maybe<Scalars['ID']>
  languageId_in?: Maybe<Array<Scalars['ID']>>
  license?: Maybe<LicenseWhereInput>
  licenseId_eq?: Maybe<Scalars['ID']>
  licenseId_in?: Maybe<Array<Scalars['ID']>>
  mediaAvailability_eq?: Maybe<AssetAvailability>
  mediaAvailability_in?: Maybe<Array<AssetAvailability>>
  mediaDataObject?: Maybe<DataObjectWhereInput>
  mediaDataObjectId_eq?: Maybe<Scalars['ID']>
  mediaDataObjectId_in?: Maybe<Array<Scalars['ID']>>
  mediaMetadata?: Maybe<VideoMediaMetadataWhereInput>
  mediaMetadataId_eq?: Maybe<Scalars['ID']>
  mediaMetadataId_in?: Maybe<Array<Scalars['ID']>>
  mediaUrls_containsAll?: Maybe<Array<Scalars['String']>>
  mediaUrls_containsAny?: Maybe<Array<Scalars['String']>>
  mediaUrls_containsNone?: Maybe<Array<Scalars['String']>>
  publishedBeforeJoystream_eq?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_gte?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_lt?: Maybe<Scalars['DateTime']>
  publishedBeforeJoystream_lte?: Maybe<Scalars['DateTime']>
  thumbnailPhotoAvailability_eq?: Maybe<AssetAvailability>
  thumbnailPhotoAvailability_in?: Maybe<Array<AssetAvailability>>
  thumbnailPhotoDataObject?: Maybe<DataObjectWhereInput>
  thumbnailPhotoDataObjectId_eq?: Maybe<Scalars['ID']>
  thumbnailPhotoDataObjectId_in?: Maybe<Array<Scalars['ID']>>
  thumbnailPhotoUrls_containsAll?: Maybe<Array<Scalars['String']>>
  thumbnailPhotoUrls_containsAny?: Maybe<Array<Scalars['String']>>
  thumbnailPhotoUrls_containsNone?: Maybe<Array<Scalars['String']>>
  title_contains?: Maybe<Scalars['String']>
  title_endsWith?: Maybe<Scalars['String']>
  title_eq?: Maybe<Scalars['String']>
  title_in?: Maybe<Array<Scalars['String']>>
  title_startsWith?: Maybe<Scalars['String']>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
}

export type VideoWhereUniqueInput = {
  id: Scalars['ID']
}

export type Worker = BaseGraphQlObject & {
  __typename?: 'Worker'
  createdAt: Scalars['DateTime']
  createdById: Scalars['String']
  dataObjects: Array<DataObject>
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
  metadata?: Maybe<Scalars['String']>
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
  isActive?: Maybe<Scalars['Boolean']>
  metadata?: Maybe<Scalars['String']>
  type?: Maybe<WorkerType>
  workerId?: Maybe<Scalars['String']>
}

export type WorkerWhereInput = {
  AND?: Maybe<Array<WorkerWhereInput>>
  OR?: Maybe<Array<WorkerWhereInput>>
  createdAt_eq?: Maybe<Scalars['DateTime']>
  createdAt_gt?: Maybe<Scalars['DateTime']>
  createdAt_gte?: Maybe<Scalars['DateTime']>
  createdAt_lt?: Maybe<Scalars['DateTime']>
  createdAt_lte?: Maybe<Scalars['DateTime']>
  createdById_eq?: Maybe<Scalars['ID']>
  createdById_in?: Maybe<Array<Scalars['ID']>>
  dataObjects_every?: Maybe<DataObjectWhereInput>
  dataObjects_none?: Maybe<DataObjectWhereInput>
  dataObjects_some?: Maybe<DataObjectWhereInput>
  deletedAt_all?: Maybe<Scalars['Boolean']>
  deletedAt_eq?: Maybe<Scalars['DateTime']>
  deletedAt_gt?: Maybe<Scalars['DateTime']>
  deletedAt_gte?: Maybe<Scalars['DateTime']>
  deletedAt_lt?: Maybe<Scalars['DateTime']>
  deletedAt_lte?: Maybe<Scalars['DateTime']>
  deletedById_eq?: Maybe<Scalars['ID']>
  deletedById_in?: Maybe<Array<Scalars['ID']>>
  id_eq?: Maybe<Scalars['ID']>
  id_in?: Maybe<Array<Scalars['ID']>>
  isActive_eq?: Maybe<Scalars['Boolean']>
  isActive_in?: Maybe<Array<Scalars['Boolean']>>
  metadata_contains?: Maybe<Scalars['String']>
  metadata_endsWith?: Maybe<Scalars['String']>
  metadata_eq?: Maybe<Scalars['String']>
  metadata_in?: Maybe<Array<Scalars['String']>>
  metadata_startsWith?: Maybe<Scalars['String']>
  type_eq?: Maybe<WorkerType>
  type_in?: Maybe<Array<WorkerType>>
  updatedAt_eq?: Maybe<Scalars['DateTime']>
  updatedAt_gt?: Maybe<Scalars['DateTime']>
  updatedAt_gte?: Maybe<Scalars['DateTime']>
  updatedAt_lt?: Maybe<Scalars['DateTime']>
  updatedAt_lte?: Maybe<Scalars['DateTime']>
  updatedById_eq?: Maybe<Scalars['ID']>
  updatedById_in?: Maybe<Array<Scalars['ID']>>
  workerId_contains?: Maybe<Scalars['String']>
  workerId_endsWith?: Maybe<Scalars['String']>
  workerId_eq?: Maybe<Scalars['String']>
  workerId_in?: Maybe<Array<Scalars['String']>>
  workerId_startsWith?: Maybe<Scalars['String']>
}

export type WorkerWhereUniqueInput = {
  id: Scalars['ID']
}
