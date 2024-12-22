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
  BigDecimal: string
  BigInt: string
  DateTime: Date
  id_ASC: string
}

/** A Gateway Account */
export type Account = {
  __typename?: 'Account'
  /** Gateway account's e-mail address */
  email: Scalars['String']
  /** Unique identifier (can be sequential) */
  id: Scalars['String']
  /** Indicates whether the access to the gateway account is blocked */
  isBlocked: Scalars['Boolean']
  /** Indicates whether the gateway account's e-mail has been confirmed or not. */
  isEmailConfirmed: Scalars['Boolean']
  /** Blockchain (joystream) account associated with the gateway account */
  joystreamAccount: Scalars['String']
  /** On-chain membership associated with the gateway account */
  membership: Membership
  /** notification preferences for the account */
  notificationPreferences: AccountNotificationPreferences
  /** runtime notifications */
  notifications: Array<Notification>
  /** ID of the channel which referred the user to the platform */
  referrerChannelId?: Maybe<Scalars['String']>
  /** Time when the gateway account was registered */
  registeredAt: Scalars['DateTime']
  /** The user associated with the gateway account (the Gateway Account Owner) */
  user: User
}

/** A Gateway Account */
export type AccountNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>
  where?: InputMaybe<NotificationWhereInput>
}

export type AccountData = {
  __typename?: 'AccountData'
  email: Scalars['String']
  followedChannels: Array<FollowedChannel>
  id: Scalars['String']
  isEmailConfirmed: Scalars['Boolean']
  joystreamAccount: Scalars['String']
  membershipId: Scalars['String']
  preferences?: Maybe<AccountNotificationPreferencesOutput>
}

export type AccountEdge = {
  __typename?: 'AccountEdge'
  cursor: Scalars['String']
  node: Account
}

export type AccountNotificationPreferences = {
  __typename?: 'AccountNotificationPreferences'
  auctionLost: NotificationPreference
  auctionWon: NotificationPreference
  bidMadeOnNft: NotificationPreference
  channelCreated: NotificationPreference
  channelExcludedFromApp: NotificationPreference
  channelFundsWithdrawn: NotificationPreference
  channelPaymentReceived: NotificationPreference
  channelReceivedFundsFromWg: NotificationPreference
  creatorTimedAuctionExpired: NotificationPreference
  crtIssued: NotificationPreference
  crtMarketBurn: NotificationPreference
  crtMarketMint: NotificationPreference
  crtMarketStarted: NotificationPreference
  crtRevenueShareEnded: NotificationPreference
  crtRevenueSharePlanned: NotificationPreference
  crtRevenueShareStarted: NotificationPreference
  crtSaleMint: NotificationPreference
  crtSaleStarted: NotificationPreference
  fundsFromCouncilReceived: NotificationPreference
  fundsFromWgReceived: NotificationPreference
  fundsToExternalWalletSent: NotificationPreference
  higherBidThanYoursMade: NotificationPreference
  newChannelFollower: NotificationPreference
  newNftOnAuction: NotificationPreference
  newNftOnSale: NotificationPreference
  newPayoutUpdatedByCouncil: NotificationPreference
  nftBought: NotificationPreference
  nftFeaturedOnMarketPlace: NotificationPreference
  openAuctionBidCanBeWithdrawn: NotificationPreference
  reactionToComment: NotificationPreference
  replyToComment: NotificationPreference
  royaltyReceived: NotificationPreference
  timedAuctionExpired: NotificationPreference
  videoCommentCreated: NotificationPreference
  videoDisliked: NotificationPreference
  videoExcludedFromApp: NotificationPreference
  videoLiked: NotificationPreference
  videoPosted: NotificationPreference
  yppChannelSuspended: NotificationPreference
  yppChannelVerified: NotificationPreference
  yppSignupSuccessful: NotificationPreference
}

export type AccountNotificationPreferencesInput = {
  auctionLost?: InputMaybe<NotificationPreferenceGql>
  auctionWon?: InputMaybe<NotificationPreferenceGql>
  bidMadeOnNft?: InputMaybe<NotificationPreferenceGql>
  channelCreated?: InputMaybe<NotificationPreferenceGql>
  channelExcludedFromApp?: InputMaybe<NotificationPreferenceGql>
  channelFundsWithdrawn?: InputMaybe<NotificationPreferenceGql>
  channelPaymentReceived?: InputMaybe<NotificationPreferenceGql>
  channelReceivedFundsFromWg?: InputMaybe<NotificationPreferenceGql>
  creatorTimedAuctionExpired?: InputMaybe<NotificationPreferenceGql>
  fundsFromCouncilReceived?: InputMaybe<NotificationPreferenceGql>
  fundsFromWgReceived?: InputMaybe<NotificationPreferenceGql>
  fundsToExternalWalletSent?: InputMaybe<NotificationPreferenceGql>
  higherBidThanYoursMade?: InputMaybe<NotificationPreferenceGql>
  newChannelFollower?: InputMaybe<NotificationPreferenceGql>
  newNftOnAuction?: InputMaybe<NotificationPreferenceGql>
  newNftOnSale?: InputMaybe<NotificationPreferenceGql>
  newPayoutUpdatedByCouncil?: InputMaybe<NotificationPreferenceGql>
  nftBought?: InputMaybe<NotificationPreferenceGql>
  nftFeaturedOnMarketPlace?: InputMaybe<NotificationPreferenceGql>
  openAuctionBidCanBeWithdrawn?: InputMaybe<NotificationPreferenceGql>
  reactionToComment?: InputMaybe<NotificationPreferenceGql>
  replyToComment?: InputMaybe<NotificationPreferenceGql>
  royaltyReceived?: InputMaybe<NotificationPreferenceGql>
  timedAuctionExpired?: InputMaybe<NotificationPreferenceGql>
  videoCommentCreated?: InputMaybe<NotificationPreferenceGql>
  videoDisliked?: InputMaybe<NotificationPreferenceGql>
  videoExcludedFromApp?: InputMaybe<NotificationPreferenceGql>
  videoLiked?: InputMaybe<NotificationPreferenceGql>
  videoPosted?: InputMaybe<NotificationPreferenceGql>
  yppChannelSuspended?: InputMaybe<NotificationPreferenceGql>
  yppChannelVerified?: InputMaybe<NotificationPreferenceGql>
  yppSignupSuccessful?: InputMaybe<NotificationPreferenceGql>
}

export type AccountNotificationPreferencesOutput = {
  __typename?: 'AccountNotificationPreferencesOutput'
  auctionLost?: Maybe<NotificationPreferenceOutput>
  auctionWon?: Maybe<NotificationPreferenceOutput>
  bidMadeOnNft?: Maybe<NotificationPreferenceOutput>
  channelCreated?: Maybe<NotificationPreferenceOutput>
  channelExcludedFromApp?: Maybe<NotificationPreferenceOutput>
  channelFundsWithdrawn?: Maybe<NotificationPreferenceOutput>
  channelPaymentReceived?: Maybe<NotificationPreferenceOutput>
  channelReceivedFundsFromWg?: Maybe<NotificationPreferenceOutput>
  creatorTimedAuctionExpired?: Maybe<NotificationPreferenceOutput>
  fundsFromCouncilReceived?: Maybe<NotificationPreferenceOutput>
  fundsFromWgReceived?: Maybe<NotificationPreferenceOutput>
  fundsToExternalWalletSent?: Maybe<NotificationPreferenceOutput>
  higherBidThanYoursMade?: Maybe<NotificationPreferenceOutput>
  newChannelFollower?: Maybe<NotificationPreferenceOutput>
  newNftOnAuction?: Maybe<NotificationPreferenceOutput>
  newNftOnSale?: Maybe<NotificationPreferenceOutput>
  newPayoutUpdatedByCouncil?: Maybe<NotificationPreferenceOutput>
  nftBought?: Maybe<NotificationPreferenceOutput>
  nftFeaturedOnMarketPlace?: Maybe<NotificationPreferenceOutput>
  openAuctionBidCanBeWithdrawn?: Maybe<NotificationPreferenceOutput>
  reactionToComment?: Maybe<NotificationPreferenceOutput>
  replyToComment?: Maybe<NotificationPreferenceOutput>
  royaltyReceived?: Maybe<NotificationPreferenceOutput>
  timedAuctionExpired?: Maybe<NotificationPreferenceOutput>
  videoCommentCreated?: Maybe<NotificationPreferenceOutput>
  videoDisliked?: Maybe<NotificationPreferenceOutput>
  videoExcludedFromApp?: Maybe<NotificationPreferenceOutput>
  videoLiked?: Maybe<NotificationPreferenceOutput>
  videoPosted?: Maybe<NotificationPreferenceOutput>
  yppChannelSuspended?: Maybe<NotificationPreferenceOutput>
  yppChannelVerified?: Maybe<NotificationPreferenceOutput>
  yppSignupSuccessful?: Maybe<NotificationPreferenceOutput>
}

export type AccountNotificationPreferencesResult = {
  __typename?: 'AccountNotificationPreferencesResult'
  newPreferences: AccountNotificationPreferencesOutput
}

export type AccountNotificationPreferencesWhereInput = {
  auctionLost?: InputMaybe<NotificationPreferenceWhereInput>
  auctionLost_isNull?: InputMaybe<Scalars['Boolean']>
  auctionWon?: InputMaybe<NotificationPreferenceWhereInput>
  auctionWon_isNull?: InputMaybe<Scalars['Boolean']>
  bidMadeOnNft?: InputMaybe<NotificationPreferenceWhereInput>
  bidMadeOnNft_isNull?: InputMaybe<Scalars['Boolean']>
  channelCreated?: InputMaybe<NotificationPreferenceWhereInput>
  channelCreated_isNull?: InputMaybe<Scalars['Boolean']>
  channelExcludedFromApp?: InputMaybe<NotificationPreferenceWhereInput>
  channelExcludedFromApp_isNull?: InputMaybe<Scalars['Boolean']>
  channelFundsWithdrawn?: InputMaybe<NotificationPreferenceWhereInput>
  channelFundsWithdrawn_isNull?: InputMaybe<Scalars['Boolean']>
  channelPaymentReceived?: InputMaybe<NotificationPreferenceWhereInput>
  channelPaymentReceived_isNull?: InputMaybe<Scalars['Boolean']>
  channelReceivedFundsFromWg?: InputMaybe<NotificationPreferenceWhereInput>
  channelReceivedFundsFromWg_isNull?: InputMaybe<Scalars['Boolean']>
  creatorTimedAuctionExpired?: InputMaybe<NotificationPreferenceWhereInput>
  creatorTimedAuctionExpired_isNull?: InputMaybe<Scalars['Boolean']>
  crtIssued?: InputMaybe<NotificationPreferenceWhereInput>
  crtIssued_isNull?: InputMaybe<Scalars['Boolean']>
  crtMarketBurn?: InputMaybe<NotificationPreferenceWhereInput>
  crtMarketBurn_isNull?: InputMaybe<Scalars['Boolean']>
  crtMarketMint?: InputMaybe<NotificationPreferenceWhereInput>
  crtMarketMint_isNull?: InputMaybe<Scalars['Boolean']>
  crtMarketStarted?: InputMaybe<NotificationPreferenceWhereInput>
  crtMarketStarted_isNull?: InputMaybe<Scalars['Boolean']>
  crtRevenueShareEnded?: InputMaybe<NotificationPreferenceWhereInput>
  crtRevenueShareEnded_isNull?: InputMaybe<Scalars['Boolean']>
  crtRevenueSharePlanned?: InputMaybe<NotificationPreferenceWhereInput>
  crtRevenueSharePlanned_isNull?: InputMaybe<Scalars['Boolean']>
  crtRevenueShareStarted?: InputMaybe<NotificationPreferenceWhereInput>
  crtRevenueShareStarted_isNull?: InputMaybe<Scalars['Boolean']>
  crtSaleMint?: InputMaybe<NotificationPreferenceWhereInput>
  crtSaleMint_isNull?: InputMaybe<Scalars['Boolean']>
  crtSaleStarted?: InputMaybe<NotificationPreferenceWhereInput>
  crtSaleStarted_isNull?: InputMaybe<Scalars['Boolean']>
  fundsFromCouncilReceived?: InputMaybe<NotificationPreferenceWhereInput>
  fundsFromCouncilReceived_isNull?: InputMaybe<Scalars['Boolean']>
  fundsFromWgReceived?: InputMaybe<NotificationPreferenceWhereInput>
  fundsFromWgReceived_isNull?: InputMaybe<Scalars['Boolean']>
  fundsToExternalWalletSent?: InputMaybe<NotificationPreferenceWhereInput>
  fundsToExternalWalletSent_isNull?: InputMaybe<Scalars['Boolean']>
  higherBidThanYoursMade?: InputMaybe<NotificationPreferenceWhereInput>
  higherBidThanYoursMade_isNull?: InputMaybe<Scalars['Boolean']>
  newChannelFollower?: InputMaybe<NotificationPreferenceWhereInput>
  newChannelFollower_isNull?: InputMaybe<Scalars['Boolean']>
  newNftOnAuction?: InputMaybe<NotificationPreferenceWhereInput>
  newNftOnAuction_isNull?: InputMaybe<Scalars['Boolean']>
  newNftOnSale?: InputMaybe<NotificationPreferenceWhereInput>
  newNftOnSale_isNull?: InputMaybe<Scalars['Boolean']>
  newPayoutUpdatedByCouncil?: InputMaybe<NotificationPreferenceWhereInput>
  newPayoutUpdatedByCouncil_isNull?: InputMaybe<Scalars['Boolean']>
  nftBought?: InputMaybe<NotificationPreferenceWhereInput>
  nftBought_isNull?: InputMaybe<Scalars['Boolean']>
  nftFeaturedOnMarketPlace?: InputMaybe<NotificationPreferenceWhereInput>
  nftFeaturedOnMarketPlace_isNull?: InputMaybe<Scalars['Boolean']>
  openAuctionBidCanBeWithdrawn?: InputMaybe<NotificationPreferenceWhereInput>
  openAuctionBidCanBeWithdrawn_isNull?: InputMaybe<Scalars['Boolean']>
  reactionToComment?: InputMaybe<NotificationPreferenceWhereInput>
  reactionToComment_isNull?: InputMaybe<Scalars['Boolean']>
  replyToComment?: InputMaybe<NotificationPreferenceWhereInput>
  replyToComment_isNull?: InputMaybe<Scalars['Boolean']>
  royaltyReceived?: InputMaybe<NotificationPreferenceWhereInput>
  royaltyReceived_isNull?: InputMaybe<Scalars['Boolean']>
  timedAuctionExpired?: InputMaybe<NotificationPreferenceWhereInput>
  timedAuctionExpired_isNull?: InputMaybe<Scalars['Boolean']>
  videoCommentCreated?: InputMaybe<NotificationPreferenceWhereInput>
  videoCommentCreated_isNull?: InputMaybe<Scalars['Boolean']>
  videoDisliked?: InputMaybe<NotificationPreferenceWhereInput>
  videoDisliked_isNull?: InputMaybe<Scalars['Boolean']>
  videoExcludedFromApp?: InputMaybe<NotificationPreferenceWhereInput>
  videoExcludedFromApp_isNull?: InputMaybe<Scalars['Boolean']>
  videoLiked?: InputMaybe<NotificationPreferenceWhereInput>
  videoLiked_isNull?: InputMaybe<Scalars['Boolean']>
  videoPosted?: InputMaybe<NotificationPreferenceWhereInput>
  videoPosted_isNull?: InputMaybe<Scalars['Boolean']>
  yppChannelSuspended?: InputMaybe<NotificationPreferenceWhereInput>
  yppChannelSuspended_isNull?: InputMaybe<Scalars['Boolean']>
  yppChannelVerified?: InputMaybe<NotificationPreferenceWhereInput>
  yppChannelVerified_isNull?: InputMaybe<Scalars['Boolean']>
  yppSignupSuccessful?: InputMaybe<NotificationPreferenceWhereInput>
  yppSignupSuccessful_isNull?: InputMaybe<Scalars['Boolean']>
}

export enum AccountOrderByInput {
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsBlockedAsc = 'isBlocked_ASC',
  IsBlockedDesc = 'isBlocked_DESC',
  IsEmailConfirmedAsc = 'isEmailConfirmed_ASC',
  IsEmailConfirmedDesc = 'isEmailConfirmed_DESC',
  JoystreamAccountAsc = 'joystreamAccount_ASC',
  JoystreamAccountDesc = 'joystreamAccount_DESC',
  MembershipControllerAccountAsc = 'membership_controllerAccount_ASC',
  MembershipControllerAccountDesc = 'membership_controllerAccount_DESC',
  MembershipCreatedAtAsc = 'membership_createdAt_ASC',
  MembershipCreatedAtDesc = 'membership_createdAt_DESC',
  MembershipHandleRawAsc = 'membership_handleRaw_ASC',
  MembershipHandleRawDesc = 'membership_handleRaw_DESC',
  MembershipHandleAsc = 'membership_handle_ASC',
  MembershipHandleDesc = 'membership_handle_DESC',
  MembershipIdAsc = 'membership_id_ASC',
  MembershipIdDesc = 'membership_id_DESC',
  MembershipTotalChannelsCreatedAsc = 'membership_totalChannelsCreated_ASC',
  MembershipTotalChannelsCreatedDesc = 'membership_totalChannelsCreated_DESC',
  ReferrerChannelIdAsc = 'referrerChannelId_ASC',
  ReferrerChannelIdDesc = 'referrerChannelId_DESC',
  RegisteredAtAsc = 'registeredAt_ASC',
  RegisteredAtDesc = 'registeredAt_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>
  OR?: InputMaybe<Array<AccountWhereInput>>
  email_contains?: InputMaybe<Scalars['String']>
  email_containsInsensitive?: InputMaybe<Scalars['String']>
  email_endsWith?: InputMaybe<Scalars['String']>
  email_eq?: InputMaybe<Scalars['String']>
  email_gt?: InputMaybe<Scalars['String']>
  email_gte?: InputMaybe<Scalars['String']>
  email_in?: InputMaybe<Array<Scalars['String']>>
  email_isNull?: InputMaybe<Scalars['Boolean']>
  email_lt?: InputMaybe<Scalars['String']>
  email_lte?: InputMaybe<Scalars['String']>
  email_not_contains?: InputMaybe<Scalars['String']>
  email_not_containsInsensitive?: InputMaybe<Scalars['String']>
  email_not_endsWith?: InputMaybe<Scalars['String']>
  email_not_eq?: InputMaybe<Scalars['String']>
  email_not_in?: InputMaybe<Array<Scalars['String']>>
  email_not_startsWith?: InputMaybe<Scalars['String']>
  email_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isBlocked_eq?: InputMaybe<Scalars['Boolean']>
  isBlocked_isNull?: InputMaybe<Scalars['Boolean']>
  isBlocked_not_eq?: InputMaybe<Scalars['Boolean']>
  isEmailConfirmed_eq?: InputMaybe<Scalars['Boolean']>
  isEmailConfirmed_isNull?: InputMaybe<Scalars['Boolean']>
  isEmailConfirmed_not_eq?: InputMaybe<Scalars['Boolean']>
  joystreamAccount_contains?: InputMaybe<Scalars['String']>
  joystreamAccount_containsInsensitive?: InputMaybe<Scalars['String']>
  joystreamAccount_endsWith?: InputMaybe<Scalars['String']>
  joystreamAccount_eq?: InputMaybe<Scalars['String']>
  joystreamAccount_gt?: InputMaybe<Scalars['String']>
  joystreamAccount_gte?: InputMaybe<Scalars['String']>
  joystreamAccount_in?: InputMaybe<Array<Scalars['String']>>
  joystreamAccount_isNull?: InputMaybe<Scalars['Boolean']>
  joystreamAccount_lt?: InputMaybe<Scalars['String']>
  joystreamAccount_lte?: InputMaybe<Scalars['String']>
  joystreamAccount_not_contains?: InputMaybe<Scalars['String']>
  joystreamAccount_not_containsInsensitive?: InputMaybe<Scalars['String']>
  joystreamAccount_not_endsWith?: InputMaybe<Scalars['String']>
  joystreamAccount_not_eq?: InputMaybe<Scalars['String']>
  joystreamAccount_not_in?: InputMaybe<Array<Scalars['String']>>
  joystreamAccount_not_startsWith?: InputMaybe<Scalars['String']>
  joystreamAccount_startsWith?: InputMaybe<Scalars['String']>
  membership?: InputMaybe<MembershipWhereInput>
  membership_isNull?: InputMaybe<Scalars['Boolean']>
  notificationPreferences?: InputMaybe<AccountNotificationPreferencesWhereInput>
  notificationPreferences_isNull?: InputMaybe<Scalars['Boolean']>
  notifications_every?: InputMaybe<NotificationWhereInput>
  notifications_none?: InputMaybe<NotificationWhereInput>
  notifications_some?: InputMaybe<NotificationWhereInput>
  referrerChannelId_contains?: InputMaybe<Scalars['String']>
  referrerChannelId_containsInsensitive?: InputMaybe<Scalars['String']>
  referrerChannelId_endsWith?: InputMaybe<Scalars['String']>
  referrerChannelId_eq?: InputMaybe<Scalars['String']>
  referrerChannelId_gt?: InputMaybe<Scalars['String']>
  referrerChannelId_gte?: InputMaybe<Scalars['String']>
  referrerChannelId_in?: InputMaybe<Array<Scalars['String']>>
  referrerChannelId_isNull?: InputMaybe<Scalars['Boolean']>
  referrerChannelId_lt?: InputMaybe<Scalars['String']>
  referrerChannelId_lte?: InputMaybe<Scalars['String']>
  referrerChannelId_not_contains?: InputMaybe<Scalars['String']>
  referrerChannelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  referrerChannelId_not_endsWith?: InputMaybe<Scalars['String']>
  referrerChannelId_not_eq?: InputMaybe<Scalars['String']>
  referrerChannelId_not_in?: InputMaybe<Array<Scalars['String']>>
  referrerChannelId_not_startsWith?: InputMaybe<Scalars['String']>
  referrerChannelId_startsWith?: InputMaybe<Scalars['String']>
  registeredAt_eq?: InputMaybe<Scalars['DateTime']>
  registeredAt_gt?: InputMaybe<Scalars['DateTime']>
  registeredAt_gte?: InputMaybe<Scalars['DateTime']>
  registeredAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  registeredAt_isNull?: InputMaybe<Scalars['Boolean']>
  registeredAt_lt?: InputMaybe<Scalars['DateTime']>
  registeredAt_lte?: InputMaybe<Scalars['DateTime']>
  registeredAt_not_eq?: InputMaybe<Scalars['DateTime']>
  registeredAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
}

export type AccountsConnection = {
  __typename?: 'AccountsConnection'
  edges: Array<AccountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type AddVideoViewResult = {
  __typename?: 'AddVideoViewResult'
  added: Scalars['Boolean']
  videoId: Scalars['String']
  viewId: Scalars['String']
  viewsNum: Scalars['Int']
}

export type AmmCurve = {
  __typename?: 'AmmCurve'
  /** the amm intercept parameter b in the formula a * x + b */
  ammInitPrice: Scalars['BigInt']
  /** the amm slope parameter a in the formula a * x + b */
  ammSlopeParameter: Scalars['BigInt']
  /** quantity bought on the market by the amm */
  burnedByAmm: Scalars['BigInt']
  /** finalized (i.e. closed) */
  finalized: Scalars['Boolean']
  /** counter */
  id: Scalars['String']
  /** quantity sold to the market */
  mintedByAmm: Scalars['BigInt']
  /** token this Amm is for */
  token: CreatorToken
  /** transaction for this amm */
  transactions: Array<AmmTransaction>
}

export type AmmCurveTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmTransactionOrderByInput>>
  where?: InputMaybe<AmmTransactionWhereInput>
}

export type AmmCurveEdge = {
  __typename?: 'AmmCurveEdge'
  cursor: Scalars['String']
  node: AmmCurve
}

export enum AmmCurveOrderByInput {
  AmmInitPriceAsc = 'ammInitPrice_ASC',
  AmmInitPriceDesc = 'ammInitPrice_DESC',
  AmmSlopeParameterAsc = 'ammSlopeParameter_ASC',
  AmmSlopeParameterDesc = 'ammSlopeParameter_DESC',
  BurnedByAmmAsc = 'burnedByAmm_ASC',
  BurnedByAmmDesc = 'burnedByAmm_DESC',
  FinalizedAsc = 'finalized_ASC',
  FinalizedDesc = 'finalized_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MintedByAmmAsc = 'mintedByAmm_ASC',
  MintedByAmmDesc = 'mintedByAmm_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
}

export type AmmCurveWhereInput = {
  AND?: InputMaybe<Array<AmmCurveWhereInput>>
  OR?: InputMaybe<Array<AmmCurveWhereInput>>
  ammInitPrice_eq?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_gt?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_gte?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  ammInitPrice_isNull?: InputMaybe<Scalars['Boolean']>
  ammInitPrice_lt?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_lte?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  ammInitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  ammSlopeParameter_eq?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_gt?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_gte?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_in?: InputMaybe<Array<Scalars['BigInt']>>
  ammSlopeParameter_isNull?: InputMaybe<Scalars['Boolean']>
  ammSlopeParameter_lt?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_lte?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_not_eq?: InputMaybe<Scalars['BigInt']>
  ammSlopeParameter_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  burnedByAmm_eq?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_gt?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_gte?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_in?: InputMaybe<Array<Scalars['BigInt']>>
  burnedByAmm_isNull?: InputMaybe<Scalars['Boolean']>
  burnedByAmm_lt?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_lte?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_not_eq?: InputMaybe<Scalars['BigInt']>
  burnedByAmm_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  finalized_eq?: InputMaybe<Scalars['Boolean']>
  finalized_isNull?: InputMaybe<Scalars['Boolean']>
  finalized_not_eq?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  mintedByAmm_eq?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_gt?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_gte?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_in?: InputMaybe<Array<Scalars['BigInt']>>
  mintedByAmm_isNull?: InputMaybe<Scalars['Boolean']>
  mintedByAmm_lt?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_lte?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_not_eq?: InputMaybe<Scalars['BigInt']>
  mintedByAmm_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
  transactions_every?: InputMaybe<AmmTransactionWhereInput>
  transactions_none?: InputMaybe<AmmTransactionWhereInput>
  transactions_some?: InputMaybe<AmmTransactionWhereInput>
}

export type AmmCurvesConnection = {
  __typename?: 'AmmCurvesConnection'
  edges: Array<AmmCurveEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type AmmTransaction = {
  __typename?: 'AmmTransaction'
  /** buyer account */
  account: TokenAccount
  /** Reference to the Amm Sale */
  amm: AmmCurve
  /** block */
  createdIn: Scalars['Int']
  /** counter */
  id: Scalars['String']
  /** total HAPI paid/received for the quantity */
  pricePaid: Scalars['BigInt']
  /** price per unit in HAPI */
  pricePerUnit: Scalars['BigInt']
  /** amount of token bought/sold */
  quantity: Scalars['BigInt']
  /** was it bought/sold */
  transactionType: AmmTransactionType
}

export type AmmTransactionEdge = {
  __typename?: 'AmmTransactionEdge'
  cursor: Scalars['String']
  node: AmmTransaction
}

export enum AmmTransactionOrderByInput {
  AccountDeletedAsc = 'account_deleted_ASC',
  AccountDeletedDesc = 'account_deleted_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountStakedAmountAsc = 'account_stakedAmount_ASC',
  AccountStakedAmountDesc = 'account_stakedAmount_DESC',
  AccountTotalAmountAsc = 'account_totalAmount_ASC',
  AccountTotalAmountDesc = 'account_totalAmount_DESC',
  AmmAmmInitPriceAsc = 'amm_ammInitPrice_ASC',
  AmmAmmInitPriceDesc = 'amm_ammInitPrice_DESC',
  AmmAmmSlopeParameterAsc = 'amm_ammSlopeParameter_ASC',
  AmmAmmSlopeParameterDesc = 'amm_ammSlopeParameter_DESC',
  AmmBurnedByAmmAsc = 'amm_burnedByAmm_ASC',
  AmmBurnedByAmmDesc = 'amm_burnedByAmm_DESC',
  AmmFinalizedAsc = 'amm_finalized_ASC',
  AmmFinalizedDesc = 'amm_finalized_DESC',
  AmmIdAsc = 'amm_id_ASC',
  AmmIdDesc = 'amm_id_DESC',
  AmmMintedByAmmAsc = 'amm_mintedByAmm_ASC',
  AmmMintedByAmmDesc = 'amm_mintedByAmm_DESC',
  CreatedInAsc = 'createdIn_ASC',
  CreatedInDesc = 'createdIn_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PricePaidAsc = 'pricePaid_ASC',
  PricePaidDesc = 'pricePaid_DESC',
  PricePerUnitAsc = 'pricePerUnit_ASC',
  PricePerUnitDesc = 'pricePerUnit_DESC',
  QuantityAsc = 'quantity_ASC',
  QuantityDesc = 'quantity_DESC',
  TransactionTypeAsc = 'transactionType_ASC',
  TransactionTypeDesc = 'transactionType_DESC',
}

export enum AmmTransactionType {
  Buy = 'BUY',
  Sell = 'SELL',
}

export type AmmTransactionWhereInput = {
  AND?: InputMaybe<Array<AmmTransactionWhereInput>>
  OR?: InputMaybe<Array<AmmTransactionWhereInput>>
  account?: InputMaybe<TokenAccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  amm?: InputMaybe<AmmCurveWhereInput>
  amm_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_eq?: InputMaybe<Scalars['Int']>
  createdIn_gt?: InputMaybe<Scalars['Int']>
  createdIn_gte?: InputMaybe<Scalars['Int']>
  createdIn_in?: InputMaybe<Array<Scalars['Int']>>
  createdIn_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_lt?: InputMaybe<Scalars['Int']>
  createdIn_lte?: InputMaybe<Scalars['Int']>
  createdIn_not_eq?: InputMaybe<Scalars['Int']>
  createdIn_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  pricePaid_eq?: InputMaybe<Scalars['BigInt']>
  pricePaid_gt?: InputMaybe<Scalars['BigInt']>
  pricePaid_gte?: InputMaybe<Scalars['BigInt']>
  pricePaid_in?: InputMaybe<Array<Scalars['BigInt']>>
  pricePaid_isNull?: InputMaybe<Scalars['Boolean']>
  pricePaid_lt?: InputMaybe<Scalars['BigInt']>
  pricePaid_lte?: InputMaybe<Scalars['BigInt']>
  pricePaid_not_eq?: InputMaybe<Scalars['BigInt']>
  pricePaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  pricePerUnit_eq?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_gt?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_gte?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_in?: InputMaybe<Array<Scalars['BigInt']>>
  pricePerUnit_isNull?: InputMaybe<Scalars['Boolean']>
  pricePerUnit_lt?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_lte?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_not_eq?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  quantity_eq?: InputMaybe<Scalars['BigInt']>
  quantity_gt?: InputMaybe<Scalars['BigInt']>
  quantity_gte?: InputMaybe<Scalars['BigInt']>
  quantity_in?: InputMaybe<Array<Scalars['BigInt']>>
  quantity_isNull?: InputMaybe<Scalars['Boolean']>
  quantity_lt?: InputMaybe<Scalars['BigInt']>
  quantity_lte?: InputMaybe<Scalars['BigInt']>
  quantity_not_eq?: InputMaybe<Scalars['BigInt']>
  quantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  transactionType_eq?: InputMaybe<AmmTransactionType>
  transactionType_in?: InputMaybe<Array<AmmTransactionType>>
  transactionType_isNull?: InputMaybe<Scalars['Boolean']>
  transactionType_not_eq?: InputMaybe<AmmTransactionType>
  transactionType_not_in?: InputMaybe<Array<AmmTransactionType>>
}

export type AmmTransactionsConnection = {
  __typename?: 'AmmTransactionsConnection'
  edges: Array<AmmTransactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type App = {
  __typename?: 'App'
  appChannels: Array<Channel>
  appVideos: Array<Video>
  authKey?: Maybe<Scalars['String']>
  bigIcon?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  /** Runtime entity identifier (EntityId) */
  id: Scalars['String']
  mediumIcon?: Maybe<Scalars['String']>
  /** The name of the App */
  name: Scalars['String']
  /** Tagline of the app */
  oneLiner?: Maybe<Scalars['String']>
  /** Member owning the App */
  ownerMember: Membership
  /** List of platforms on which the app will be available, e.g. [mobile, web, native] */
  platforms?: Maybe<Array<Maybe<Scalars['String']>>>
  smallIcon?: Maybe<Scalars['String']>
  termsOfService?: Maybe<Scalars['String']>
  /** Url to the app */
  useUri?: Maybe<Scalars['String']>
  /** Url where user can read more about the project or company for this app */
  websiteUrl?: Maybe<Scalars['String']>
}

export type AppAppChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

export type AppAppVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export enum AppActionActionType {
  CreateChannel = 'CREATE_CHANNEL',
  CreateVideo = 'CREATE_VIDEO',
}

export type AppEdge = {
  __typename?: 'AppEdge'
  cursor: Scalars['String']
  node: App
}

export enum AppOrderByInput {
  AuthKeyAsc = 'authKey_ASC',
  AuthKeyDesc = 'authKey_DESC',
  BigIconAsc = 'bigIcon_ASC',
  BigIconDesc = 'bigIcon_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MediumIconAsc = 'mediumIcon_ASC',
  MediumIconDesc = 'mediumIcon_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  OneLinerAsc = 'oneLiner_ASC',
  OneLinerDesc = 'oneLiner_DESC',
  OwnerMemberControllerAccountAsc = 'ownerMember_controllerAccount_ASC',
  OwnerMemberControllerAccountDesc = 'ownerMember_controllerAccount_DESC',
  OwnerMemberCreatedAtAsc = 'ownerMember_createdAt_ASC',
  OwnerMemberCreatedAtDesc = 'ownerMember_createdAt_DESC',
  OwnerMemberHandleRawAsc = 'ownerMember_handleRaw_ASC',
  OwnerMemberHandleRawDesc = 'ownerMember_handleRaw_DESC',
  OwnerMemberHandleAsc = 'ownerMember_handle_ASC',
  OwnerMemberHandleDesc = 'ownerMember_handle_DESC',
  OwnerMemberIdAsc = 'ownerMember_id_ASC',
  OwnerMemberIdDesc = 'ownerMember_id_DESC',
  OwnerMemberTotalChannelsCreatedAsc = 'ownerMember_totalChannelsCreated_ASC',
  OwnerMemberTotalChannelsCreatedDesc = 'ownerMember_totalChannelsCreated_DESC',
  SmallIconAsc = 'smallIcon_ASC',
  SmallIconDesc = 'smallIcon_DESC',
  TermsOfServiceAsc = 'termsOfService_ASC',
  TermsOfServiceDesc = 'termsOfService_DESC',
  UseUriAsc = 'useUri_ASC',
  UseUriDesc = 'useUri_DESC',
  WebsiteUrlAsc = 'websiteUrl_ASC',
  WebsiteUrlDesc = 'websiteUrl_DESC',
}

export type AppRootDomain = {
  __typename?: 'AppRootDomain'
  isApplied: Scalars['Boolean']
}

export type AppWhereInput = {
  AND?: InputMaybe<Array<AppWhereInput>>
  OR?: InputMaybe<Array<AppWhereInput>>
  appChannels_every?: InputMaybe<ChannelWhereInput>
  appChannels_none?: InputMaybe<ChannelWhereInput>
  appChannels_some?: InputMaybe<ChannelWhereInput>
  appVideos_every?: InputMaybe<VideoWhereInput>
  appVideos_none?: InputMaybe<VideoWhereInput>
  appVideos_some?: InputMaybe<VideoWhereInput>
  authKey_contains?: InputMaybe<Scalars['String']>
  authKey_containsInsensitive?: InputMaybe<Scalars['String']>
  authKey_endsWith?: InputMaybe<Scalars['String']>
  authKey_eq?: InputMaybe<Scalars['String']>
  authKey_gt?: InputMaybe<Scalars['String']>
  authKey_gte?: InputMaybe<Scalars['String']>
  authKey_in?: InputMaybe<Array<Scalars['String']>>
  authKey_isNull?: InputMaybe<Scalars['Boolean']>
  authKey_lt?: InputMaybe<Scalars['String']>
  authKey_lte?: InputMaybe<Scalars['String']>
  authKey_not_contains?: InputMaybe<Scalars['String']>
  authKey_not_containsInsensitive?: InputMaybe<Scalars['String']>
  authKey_not_endsWith?: InputMaybe<Scalars['String']>
  authKey_not_eq?: InputMaybe<Scalars['String']>
  authKey_not_in?: InputMaybe<Array<Scalars['String']>>
  authKey_not_startsWith?: InputMaybe<Scalars['String']>
  authKey_startsWith?: InputMaybe<Scalars['String']>
  bigIcon_contains?: InputMaybe<Scalars['String']>
  bigIcon_containsInsensitive?: InputMaybe<Scalars['String']>
  bigIcon_endsWith?: InputMaybe<Scalars['String']>
  bigIcon_eq?: InputMaybe<Scalars['String']>
  bigIcon_gt?: InputMaybe<Scalars['String']>
  bigIcon_gte?: InputMaybe<Scalars['String']>
  bigIcon_in?: InputMaybe<Array<Scalars['String']>>
  bigIcon_isNull?: InputMaybe<Scalars['Boolean']>
  bigIcon_lt?: InputMaybe<Scalars['String']>
  bigIcon_lte?: InputMaybe<Scalars['String']>
  bigIcon_not_contains?: InputMaybe<Scalars['String']>
  bigIcon_not_containsInsensitive?: InputMaybe<Scalars['String']>
  bigIcon_not_endsWith?: InputMaybe<Scalars['String']>
  bigIcon_not_eq?: InputMaybe<Scalars['String']>
  bigIcon_not_in?: InputMaybe<Array<Scalars['String']>>
  bigIcon_not_startsWith?: InputMaybe<Scalars['String']>
  bigIcon_startsWith?: InputMaybe<Scalars['String']>
  category_contains?: InputMaybe<Scalars['String']>
  category_containsInsensitive?: InputMaybe<Scalars['String']>
  category_endsWith?: InputMaybe<Scalars['String']>
  category_eq?: InputMaybe<Scalars['String']>
  category_gt?: InputMaybe<Scalars['String']>
  category_gte?: InputMaybe<Scalars['String']>
  category_in?: InputMaybe<Array<Scalars['String']>>
  category_isNull?: InputMaybe<Scalars['Boolean']>
  category_lt?: InputMaybe<Scalars['String']>
  category_lte?: InputMaybe<Scalars['String']>
  category_not_contains?: InputMaybe<Scalars['String']>
  category_not_containsInsensitive?: InputMaybe<Scalars['String']>
  category_not_endsWith?: InputMaybe<Scalars['String']>
  category_not_eq?: InputMaybe<Scalars['String']>
  category_not_in?: InputMaybe<Array<Scalars['String']>>
  category_not_startsWith?: InputMaybe<Scalars['String']>
  category_startsWith?: InputMaybe<Scalars['String']>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  mediumIcon_contains?: InputMaybe<Scalars['String']>
  mediumIcon_containsInsensitive?: InputMaybe<Scalars['String']>
  mediumIcon_endsWith?: InputMaybe<Scalars['String']>
  mediumIcon_eq?: InputMaybe<Scalars['String']>
  mediumIcon_gt?: InputMaybe<Scalars['String']>
  mediumIcon_gte?: InputMaybe<Scalars['String']>
  mediumIcon_in?: InputMaybe<Array<Scalars['String']>>
  mediumIcon_isNull?: InputMaybe<Scalars['Boolean']>
  mediumIcon_lt?: InputMaybe<Scalars['String']>
  mediumIcon_lte?: InputMaybe<Scalars['String']>
  mediumIcon_not_contains?: InputMaybe<Scalars['String']>
  mediumIcon_not_containsInsensitive?: InputMaybe<Scalars['String']>
  mediumIcon_not_endsWith?: InputMaybe<Scalars['String']>
  mediumIcon_not_eq?: InputMaybe<Scalars['String']>
  mediumIcon_not_in?: InputMaybe<Array<Scalars['String']>>
  mediumIcon_not_startsWith?: InputMaybe<Scalars['String']>
  mediumIcon_startsWith?: InputMaybe<Scalars['String']>
  name_contains?: InputMaybe<Scalars['String']>
  name_containsInsensitive?: InputMaybe<Scalars['String']>
  name_endsWith?: InputMaybe<Scalars['String']>
  name_eq?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_isNull?: InputMaybe<Scalars['Boolean']>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>
  name_not_endsWith?: InputMaybe<Scalars['String']>
  name_not_eq?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_startsWith?: InputMaybe<Scalars['String']>
  name_startsWith?: InputMaybe<Scalars['String']>
  oneLiner_contains?: InputMaybe<Scalars['String']>
  oneLiner_containsInsensitive?: InputMaybe<Scalars['String']>
  oneLiner_endsWith?: InputMaybe<Scalars['String']>
  oneLiner_eq?: InputMaybe<Scalars['String']>
  oneLiner_gt?: InputMaybe<Scalars['String']>
  oneLiner_gte?: InputMaybe<Scalars['String']>
  oneLiner_in?: InputMaybe<Array<Scalars['String']>>
  oneLiner_isNull?: InputMaybe<Scalars['Boolean']>
  oneLiner_lt?: InputMaybe<Scalars['String']>
  oneLiner_lte?: InputMaybe<Scalars['String']>
  oneLiner_not_contains?: InputMaybe<Scalars['String']>
  oneLiner_not_containsInsensitive?: InputMaybe<Scalars['String']>
  oneLiner_not_endsWith?: InputMaybe<Scalars['String']>
  oneLiner_not_eq?: InputMaybe<Scalars['String']>
  oneLiner_not_in?: InputMaybe<Array<Scalars['String']>>
  oneLiner_not_startsWith?: InputMaybe<Scalars['String']>
  oneLiner_startsWith?: InputMaybe<Scalars['String']>
  ownerMember?: InputMaybe<MembershipWhereInput>
  ownerMember_isNull?: InputMaybe<Scalars['Boolean']>
  platforms_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  platforms_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  platforms_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  platforms_isNull?: InputMaybe<Scalars['Boolean']>
  smallIcon_contains?: InputMaybe<Scalars['String']>
  smallIcon_containsInsensitive?: InputMaybe<Scalars['String']>
  smallIcon_endsWith?: InputMaybe<Scalars['String']>
  smallIcon_eq?: InputMaybe<Scalars['String']>
  smallIcon_gt?: InputMaybe<Scalars['String']>
  smallIcon_gte?: InputMaybe<Scalars['String']>
  smallIcon_in?: InputMaybe<Array<Scalars['String']>>
  smallIcon_isNull?: InputMaybe<Scalars['Boolean']>
  smallIcon_lt?: InputMaybe<Scalars['String']>
  smallIcon_lte?: InputMaybe<Scalars['String']>
  smallIcon_not_contains?: InputMaybe<Scalars['String']>
  smallIcon_not_containsInsensitive?: InputMaybe<Scalars['String']>
  smallIcon_not_endsWith?: InputMaybe<Scalars['String']>
  smallIcon_not_eq?: InputMaybe<Scalars['String']>
  smallIcon_not_in?: InputMaybe<Array<Scalars['String']>>
  smallIcon_not_startsWith?: InputMaybe<Scalars['String']>
  smallIcon_startsWith?: InputMaybe<Scalars['String']>
  termsOfService_contains?: InputMaybe<Scalars['String']>
  termsOfService_containsInsensitive?: InputMaybe<Scalars['String']>
  termsOfService_endsWith?: InputMaybe<Scalars['String']>
  termsOfService_eq?: InputMaybe<Scalars['String']>
  termsOfService_gt?: InputMaybe<Scalars['String']>
  termsOfService_gte?: InputMaybe<Scalars['String']>
  termsOfService_in?: InputMaybe<Array<Scalars['String']>>
  termsOfService_isNull?: InputMaybe<Scalars['Boolean']>
  termsOfService_lt?: InputMaybe<Scalars['String']>
  termsOfService_lte?: InputMaybe<Scalars['String']>
  termsOfService_not_contains?: InputMaybe<Scalars['String']>
  termsOfService_not_containsInsensitive?: InputMaybe<Scalars['String']>
  termsOfService_not_endsWith?: InputMaybe<Scalars['String']>
  termsOfService_not_eq?: InputMaybe<Scalars['String']>
  termsOfService_not_in?: InputMaybe<Array<Scalars['String']>>
  termsOfService_not_startsWith?: InputMaybe<Scalars['String']>
  termsOfService_startsWith?: InputMaybe<Scalars['String']>
  useUri_contains?: InputMaybe<Scalars['String']>
  useUri_containsInsensitive?: InputMaybe<Scalars['String']>
  useUri_endsWith?: InputMaybe<Scalars['String']>
  useUri_eq?: InputMaybe<Scalars['String']>
  useUri_gt?: InputMaybe<Scalars['String']>
  useUri_gte?: InputMaybe<Scalars['String']>
  useUri_in?: InputMaybe<Array<Scalars['String']>>
  useUri_isNull?: InputMaybe<Scalars['Boolean']>
  useUri_lt?: InputMaybe<Scalars['String']>
  useUri_lte?: InputMaybe<Scalars['String']>
  useUri_not_contains?: InputMaybe<Scalars['String']>
  useUri_not_containsInsensitive?: InputMaybe<Scalars['String']>
  useUri_not_endsWith?: InputMaybe<Scalars['String']>
  useUri_not_eq?: InputMaybe<Scalars['String']>
  useUri_not_in?: InputMaybe<Array<Scalars['String']>>
  useUri_not_startsWith?: InputMaybe<Scalars['String']>
  useUri_startsWith?: InputMaybe<Scalars['String']>
  websiteUrl_contains?: InputMaybe<Scalars['String']>
  websiteUrl_containsInsensitive?: InputMaybe<Scalars['String']>
  websiteUrl_endsWith?: InputMaybe<Scalars['String']>
  websiteUrl_eq?: InputMaybe<Scalars['String']>
  websiteUrl_gt?: InputMaybe<Scalars['String']>
  websiteUrl_gte?: InputMaybe<Scalars['String']>
  websiteUrl_in?: InputMaybe<Array<Scalars['String']>>
  websiteUrl_isNull?: InputMaybe<Scalars['Boolean']>
  websiteUrl_lt?: InputMaybe<Scalars['String']>
  websiteUrl_lte?: InputMaybe<Scalars['String']>
  websiteUrl_not_contains?: InputMaybe<Scalars['String']>
  websiteUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>
  websiteUrl_not_endsWith?: InputMaybe<Scalars['String']>
  websiteUrl_not_eq?: InputMaybe<Scalars['String']>
  websiteUrl_not_in?: InputMaybe<Array<Scalars['String']>>
  websiteUrl_not_startsWith?: InputMaybe<Scalars['String']>
  websiteUrl_startsWith?: InputMaybe<Scalars['String']>
}

export type AppsConnection = {
  __typename?: 'AppsConnection'
  edges: Array<AppEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

/** Represents NFT auction */
export type Auction = {
  __typename?: 'Auction'
  /** The type of auction */
  auctionType: AuctionType
  /** All bids made during this auction */
  bids: Array<Bid>
  /** Price at which the auction gets completed instantly (if any) */
  buyNowPrice?: Maybe<Scalars['BigInt']>
  /** Block when auction ended */
  endedAtBlock?: Maybe<Scalars['Int']>
  /** Unique identifier */
  id: Scalars['String']
  /** Is auction canceled */
  isCanceled: Scalars['Boolean']
  /** Is auction completed */
  isCompleted: Scalars['Boolean']
  /** Auctioned NFT */
  nft: OwnedNft
  /** Auction starting price */
  startingPrice: Scalars['BigInt']
  /** Block when auction starts */
  startsAtBlock: Scalars['Int']
  /** Auction last bid (if exists) */
  topBid?: Maybe<Bid>
  /** Auction participants whitelist */
  whitelistedMembers: Array<AuctionWhitelistedMember>
  /** Member that won this auction */
  winningMember?: Maybe<Membership>
}

/** Represents NFT auction */
export type AuctionBidsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BidOrderByInput>>
  where?: InputMaybe<BidWhereInput>
}

/** Represents NFT auction */
export type AuctionWhitelistedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type AuctionBidCanceledEventData = {
  __typename?: 'AuctionBidCanceledEventData'
  /** The bid that got canceled. */
  bid: Bid
  /** Member that canceled the bid. */
  member: Membership
  /** Nft owner at the time it was being auctioned. */
  nftOwner: NftOwner
}

export type AuctionBidMadeEventData = {
  __typename?: 'AuctionBidMadeEventData'
  /** The bid that was submitted  */
  bid: Bid
  /** Nft owner at the time it was being auctioned. */
  nftOwner: NftOwner
}

export type AuctionCanceledEventData = {
  __typename?: 'AuctionCanceledEventData'
  /** Content actor canceling the auction. */
  actor: ContentActor
  /** Auction that was canceled. */
  auction: Auction
  /** Nft owner at the time the auction was being auctioned. */
  nftOwner: NftOwner
}

export type AuctionEdge = {
  __typename?: 'AuctionEdge'
  cursor: Scalars['String']
  node: Auction
}

export type AuctionLost = {
  __typename?: 'AuctionLost'
  /** Auction type */
  type: AuctionType
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export enum AuctionOrderByInput {
  AuctionTypeBidLockDurationAsc = 'auctionType_bidLockDuration_ASC',
  AuctionTypeBidLockDurationDesc = 'auctionType_bidLockDuration_DESC',
  AuctionTypeDurationAsc = 'auctionType_duration_ASC',
  AuctionTypeDurationDesc = 'auctionType_duration_DESC',
  AuctionTypeExtensionPeriodAsc = 'auctionType_extensionPeriod_ASC',
  AuctionTypeExtensionPeriodDesc = 'auctionType_extensionPeriod_DESC',
  AuctionTypeIsTypeOfAsc = 'auctionType_isTypeOf_ASC',
  AuctionTypeIsTypeOfDesc = 'auctionType_isTypeOf_DESC',
  AuctionTypeMinimalBidStepAsc = 'auctionType_minimalBidStep_ASC',
  AuctionTypeMinimalBidStepDesc = 'auctionType_minimalBidStep_DESC',
  AuctionTypePlannedEndAtBlockAsc = 'auctionType_plannedEndAtBlock_ASC',
  AuctionTypePlannedEndAtBlockDesc = 'auctionType_plannedEndAtBlock_DESC',
  BuyNowPriceAsc = 'buyNowPrice_ASC',
  BuyNowPriceDesc = 'buyNowPrice_DESC',
  EndedAtBlockAsc = 'endedAtBlock_ASC',
  EndedAtBlockDesc = 'endedAtBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsCanceledAsc = 'isCanceled_ASC',
  IsCanceledDesc = 'isCanceled_DESC',
  IsCompletedAsc = 'isCompleted_ASC',
  IsCompletedDesc = 'isCompleted_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  StartingPriceAsc = 'startingPrice_ASC',
  StartingPriceDesc = 'startingPrice_DESC',
  StartsAtBlockAsc = 'startsAtBlock_ASC',
  StartsAtBlockDesc = 'startsAtBlock_DESC',
  TopBidAmountAsc = 'topBid_amount_ASC',
  TopBidAmountDesc = 'topBid_amount_DESC',
  TopBidCreatedAtAsc = 'topBid_createdAt_ASC',
  TopBidCreatedAtDesc = 'topBid_createdAt_DESC',
  TopBidCreatedInBlockAsc = 'topBid_createdInBlock_ASC',
  TopBidCreatedInBlockDesc = 'topBid_createdInBlock_DESC',
  TopBidIdAsc = 'topBid_id_ASC',
  TopBidIdDesc = 'topBid_id_DESC',
  TopBidIndexInBlockAsc = 'topBid_indexInBlock_ASC',
  TopBidIndexInBlockDesc = 'topBid_indexInBlock_DESC',
  TopBidIsCanceledAsc = 'topBid_isCanceled_ASC',
  TopBidIsCanceledDesc = 'topBid_isCanceled_DESC',
  WinningMemberControllerAccountAsc = 'winningMember_controllerAccount_ASC',
  WinningMemberControllerAccountDesc = 'winningMember_controllerAccount_DESC',
  WinningMemberCreatedAtAsc = 'winningMember_createdAt_ASC',
  WinningMemberCreatedAtDesc = 'winningMember_createdAt_DESC',
  WinningMemberHandleRawAsc = 'winningMember_handleRaw_ASC',
  WinningMemberHandleRawDesc = 'winningMember_handleRaw_DESC',
  WinningMemberHandleAsc = 'winningMember_handle_ASC',
  WinningMemberHandleDesc = 'winningMember_handle_DESC',
  WinningMemberIdAsc = 'winningMember_id_ASC',
  WinningMemberIdDesc = 'winningMember_id_DESC',
  WinningMemberTotalChannelsCreatedAsc = 'winningMember_totalChannelsCreated_ASC',
  WinningMemberTotalChannelsCreatedDesc = 'winningMember_totalChannelsCreated_DESC',
}

/** Represents various action types */
export type AuctionType = AuctionTypeEnglish | AuctionTypeOpen

/** Represents English auction details */
export type AuctionTypeEnglish = {
  __typename?: 'AuctionTypeEnglish'
  /** English auction duration in blocks */
  duration: Scalars['Int']
  /** Auction extension period in blocks */
  extensionPeriod: Scalars['Int']
  /** Minimal step between auction bids */
  minimalBidStep: Scalars['BigInt']
  /** Block when auction is supposed to end */
  plannedEndAtBlock: Scalars['Int']
}

/** Represents Open auction details */
export type AuctionTypeOpen = {
  __typename?: 'AuctionTypeOpen'
  /** Auction bid lock duration */
  bidLockDuration: Scalars['Int']
}

export type AuctionTypeWhereInput = {
  bidLockDuration_eq?: InputMaybe<Scalars['Int']>
  bidLockDuration_gt?: InputMaybe<Scalars['Int']>
  bidLockDuration_gte?: InputMaybe<Scalars['Int']>
  bidLockDuration_in?: InputMaybe<Array<Scalars['Int']>>
  bidLockDuration_isNull?: InputMaybe<Scalars['Boolean']>
  bidLockDuration_lt?: InputMaybe<Scalars['Int']>
  bidLockDuration_lte?: InputMaybe<Scalars['Int']>
  bidLockDuration_not_eq?: InputMaybe<Scalars['Int']>
  bidLockDuration_not_in?: InputMaybe<Array<Scalars['Int']>>
  duration_eq?: InputMaybe<Scalars['Int']>
  duration_gt?: InputMaybe<Scalars['Int']>
  duration_gte?: InputMaybe<Scalars['Int']>
  duration_in?: InputMaybe<Array<Scalars['Int']>>
  duration_isNull?: InputMaybe<Scalars['Boolean']>
  duration_lt?: InputMaybe<Scalars['Int']>
  duration_lte?: InputMaybe<Scalars['Int']>
  duration_not_eq?: InputMaybe<Scalars['Int']>
  duration_not_in?: InputMaybe<Array<Scalars['Int']>>
  extensionPeriod_eq?: InputMaybe<Scalars['Int']>
  extensionPeriod_gt?: InputMaybe<Scalars['Int']>
  extensionPeriod_gte?: InputMaybe<Scalars['Int']>
  extensionPeriod_in?: InputMaybe<Array<Scalars['Int']>>
  extensionPeriod_isNull?: InputMaybe<Scalars['Boolean']>
  extensionPeriod_lt?: InputMaybe<Scalars['Int']>
  extensionPeriod_lte?: InputMaybe<Scalars['Int']>
  extensionPeriod_not_eq?: InputMaybe<Scalars['Int']>
  extensionPeriod_not_in?: InputMaybe<Array<Scalars['Int']>>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  minimalBidStep_eq?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_gt?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_gte?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_in?: InputMaybe<Array<Scalars['BigInt']>>
  minimalBidStep_isNull?: InputMaybe<Scalars['Boolean']>
  minimalBidStep_lt?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_lte?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_not_eq?: InputMaybe<Scalars['BigInt']>
  minimalBidStep_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  plannedEndAtBlock_eq?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_gt?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_gte?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_in?: InputMaybe<Array<Scalars['Int']>>
  plannedEndAtBlock_isNull?: InputMaybe<Scalars['Boolean']>
  plannedEndAtBlock_lt?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_lte?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_not_eq?: InputMaybe<Scalars['Int']>
  plannedEndAtBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export type AuctionWhereInput = {
  AND?: InputMaybe<Array<AuctionWhereInput>>
  OR?: InputMaybe<Array<AuctionWhereInput>>
  auctionType?: InputMaybe<AuctionTypeWhereInput>
  auctionType_isNull?: InputMaybe<Scalars['Boolean']>
  bids_every?: InputMaybe<BidWhereInput>
  bids_none?: InputMaybe<BidWhereInput>
  bids_some?: InputMaybe<BidWhereInput>
  buyNowPrice_eq?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_gt?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_gte?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  buyNowPrice_isNull?: InputMaybe<Scalars['Boolean']>
  buyNowPrice_lt?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_lte?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  buyNowPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  endedAtBlock_eq?: InputMaybe<Scalars['Int']>
  endedAtBlock_gt?: InputMaybe<Scalars['Int']>
  endedAtBlock_gte?: InputMaybe<Scalars['Int']>
  endedAtBlock_in?: InputMaybe<Array<Scalars['Int']>>
  endedAtBlock_isNull?: InputMaybe<Scalars['Boolean']>
  endedAtBlock_lt?: InputMaybe<Scalars['Int']>
  endedAtBlock_lte?: InputMaybe<Scalars['Int']>
  endedAtBlock_not_eq?: InputMaybe<Scalars['Int']>
  endedAtBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isCanceled_eq?: InputMaybe<Scalars['Boolean']>
  isCanceled_isNull?: InputMaybe<Scalars['Boolean']>
  isCanceled_not_eq?: InputMaybe<Scalars['Boolean']>
  isCompleted_eq?: InputMaybe<Scalars['Boolean']>
  isCompleted_isNull?: InputMaybe<Scalars['Boolean']>
  isCompleted_not_eq?: InputMaybe<Scalars['Boolean']>
  nft?: InputMaybe<OwnedNftWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']>
  startingPrice_eq?: InputMaybe<Scalars['BigInt']>
  startingPrice_gt?: InputMaybe<Scalars['BigInt']>
  startingPrice_gte?: InputMaybe<Scalars['BigInt']>
  startingPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  startingPrice_isNull?: InputMaybe<Scalars['Boolean']>
  startingPrice_lt?: InputMaybe<Scalars['BigInt']>
  startingPrice_lte?: InputMaybe<Scalars['BigInt']>
  startingPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  startingPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  startsAtBlock_eq?: InputMaybe<Scalars['Int']>
  startsAtBlock_gt?: InputMaybe<Scalars['Int']>
  startsAtBlock_gte?: InputMaybe<Scalars['Int']>
  startsAtBlock_in?: InputMaybe<Array<Scalars['Int']>>
  startsAtBlock_isNull?: InputMaybe<Scalars['Boolean']>
  startsAtBlock_lt?: InputMaybe<Scalars['Int']>
  startsAtBlock_lte?: InputMaybe<Scalars['Int']>
  startsAtBlock_not_eq?: InputMaybe<Scalars['Int']>
  startsAtBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  topBid?: InputMaybe<BidWhereInput>
  topBid_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistedMembers_every?: InputMaybe<AuctionWhitelistedMemberWhereInput>
  whitelistedMembers_none?: InputMaybe<AuctionWhitelistedMemberWhereInput>
  whitelistedMembers_some?: InputMaybe<AuctionWhitelistedMemberWhereInput>
  winningMember?: InputMaybe<MembershipWhereInput>
  winningMember_isNull?: InputMaybe<Scalars['Boolean']>
}

export type AuctionWhitelistedMember = {
  __typename?: 'AuctionWhitelistedMember'
  auction: Auction
  /** {auctionId}-{memberId} */
  id: Scalars['String']
  member: Membership
}

export type AuctionWhitelistedMemberEdge = {
  __typename?: 'AuctionWhitelistedMemberEdge'
  cursor: Scalars['String']
  node: AuctionWhitelistedMember
}

export enum AuctionWhitelistedMemberOrderByInput {
  AuctionBuyNowPriceAsc = 'auction_buyNowPrice_ASC',
  AuctionBuyNowPriceDesc = 'auction_buyNowPrice_DESC',
  AuctionEndedAtBlockAsc = 'auction_endedAtBlock_ASC',
  AuctionEndedAtBlockDesc = 'auction_endedAtBlock_DESC',
  AuctionIdAsc = 'auction_id_ASC',
  AuctionIdDesc = 'auction_id_DESC',
  AuctionIsCanceledAsc = 'auction_isCanceled_ASC',
  AuctionIsCanceledDesc = 'auction_isCanceled_DESC',
  AuctionIsCompletedAsc = 'auction_isCompleted_ASC',
  AuctionIsCompletedDesc = 'auction_isCompleted_DESC',
  AuctionStartingPriceAsc = 'auction_startingPrice_ASC',
  AuctionStartingPriceDesc = 'auction_startingPrice_DESC',
  AuctionStartsAtBlockAsc = 'auction_startsAtBlock_ASC',
  AuctionStartsAtBlockDesc = 'auction_startsAtBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type AuctionWhitelistedMemberWhereInput = {
  AND?: InputMaybe<Array<AuctionWhitelistedMemberWhereInput>>
  OR?: InputMaybe<Array<AuctionWhitelistedMemberWhereInput>>
  auction?: InputMaybe<AuctionWhereInput>
  auction_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
}

export type AuctionWhitelistedMembersConnection = {
  __typename?: 'AuctionWhitelistedMembersConnection'
  edges: Array<AuctionWhitelistedMemberEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type AuctionWon = {
  __typename?: 'AuctionWon'
  /** Auction type */
  type: AuctionType
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type AuctionsConnection = {
  __typename?: 'AuctionsConnection'
  edges: Array<AuctionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Avatar = AvatarObject | AvatarUri

export type AvatarObject = {
  __typename?: 'AvatarObject'
  /** The avatar data object */
  avatarObject: StorageDataObject
}

export type AvatarUri = {
  __typename?: 'AvatarUri'
  /** The avatar URL */
  avatarUri: Scalars['String']
}

export type AvatarWhereInput = {
  avatarObject?: InputMaybe<StorageDataObjectWhereInput>
  avatarObject_isNull?: InputMaybe<Scalars['Boolean']>
  avatarUri_contains?: InputMaybe<Scalars['String']>
  avatarUri_containsInsensitive?: InputMaybe<Scalars['String']>
  avatarUri_endsWith?: InputMaybe<Scalars['String']>
  avatarUri_eq?: InputMaybe<Scalars['String']>
  avatarUri_gt?: InputMaybe<Scalars['String']>
  avatarUri_gte?: InputMaybe<Scalars['String']>
  avatarUri_in?: InputMaybe<Array<Scalars['String']>>
  avatarUri_isNull?: InputMaybe<Scalars['Boolean']>
  avatarUri_lt?: InputMaybe<Scalars['String']>
  avatarUri_lte?: InputMaybe<Scalars['String']>
  avatarUri_not_contains?: InputMaybe<Scalars['String']>
  avatarUri_not_containsInsensitive?: InputMaybe<Scalars['String']>
  avatarUri_not_endsWith?: InputMaybe<Scalars['String']>
  avatarUri_not_eq?: InputMaybe<Scalars['String']>
  avatarUri_not_in?: InputMaybe<Array<Scalars['String']>>
  avatarUri_not_startsWith?: InputMaybe<Scalars['String']>
  avatarUri_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
}

export type BannedMember = {
  __typename?: 'BannedMember'
  channel: Channel
  /** {memberId}-{channelId} */
  id: Scalars['String']
  member: Membership
}

export type BannedMemberEdge = {
  __typename?: 'BannedMemberEdge'
  cursor: Scalars['String']
  node: BannedMember
}

export enum BannedMemberOrderByInput {
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelChannelWeightAsc = 'channel_channelWeight_ASC',
  ChannelChannelWeightDesc = 'channel_channelWeight_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRevenueAsc = 'channel_cumulativeRevenue_ASC',
  ChannelCumulativeRevenueDesc = 'channel_cumulativeRevenue_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelCumulativeRewardAsc = 'channel_cumulativeReward_ASC',
  ChannelCumulativeRewardDesc = 'channel_cumulativeReward_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRevenueShareRatioPercentAsc = 'channel_revenueShareRatioPercent_ASC',
  ChannelRevenueShareRatioPercentDesc = 'channel_revenueShareRatioPercent_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type BannedMemberWhereInput = {
  AND?: InputMaybe<Array<BannedMemberWhereInput>>
  OR?: InputMaybe<Array<BannedMemberWhereInput>>
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
}

export type BannedMembersConnection = {
  __typename?: 'BannedMembersConnection'
  edges: Array<BannedMemberEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Benefit = {
  __typename?: 'Benefit'
  /** description for the benefit */
  description: Scalars['String']
  /** order in which the benefits is displayed */
  displayOrder: Scalars['Int']
  /** emoji for the benefit */
  emojiCode?: Maybe<Scalars['String']>
  /** counter */
  id: Scalars['String']
  /** title for the benefit */
  title: Scalars['String']
  /** token the benefit is for */
  token: CreatorToken
}

export type BenefitEdge = {
  __typename?: 'BenefitEdge'
  cursor: Scalars['String']
  node: Benefit
}

export enum BenefitOrderByInput {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  DisplayOrderAsc = 'displayOrder_ASC',
  DisplayOrderDesc = 'displayOrder_DESC',
  EmojiCodeAsc = 'emojiCode_ASC',
  EmojiCodeDesc = 'emojiCode_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
}

export type BenefitWhereInput = {
  AND?: InputMaybe<Array<BenefitWhereInput>>
  OR?: InputMaybe<Array<BenefitWhereInput>>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  displayOrder_eq?: InputMaybe<Scalars['Int']>
  displayOrder_gt?: InputMaybe<Scalars['Int']>
  displayOrder_gte?: InputMaybe<Scalars['Int']>
  displayOrder_in?: InputMaybe<Array<Scalars['Int']>>
  displayOrder_isNull?: InputMaybe<Scalars['Boolean']>
  displayOrder_lt?: InputMaybe<Scalars['Int']>
  displayOrder_lte?: InputMaybe<Scalars['Int']>
  displayOrder_not_eq?: InputMaybe<Scalars['Int']>
  displayOrder_not_in?: InputMaybe<Array<Scalars['Int']>>
  emojiCode_contains?: InputMaybe<Scalars['String']>
  emojiCode_containsInsensitive?: InputMaybe<Scalars['String']>
  emojiCode_endsWith?: InputMaybe<Scalars['String']>
  emojiCode_eq?: InputMaybe<Scalars['String']>
  emojiCode_gt?: InputMaybe<Scalars['String']>
  emojiCode_gte?: InputMaybe<Scalars['String']>
  emojiCode_in?: InputMaybe<Array<Scalars['String']>>
  emojiCode_isNull?: InputMaybe<Scalars['Boolean']>
  emojiCode_lt?: InputMaybe<Scalars['String']>
  emojiCode_lte?: InputMaybe<Scalars['String']>
  emojiCode_not_contains?: InputMaybe<Scalars['String']>
  emojiCode_not_containsInsensitive?: InputMaybe<Scalars['String']>
  emojiCode_not_endsWith?: InputMaybe<Scalars['String']>
  emojiCode_not_eq?: InputMaybe<Scalars['String']>
  emojiCode_not_in?: InputMaybe<Array<Scalars['String']>>
  emojiCode_not_startsWith?: InputMaybe<Scalars['String']>
  emojiCode_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_containsInsensitive?: InputMaybe<Scalars['String']>
  title_endsWith?: InputMaybe<Scalars['String']>
  title_eq?: InputMaybe<Scalars['String']>
  title_gt?: InputMaybe<Scalars['String']>
  title_gte?: InputMaybe<Scalars['String']>
  title_in?: InputMaybe<Array<Scalars['String']>>
  title_isNull?: InputMaybe<Scalars['Boolean']>
  title_lt?: InputMaybe<Scalars['String']>
  title_lte?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_containsInsensitive?: InputMaybe<Scalars['String']>
  title_not_endsWith?: InputMaybe<Scalars['String']>
  title_not_eq?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  title_not_startsWith?: InputMaybe<Scalars['String']>
  title_startsWith?: InputMaybe<Scalars['String']>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
}

export type BenefitsConnection = {
  __typename?: 'BenefitsConnection'
  edges: Array<BenefitEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

/** Represents bid in NFT auction */
export type Bid = {
  __typename?: 'Bid'
  /** Amount bidded */
  amount: Scalars['BigInt']
  /** NFT's auction */
  auction: Auction
  /** Bidder membership */
  bidder: Membership
  /** Timestamp of the block the bid was created at */
  createdAt: Scalars['DateTime']
  /** Block in which the bid was placed */
  createdInBlock: Scalars['Int']
  /** Unique identifier */
  id: Scalars['String']
  /** Index in block of the related AuctionBidMade event */
  indexInBlock: Scalars['Int']
  /** Sign for canceled bid */
  isCanceled: Scalars['Boolean']
  /** Bid's NFT */
  nft: OwnedNft
  /** Bid that was displaced by this bid in the English auction (if any) */
  previousTopBid?: Maybe<Bid>
}

export type BidEdge = {
  __typename?: 'BidEdge'
  cursor: Scalars['String']
  node: Bid
}

export type BidMadeCompletingAuctionEventData = {
  __typename?: 'BidMadeCompletingAuctionEventData'
  /** NFT owner before the auction was completed */
  previousNftOwner: NftOwner
  /** Bid that completed the auction */
  winningBid: Bid
}

export enum BidOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  AuctionBuyNowPriceAsc = 'auction_buyNowPrice_ASC',
  AuctionBuyNowPriceDesc = 'auction_buyNowPrice_DESC',
  AuctionEndedAtBlockAsc = 'auction_endedAtBlock_ASC',
  AuctionEndedAtBlockDesc = 'auction_endedAtBlock_DESC',
  AuctionIdAsc = 'auction_id_ASC',
  AuctionIdDesc = 'auction_id_DESC',
  AuctionIsCanceledAsc = 'auction_isCanceled_ASC',
  AuctionIsCanceledDesc = 'auction_isCanceled_DESC',
  AuctionIsCompletedAsc = 'auction_isCompleted_ASC',
  AuctionIsCompletedDesc = 'auction_isCompleted_DESC',
  AuctionStartingPriceAsc = 'auction_startingPrice_ASC',
  AuctionStartingPriceDesc = 'auction_startingPrice_DESC',
  AuctionStartsAtBlockAsc = 'auction_startsAtBlock_ASC',
  AuctionStartsAtBlockDesc = 'auction_startsAtBlock_DESC',
  BidderControllerAccountAsc = 'bidder_controllerAccount_ASC',
  BidderControllerAccountDesc = 'bidder_controllerAccount_DESC',
  BidderCreatedAtAsc = 'bidder_createdAt_ASC',
  BidderCreatedAtDesc = 'bidder_createdAt_DESC',
  BidderHandleRawAsc = 'bidder_handleRaw_ASC',
  BidderHandleRawDesc = 'bidder_handleRaw_DESC',
  BidderHandleAsc = 'bidder_handle_ASC',
  BidderHandleDesc = 'bidder_handle_DESC',
  BidderIdAsc = 'bidder_id_ASC',
  BidderIdDesc = 'bidder_id_DESC',
  BidderTotalChannelsCreatedAsc = 'bidder_totalChannelsCreated_ASC',
  BidderTotalChannelsCreatedDesc = 'bidder_totalChannelsCreated_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  IsCanceledAsc = 'isCanceled_ASC',
  IsCanceledDesc = 'isCanceled_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  PreviousTopBidAmountAsc = 'previousTopBid_amount_ASC',
  PreviousTopBidAmountDesc = 'previousTopBid_amount_DESC',
  PreviousTopBidCreatedAtAsc = 'previousTopBid_createdAt_ASC',
  PreviousTopBidCreatedAtDesc = 'previousTopBid_createdAt_DESC',
  PreviousTopBidCreatedInBlockAsc = 'previousTopBid_createdInBlock_ASC',
  PreviousTopBidCreatedInBlockDesc = 'previousTopBid_createdInBlock_DESC',
  PreviousTopBidIdAsc = 'previousTopBid_id_ASC',
  PreviousTopBidIdDesc = 'previousTopBid_id_DESC',
  PreviousTopBidIndexInBlockAsc = 'previousTopBid_indexInBlock_ASC',
  PreviousTopBidIndexInBlockDesc = 'previousTopBid_indexInBlock_DESC',
  PreviousTopBidIsCanceledAsc = 'previousTopBid_isCanceled_ASC',
  PreviousTopBidIsCanceledDesc = 'previousTopBid_isCanceled_DESC',
}

export type BidWhereInput = {
  AND?: InputMaybe<Array<BidWhereInput>>
  OR?: InputMaybe<Array<BidWhereInput>>
  amount_eq?: InputMaybe<Scalars['BigInt']>
  amount_gt?: InputMaybe<Scalars['BigInt']>
  amount_gte?: InputMaybe<Scalars['BigInt']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>
  amount_isNull?: InputMaybe<Scalars['Boolean']>
  amount_lt?: InputMaybe<Scalars['BigInt']>
  amount_lte?: InputMaybe<Scalars['BigInt']>
  amount_not_eq?: InputMaybe<Scalars['BigInt']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  auction?: InputMaybe<AuctionWhereInput>
  auction_isNull?: InputMaybe<Scalars['Boolean']>
  bidder?: InputMaybe<MembershipWhereInput>
  bidder_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  createdInBlock_not_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  indexInBlock_eq?: InputMaybe<Scalars['Int']>
  indexInBlock_gt?: InputMaybe<Scalars['Int']>
  indexInBlock_gte?: InputMaybe<Scalars['Int']>
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  indexInBlock_lt?: InputMaybe<Scalars['Int']>
  indexInBlock_lte?: InputMaybe<Scalars['Int']>
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  isCanceled_eq?: InputMaybe<Scalars['Boolean']>
  isCanceled_isNull?: InputMaybe<Scalars['Boolean']>
  isCanceled_not_eq?: InputMaybe<Scalars['Boolean']>
  nft?: InputMaybe<OwnedNftWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']>
  previousTopBid?: InputMaybe<BidWhereInput>
  previousTopBid_isNull?: InputMaybe<Scalars['Boolean']>
}

export type BidsConnection = {
  __typename?: 'BidsConnection'
  edges: Array<BidEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type BuyNowCanceledEventData = {
  __typename?: 'BuyNowCanceledEventData'
  /** Content actor acting as NFT owner. */
  actor: ContentActor
  /** The NFT for which the buy now offer was canceled */
  nft: OwnedNft
  /** Owner of the NFT at the time the buy now offer was canceled. */
  nftOwner: NftOwner
}

export type BuyNowPriceUpdatedEventData = {
  __typename?: 'BuyNowPriceUpdatedEventData'
  /** Content actor acting as NFT owner. */
  actor: ContentActor
  /** New sell order price. */
  newPrice: Scalars['BigInt']
  /** NFT being sold */
  nft: OwnedNft
  /** NFT owner at the time it was on sale */
  nftOwner: NftOwner
}

export type Channel = {
  __typename?: 'Channel'
  /** Channel's avatar photo asset. */
  avatarPhoto?: Maybe<StorageDataObject>
  /** List of members blocked from commenting/reacting on any video of the channel. */
  bannedMembers: Array<BannedMember>
  /** Value of channel state bloat bond fee paid by channel creator */
  channelStateBloatBond: Scalars['BigInt']
  /** Weight/Bias of the channel affecting video relevance in the Homepage */
  channelWeight?: Maybe<Scalars['Float']>
  /** Channel's cover (background) photo asset. Recommended ratio: 16:9. */
  coverPhoto?: Maybe<StorageDataObject>
  /** Timestamp of the block the channel was created at */
  createdAt: Scalars['DateTime']
  /** Number of the block the channel was created in */
  createdInBlock: Scalars['Int']
  /** Token issued by channel if any */
  creatorToken?: Maybe<TokenChannel>
  /** Cumulative total revenue coming from nft sales + member payments + council payouts */
  cumulativeRevenue: Scalars['BigInt']
  /** Cumulative rewards paid to this channel */
  cumulativeReward: Scalars['BigInt']
  /** Cumulative rewards claimed by this channel */
  cumulativeRewardClaimed: Scalars['BigInt']
  /** The description of a Channel */
  description?: Maybe<Scalars['String']>
  /** Application used for channel creation */
  entryApp?: Maybe<App>
  /** Number of active follows (to speed up orderBy queries by avoiding COUNT aggregation) */
  followsNum: Scalars['Int']
  /** Runtime entity identifier (EntityId) */
  id: Scalars['String']
  /** Flag signaling whether a channel is censored. */
  isCensored: Scalars['Boolean']
  /** Whether a channel has been excluded/hidden (by the gateway operator) */
  isExcluded: Scalars['Boolean']
  /** Flag signaling whether a channel is public. */
  isPublic?: Maybe<Scalars['Boolean']>
  /** The primary langauge of the channel's content */
  language?: Maybe<Scalars['String']>
  /** Current member-owner of the channel (if owned by a member) */
  ownerMember?: Maybe<Membership>
  /** % of channel balance that the creator devotes to revenue shares */
  revenueShareRatioPercent?: Maybe<Scalars['Int']>
  /** Channel's reward account, storing the income from the nft sales and channel payouts. */
  rewardAccount: Scalars['String']
  /** The title of the Channel */
  title?: Maybe<Scalars['String']>
  /** Number of videos ever created in this channel */
  totalVideosCreated: Scalars['Int']
  /** Number of total video views (to speed up orderBy queries by avoiding COUNT aggregation) */
  videoViewsNum: Scalars['Int']
  /** List of videos that belong to the channel */
  videos: Array<Video>
  /** Channel Ypp Status: either unverified , verified or suspended */
  yppStatus: ChannelYppStatus
}

export type ChannelBannedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BannedMemberOrderByInput>>
  where?: InputMaybe<BannedMemberWhereInput>
}

export type ChannelVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type ChannelAssetsDeletedByModeratorEventData = {
  __typename?: 'ChannelAssetsDeletedByModeratorEventData'
  /** IDs of channel assets being deleted by moderator */
  assetIds?: Maybe<Array<Scalars['BigInt']>>
  /** Channel whose assets were deleted */
  channel: Channel
  /** Actor who deleted the channel assets. */
  deletedBy: ContentActor
  /** why the channel assets were deleted */
  rationale: Scalars['String']
}

export type ChannelCreated = {
  __typename?: 'ChannelCreated'
  /** id for link construction */
  channelId: Scalars['String']
  /** title for link construction */
  channelTitle: Scalars['String']
}

export type ChannelCreatedEventData = {
  __typename?: 'ChannelCreatedEventData'
  /** channel just created */
  channel: Channel
}

export type ChannelEdge = {
  __typename?: 'ChannelEdge'
  cursor: Scalars['String']
  node: Channel
}

export type ChannelExcluded = {
  __typename?: 'ChannelExcluded'
  /** title for the channel used for notification text */
  channelTitle: Scalars['String']
}

export type ChannelFollow = {
  __typename?: 'ChannelFollow'
  /** ID of the channel being followed (the channel may no longer exist) */
  channelId: Scalars['String']
  /** Unique identifier of the follow */
  id: Scalars['String']
  /** Time when user started following the channel */
  timestamp: Scalars['DateTime']
  /** User that followed the channel */
  user: User
}

export type ChannelFollowEdge = {
  __typename?: 'ChannelFollowEdge'
  cursor: Scalars['String']
  node: ChannelFollow
}

export enum ChannelFollowOrderByInput {
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
}

export type ChannelFollowResult = {
  __typename?: 'ChannelFollowResult'
  added: Scalars['Boolean']
  channelId: Scalars['String']
  followId: Scalars['String']
  follows: Scalars['Int']
}

export type ChannelFollowWhereInput = {
  AND?: InputMaybe<Array<ChannelFollowWhereInput>>
  OR?: InputMaybe<Array<ChannelFollowWhereInput>>
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
}

export type ChannelFollowsConnection = {
  __typename?: 'ChannelFollowsConnection'
  edges: Array<ChannelFollowEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelFundsWithdrawn = {
  __typename?: 'ChannelFundsWithdrawn'
  /** amount */
  amount: Scalars['BigInt']
}

export type ChannelFundsWithdrawnEventData = {
  __typename?: 'ChannelFundsWithdrawnEventData'
  /** Destination account ID. Null if claimed by curators' channel (paid to council budget in this case) */
  account?: Maybe<Scalars['String']>
  /** Content actor */
  actor: ContentActor
  /** Reward amount claimed */
  amount: Scalars['BigInt']
  /** The channel that claimed the reward */
  channel: Channel
}

export type ChannelNftCollector = {
  __typename?: 'ChannelNftCollector'
  amount: Scalars['Int']
  member: Membership
}

export enum ChannelNftCollectorsOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
}

export enum ChannelOrderByInput {
  AvatarPhotoCreatedAtAsc = 'avatarPhoto_createdAt_ASC',
  AvatarPhotoCreatedAtDesc = 'avatarPhoto_createdAt_DESC',
  AvatarPhotoIdAsc = 'avatarPhoto_id_ASC',
  AvatarPhotoIdDesc = 'avatarPhoto_id_DESC',
  AvatarPhotoIpfsHashAsc = 'avatarPhoto_ipfsHash_ASC',
  AvatarPhotoIpfsHashDesc = 'avatarPhoto_ipfsHash_DESC',
  AvatarPhotoIsAcceptedAsc = 'avatarPhoto_isAccepted_ASC',
  AvatarPhotoIsAcceptedDesc = 'avatarPhoto_isAccepted_DESC',
  AvatarPhotoSizeAsc = 'avatarPhoto_size_ASC',
  AvatarPhotoSizeDesc = 'avatarPhoto_size_DESC',
  AvatarPhotoStateBloatBondAsc = 'avatarPhoto_stateBloatBond_ASC',
  AvatarPhotoStateBloatBondDesc = 'avatarPhoto_stateBloatBond_DESC',
  AvatarPhotoUnsetAtAsc = 'avatarPhoto_unsetAt_ASC',
  AvatarPhotoUnsetAtDesc = 'avatarPhoto_unsetAt_DESC',
  ChannelStateBloatBondAsc = 'channelStateBloatBond_ASC',
  ChannelStateBloatBondDesc = 'channelStateBloatBond_DESC',
  ChannelWeightAsc = 'channelWeight_ASC',
  ChannelWeightDesc = 'channelWeight_DESC',
  CoverPhotoCreatedAtAsc = 'coverPhoto_createdAt_ASC',
  CoverPhotoCreatedAtDesc = 'coverPhoto_createdAt_DESC',
  CoverPhotoIdAsc = 'coverPhoto_id_ASC',
  CoverPhotoIdDesc = 'coverPhoto_id_DESC',
  CoverPhotoIpfsHashAsc = 'coverPhoto_ipfsHash_ASC',
  CoverPhotoIpfsHashDesc = 'coverPhoto_ipfsHash_DESC',
  CoverPhotoIsAcceptedAsc = 'coverPhoto_isAccepted_ASC',
  CoverPhotoIsAcceptedDesc = 'coverPhoto_isAccepted_DESC',
  CoverPhotoSizeAsc = 'coverPhoto_size_ASC',
  CoverPhotoSizeDesc = 'coverPhoto_size_DESC',
  CoverPhotoStateBloatBondAsc = 'coverPhoto_stateBloatBond_ASC',
  CoverPhotoStateBloatBondDesc = 'coverPhoto_stateBloatBond_DESC',
  CoverPhotoUnsetAtAsc = 'coverPhoto_unsetAt_ASC',
  CoverPhotoUnsetAtDesc = 'coverPhoto_unsetAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  CreatorTokenIdAsc = 'creatorToken_id_ASC',
  CreatorTokenIdDesc = 'creatorToken_id_DESC',
  CumulativeRevenueAsc = 'cumulativeRevenue_ASC',
  CumulativeRevenueDesc = 'cumulativeRevenue_DESC',
  CumulativeRewardClaimedAsc = 'cumulativeRewardClaimed_ASC',
  CumulativeRewardClaimedDesc = 'cumulativeRewardClaimed_DESC',
  CumulativeRewardAsc = 'cumulativeReward_ASC',
  CumulativeRewardDesc = 'cumulativeReward_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  EntryAppAuthKeyAsc = 'entryApp_authKey_ASC',
  EntryAppAuthKeyDesc = 'entryApp_authKey_DESC',
  EntryAppBigIconAsc = 'entryApp_bigIcon_ASC',
  EntryAppBigIconDesc = 'entryApp_bigIcon_DESC',
  EntryAppCategoryAsc = 'entryApp_category_ASC',
  EntryAppCategoryDesc = 'entryApp_category_DESC',
  EntryAppDescriptionAsc = 'entryApp_description_ASC',
  EntryAppDescriptionDesc = 'entryApp_description_DESC',
  EntryAppIdAsc = 'entryApp_id_ASC',
  EntryAppIdDesc = 'entryApp_id_DESC',
  EntryAppMediumIconAsc = 'entryApp_mediumIcon_ASC',
  EntryAppMediumIconDesc = 'entryApp_mediumIcon_DESC',
  EntryAppNameAsc = 'entryApp_name_ASC',
  EntryAppNameDesc = 'entryApp_name_DESC',
  EntryAppOneLinerAsc = 'entryApp_oneLiner_ASC',
  EntryAppOneLinerDesc = 'entryApp_oneLiner_DESC',
  EntryAppSmallIconAsc = 'entryApp_smallIcon_ASC',
  EntryAppSmallIconDesc = 'entryApp_smallIcon_DESC',
  EntryAppTermsOfServiceAsc = 'entryApp_termsOfService_ASC',
  EntryAppTermsOfServiceDesc = 'entryApp_termsOfService_DESC',
  EntryAppUseUriAsc = 'entryApp_useUri_ASC',
  EntryAppUseUriDesc = 'entryApp_useUri_DESC',
  EntryAppWebsiteUrlAsc = 'entryApp_websiteUrl_ASC',
  EntryAppWebsiteUrlDesc = 'entryApp_websiteUrl_DESC',
  FollowsNumAsc = 'followsNum_ASC',
  FollowsNumDesc = 'followsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  OwnerMemberControllerAccountAsc = 'ownerMember_controllerAccount_ASC',
  OwnerMemberControllerAccountDesc = 'ownerMember_controllerAccount_DESC',
  OwnerMemberCreatedAtAsc = 'ownerMember_createdAt_ASC',
  OwnerMemberCreatedAtDesc = 'ownerMember_createdAt_DESC',
  OwnerMemberHandleRawAsc = 'ownerMember_handleRaw_ASC',
  OwnerMemberHandleRawDesc = 'ownerMember_handleRaw_DESC',
  OwnerMemberHandleAsc = 'ownerMember_handle_ASC',
  OwnerMemberHandleDesc = 'ownerMember_handle_DESC',
  OwnerMemberIdAsc = 'ownerMember_id_ASC',
  OwnerMemberIdDesc = 'ownerMember_id_DESC',
  OwnerMemberTotalChannelsCreatedAsc = 'ownerMember_totalChannelsCreated_ASC',
  OwnerMemberTotalChannelsCreatedDesc = 'ownerMember_totalChannelsCreated_DESC',
  RevenueShareRatioPercentAsc = 'revenueShareRatioPercent_ASC',
  RevenueShareRatioPercentDesc = 'revenueShareRatioPercent_DESC',
  RewardAccountAsc = 'rewardAccount_ASC',
  RewardAccountDesc = 'rewardAccount_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TotalVideosCreatedAsc = 'totalVideosCreated_ASC',
  TotalVideosCreatedDesc = 'totalVideosCreated_DESC',
  VideoViewsNumAsc = 'videoViewsNum_ASC',
  VideoViewsNumDesc = 'videoViewsNum_DESC',
  YppStatusIsTypeOfAsc = 'yppStatus_isTypeOf_ASC',
  YppStatusIsTypeOfDesc = 'yppStatus_isTypeOf_DESC',
  YppStatusPhantomAsc = 'yppStatus_phantom_ASC',
  YppStatusPhantomDesc = 'yppStatus_phantom_DESC',
}

/** Direct channel payment by any member by-passing the council payouts */
export type ChannelPaymentMadeEventData = {
  __typename?: 'ChannelPaymentMadeEventData'
  /** Amount of the payment */
  amount: Scalars['BigInt']
  /** Channel that received the payment (if any) */
  payeeChannel?: Maybe<Channel>
  /** Actor that made the payment */
  payer: Membership
  /** Payment and payee context */
  paymentContext?: Maybe<PaymentContext>
  /** Reason of the payment */
  rationale?: Maybe<Scalars['String']>
}

export type ChannelPayoutsUpdatedEventData = {
  __typename?: 'ChannelPayoutsUpdatedEventData'
  /** Can channel cashout the rewards */
  channelCashoutsEnabled?: Maybe<Scalars['Boolean']>
  /** Merkle root of the channel payouts */
  commitment?: Maybe<Scalars['String']>
  /** Maximum amount of channel reward cashout allowed at a time */
  maxCashoutAllowed?: Maybe<Scalars['BigInt']>
  /** Minimum amount of channel reward cashout allowed at a time */
  minCashoutAllowed?: Maybe<Scalars['BigInt']>
  /** Storage data object corresponding to the channel payouts payload */
  payloadDataObject?: Maybe<StorageDataObject>
}

export type ChannelRecipient = {
  __typename?: 'ChannelRecipient'
  /** channel */
  channel: Channel
}

export type ChannelReportInfo = {
  __typename?: 'ChannelReportInfo'
  channelId: Scalars['String']
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
}

export type ChannelRewardClaimedAndWithdrawnEventData = {
  __typename?: 'ChannelRewardClaimedAndWithdrawnEventData'
  /** Destination account ID. Null if claimed by curators' channel (paid to council budget in this case) */
  account?: Maybe<Scalars['String']>
  /** Content actor */
  actor: ContentActor
  /** Reward amount claimed */
  amount: Scalars['BigInt']
  /** The channel that claimed the reward */
  channel: Channel
}

export type ChannelRewardClaimedEventData = {
  __typename?: 'ChannelRewardClaimedEventData'
  /** Reward amount claimed */
  amount: Scalars['BigInt']
  /** The channel that claimed the reward */
  channel: Channel
}

export type ChannelSuspended = {
  __typename?: 'ChannelSuspended'
  phantom?: Maybe<Scalars['Int']>
}

export type ChannelSuspension = {
  __typename?: 'ChannelSuspension'
  /** channel suspended */
  channel: Channel
  /** unique Id */
  id: Scalars['String']
  /** timestamp of suspension */
  timestamp: Scalars['DateTime']
}

export type ChannelSuspensionEdge = {
  __typename?: 'ChannelSuspensionEdge'
  cursor: Scalars['String']
  node: ChannelSuspension
}

export enum ChannelSuspensionOrderByInput {
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelChannelWeightAsc = 'channel_channelWeight_ASC',
  ChannelChannelWeightDesc = 'channel_channelWeight_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRevenueAsc = 'channel_cumulativeRevenue_ASC',
  ChannelCumulativeRevenueDesc = 'channel_cumulativeRevenue_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelCumulativeRewardAsc = 'channel_cumulativeReward_ASC',
  ChannelCumulativeRewardDesc = 'channel_cumulativeReward_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRevenueShareRatioPercentAsc = 'channel_revenueShareRatioPercent_ASC',
  ChannelRevenueShareRatioPercentDesc = 'channel_revenueShareRatioPercent_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type ChannelSuspensionWhereInput = {
  AND?: InputMaybe<Array<ChannelSuspensionWhereInput>>
  OR?: InputMaybe<Array<ChannelSuspensionWhereInput>>
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type ChannelSuspensionsConnection = {
  __typename?: 'ChannelSuspensionsConnection'
  edges: Array<ChannelSuspensionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelUnfollowResult = {
  __typename?: 'ChannelUnfollowResult'
  channelId: Scalars['String']
  follows: Scalars['Int']
  removed: Scalars['Boolean']
}

export type ChannelVerification = {
  __typename?: 'ChannelVerification'
  /** channel verified */
  channel: Channel
  /** unique Id */
  id: Scalars['String']
  /** timestamp of verification */
  timestamp: Scalars['DateTime']
}

export type ChannelVerificationEdge = {
  __typename?: 'ChannelVerificationEdge'
  cursor: Scalars['String']
  node: ChannelVerification
}

export enum ChannelVerificationOrderByInput {
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelChannelWeightAsc = 'channel_channelWeight_ASC',
  ChannelChannelWeightDesc = 'channel_channelWeight_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRevenueAsc = 'channel_cumulativeRevenue_ASC',
  ChannelCumulativeRevenueDesc = 'channel_cumulativeRevenue_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelCumulativeRewardAsc = 'channel_cumulativeReward_ASC',
  ChannelCumulativeRewardDesc = 'channel_cumulativeReward_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRevenueShareRatioPercentAsc = 'channel_revenueShareRatioPercent_ASC',
  ChannelRevenueShareRatioPercentDesc = 'channel_revenueShareRatioPercent_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type ChannelVerificationWhereInput = {
  AND?: InputMaybe<Array<ChannelVerificationWhereInput>>
  OR?: InputMaybe<Array<ChannelVerificationWhereInput>>
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type ChannelVerificationsConnection = {
  __typename?: 'ChannelVerificationsConnection'
  edges: Array<ChannelVerificationEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelVerified = {
  __typename?: 'ChannelVerified'
  /** no data needed as recipient is channel */
  phantom?: Maybe<Scalars['Int']>
}

export type ChannelWeight = {
  __typename?: 'ChannelWeight'
  channelId: Scalars['String']
  isApplied: Scalars['Boolean']
}

export type ChannelWeightInput = {
  channelId: Scalars['String']
  weight: Scalars['Float']
}

export type ChannelWhereInput = {
  AND?: InputMaybe<Array<ChannelWhereInput>>
  OR?: InputMaybe<Array<ChannelWhereInput>>
  avatarPhoto?: InputMaybe<StorageDataObjectWhereInput>
  avatarPhoto_isNull?: InputMaybe<Scalars['Boolean']>
  bannedMembers_every?: InputMaybe<BannedMemberWhereInput>
  bannedMembers_none?: InputMaybe<BannedMemberWhereInput>
  bannedMembers_some?: InputMaybe<BannedMemberWhereInput>
  channelStateBloatBond_eq?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_gt?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_gte?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_in?: InputMaybe<Array<Scalars['BigInt']>>
  channelStateBloatBond_isNull?: InputMaybe<Scalars['Boolean']>
  channelStateBloatBond_lt?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_lte?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_not_eq?: InputMaybe<Scalars['BigInt']>
  channelStateBloatBond_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  channelWeight_eq?: InputMaybe<Scalars['Float']>
  channelWeight_gt?: InputMaybe<Scalars['Float']>
  channelWeight_gte?: InputMaybe<Scalars['Float']>
  channelWeight_in?: InputMaybe<Array<Scalars['Float']>>
  channelWeight_isNull?: InputMaybe<Scalars['Boolean']>
  channelWeight_lt?: InputMaybe<Scalars['Float']>
  channelWeight_lte?: InputMaybe<Scalars['Float']>
  channelWeight_not_eq?: InputMaybe<Scalars['Float']>
  channelWeight_not_in?: InputMaybe<Array<Scalars['Float']>>
  coverPhoto?: InputMaybe<StorageDataObjectWhereInput>
  coverPhoto_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  createdInBlock_not_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  creatorToken?: InputMaybe<TokenChannelWhereInput>
  creatorToken_isNull?: InputMaybe<Scalars['Boolean']>
  cumulativeRevenue_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_gt?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_gte?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeRevenue_isNull?: InputMaybe<Scalars['Boolean']>
  cumulativeRevenue_lt?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_lte?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_not_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeRewardClaimed_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_gt?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_gte?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeRewardClaimed_isNull?: InputMaybe<Scalars['Boolean']>
  cumulativeRewardClaimed_lt?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_lte?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_not_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRewardClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeReward_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_gt?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_gte?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeReward_isNull?: InputMaybe<Scalars['Boolean']>
  cumulativeReward_lt?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_lte?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_not_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeReward_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  entryApp?: InputMaybe<AppWhereInput>
  entryApp_isNull?: InputMaybe<Scalars['Boolean']>
  followsNum_eq?: InputMaybe<Scalars['Int']>
  followsNum_gt?: InputMaybe<Scalars['Int']>
  followsNum_gte?: InputMaybe<Scalars['Int']>
  followsNum_in?: InputMaybe<Array<Scalars['Int']>>
  followsNum_isNull?: InputMaybe<Scalars['Boolean']>
  followsNum_lt?: InputMaybe<Scalars['Int']>
  followsNum_lte?: InputMaybe<Scalars['Int']>
  followsNum_not_eq?: InputMaybe<Scalars['Int']>
  followsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isCensored_eq?: InputMaybe<Scalars['Boolean']>
  isCensored_isNull?: InputMaybe<Scalars['Boolean']>
  isCensored_not_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_isNull?: InputMaybe<Scalars['Boolean']>
  isExcluded_not_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_isNull?: InputMaybe<Scalars['Boolean']>
  isPublic_not_eq?: InputMaybe<Scalars['Boolean']>
  language_contains?: InputMaybe<Scalars['String']>
  language_containsInsensitive?: InputMaybe<Scalars['String']>
  language_endsWith?: InputMaybe<Scalars['String']>
  language_eq?: InputMaybe<Scalars['String']>
  language_gt?: InputMaybe<Scalars['String']>
  language_gte?: InputMaybe<Scalars['String']>
  language_in?: InputMaybe<Array<Scalars['String']>>
  language_isNull?: InputMaybe<Scalars['Boolean']>
  language_lt?: InputMaybe<Scalars['String']>
  language_lte?: InputMaybe<Scalars['String']>
  language_not_contains?: InputMaybe<Scalars['String']>
  language_not_containsInsensitive?: InputMaybe<Scalars['String']>
  language_not_endsWith?: InputMaybe<Scalars['String']>
  language_not_eq?: InputMaybe<Scalars['String']>
  language_not_in?: InputMaybe<Array<Scalars['String']>>
  language_not_startsWith?: InputMaybe<Scalars['String']>
  language_startsWith?: InputMaybe<Scalars['String']>
  ownerMember?: InputMaybe<MembershipWhereInput>
  ownerMember_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareRatioPercent_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_gt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_gte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_in?: InputMaybe<Array<Scalars['Int']>>
  revenueShareRatioPercent_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareRatioPercent_lt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_lte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_not_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPercent_not_in?: InputMaybe<Array<Scalars['Int']>>
  rewardAccount_contains?: InputMaybe<Scalars['String']>
  rewardAccount_containsInsensitive?: InputMaybe<Scalars['String']>
  rewardAccount_endsWith?: InputMaybe<Scalars['String']>
  rewardAccount_eq?: InputMaybe<Scalars['String']>
  rewardAccount_gt?: InputMaybe<Scalars['String']>
  rewardAccount_gte?: InputMaybe<Scalars['String']>
  rewardAccount_in?: InputMaybe<Array<Scalars['String']>>
  rewardAccount_isNull?: InputMaybe<Scalars['Boolean']>
  rewardAccount_lt?: InputMaybe<Scalars['String']>
  rewardAccount_lte?: InputMaybe<Scalars['String']>
  rewardAccount_not_contains?: InputMaybe<Scalars['String']>
  rewardAccount_not_containsInsensitive?: InputMaybe<Scalars['String']>
  rewardAccount_not_endsWith?: InputMaybe<Scalars['String']>
  rewardAccount_not_eq?: InputMaybe<Scalars['String']>
  rewardAccount_not_in?: InputMaybe<Array<Scalars['String']>>
  rewardAccount_not_startsWith?: InputMaybe<Scalars['String']>
  rewardAccount_startsWith?: InputMaybe<Scalars['String']>
  title_contains?: InputMaybe<Scalars['String']>
  title_containsInsensitive?: InputMaybe<Scalars['String']>
  title_endsWith?: InputMaybe<Scalars['String']>
  title_eq?: InputMaybe<Scalars['String']>
  title_gt?: InputMaybe<Scalars['String']>
  title_gte?: InputMaybe<Scalars['String']>
  title_in?: InputMaybe<Array<Scalars['String']>>
  title_isNull?: InputMaybe<Scalars['Boolean']>
  title_lt?: InputMaybe<Scalars['String']>
  title_lte?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_containsInsensitive?: InputMaybe<Scalars['String']>
  title_not_endsWith?: InputMaybe<Scalars['String']>
  title_not_eq?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  title_not_startsWith?: InputMaybe<Scalars['String']>
  title_startsWith?: InputMaybe<Scalars['String']>
  totalVideosCreated_eq?: InputMaybe<Scalars['Int']>
  totalVideosCreated_gt?: InputMaybe<Scalars['Int']>
  totalVideosCreated_gte?: InputMaybe<Scalars['Int']>
  totalVideosCreated_in?: InputMaybe<Array<Scalars['Int']>>
  totalVideosCreated_isNull?: InputMaybe<Scalars['Boolean']>
  totalVideosCreated_lt?: InputMaybe<Scalars['Int']>
  totalVideosCreated_lte?: InputMaybe<Scalars['Int']>
  totalVideosCreated_not_eq?: InputMaybe<Scalars['Int']>
  totalVideosCreated_not_in?: InputMaybe<Array<Scalars['Int']>>
  videoViewsNum_eq?: InputMaybe<Scalars['Int']>
  videoViewsNum_gt?: InputMaybe<Scalars['Int']>
  videoViewsNum_gte?: InputMaybe<Scalars['Int']>
  videoViewsNum_in?: InputMaybe<Array<Scalars['Int']>>
  videoViewsNum_isNull?: InputMaybe<Scalars['Boolean']>
  videoViewsNum_lt?: InputMaybe<Scalars['Int']>
  videoViewsNum_lte?: InputMaybe<Scalars['Int']>
  videoViewsNum_not_eq?: InputMaybe<Scalars['Int']>
  videoViewsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  videos_every?: InputMaybe<VideoWhereInput>
  videos_none?: InputMaybe<VideoWhereInput>
  videos_some?: InputMaybe<VideoWhereInput>
  yppStatus?: InputMaybe<ChannelYppStatusWhereInput>
  yppStatus_isNull?: InputMaybe<Scalars['Boolean']>
}

export type ChannelYppStatus = YppSuspended | YppUnverified | YppVerified

export type ChannelYppStatusWhereInput = {
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  suspension?: InputMaybe<ChannelSuspensionWhereInput>
  suspension_isNull?: InputMaybe<Scalars['Boolean']>
  verification?: InputMaybe<ChannelVerificationWhereInput>
  verification_isNull?: InputMaybe<Scalars['Boolean']>
}

export type ChannelsConnection = {
  __typename?: 'ChannelsConnection'
  edges: Array<ChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ChannelsSearchResult = {
  __typename?: 'ChannelsSearchResult'
  channel: Channel
  relevance: Scalars['Int']
}

export type Comment = {
  __typename?: 'Comment'
  /** Author of the video comment */
  author: Membership
  /** Timestamp of the block the comment was created at */
  createdAt: Scalars['DateTime']
  /** METAPROTOCOL-{network}-{blockNumber}-{indexInBlock} */
  id: Scalars['String']
  /** Whether comment has been edited or not */
  isEdited: Scalars['Boolean']
  /** Whether a comment has been excluded/hidden (by the gateway operator) */
  isExcluded: Scalars['Boolean']
  /** A (parent) comment that this comment replies to (if any) */
  parentComment?: Maybe<Comment>
  /** List of all reactions to the comment */
  reactions: Array<CommentReaction>
  /** Sum of replies and reactions */
  reactionsAndRepliesCount: Scalars['Int']
  /** Total number of reactions to this comment */
  reactionsCount: Scalars['Int']
  /** Reactions count by reaction Id */
  reactionsCountByReactionId?: Maybe<Array<CommentReactionsCountByReactionId>>
  /** How many comments has replied to this comment */
  repliesCount: Scalars['Int']
  /** Base sort priority of the comment (can be increased by a tip) */
  sortPriority: Scalars['Int']
  /** Status of the comment; either it is visible, deleted, or moderated (deleted by moderator) */
  status: CommentStatus
  /** Comment text */
  text: Scalars['String']
  /** Tip included when adding the comment (in HAPI) */
  tipAmount: Scalars['BigInt']
  /** Tier received for adding a tip to the comment (if any) */
  tipTier?: Maybe<CommentTipTier>
  /** Video the comment was added to */
  video: Video
}

export type CommentReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentReactionOrderByInput>>
  where?: InputMaybe<CommentReactionWhereInput>
}

export type CommentCreatedEventData = {
  __typename?: 'CommentCreatedEventData'
  /** The comment that was added */
  comment: Comment
  /** Comment's original text */
  text: Scalars['String']
}

export type CommentEdge = {
  __typename?: 'CommentEdge'
  cursor: Scalars['String']
  node: Comment
}

export enum CommentOrderByInput {
  AuthorControllerAccountAsc = 'author_controllerAccount_ASC',
  AuthorControllerAccountDesc = 'author_controllerAccount_DESC',
  AuthorCreatedAtAsc = 'author_createdAt_ASC',
  AuthorCreatedAtDesc = 'author_createdAt_DESC',
  AuthorHandleRawAsc = 'author_handleRaw_ASC',
  AuthorHandleRawDesc = 'author_handleRaw_DESC',
  AuthorHandleAsc = 'author_handle_ASC',
  AuthorHandleDesc = 'author_handle_DESC',
  AuthorIdAsc = 'author_id_ASC',
  AuthorIdDesc = 'author_id_DESC',
  AuthorTotalChannelsCreatedAsc = 'author_totalChannelsCreated_ASC',
  AuthorTotalChannelsCreatedDesc = 'author_totalChannelsCreated_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsEditedAsc = 'isEdited_ASC',
  IsEditedDesc = 'isEdited_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  ParentCommentCreatedAtAsc = 'parentComment_createdAt_ASC',
  ParentCommentCreatedAtDesc = 'parentComment_createdAt_DESC',
  ParentCommentIdAsc = 'parentComment_id_ASC',
  ParentCommentIdDesc = 'parentComment_id_DESC',
  ParentCommentIsEditedAsc = 'parentComment_isEdited_ASC',
  ParentCommentIsEditedDesc = 'parentComment_isEdited_DESC',
  ParentCommentIsExcludedAsc = 'parentComment_isExcluded_ASC',
  ParentCommentIsExcludedDesc = 'parentComment_isExcluded_DESC',
  ParentCommentReactionsAndRepliesCountAsc = 'parentComment_reactionsAndRepliesCount_ASC',
  ParentCommentReactionsAndRepliesCountDesc = 'parentComment_reactionsAndRepliesCount_DESC',
  ParentCommentReactionsCountAsc = 'parentComment_reactionsCount_ASC',
  ParentCommentReactionsCountDesc = 'parentComment_reactionsCount_DESC',
  ParentCommentRepliesCountAsc = 'parentComment_repliesCount_ASC',
  ParentCommentRepliesCountDesc = 'parentComment_repliesCount_DESC',
  ParentCommentSortPriorityAsc = 'parentComment_sortPriority_ASC',
  ParentCommentSortPriorityDesc = 'parentComment_sortPriority_DESC',
  ParentCommentStatusAsc = 'parentComment_status_ASC',
  ParentCommentStatusDesc = 'parentComment_status_DESC',
  ParentCommentTextAsc = 'parentComment_text_ASC',
  ParentCommentTextDesc = 'parentComment_text_DESC',
  ParentCommentTipAmountAsc = 'parentComment_tipAmount_ASC',
  ParentCommentTipAmountDesc = 'parentComment_tipAmount_DESC',
  ParentCommentTipTierAsc = 'parentComment_tipTier_ASC',
  ParentCommentTipTierDesc = 'parentComment_tipTier_DESC',
  ReactionsAndRepliesCountAsc = 'reactionsAndRepliesCount_ASC',
  ReactionsAndRepliesCountDesc = 'reactionsAndRepliesCount_DESC',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountDesc = 'reactionsCount_DESC',
  RepliesCountAsc = 'repliesCount_ASC',
  RepliesCountDesc = 'repliesCount_DESC',
  SortPriorityAsc = 'sortPriority_ASC',
  SortPriorityDesc = 'sortPriority_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  TextAsc = 'text_ASC',
  TextDesc = 'text_DESC',
  TipAmountAsc = 'tipAmount_ASC',
  TipAmountDesc = 'tipAmount_DESC',
  TipTierAsc = 'tipTier_ASC',
  TipTierDesc = 'tipTier_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type CommentPostedToVideo = {
  __typename?: 'CommentPostedToVideo'
  /** id for the comment used for the link */
  comentId: Scalars['String']
  /** commenter handle for text */
  memberHandle: Scalars['String']
  /** commenter id for the avatar */
  memberId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title used for notification text */
  videoTitle: Scalars['String']
}

export type CommentReaction = {
  __typename?: 'CommentReaction'
  /** The comment that has been reacted to */
  comment: Comment
  /** {memberId}-{commentId}-{reactionId} */
  id: Scalars['String']
  /** The member that reacted */
  member: Membership
  /** The Reaction id */
  reactionId: Scalars['Int']
  /** The video the comment (that has been reacted) exists */
  video: Video
}

export type CommentReactionEdge = {
  __typename?: 'CommentReactionEdge'
  cursor: Scalars['String']
  node: CommentReaction
}

export type CommentReactionEventData = {
  __typename?: 'CommentReactionEventData'
  /** comment reaction reference */
  commentReaction: CommentReaction
}

export enum CommentReactionOrderByInput {
  CommentCreatedAtAsc = 'comment_createdAt_ASC',
  CommentCreatedAtDesc = 'comment_createdAt_DESC',
  CommentIdAsc = 'comment_id_ASC',
  CommentIdDesc = 'comment_id_DESC',
  CommentIsEditedAsc = 'comment_isEdited_ASC',
  CommentIsEditedDesc = 'comment_isEdited_DESC',
  CommentIsExcludedAsc = 'comment_isExcluded_ASC',
  CommentIsExcludedDesc = 'comment_isExcluded_DESC',
  CommentReactionsAndRepliesCountAsc = 'comment_reactionsAndRepliesCount_ASC',
  CommentReactionsAndRepliesCountDesc = 'comment_reactionsAndRepliesCount_DESC',
  CommentReactionsCountAsc = 'comment_reactionsCount_ASC',
  CommentReactionsCountDesc = 'comment_reactionsCount_DESC',
  CommentRepliesCountAsc = 'comment_repliesCount_ASC',
  CommentRepliesCountDesc = 'comment_repliesCount_DESC',
  CommentSortPriorityAsc = 'comment_sortPriority_ASC',
  CommentSortPriorityDesc = 'comment_sortPriority_DESC',
  CommentStatusAsc = 'comment_status_ASC',
  CommentStatusDesc = 'comment_status_DESC',
  CommentTextAsc = 'comment_text_ASC',
  CommentTextDesc = 'comment_text_DESC',
  CommentTipAmountAsc = 'comment_tipAmount_ASC',
  CommentTipAmountDesc = 'comment_tipAmount_DESC',
  CommentTipTierAsc = 'comment_tipTier_ASC',
  CommentTipTierDesc = 'comment_tipTier_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  ReactionIdAsc = 'reactionId_ASC',
  ReactionIdDesc = 'reactionId_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type CommentReactionWhereInput = {
  AND?: InputMaybe<Array<CommentReactionWhereInput>>
  OR?: InputMaybe<Array<CommentReactionWhereInput>>
  comment?: InputMaybe<CommentWhereInput>
  comment_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  reactionId_eq?: InputMaybe<Scalars['Int']>
  reactionId_gt?: InputMaybe<Scalars['Int']>
  reactionId_gte?: InputMaybe<Scalars['Int']>
  reactionId_in?: InputMaybe<Array<Scalars['Int']>>
  reactionId_isNull?: InputMaybe<Scalars['Boolean']>
  reactionId_lt?: InputMaybe<Scalars['Int']>
  reactionId_lte?: InputMaybe<Scalars['Int']>
  reactionId_not_eq?: InputMaybe<Scalars['Int']>
  reactionId_not_in?: InputMaybe<Array<Scalars['Int']>>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type CommentReactionsConnection = {
  __typename?: 'CommentReactionsConnection'
  edges: Array<CommentReactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CommentReactionsCountByReactionId = {
  __typename?: 'CommentReactionsCountByReactionId'
  /** No of times the comment has been reacted with given reaction Id */
  count: Scalars['Int']
  /** The reaction id */
  reactionId: Scalars['Int']
}

export type CommentReply = {
  __typename?: 'CommentReply'
  /** comment Id for the link */
  commentId: Scalars['String']
  /** member who replied */
  memberHandle: Scalars['String']
  /** member who replied */
  memberId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export enum CommentStatus {
  Deleted = 'DELETED',
  Moderated = 'MODERATED',
  Visible = 'VISIBLE',
}

export type CommentTextUpdatedEventData = {
  __typename?: 'CommentTextUpdatedEventData'
  /** The comment being updated */
  comment: Comment
  /** New comment text */
  newText: Scalars['String']
}

export enum CommentTipTier {
  Diamond = 'DIAMOND',
  Gold = 'GOLD',
  Silver = 'SILVER',
}

export type CommentTipTiers = {
  __typename?: 'CommentTipTiers'
  DIAMOND: Scalars['Int']
  GOLD: Scalars['Int']
  SILVER: Scalars['Int']
}

export type CommentWhereInput = {
  AND?: InputMaybe<Array<CommentWhereInput>>
  OR?: InputMaybe<Array<CommentWhereInput>>
  author?: InputMaybe<MembershipWhereInput>
  author_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isEdited_eq?: InputMaybe<Scalars['Boolean']>
  isEdited_isNull?: InputMaybe<Scalars['Boolean']>
  isEdited_not_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_isNull?: InputMaybe<Scalars['Boolean']>
  isExcluded_not_eq?: InputMaybe<Scalars['Boolean']>
  parentComment?: InputMaybe<CommentWhereInput>
  parentComment_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsAndRepliesCount_eq?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_gt?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_gte?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_in?: InputMaybe<Array<Scalars['Int']>>
  reactionsAndRepliesCount_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsAndRepliesCount_lt?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_lte?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_not_eq?: InputMaybe<Scalars['Int']>
  reactionsAndRepliesCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  reactionsCountByReactionId_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsCount_eq?: InputMaybe<Scalars['Int']>
  reactionsCount_gt?: InputMaybe<Scalars['Int']>
  reactionsCount_gte?: InputMaybe<Scalars['Int']>
  reactionsCount_in?: InputMaybe<Array<Scalars['Int']>>
  reactionsCount_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsCount_lt?: InputMaybe<Scalars['Int']>
  reactionsCount_lte?: InputMaybe<Scalars['Int']>
  reactionsCount_not_eq?: InputMaybe<Scalars['Int']>
  reactionsCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  reactions_every?: InputMaybe<CommentReactionWhereInput>
  reactions_none?: InputMaybe<CommentReactionWhereInput>
  reactions_some?: InputMaybe<CommentReactionWhereInput>
  repliesCount_eq?: InputMaybe<Scalars['Int']>
  repliesCount_gt?: InputMaybe<Scalars['Int']>
  repliesCount_gte?: InputMaybe<Scalars['Int']>
  repliesCount_in?: InputMaybe<Array<Scalars['Int']>>
  repliesCount_isNull?: InputMaybe<Scalars['Boolean']>
  repliesCount_lt?: InputMaybe<Scalars['Int']>
  repliesCount_lte?: InputMaybe<Scalars['Int']>
  repliesCount_not_eq?: InputMaybe<Scalars['Int']>
  repliesCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  sortPriority_eq?: InputMaybe<Scalars['Int']>
  sortPriority_gt?: InputMaybe<Scalars['Int']>
  sortPriority_gte?: InputMaybe<Scalars['Int']>
  sortPriority_in?: InputMaybe<Array<Scalars['Int']>>
  sortPriority_isNull?: InputMaybe<Scalars['Boolean']>
  sortPriority_lt?: InputMaybe<Scalars['Int']>
  sortPriority_lte?: InputMaybe<Scalars['Int']>
  sortPriority_not_eq?: InputMaybe<Scalars['Int']>
  sortPriority_not_in?: InputMaybe<Array<Scalars['Int']>>
  status_eq?: InputMaybe<CommentStatus>
  status_in?: InputMaybe<Array<CommentStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<CommentStatus>
  status_not_in?: InputMaybe<Array<CommentStatus>>
  text_contains?: InputMaybe<Scalars['String']>
  text_containsInsensitive?: InputMaybe<Scalars['String']>
  text_endsWith?: InputMaybe<Scalars['String']>
  text_eq?: InputMaybe<Scalars['String']>
  text_gt?: InputMaybe<Scalars['String']>
  text_gte?: InputMaybe<Scalars['String']>
  text_in?: InputMaybe<Array<Scalars['String']>>
  text_isNull?: InputMaybe<Scalars['Boolean']>
  text_lt?: InputMaybe<Scalars['String']>
  text_lte?: InputMaybe<Scalars['String']>
  text_not_contains?: InputMaybe<Scalars['String']>
  text_not_containsInsensitive?: InputMaybe<Scalars['String']>
  text_not_endsWith?: InputMaybe<Scalars['String']>
  text_not_eq?: InputMaybe<Scalars['String']>
  text_not_in?: InputMaybe<Array<Scalars['String']>>
  text_not_startsWith?: InputMaybe<Scalars['String']>
  text_startsWith?: InputMaybe<Scalars['String']>
  tipAmount_eq?: InputMaybe<Scalars['BigInt']>
  tipAmount_gt?: InputMaybe<Scalars['BigInt']>
  tipAmount_gte?: InputMaybe<Scalars['BigInt']>
  tipAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  tipAmount_isNull?: InputMaybe<Scalars['Boolean']>
  tipAmount_lt?: InputMaybe<Scalars['BigInt']>
  tipAmount_lte?: InputMaybe<Scalars['BigInt']>
  tipAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  tipAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  tipTier_eq?: InputMaybe<CommentTipTier>
  tipTier_in?: InputMaybe<Array<CommentTipTier>>
  tipTier_isNull?: InputMaybe<Scalars['Boolean']>
  tipTier_not_eq?: InputMaybe<CommentTipTier>
  tipTier_not_in?: InputMaybe<Array<CommentTipTier>>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type CommentsConnection = {
  __typename?: 'CommentsConnection'
  edges: Array<CommentEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ContentActor = ContentActorCurator | ContentActorLead | ContentActorMember

export type ContentActorCurator = {
  __typename?: 'ContentActorCurator'
  curator: Curator
}

export type ContentActorLead = {
  __typename?: 'ContentActorLead'
  phantom?: Maybe<Scalars['Int']>
}

export type ContentActorMember = {
  __typename?: 'ContentActorMember'
  member: Membership
}

export type ContentActorWhereInput = {
  curator?: InputMaybe<CuratorWhereInput>
  curator_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
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

export type CreatorReceivesAuctionBid = {
  __typename?: 'CreatorReceivesAuctionBid'
  /** bid amount */
  amount: Scalars['BigInt']
  /** bidder handle for notification text */
  bidderHandle: Scalars['String']
  /** bidder id for notification the avatar */
  bidderId: Scalars['String']
  /** videoId used for notification link */
  videoId: Scalars['String']
  /** video title used for notification text */
  videoTitle: Scalars['String']
}

export type CreatorToken = {
  __typename?: 'CreatorToken'
  /** holders having some amount of this token */
  accounts: Array<TokenAccount>
  /** number of accounts to avoid aggregate COUNT */
  accountsNum: Scalars['Int']
  /** amm curves issued for this token */
  ammCurves: Array<AmmCurve>
  /** creator annual revenue (minted) */
  annualCreatorRewardPermill: Scalars['Int']
  /** avatar object (profile picture) */
  avatar?: Maybe<TokenAvatar>
  /** list of benefits for the token */
  benefits: Array<Benefit>
  /** channel from which the token is issued uniqueness guaranteed by runtime */
  channel?: Maybe<TokenChannel>
  /** date at which this token was created */
  createdAt: Scalars['DateTime']
  /** current amm sale if ongoing */
  currentAmmSale?: Maybe<AmmCurve>
  /** current revenue share if ongoing */
  currentRevenueShare?: Maybe<RevenueShare>
  /** current sale if ongoing */
  currentSale?: Maybe<Sale>
  /** whether it has been deissued or not */
  deissued: Scalars['Boolean']
  /** about information displayed under the presentation video */
  description?: Maybe<Scalars['String']>
  /** runtime token identifier */
  id: Scalars['String']
  /** Flag to indicate whether the CRT is featured or not */
  isFeatured: Scalars['Boolean']
  /** access status invite only vs anyone */
  isInviteOnly: Scalars['Boolean']
  /** last unit price available */
  lastPrice?: Maybe<Scalars['BigInt']>
  /** number of revenue shares issued */
  numberOfRevenueShareActivations: Scalars['Int']
  /** number of vested transfer completed */
  numberOfVestedTransferIssued: Scalars['Int']
  /** revenue share ratio between creator and holder */
  revenueShareRatioPermill: Scalars['Int']
  /** revenue shares issued for this token */
  revenueShares: Array<RevenueShare>
  /** sales issued for this token */
  sales: Array<Sale>
  /** status sale / market / idle */
  status: TokenStatus
  /** symbol for the token uniqueness guaranteed by runtime */
  symbol?: Maybe<Scalars['String']>
  /** total supply */
  totalSupply: Scalars['BigInt']
  /** video for the token presentation page */
  trailerVideo?: Maybe<TrailerVideo>
  /** link for creator to member interested in joining the whitelist */
  whitelistApplicantLink?: Maybe<Scalars['String']>
  /** note from creator to member interested in joining the whitelist */
  whitelistApplicantNote?: Maybe<Scalars['String']>
}

export type CreatorTokenAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenAccountOrderByInput>>
  where?: InputMaybe<TokenAccountWhereInput>
}

export type CreatorTokenAmmCurvesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmCurveOrderByInput>>
  where?: InputMaybe<AmmCurveWhereInput>
}

export type CreatorTokenBenefitsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BenefitOrderByInput>>
  where?: InputMaybe<BenefitWhereInput>
}

export type CreatorTokenRevenueSharesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareOrderByInput>>
  where?: InputMaybe<RevenueShareWhereInput>
}

export type CreatorTokenSalesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleOrderByInput>>
  where?: InputMaybe<SaleWhereInput>
}

export type CreatorTokenEdge = {
  __typename?: 'CreatorTokenEdge'
  cursor: Scalars['String']
  node: CreatorToken
}

export type CreatorTokenIssued = {
  __typename?: 'CreatorTokenIssued'
  /** channel Id used for link */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenIssuedEventData = {
  __typename?: 'CreatorTokenIssuedEventData'
  /** Token that was issued */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenMarketBurn = {
  __typename?: 'CreatorTokenMarketBurn'
  /** amount of tokens that user burned */
  burnedTokenAmount: Scalars['BigInt']
  /** handle of member that burned tokens */
  burnerHandle: Scalars['String']
  /** id of member that burned tokens */
  burnerId: Scalars['String']
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** amount of joy that user received for burning */
  receivedJoyAmount: Scalars['BigInt']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenMarketBurnEventData = {
  __typename?: 'CreatorTokenMarketBurnEventData'
  /** Details of the transaction that happened */
  ammBurnTransaction?: Maybe<AmmTransaction>
  /** Token for which transaction happened */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenMarketMint = {
  __typename?: 'CreatorTokenMarketMint'
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** amount of tokens that user minted */
  mintedTokenAmount: Scalars['BigInt']
  /** handle of member that minted tokens */
  minterHandle: Scalars['String']
  /** id of member that minted tokens */
  minterId: Scalars['String']
  /** amount of joy that user used for minting */
  paiedJoyAmount: Scalars['BigInt']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenMarketMintEventData = {
  __typename?: 'CreatorTokenMarketMintEventData'
  /** Details of the transaction that happened */
  ammMintTransaction?: Maybe<AmmTransaction>
  /** Token for which transaction happened */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenMarketStarted = {
  __typename?: 'CreatorTokenMarketStarted'
  /** channel Id used for link */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenMarketStartedEventData = {
  __typename?: 'CreatorTokenMarketStartedEventData'
  /** Details of the created market */
  ammCurve?: Maybe<AmmCurve>
  /** Token for which market was created */
  token?: Maybe<CreatorToken>
}

export enum CreatorTokenOrderByInput {
  AccountsNumAsc = 'accountsNum_ASC',
  AccountsNumDesc = 'accountsNum_DESC',
  AnnualCreatorRewardPermillAsc = 'annualCreatorRewardPermill_ASC',
  AnnualCreatorRewardPermillDesc = 'annualCreatorRewardPermill_DESC',
  AvatarAvatarUriAsc = 'avatar_avatarUri_ASC',
  AvatarAvatarUriDesc = 'avatar_avatarUri_DESC',
  AvatarIsTypeOfAsc = 'avatar_isTypeOf_ASC',
  AvatarIsTypeOfDesc = 'avatar_isTypeOf_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CurrentAmmSaleAmmInitPriceAsc = 'currentAmmSale_ammInitPrice_ASC',
  CurrentAmmSaleAmmInitPriceDesc = 'currentAmmSale_ammInitPrice_DESC',
  CurrentAmmSaleAmmSlopeParameterAsc = 'currentAmmSale_ammSlopeParameter_ASC',
  CurrentAmmSaleAmmSlopeParameterDesc = 'currentAmmSale_ammSlopeParameter_DESC',
  CurrentAmmSaleBurnedByAmmAsc = 'currentAmmSale_burnedByAmm_ASC',
  CurrentAmmSaleBurnedByAmmDesc = 'currentAmmSale_burnedByAmm_DESC',
  CurrentAmmSaleFinalizedAsc = 'currentAmmSale_finalized_ASC',
  CurrentAmmSaleFinalizedDesc = 'currentAmmSale_finalized_DESC',
  CurrentAmmSaleIdAsc = 'currentAmmSale_id_ASC',
  CurrentAmmSaleIdDesc = 'currentAmmSale_id_DESC',
  CurrentAmmSaleMintedByAmmAsc = 'currentAmmSale_mintedByAmm_ASC',
  CurrentAmmSaleMintedByAmmDesc = 'currentAmmSale_mintedByAmm_DESC',
  CurrentRevenueShareAllocationAsc = 'currentRevenueShare_allocation_ASC',
  CurrentRevenueShareAllocationDesc = 'currentRevenueShare_allocation_DESC',
  CurrentRevenueShareClaimedAsc = 'currentRevenueShare_claimed_ASC',
  CurrentRevenueShareClaimedDesc = 'currentRevenueShare_claimed_DESC',
  CurrentRevenueShareCreatedInAsc = 'currentRevenueShare_createdIn_ASC',
  CurrentRevenueShareCreatedInDesc = 'currentRevenueShare_createdIn_DESC',
  CurrentRevenueShareEndsAtAsc = 'currentRevenueShare_endsAt_ASC',
  CurrentRevenueShareEndsAtDesc = 'currentRevenueShare_endsAt_DESC',
  CurrentRevenueShareFinalizedAsc = 'currentRevenueShare_finalized_ASC',
  CurrentRevenueShareFinalizedDesc = 'currentRevenueShare_finalized_DESC',
  CurrentRevenueShareIdAsc = 'currentRevenueShare_id_ASC',
  CurrentRevenueShareIdDesc = 'currentRevenueShare_id_DESC',
  CurrentRevenueShareParticipantsNumAsc = 'currentRevenueShare_participantsNum_ASC',
  CurrentRevenueShareParticipantsNumDesc = 'currentRevenueShare_participantsNum_DESC',
  CurrentRevenueSharePotentialParticipantsNumAsc = 'currentRevenueShare_potentialParticipantsNum_ASC',
  CurrentRevenueSharePotentialParticipantsNumDesc = 'currentRevenueShare_potentialParticipantsNum_DESC',
  CurrentRevenueShareStartingAtAsc = 'currentRevenueShare_startingAt_ASC',
  CurrentRevenueShareStartingAtDesc = 'currentRevenueShare_startingAt_DESC',
  CurrentSaleCreatedInAsc = 'currentSale_createdIn_ASC',
  CurrentSaleCreatedInDesc = 'currentSale_createdIn_DESC',
  CurrentSaleEndsAtAsc = 'currentSale_endsAt_ASC',
  CurrentSaleEndsAtDesc = 'currentSale_endsAt_DESC',
  CurrentSaleFinalizedAsc = 'currentSale_finalized_ASC',
  CurrentSaleFinalizedDesc = 'currentSale_finalized_DESC',
  CurrentSaleIdAsc = 'currentSale_id_ASC',
  CurrentSaleIdDesc = 'currentSale_id_DESC',
  CurrentSaleMaxAmountPerMemberAsc = 'currentSale_maxAmountPerMember_ASC',
  CurrentSaleMaxAmountPerMemberDesc = 'currentSale_maxAmountPerMember_DESC',
  CurrentSalePricePerUnitAsc = 'currentSale_pricePerUnit_ASC',
  CurrentSalePricePerUnitDesc = 'currentSale_pricePerUnit_DESC',
  CurrentSaleStartBlockAsc = 'currentSale_startBlock_ASC',
  CurrentSaleStartBlockDesc = 'currentSale_startBlock_DESC',
  CurrentSaleTermsAndConditionsAsc = 'currentSale_termsAndConditions_ASC',
  CurrentSaleTermsAndConditionsDesc = 'currentSale_termsAndConditions_DESC',
  CurrentSaleTokenSaleAllocationAsc = 'currentSale_tokenSaleAllocation_ASC',
  CurrentSaleTokenSaleAllocationDesc = 'currentSale_tokenSaleAllocation_DESC',
  CurrentSaleTokensSoldAsc = 'currentSale_tokensSold_ASC',
  CurrentSaleTokensSoldDesc = 'currentSale_tokensSold_DESC',
  DeissuedAsc = 'deissued_ASC',
  DeissuedDesc = 'deissued_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsFeaturedAsc = 'isFeatured_ASC',
  IsFeaturedDesc = 'isFeatured_DESC',
  IsInviteOnlyAsc = 'isInviteOnly_ASC',
  IsInviteOnlyDesc = 'isInviteOnly_DESC',
  LastPriceAsc = 'lastPrice_ASC',
  LastPriceDesc = 'lastPrice_DESC',
  NumberOfRevenueShareActivationsAsc = 'numberOfRevenueShareActivations_ASC',
  NumberOfRevenueShareActivationsDesc = 'numberOfRevenueShareActivations_DESC',
  NumberOfVestedTransferIssuedAsc = 'numberOfVestedTransferIssued_ASC',
  NumberOfVestedTransferIssuedDesc = 'numberOfVestedTransferIssued_DESC',
  RevenueShareRatioPermillAsc = 'revenueShareRatioPermill_ASC',
  RevenueShareRatioPermillDesc = 'revenueShareRatioPermill_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC',
  TrailerVideoIdAsc = 'trailerVideo_id_ASC',
  TrailerVideoIdDesc = 'trailerVideo_id_DESC',
  WhitelistApplicantLinkAsc = 'whitelistApplicantLink_ASC',
  WhitelistApplicantLinkDesc = 'whitelistApplicantLink_DESC',
  WhitelistApplicantNoteAsc = 'whitelistApplicantNote_ASC',
  WhitelistApplicantNoteDesc = 'whitelistApplicantNote_DESC',
}

export type CreatorTokenRevenueShareEnded = {
  __typename?: 'CreatorTokenRevenueShareEnded'
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** id of created revenue share to verify its' viability in future */
  revenueShareId: Scalars['String']
  /** id of token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenRevenueSharePlanned = {
  __typename?: 'CreatorTokenRevenueSharePlanned'
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** block on which split is planned to start */
  plannedAt: Scalars['Int']
  /** id of created revenue share to verify its' viability in future */
  revenueShareId: Scalars['String']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenRevenueShareStarted = {
  __typename?: 'CreatorTokenRevenueShareStarted'
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** id of created revenue share to verify its' viability in future */
  revenueShareId: Scalars['String']
  /** id of token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenRevenueSplitIssuedEventData = {
  __typename?: 'CreatorTokenRevenueSplitIssuedEventData'
  /** Details of the revenue split */
  revenueShare?: Maybe<RevenueShare>
  /** Token for which split was issued */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenSaleMint = {
  __typename?: 'CreatorTokenSaleMint'
  /** channel title for notification avatar */
  channelId: Scalars['String']
  /** amount of tokens that user minted */
  mintedTokenAmount: Scalars['BigInt']
  /** handle of member that minted tokens */
  minterHandle: Scalars['String']
  /** id of member that minted tokens */
  minterId: Scalars['String']
  /** amount of joy that user used for minting */
  paiedJoyAmount: Scalars['BigInt']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenSaleMintEventData = {
  __typename?: 'CreatorTokenSaleMintEventData'
  /** Details of the transaction that happened */
  saleTransaction?: Maybe<SaleTransaction>
  /** Token for which transaction happened */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenSaleStarted = {
  __typename?: 'CreatorTokenSaleStarted'
  /** channel Id used for link */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** id of the token */
  tokenId: Scalars['String']
  /** symbol of the token */
  tokenSymbol: Scalars['String']
}

export type CreatorTokenSaleStartedEventData = {
  __typename?: 'CreatorTokenSaleStartedEventData'
  /** Details of the created sale */
  sale?: Maybe<Sale>
  /** Token for which sale was created */
  token?: Maybe<CreatorToken>
}

export type CreatorTokenWhereInput = {
  AND?: InputMaybe<Array<CreatorTokenWhereInput>>
  OR?: InputMaybe<Array<CreatorTokenWhereInput>>
  accountsNum_eq?: InputMaybe<Scalars['Int']>
  accountsNum_gt?: InputMaybe<Scalars['Int']>
  accountsNum_gte?: InputMaybe<Scalars['Int']>
  accountsNum_in?: InputMaybe<Array<Scalars['Int']>>
  accountsNum_isNull?: InputMaybe<Scalars['Boolean']>
  accountsNum_lt?: InputMaybe<Scalars['Int']>
  accountsNum_lte?: InputMaybe<Scalars['Int']>
  accountsNum_not_eq?: InputMaybe<Scalars['Int']>
  accountsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  accounts_every?: InputMaybe<TokenAccountWhereInput>
  accounts_none?: InputMaybe<TokenAccountWhereInput>
  accounts_some?: InputMaybe<TokenAccountWhereInput>
  ammCurves_every?: InputMaybe<AmmCurveWhereInput>
  ammCurves_none?: InputMaybe<AmmCurveWhereInput>
  ammCurves_some?: InputMaybe<AmmCurveWhereInput>
  annualCreatorRewardPermill_eq?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_gt?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_gte?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_in?: InputMaybe<Array<Scalars['Int']>>
  annualCreatorRewardPermill_isNull?: InputMaybe<Scalars['Boolean']>
  annualCreatorRewardPermill_lt?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_lte?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_not_eq?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_not_in?: InputMaybe<Array<Scalars['Int']>>
  avatar?: InputMaybe<TokenAvatarWhereInput>
  avatar_isNull?: InputMaybe<Scalars['Boolean']>
  benefits_every?: InputMaybe<BenefitWhereInput>
  benefits_none?: InputMaybe<BenefitWhereInput>
  benefits_some?: InputMaybe<BenefitWhereInput>
  channel?: InputMaybe<TokenChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  currentAmmSale?: InputMaybe<AmmCurveWhereInput>
  currentAmmSale_isNull?: InputMaybe<Scalars['Boolean']>
  currentRevenueShare?: InputMaybe<RevenueShareWhereInput>
  currentRevenueShare_isNull?: InputMaybe<Scalars['Boolean']>
  currentSale?: InputMaybe<SaleWhereInput>
  currentSale_isNull?: InputMaybe<Scalars['Boolean']>
  deissued_eq?: InputMaybe<Scalars['Boolean']>
  deissued_isNull?: InputMaybe<Scalars['Boolean']>
  deissued_not_eq?: InputMaybe<Scalars['Boolean']>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isFeatured_eq?: InputMaybe<Scalars['Boolean']>
  isFeatured_isNull?: InputMaybe<Scalars['Boolean']>
  isFeatured_not_eq?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_eq?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_isNull?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_not_eq?: InputMaybe<Scalars['Boolean']>
  lastPrice_eq?: InputMaybe<Scalars['BigInt']>
  lastPrice_gt?: InputMaybe<Scalars['BigInt']>
  lastPrice_gte?: InputMaybe<Scalars['BigInt']>
  lastPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  lastPrice_isNull?: InputMaybe<Scalars['Boolean']>
  lastPrice_lt?: InputMaybe<Scalars['BigInt']>
  lastPrice_lte?: InputMaybe<Scalars['BigInt']>
  lastPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  numberOfRevenueShareActivations_eq?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_gt?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_gte?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfRevenueShareActivations_isNull?: InputMaybe<Scalars['Boolean']>
  numberOfRevenueShareActivations_lt?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_lte?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_not_eq?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_not_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfVestedTransferIssued_eq?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_gt?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_gte?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfVestedTransferIssued_isNull?: InputMaybe<Scalars['Boolean']>
  numberOfVestedTransferIssued_lt?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_lte?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_not_eq?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_not_in?: InputMaybe<Array<Scalars['Int']>>
  revenueShareRatioPermill_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_gt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_gte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_in?: InputMaybe<Array<Scalars['Int']>>
  revenueShareRatioPermill_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareRatioPermill_lt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_lte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_not_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_not_in?: InputMaybe<Array<Scalars['Int']>>
  revenueShares_every?: InputMaybe<RevenueShareWhereInput>
  revenueShares_none?: InputMaybe<RevenueShareWhereInput>
  revenueShares_some?: InputMaybe<RevenueShareWhereInput>
  sales_every?: InputMaybe<SaleWhereInput>
  sales_none?: InputMaybe<SaleWhereInput>
  sales_some?: InputMaybe<SaleWhereInput>
  status_eq?: InputMaybe<TokenStatus>
  status_in?: InputMaybe<Array<TokenStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<TokenStatus>
  status_not_in?: InputMaybe<Array<TokenStatus>>
  symbol_contains?: InputMaybe<Scalars['String']>
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>
  symbol_endsWith?: InputMaybe<Scalars['String']>
  symbol_eq?: InputMaybe<Scalars['String']>
  symbol_gt?: InputMaybe<Scalars['String']>
  symbol_gte?: InputMaybe<Scalars['String']>
  symbol_in?: InputMaybe<Array<Scalars['String']>>
  symbol_isNull?: InputMaybe<Scalars['Boolean']>
  symbol_lt?: InputMaybe<Scalars['String']>
  symbol_lte?: InputMaybe<Scalars['String']>
  symbol_not_contains?: InputMaybe<Scalars['String']>
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>
  symbol_not_endsWith?: InputMaybe<Scalars['String']>
  symbol_not_eq?: InputMaybe<Scalars['String']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>
  symbol_not_startsWith?: InputMaybe<Scalars['String']>
  symbol_startsWith?: InputMaybe<Scalars['String']>
  totalSupply_eq?: InputMaybe<Scalars['BigInt']>
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>
  totalSupply_not_eq?: InputMaybe<Scalars['BigInt']>
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  trailerVideo?: InputMaybe<TrailerVideoWhereInput>
  trailerVideo_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistApplicantLink_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_gt?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_gte?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantLink_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistApplicantLink_lt?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_lte?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantLink_not_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_gt?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_gte?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantNote_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistApplicantNote_lt?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_lte?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantNote_not_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_startsWith?: InputMaybe<Scalars['String']>
}

export type CreatorTokensConnection = {
  __typename?: 'CreatorTokensConnection'
  edges: Array<CreatorTokenEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CrtMarketCapMinVolume = {
  __typename?: 'CrtMarketCapMinVolume'
  minVolumeJoy: Scalars['Int']
}

export type Curator = {
  __typename?: 'Curator'
  /** Runtime identifier */
  id: Scalars['String']
}

export type CuratorEdge = {
  __typename?: 'CuratorEdge'
  cursor: Scalars['String']
  node: Curator
}

export type CuratorGroup = {
  __typename?: 'CuratorGroup'
  /** Runtime identifier */
  id: Scalars['String']
  /** Is group active or not */
  isActive: Scalars['Boolean']
}

export type CuratorGroupEdge = {
  __typename?: 'CuratorGroupEdge'
  cursor: Scalars['String']
  node: CuratorGroup
}

export enum CuratorGroupOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
}

export type CuratorGroupWhereInput = {
  AND?: InputMaybe<Array<CuratorGroupWhereInput>>
  OR?: InputMaybe<Array<CuratorGroupWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isActive_eq?: InputMaybe<Scalars['Boolean']>
  isActive_isNull?: InputMaybe<Scalars['Boolean']>
  isActive_not_eq?: InputMaybe<Scalars['Boolean']>
}

export type CuratorGroupsConnection = {
  __typename?: 'CuratorGroupsConnection'
  edges: Array<CuratorGroupEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum CuratorOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type CuratorWhereInput = {
  AND?: InputMaybe<Array<CuratorWhereInput>>
  OR?: InputMaybe<Array<CuratorWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
}

export type CuratorsConnection = {
  __typename?: 'CuratorsConnection'
  edges: Array<CuratorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DataObjectType =
  | DataObjectTypeChannelAvatar
  | DataObjectTypeChannelCoverPhoto
  | DataObjectTypeChannelPayoutsPayload
  | DataObjectTypeVideoMedia
  | DataObjectTypeVideoSubtitle
  | DataObjectTypeVideoThumbnail

export type DataObjectTypeChannelAvatar = {
  __typename?: 'DataObjectTypeChannelAvatar'
  /** Related channel entity */
  channel: Channel
}

export type DataObjectTypeChannelCoverPhoto = {
  __typename?: 'DataObjectTypeChannelCoverPhoto'
  /** Related channel entity */
  channel: Channel
}

export type DataObjectTypeChannelPayoutsPayload = {
  __typename?: 'DataObjectTypeChannelPayoutsPayload'
  phantom?: Maybe<Scalars['Int']>
}

export type DataObjectTypeVideoMedia = {
  __typename?: 'DataObjectTypeVideoMedia'
  /** Related video entity */
  video: Video
}

export type DataObjectTypeVideoSubtitle = {
  __typename?: 'DataObjectTypeVideoSubtitle'
  /** Related subtitle entity */
  subtitle: VideoSubtitle
  /** Related video entity */
  video: Video
}

export type DataObjectTypeVideoThumbnail = {
  __typename?: 'DataObjectTypeVideoThumbnail'
  /** Related video entity */
  video: Video
}

export type DataObjectTypeWhereInput = {
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  subtitle?: InputMaybe<VideoSubtitleWhereInput>
  subtitle_isNull?: InputMaybe<Scalars['Boolean']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type DeliveryStatus = EmailFailure | EmailSuccess

export type DeliveryStatusWhereInput = {
  errorStatus_contains?: InputMaybe<Scalars['String']>
  errorStatus_containsInsensitive?: InputMaybe<Scalars['String']>
  errorStatus_endsWith?: InputMaybe<Scalars['String']>
  errorStatus_eq?: InputMaybe<Scalars['String']>
  errorStatus_gt?: InputMaybe<Scalars['String']>
  errorStatus_gte?: InputMaybe<Scalars['String']>
  errorStatus_in?: InputMaybe<Array<Scalars['String']>>
  errorStatus_isNull?: InputMaybe<Scalars['Boolean']>
  errorStatus_lt?: InputMaybe<Scalars['String']>
  errorStatus_lte?: InputMaybe<Scalars['String']>
  errorStatus_not_contains?: InputMaybe<Scalars['String']>
  errorStatus_not_containsInsensitive?: InputMaybe<Scalars['String']>
  errorStatus_not_endsWith?: InputMaybe<Scalars['String']>
  errorStatus_not_eq?: InputMaybe<Scalars['String']>
  errorStatus_not_in?: InputMaybe<Array<Scalars['String']>>
  errorStatus_not_startsWith?: InputMaybe<Scalars['String']>
  errorStatus_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export type DirectChannelPaymentByMember = {
  __typename?: 'DirectChannelPaymentByMember'
  /** amount paid */
  amount: Scalars['BigInt']
  /** payer handle */
  payerHandle: Scalars['String']
  /** payer id */
  payerId: Scalars['String']
}

export type DistributionBucket = {
  __typename?: 'DistributionBucket'
  /** Whether the bucket is accepting any new bags */
  acceptingNewBags: Scalars['Boolean']
  /** Storage bags assigned to the bucket */
  bags: Array<DistributionBucketBag>
  /** Bucket index within the family */
  bucketIndex: Scalars['Int']
  /** Whether the bucket is currently distributing content */
  distributing: Scalars['Boolean']
  /** Distribution family the bucket is part of */
  family: DistributionBucketFamily
  /** Runtime bucket id in {familyId}:{bucketIndex} format */
  id: Scalars['String']
  /** Distribution bucket operators (either active or invited) */
  operators: Array<DistributionBucketOperator>
}

export type DistributionBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketBagOrderByInput>>
  where?: InputMaybe<DistributionBucketBagWhereInput>
}

export type DistributionBucketOperatorsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorWhereInput>
}

export type DistributionBucketBag = {
  __typename?: 'DistributionBucketBag'
  bag: StorageBag
  distributionBucket: DistributionBucket
  /** {distributionBucketId}-{storageBagId} */
  id: Scalars['String']
}

export type DistributionBucketBagEdge = {
  __typename?: 'DistributionBucketBagEdge'
  cursor: Scalars['String']
  node: DistributionBucketBag
}

export enum DistributionBucketBagOrderByInput {
  BagIdAsc = 'bag_id_ASC',
  BagIdDesc = 'bag_id_DESC',
  DistributionBucketAcceptingNewBagsAsc = 'distributionBucket_acceptingNewBags_ASC',
  DistributionBucketAcceptingNewBagsDesc = 'distributionBucket_acceptingNewBags_DESC',
  DistributionBucketBucketIndexAsc = 'distributionBucket_bucketIndex_ASC',
  DistributionBucketBucketIndexDesc = 'distributionBucket_bucketIndex_DESC',
  DistributionBucketDistributingAsc = 'distributionBucket_distributing_ASC',
  DistributionBucketDistributingDesc = 'distributionBucket_distributing_DESC',
  DistributionBucketIdAsc = 'distributionBucket_id_ASC',
  DistributionBucketIdDesc = 'distributionBucket_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type DistributionBucketBagWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketBagWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketBagWhereInput>>
  bag?: InputMaybe<StorageBagWhereInput>
  bag_isNull?: InputMaybe<Scalars['Boolean']>
  distributionBucket?: InputMaybe<DistributionBucketWhereInput>
  distributionBucket_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
}

export type DistributionBucketBagsConnection = {
  __typename?: 'DistributionBucketBagsConnection'
  edges: Array<DistributionBucketBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketEdge = {
  __typename?: 'DistributionBucketEdge'
  cursor: Scalars['String']
  node: DistributionBucket
}

export type DistributionBucketFamiliesConnection = {
  __typename?: 'DistributionBucketFamiliesConnection'
  edges: Array<DistributionBucketFamilyEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamily = {
  __typename?: 'DistributionBucketFamily'
  /** Distribution buckets belonging to the family */
  buckets: Array<DistributionBucket>
  /** Runtime bucket family id */
  id: Scalars['String']
  /** Current bucket family metadata */
  metadata?: Maybe<DistributionBucketFamilyMetadata>
}

export type DistributionBucketFamilyBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOrderByInput>>
  where?: InputMaybe<DistributionBucketWhereInput>
}

export type DistributionBucketFamilyEdge = {
  __typename?: 'DistributionBucketFamilyEdge'
  cursor: Scalars['String']
  node: DistributionBucketFamily
}

export type DistributionBucketFamilyMetadata = {
  __typename?: 'DistributionBucketFamilyMetadata'
  /** Geographical areas covered by the family */
  areas?: Maybe<Array<GeographicalArea>>
  /** Optional, more specific description of the region covered by the family */
  description?: Maybe<Scalars['String']>
  /** Distribution bucket family */
  family: DistributionBucketFamily
  id: Scalars['String']
  /** List of targets (hosts/ips) best suited latency measurements for the family */
  latencyTestTargets?: Maybe<Array<Maybe<Scalars['String']>>>
  /** Name of the geographical region covered by the family (ie.: us-east-1) */
  region?: Maybe<Scalars['String']>
}

export type DistributionBucketFamilyMetadataConnection = {
  __typename?: 'DistributionBucketFamilyMetadataConnection'
  edges: Array<DistributionBucketFamilyMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketFamilyMetadataEdge = {
  __typename?: 'DistributionBucketFamilyMetadataEdge'
  cursor: Scalars['String']
  node: DistributionBucketFamilyMetadata
}

export enum DistributionBucketFamilyMetadataOrderByInput {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  FamilyIdAsc = 'family_id_ASC',
  FamilyIdDesc = 'family_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  RegionAsc = 'region_ASC',
  RegionDesc = 'region_DESC',
}

export type DistributionBucketFamilyMetadataWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketFamilyMetadataWhereInput>>
  areas_isNull?: InputMaybe<Scalars['Boolean']>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  family?: InputMaybe<DistributionBucketFamilyWhereInput>
  family_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  latencyTestTargets_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  latencyTestTargets_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  latencyTestTargets_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  latencyTestTargets_isNull?: InputMaybe<Scalars['Boolean']>
  region_contains?: InputMaybe<Scalars['String']>
  region_containsInsensitive?: InputMaybe<Scalars['String']>
  region_endsWith?: InputMaybe<Scalars['String']>
  region_eq?: InputMaybe<Scalars['String']>
  region_gt?: InputMaybe<Scalars['String']>
  region_gte?: InputMaybe<Scalars['String']>
  region_in?: InputMaybe<Array<Scalars['String']>>
  region_isNull?: InputMaybe<Scalars['Boolean']>
  region_lt?: InputMaybe<Scalars['String']>
  region_lte?: InputMaybe<Scalars['String']>
  region_not_contains?: InputMaybe<Scalars['String']>
  region_not_containsInsensitive?: InputMaybe<Scalars['String']>
  region_not_endsWith?: InputMaybe<Scalars['String']>
  region_not_eq?: InputMaybe<Scalars['String']>
  region_not_in?: InputMaybe<Array<Scalars['String']>>
  region_not_startsWith?: InputMaybe<Scalars['String']>
  region_startsWith?: InputMaybe<Scalars['String']>
}

export enum DistributionBucketFamilyOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataDescriptionAsc = 'metadata_description_ASC',
  MetadataDescriptionDesc = 'metadata_description_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataRegionAsc = 'metadata_region_ASC',
  MetadataRegionDesc = 'metadata_region_DESC',
}

export type DistributionBucketFamilyWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketFamilyWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketFamilyWhereInput>>
  buckets_every?: InputMaybe<DistributionBucketWhereInput>
  buckets_none?: InputMaybe<DistributionBucketWhereInput>
  buckets_some?: InputMaybe<DistributionBucketWhereInput>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
  metadata_isNull?: InputMaybe<Scalars['Boolean']>
}

export type DistributionBucketOperator = {
  __typename?: 'DistributionBucketOperator'
  /** Related distirbution bucket */
  distributionBucket: DistributionBucket
  /** {bucketId}-{workerId} */
  id: Scalars['String']
  /** Operator metadata */
  metadata?: Maybe<DistributionBucketOperatorMetadata>
  /** Current operator status */
  status: DistributionBucketOperatorStatus
  /** ID of the distribution group worker */
  workerId: Scalars['Int']
}

export type DistributionBucketOperatorEdge = {
  __typename?: 'DistributionBucketOperatorEdge'
  cursor: Scalars['String']
  node: DistributionBucketOperator
}

export type DistributionBucketOperatorMetadata = {
  __typename?: 'DistributionBucketOperatorMetadata'
  /** Distribution bucket operator */
  distirbutionBucketOperator: DistributionBucketOperator
  /** Additional information about the node/operator */
  extra?: Maybe<Scalars['String']>
  id: Scalars['String']
  /** Root distributor node api endpoint */
  nodeEndpoint?: Maybe<Scalars['String']>
  /** Optional node location metadata */
  nodeLocation?: Maybe<NodeLocationMetadata>
}

export type DistributionBucketOperatorMetadataConnection = {
  __typename?: 'DistributionBucketOperatorMetadataConnection'
  edges: Array<DistributionBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type DistributionBucketOperatorMetadataEdge = {
  __typename?: 'DistributionBucketOperatorMetadataEdge'
  cursor: Scalars['String']
  node: DistributionBucketOperatorMetadata
}

export enum DistributionBucketOperatorMetadataOrderByInput {
  DistirbutionBucketOperatorIdAsc = 'distirbutionBucketOperator_id_ASC',
  DistirbutionBucketOperatorIdDesc = 'distirbutionBucketOperator_id_DESC',
  DistirbutionBucketOperatorStatusAsc = 'distirbutionBucketOperator_status_ASC',
  DistirbutionBucketOperatorStatusDesc = 'distirbutionBucketOperator_status_DESC',
  DistirbutionBucketOperatorWorkerIdAsc = 'distirbutionBucketOperator_workerId_ASC',
  DistirbutionBucketOperatorWorkerIdDesc = 'distirbutionBucketOperator_workerId_DESC',
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationCityAsc = 'nodeLocation_city_ASC',
  NodeLocationCityDesc = 'nodeLocation_city_DESC',
  NodeLocationCountryCodeAsc = 'nodeLocation_countryCode_ASC',
  NodeLocationCountryCodeDesc = 'nodeLocation_countryCode_DESC',
}

export type DistributionBucketOperatorMetadataWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketOperatorMetadataWhereInput>>
  distirbutionBucketOperator?: InputMaybe<DistributionBucketOperatorWhereInput>
  distirbutionBucketOperator_isNull?: InputMaybe<Scalars['Boolean']>
  extra_contains?: InputMaybe<Scalars['String']>
  extra_containsInsensitive?: InputMaybe<Scalars['String']>
  extra_endsWith?: InputMaybe<Scalars['String']>
  extra_eq?: InputMaybe<Scalars['String']>
  extra_gt?: InputMaybe<Scalars['String']>
  extra_gte?: InputMaybe<Scalars['String']>
  extra_in?: InputMaybe<Array<Scalars['String']>>
  extra_isNull?: InputMaybe<Scalars['Boolean']>
  extra_lt?: InputMaybe<Scalars['String']>
  extra_lte?: InputMaybe<Scalars['String']>
  extra_not_contains?: InputMaybe<Scalars['String']>
  extra_not_containsInsensitive?: InputMaybe<Scalars['String']>
  extra_not_endsWith?: InputMaybe<Scalars['String']>
  extra_not_eq?: InputMaybe<Scalars['String']>
  extra_not_in?: InputMaybe<Array<Scalars['String']>>
  extra_not_startsWith?: InputMaybe<Scalars['String']>
  extra_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_containsInsensitive?: InputMaybe<Scalars['String']>
  nodeEndpoint_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_gt?: InputMaybe<Scalars['String']>
  nodeEndpoint_gte?: InputMaybe<Scalars['String']>
  nodeEndpoint_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_isNull?: InputMaybe<Scalars['Boolean']>
  nodeEndpoint_lt?: InputMaybe<Scalars['String']>
  nodeEndpoint_lte?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_containsInsensitive?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_not_startsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_startsWith?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<NodeLocationMetadataWhereInput>
  nodeLocation_isNull?: InputMaybe<Scalars['Boolean']>
}

export enum DistributionBucketOperatorOrderByInput {
  DistributionBucketAcceptingNewBagsAsc = 'distributionBucket_acceptingNewBags_ASC',
  DistributionBucketAcceptingNewBagsDesc = 'distributionBucket_acceptingNewBags_DESC',
  DistributionBucketBucketIndexAsc = 'distributionBucket_bucketIndex_ASC',
  DistributionBucketBucketIndexDesc = 'distributionBucket_bucketIndex_DESC',
  DistributionBucketDistributingAsc = 'distributionBucket_distributing_ASC',
  DistributionBucketDistributingDesc = 'distributionBucket_distributing_DESC',
  DistributionBucketIdAsc = 'distributionBucket_id_ASC',
  DistributionBucketIdDesc = 'distributionBucket_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataExtraAsc = 'metadata_extra_ASC',
  MetadataExtraDesc = 'metadata_extra_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataNodeEndpointAsc = 'metadata_nodeEndpoint_ASC',
  MetadataNodeEndpointDesc = 'metadata_nodeEndpoint_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  WorkerIdAsc = 'workerId_ASC',
  WorkerIdDesc = 'workerId_DESC',
}

export enum DistributionBucketOperatorStatus {
  Active = 'ACTIVE',
  Invited = 'INVITED',
}

export type DistributionBucketOperatorWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketOperatorWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketOperatorWhereInput>>
  distributionBucket?: InputMaybe<DistributionBucketWhereInput>
  distributionBucket_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
  metadata_isNull?: InputMaybe<Scalars['Boolean']>
  status_eq?: InputMaybe<DistributionBucketOperatorStatus>
  status_in?: InputMaybe<Array<DistributionBucketOperatorStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<DistributionBucketOperatorStatus>
  status_not_in?: InputMaybe<Array<DistributionBucketOperatorStatus>>
  workerId_eq?: InputMaybe<Scalars['Int']>
  workerId_gt?: InputMaybe<Scalars['Int']>
  workerId_gte?: InputMaybe<Scalars['Int']>
  workerId_in?: InputMaybe<Array<Scalars['Int']>>
  workerId_isNull?: InputMaybe<Scalars['Boolean']>
  workerId_lt?: InputMaybe<Scalars['Int']>
  workerId_lte?: InputMaybe<Scalars['Int']>
  workerId_not_eq?: InputMaybe<Scalars['Int']>
  workerId_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export type DistributionBucketOperatorsConnection = {
  __typename?: 'DistributionBucketOperatorsConnection'
  edges: Array<DistributionBucketOperatorEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum DistributionBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  BucketIndexAsc = 'bucketIndex_ASC',
  BucketIndexDesc = 'bucketIndex_DESC',
  DistributingAsc = 'distributing_ASC',
  DistributingDesc = 'distributing_DESC',
  FamilyIdAsc = 'family_id_ASC',
  FamilyIdDesc = 'family_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type DistributionBucketWhereInput = {
  AND?: InputMaybe<Array<DistributionBucketWhereInput>>
  OR?: InputMaybe<Array<DistributionBucketWhereInput>>
  acceptingNewBags_eq?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_isNull?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_not_eq?: InputMaybe<Scalars['Boolean']>
  bags_every?: InputMaybe<DistributionBucketBagWhereInput>
  bags_none?: InputMaybe<DistributionBucketBagWhereInput>
  bags_some?: InputMaybe<DistributionBucketBagWhereInput>
  bucketIndex_eq?: InputMaybe<Scalars['Int']>
  bucketIndex_gt?: InputMaybe<Scalars['Int']>
  bucketIndex_gte?: InputMaybe<Scalars['Int']>
  bucketIndex_in?: InputMaybe<Array<Scalars['Int']>>
  bucketIndex_isNull?: InputMaybe<Scalars['Boolean']>
  bucketIndex_lt?: InputMaybe<Scalars['Int']>
  bucketIndex_lte?: InputMaybe<Scalars['Int']>
  bucketIndex_not_eq?: InputMaybe<Scalars['Int']>
  bucketIndex_not_in?: InputMaybe<Array<Scalars['Int']>>
  distributing_eq?: InputMaybe<Scalars['Boolean']>
  distributing_isNull?: InputMaybe<Scalars['Boolean']>
  distributing_not_eq?: InputMaybe<Scalars['Boolean']>
  family?: InputMaybe<DistributionBucketFamilyWhereInput>
  family_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  operators_every?: InputMaybe<DistributionBucketOperatorWhereInput>
  operators_none?: InputMaybe<DistributionBucketOperatorWhereInput>
  operators_some?: InputMaybe<DistributionBucketOperatorWhereInput>
}

export type DistributionBucketsConnection = {
  __typename?: 'DistributionBucketsConnection'
  edges: Array<DistributionBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type EarningStatsOutput = {
  __typename?: 'EarningStatsOutput'
  crtSaleVolume: Scalars['String']
  nftSaleVolume: Scalars['String']
  totalRewardsPaid: Scalars['String']
}

export type EmailDeliveryAttempt = {
  __typename?: 'EmailDeliveryAttempt'
  /** UUID */
  id: Scalars['String']
  /** notification Fk */
  notificationDelivery: NotificationEmailDelivery
  /** delivery status */
  status: DeliveryStatus
  /** datetime */
  timestamp: Scalars['DateTime']
}

export type EmailDeliveryAttemptEdge = {
  __typename?: 'EmailDeliveryAttemptEdge'
  cursor: Scalars['String']
  node: EmailDeliveryAttempt
}

export enum EmailDeliveryAttemptOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NotificationDeliveryDiscardAsc = 'notificationDelivery_discard_ASC',
  NotificationDeliveryDiscardDesc = 'notificationDelivery_discard_DESC',
  NotificationDeliveryIdAsc = 'notificationDelivery_id_ASC',
  NotificationDeliveryIdDesc = 'notificationDelivery_id_DESC',
  StatusErrorStatusAsc = 'status_errorStatus_ASC',
  StatusErrorStatusDesc = 'status_errorStatus_DESC',
  StatusIsTypeOfAsc = 'status_isTypeOf_ASC',
  StatusIsTypeOfDesc = 'status_isTypeOf_DESC',
  StatusPhantomAsc = 'status_phantom_ASC',
  StatusPhantomDesc = 'status_phantom_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type EmailDeliveryAttemptWhereInput = {
  AND?: InputMaybe<Array<EmailDeliveryAttemptWhereInput>>
  OR?: InputMaybe<Array<EmailDeliveryAttemptWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  notificationDelivery?: InputMaybe<NotificationEmailDeliveryWhereInput>
  notificationDelivery_isNull?: InputMaybe<Scalars['Boolean']>
  status?: InputMaybe<DeliveryStatusWhereInput>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type EmailDeliveryAttemptsConnection = {
  __typename?: 'EmailDeliveryAttemptsConnection'
  edges: Array<EmailDeliveryAttemptEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type EmailFailure = {
  __typename?: 'EmailFailure'
  errorStatus: Scalars['String']
}

export type EmailSuccess = {
  __typename?: 'EmailSuccess'
  phantom?: Maybe<Scalars['Int']>
}

export type EncryptionArtifacts = {
  __typename?: 'EncryptionArtifacts'
  /** The account the encryption artifacts are associated with */
  account: Account
  /** The IV used to encrypt the wallet seed with user credentials */
  cipherIv: Scalars['String']
  /** Wallet seed encrypted with user credentials */
  encryptedSeed: Scalars['String']
  /** ID / lookupKey */
  id: Scalars['String']
}

export type EncryptionArtifactsConnection = {
  __typename?: 'EncryptionArtifactsConnection'
  edges: Array<EncryptionArtifactsEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type EncryptionArtifactsEdge = {
  __typename?: 'EncryptionArtifactsEdge'
  cursor: Scalars['String']
  node: EncryptionArtifacts
}

export enum EncryptionArtifactsOrderByInput {
  AccountEmailAsc = 'account_email_ASC',
  AccountEmailDesc = 'account_email_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountIsBlockedAsc = 'account_isBlocked_ASC',
  AccountIsBlockedDesc = 'account_isBlocked_DESC',
  AccountIsEmailConfirmedAsc = 'account_isEmailConfirmed_ASC',
  AccountIsEmailConfirmedDesc = 'account_isEmailConfirmed_DESC',
  AccountJoystreamAccountAsc = 'account_joystreamAccount_ASC',
  AccountJoystreamAccountDesc = 'account_joystreamAccount_DESC',
  AccountReferrerChannelIdAsc = 'account_referrerChannelId_ASC',
  AccountReferrerChannelIdDesc = 'account_referrerChannelId_DESC',
  AccountRegisteredAtAsc = 'account_registeredAt_ASC',
  AccountRegisteredAtDesc = 'account_registeredAt_DESC',
  CipherIvAsc = 'cipherIv_ASC',
  CipherIvDesc = 'cipherIv_DESC',
  EncryptedSeedAsc = 'encryptedSeed_ASC',
  EncryptedSeedDesc = 'encryptedSeed_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type EncryptionArtifactsWhereInput = {
  AND?: InputMaybe<Array<EncryptionArtifactsWhereInput>>
  OR?: InputMaybe<Array<EncryptionArtifactsWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  cipherIv_contains?: InputMaybe<Scalars['String']>
  cipherIv_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherIv_endsWith?: InputMaybe<Scalars['String']>
  cipherIv_eq?: InputMaybe<Scalars['String']>
  cipherIv_gt?: InputMaybe<Scalars['String']>
  cipherIv_gte?: InputMaybe<Scalars['String']>
  cipherIv_in?: InputMaybe<Array<Scalars['String']>>
  cipherIv_isNull?: InputMaybe<Scalars['Boolean']>
  cipherIv_lt?: InputMaybe<Scalars['String']>
  cipherIv_lte?: InputMaybe<Scalars['String']>
  cipherIv_not_contains?: InputMaybe<Scalars['String']>
  cipherIv_not_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherIv_not_endsWith?: InputMaybe<Scalars['String']>
  cipherIv_not_eq?: InputMaybe<Scalars['String']>
  cipherIv_not_in?: InputMaybe<Array<Scalars['String']>>
  cipherIv_not_startsWith?: InputMaybe<Scalars['String']>
  cipherIv_startsWith?: InputMaybe<Scalars['String']>
  encryptedSeed_contains?: InputMaybe<Scalars['String']>
  encryptedSeed_containsInsensitive?: InputMaybe<Scalars['String']>
  encryptedSeed_endsWith?: InputMaybe<Scalars['String']>
  encryptedSeed_eq?: InputMaybe<Scalars['String']>
  encryptedSeed_gt?: InputMaybe<Scalars['String']>
  encryptedSeed_gte?: InputMaybe<Scalars['String']>
  encryptedSeed_in?: InputMaybe<Array<Scalars['String']>>
  encryptedSeed_isNull?: InputMaybe<Scalars['Boolean']>
  encryptedSeed_lt?: InputMaybe<Scalars['String']>
  encryptedSeed_lte?: InputMaybe<Scalars['String']>
  encryptedSeed_not_contains?: InputMaybe<Scalars['String']>
  encryptedSeed_not_containsInsensitive?: InputMaybe<Scalars['String']>
  encryptedSeed_not_endsWith?: InputMaybe<Scalars['String']>
  encryptedSeed_not_eq?: InputMaybe<Scalars['String']>
  encryptedSeed_not_in?: InputMaybe<Array<Scalars['String']>>
  encryptedSeed_not_startsWith?: InputMaybe<Scalars['String']>
  encryptedSeed_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
}

export type EnglishAuctionSettledEventData = {
  __typename?: 'EnglishAuctionSettledEventData'
  /** NFT owner before the english auction was settled */
  previousNftOwner: NftOwner
  /** English auction winning bid */
  winningBid: Bid
}

export type EnglishAuctionStartedEventData = {
  __typename?: 'EnglishAuctionStartedEventData'
  /** Actor that started this auction. */
  actor: ContentActor
  /** Auction started. */
  auction: Auction
  /** owner of the NFT being auctioned */
  nftOwner: NftOwner
}

export type EntityReportInfo = {
  __typename?: 'EntityReportInfo'
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
}

export type Event = {
  __typename?: 'Event'
  /** More specific event data, which depends on event type */
  data: EventData
  /** {blockNumber}-{indexInBlock} */
  id: Scalars['String']
  /** Blocknumber of the block in which the event was emitted. */
  inBlock: Scalars['Int']
  /** Hash of the extrinsic the event was emitted in */
  inExtrinsic?: Maybe<Scalars['String']>
  /** Index of event in block from which it was emitted. */
  indexInBlock: Scalars['Int']
  /** Timestamp of the block the event was emitted in */
  timestamp: Scalars['DateTime']
}

export type EventData =
  | AuctionBidCanceledEventData
  | AuctionBidMadeEventData
  | AuctionCanceledEventData
  | BidMadeCompletingAuctionEventData
  | BuyNowCanceledEventData
  | BuyNowPriceUpdatedEventData
  | ChannelAssetsDeletedByModeratorEventData
  | ChannelCreatedEventData
  | ChannelFundsWithdrawnEventData
  | ChannelPaymentMadeEventData
  | ChannelPayoutsUpdatedEventData
  | ChannelRewardClaimedAndWithdrawnEventData
  | ChannelRewardClaimedEventData
  | CommentCreatedEventData
  | CommentReactionEventData
  | CommentTextUpdatedEventData
  | CreatorTokenIssuedEventData
  | CreatorTokenMarketBurnEventData
  | CreatorTokenMarketMintEventData
  | CreatorTokenMarketStartedEventData
  | CreatorTokenRevenueSplitIssuedEventData
  | CreatorTokenSaleMintEventData
  | CreatorTokenSaleStartedEventData
  | EnglishAuctionSettledEventData
  | EnglishAuctionStartedEventData
  | MemberBannedFromChannelEventData
  | MetaprotocolTransactionStatusEventData
  | NftBoughtEventData
  | NftIssuedEventData
  | NftOfferedEventData
  | NftSellOrderMadeEventData
  | OpenAuctionBidAcceptedEventData
  | OpenAuctionStartedEventData
  | VideoAssetsDeletedByModeratorEventData
  | VideoCreatedEventData
  | VideoReactionEventData

export type EventDataWhereInput = {
  account_contains?: InputMaybe<Scalars['String']>
  account_containsInsensitive?: InputMaybe<Scalars['String']>
  account_endsWith?: InputMaybe<Scalars['String']>
  account_eq?: InputMaybe<Scalars['String']>
  account_gt?: InputMaybe<Scalars['String']>
  account_gte?: InputMaybe<Scalars['String']>
  account_in?: InputMaybe<Array<Scalars['String']>>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  account_lt?: InputMaybe<Scalars['String']>
  account_lte?: InputMaybe<Scalars['String']>
  account_not_contains?: InputMaybe<Scalars['String']>
  account_not_containsInsensitive?: InputMaybe<Scalars['String']>
  account_not_endsWith?: InputMaybe<Scalars['String']>
  account_not_eq?: InputMaybe<Scalars['String']>
  account_not_in?: InputMaybe<Array<Scalars['String']>>
  account_not_startsWith?: InputMaybe<Scalars['String']>
  account_startsWith?: InputMaybe<Scalars['String']>
  action_eq?: InputMaybe<Scalars['Boolean']>
  action_isNull?: InputMaybe<Scalars['Boolean']>
  action_not_eq?: InputMaybe<Scalars['Boolean']>
  actor?: InputMaybe<ContentActorWhereInput>
  actor_isNull?: InputMaybe<Scalars['Boolean']>
  ammBurnTransaction?: InputMaybe<AmmTransactionWhereInput>
  ammBurnTransaction_isNull?: InputMaybe<Scalars['Boolean']>
  ammCurve?: InputMaybe<AmmCurveWhereInput>
  ammCurve_isNull?: InputMaybe<Scalars['Boolean']>
  ammMintTransaction?: InputMaybe<AmmTransactionWhereInput>
  ammMintTransaction_isNull?: InputMaybe<Scalars['Boolean']>
  amount_eq?: InputMaybe<Scalars['BigInt']>
  amount_gt?: InputMaybe<Scalars['BigInt']>
  amount_gte?: InputMaybe<Scalars['BigInt']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>
  amount_isNull?: InputMaybe<Scalars['Boolean']>
  amount_lt?: InputMaybe<Scalars['BigInt']>
  amount_lte?: InputMaybe<Scalars['BigInt']>
  amount_not_eq?: InputMaybe<Scalars['BigInt']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  assetIds_containsAll?: InputMaybe<Array<Scalars['BigInt']>>
  assetIds_containsAny?: InputMaybe<Array<Scalars['BigInt']>>
  assetIds_containsNone?: InputMaybe<Array<Scalars['BigInt']>>
  assetIds_isNull?: InputMaybe<Scalars['Boolean']>
  auction?: InputMaybe<AuctionWhereInput>
  auction_isNull?: InputMaybe<Scalars['Boolean']>
  bid?: InputMaybe<BidWhereInput>
  bid_isNull?: InputMaybe<Scalars['Boolean']>
  buyer?: InputMaybe<MembershipWhereInput>
  buyer_isNull?: InputMaybe<Scalars['Boolean']>
  channel?: InputMaybe<ChannelWhereInput>
  channelCashoutsEnabled_eq?: InputMaybe<Scalars['Boolean']>
  channelCashoutsEnabled_isNull?: InputMaybe<Scalars['Boolean']>
  channelCashoutsEnabled_not_eq?: InputMaybe<Scalars['Boolean']>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  comment?: InputMaybe<CommentWhereInput>
  commentReaction?: InputMaybe<CommentReactionWhereInput>
  commentReaction_isNull?: InputMaybe<Scalars['Boolean']>
  comment_isNull?: InputMaybe<Scalars['Boolean']>
  commitment_contains?: InputMaybe<Scalars['String']>
  commitment_containsInsensitive?: InputMaybe<Scalars['String']>
  commitment_endsWith?: InputMaybe<Scalars['String']>
  commitment_eq?: InputMaybe<Scalars['String']>
  commitment_gt?: InputMaybe<Scalars['String']>
  commitment_gte?: InputMaybe<Scalars['String']>
  commitment_in?: InputMaybe<Array<Scalars['String']>>
  commitment_isNull?: InputMaybe<Scalars['Boolean']>
  commitment_lt?: InputMaybe<Scalars['String']>
  commitment_lte?: InputMaybe<Scalars['String']>
  commitment_not_contains?: InputMaybe<Scalars['String']>
  commitment_not_containsInsensitive?: InputMaybe<Scalars['String']>
  commitment_not_endsWith?: InputMaybe<Scalars['String']>
  commitment_not_eq?: InputMaybe<Scalars['String']>
  commitment_not_in?: InputMaybe<Array<Scalars['String']>>
  commitment_not_startsWith?: InputMaybe<Scalars['String']>
  commitment_startsWith?: InputMaybe<Scalars['String']>
  deletedBy?: InputMaybe<ContentActorWhereInput>
  deletedBy_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  maxCashoutAllowed_eq?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_gt?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_gte?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_in?: InputMaybe<Array<Scalars['BigInt']>>
  maxCashoutAllowed_isNull?: InputMaybe<Scalars['Boolean']>
  maxCashoutAllowed_lt?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_lte?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_not_eq?: InputMaybe<Scalars['BigInt']>
  maxCashoutAllowed_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  minCashoutAllowed_eq?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_gt?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_gte?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_in?: InputMaybe<Array<Scalars['BigInt']>>
  minCashoutAllowed_isNull?: InputMaybe<Scalars['Boolean']>
  minCashoutAllowed_lt?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_lte?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_not_eq?: InputMaybe<Scalars['BigInt']>
  minCashoutAllowed_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  newPrice_eq?: InputMaybe<Scalars['BigInt']>
  newPrice_gt?: InputMaybe<Scalars['BigInt']>
  newPrice_gte?: InputMaybe<Scalars['BigInt']>
  newPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  newPrice_isNull?: InputMaybe<Scalars['Boolean']>
  newPrice_lt?: InputMaybe<Scalars['BigInt']>
  newPrice_lte?: InputMaybe<Scalars['BigInt']>
  newPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  newPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  newText_contains?: InputMaybe<Scalars['String']>
  newText_containsInsensitive?: InputMaybe<Scalars['String']>
  newText_endsWith?: InputMaybe<Scalars['String']>
  newText_eq?: InputMaybe<Scalars['String']>
  newText_gt?: InputMaybe<Scalars['String']>
  newText_gte?: InputMaybe<Scalars['String']>
  newText_in?: InputMaybe<Array<Scalars['String']>>
  newText_isNull?: InputMaybe<Scalars['Boolean']>
  newText_lt?: InputMaybe<Scalars['String']>
  newText_lte?: InputMaybe<Scalars['String']>
  newText_not_contains?: InputMaybe<Scalars['String']>
  newText_not_containsInsensitive?: InputMaybe<Scalars['String']>
  newText_not_endsWith?: InputMaybe<Scalars['String']>
  newText_not_eq?: InputMaybe<Scalars['String']>
  newText_not_in?: InputMaybe<Array<Scalars['String']>>
  newText_not_startsWith?: InputMaybe<Scalars['String']>
  newText_startsWith?: InputMaybe<Scalars['String']>
  nft?: InputMaybe<OwnedNftWhereInput>
  nftOwner?: InputMaybe<NftOwnerWhereInput>
  nftOwner_isNull?: InputMaybe<Scalars['Boolean']>
  nft_isNull?: InputMaybe<Scalars['Boolean']>
  payeeChannel?: InputMaybe<ChannelWhereInput>
  payeeChannel_isNull?: InputMaybe<Scalars['Boolean']>
  payer?: InputMaybe<MembershipWhereInput>
  payer_isNull?: InputMaybe<Scalars['Boolean']>
  payloadDataObject?: InputMaybe<StorageDataObjectWhereInput>
  payloadDataObject_isNull?: InputMaybe<Scalars['Boolean']>
  paymentContext?: InputMaybe<PaymentContextWhereInput>
  paymentContext_isNull?: InputMaybe<Scalars['Boolean']>
  previousNftOwner?: InputMaybe<NftOwnerWhereInput>
  previousNftOwner_isNull?: InputMaybe<Scalars['Boolean']>
  price_eq?: InputMaybe<Scalars['BigInt']>
  price_gt?: InputMaybe<Scalars['BigInt']>
  price_gte?: InputMaybe<Scalars['BigInt']>
  price_in?: InputMaybe<Array<Scalars['BigInt']>>
  price_isNull?: InputMaybe<Scalars['Boolean']>
  price_lt?: InputMaybe<Scalars['BigInt']>
  price_lte?: InputMaybe<Scalars['BigInt']>
  price_not_eq?: InputMaybe<Scalars['BigInt']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  rationale_contains?: InputMaybe<Scalars['String']>
  rationale_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_endsWith?: InputMaybe<Scalars['String']>
  rationale_eq?: InputMaybe<Scalars['String']>
  rationale_gt?: InputMaybe<Scalars['String']>
  rationale_gte?: InputMaybe<Scalars['String']>
  rationale_in?: InputMaybe<Array<Scalars['String']>>
  rationale_isNull?: InputMaybe<Scalars['Boolean']>
  rationale_lt?: InputMaybe<Scalars['String']>
  rationale_lte?: InputMaybe<Scalars['String']>
  rationale_not_contains?: InputMaybe<Scalars['String']>
  rationale_not_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_not_endsWith?: InputMaybe<Scalars['String']>
  rationale_not_eq?: InputMaybe<Scalars['String']>
  rationale_not_in?: InputMaybe<Array<Scalars['String']>>
  rationale_not_startsWith?: InputMaybe<Scalars['String']>
  rationale_startsWith?: InputMaybe<Scalars['String']>
  result?: InputMaybe<MetaprotocolTransactionResultWhereInput>
  result_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShare?: InputMaybe<RevenueShareWhereInput>
  revenueShare_isNull?: InputMaybe<Scalars['Boolean']>
  sale?: InputMaybe<SaleWhereInput>
  saleTransaction?: InputMaybe<SaleTransactionWhereInput>
  saleTransaction_isNull?: InputMaybe<Scalars['Boolean']>
  sale_isNull?: InputMaybe<Scalars['Boolean']>
  text_contains?: InputMaybe<Scalars['String']>
  text_containsInsensitive?: InputMaybe<Scalars['String']>
  text_endsWith?: InputMaybe<Scalars['String']>
  text_eq?: InputMaybe<Scalars['String']>
  text_gt?: InputMaybe<Scalars['String']>
  text_gte?: InputMaybe<Scalars['String']>
  text_in?: InputMaybe<Array<Scalars['String']>>
  text_isNull?: InputMaybe<Scalars['Boolean']>
  text_lt?: InputMaybe<Scalars['String']>
  text_lte?: InputMaybe<Scalars['String']>
  text_not_contains?: InputMaybe<Scalars['String']>
  text_not_containsInsensitive?: InputMaybe<Scalars['String']>
  text_not_endsWith?: InputMaybe<Scalars['String']>
  text_not_eq?: InputMaybe<Scalars['String']>
  text_not_in?: InputMaybe<Array<Scalars['String']>>
  text_not_startsWith?: InputMaybe<Scalars['String']>
  text_startsWith?: InputMaybe<Scalars['String']>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
  video?: InputMaybe<VideoWhereInput>
  videoReaction?: InputMaybe<VideoReactionWhereInput>
  videoReaction_isNull?: InputMaybe<Scalars['Boolean']>
  video_isNull?: InputMaybe<Scalars['Boolean']>
  winningBid?: InputMaybe<BidWhereInput>
  winningBid_isNull?: InputMaybe<Scalars['Boolean']>
}

export type EventEdge = {
  __typename?: 'EventEdge'
  cursor: Scalars['String']
  node: Event
}

export enum EventOrderByInput {
  DataAccountAsc = 'data_account_ASC',
  DataAccountDesc = 'data_account_DESC',
  DataActionAsc = 'data_action_ASC',
  DataActionDesc = 'data_action_DESC',
  DataAmountAsc = 'data_amount_ASC',
  DataAmountDesc = 'data_amount_DESC',
  DataChannelCashoutsEnabledAsc = 'data_channelCashoutsEnabled_ASC',
  DataChannelCashoutsEnabledDesc = 'data_channelCashoutsEnabled_DESC',
  DataCommitmentAsc = 'data_commitment_ASC',
  DataCommitmentDesc = 'data_commitment_DESC',
  DataIsTypeOfAsc = 'data_isTypeOf_ASC',
  DataIsTypeOfDesc = 'data_isTypeOf_DESC',
  DataMaxCashoutAllowedAsc = 'data_maxCashoutAllowed_ASC',
  DataMaxCashoutAllowedDesc = 'data_maxCashoutAllowed_DESC',
  DataMinCashoutAllowedAsc = 'data_minCashoutAllowed_ASC',
  DataMinCashoutAllowedDesc = 'data_minCashoutAllowed_DESC',
  DataNewPriceAsc = 'data_newPrice_ASC',
  DataNewPriceDesc = 'data_newPrice_DESC',
  DataNewTextAsc = 'data_newText_ASC',
  DataNewTextDesc = 'data_newText_DESC',
  DataPriceAsc = 'data_price_ASC',
  DataPriceDesc = 'data_price_DESC',
  DataRationaleAsc = 'data_rationale_ASC',
  DataRationaleDesc = 'data_rationale_DESC',
  DataTextAsc = 'data_text_ASC',
  DataTextDesc = 'data_text_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InBlockAsc = 'inBlock_ASC',
  InBlockDesc = 'inBlock_DESC',
  InExtrinsicAsc = 'inExtrinsic_ASC',
  InExtrinsicDesc = 'inExtrinsic_DESC',
  IndexInBlockAsc = 'indexInBlock_ASC',
  IndexInBlockDesc = 'indexInBlock_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
}

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>
  OR?: InputMaybe<Array<EventWhereInput>>
  data?: InputMaybe<EventDataWhereInput>
  data_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  inBlock_eq?: InputMaybe<Scalars['Int']>
  inBlock_gt?: InputMaybe<Scalars['Int']>
  inBlock_gte?: InputMaybe<Scalars['Int']>
  inBlock_in?: InputMaybe<Array<Scalars['Int']>>
  inBlock_isNull?: InputMaybe<Scalars['Boolean']>
  inBlock_lt?: InputMaybe<Scalars['Int']>
  inBlock_lte?: InputMaybe<Scalars['Int']>
  inBlock_not_eq?: InputMaybe<Scalars['Int']>
  inBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  inExtrinsic_contains?: InputMaybe<Scalars['String']>
  inExtrinsic_containsInsensitive?: InputMaybe<Scalars['String']>
  inExtrinsic_endsWith?: InputMaybe<Scalars['String']>
  inExtrinsic_eq?: InputMaybe<Scalars['String']>
  inExtrinsic_gt?: InputMaybe<Scalars['String']>
  inExtrinsic_gte?: InputMaybe<Scalars['String']>
  inExtrinsic_in?: InputMaybe<Array<Scalars['String']>>
  inExtrinsic_isNull?: InputMaybe<Scalars['Boolean']>
  inExtrinsic_lt?: InputMaybe<Scalars['String']>
  inExtrinsic_lte?: InputMaybe<Scalars['String']>
  inExtrinsic_not_contains?: InputMaybe<Scalars['String']>
  inExtrinsic_not_containsInsensitive?: InputMaybe<Scalars['String']>
  inExtrinsic_not_endsWith?: InputMaybe<Scalars['String']>
  inExtrinsic_not_eq?: InputMaybe<Scalars['String']>
  inExtrinsic_not_in?: InputMaybe<Array<Scalars['String']>>
  inExtrinsic_not_startsWith?: InputMaybe<Scalars['String']>
  inExtrinsic_startsWith?: InputMaybe<Scalars['String']>
  indexInBlock_eq?: InputMaybe<Scalars['Int']>
  indexInBlock_gt?: InputMaybe<Scalars['Int']>
  indexInBlock_gte?: InputMaybe<Scalars['Int']>
  indexInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  indexInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  indexInBlock_lt?: InputMaybe<Scalars['Int']>
  indexInBlock_lte?: InputMaybe<Scalars['Int']>
  indexInBlock_not_eq?: InputMaybe<Scalars['Int']>
  indexInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type EventsConnection = {
  __typename?: 'EventsConnection'
  edges: Array<EventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum ExcludableContentType {
  Channel = 'Channel',
  Comment = 'Comment',
  Video = 'Video',
}

export type ExcludeChannelResult = {
  __typename?: 'ExcludeChannelResult'
  channelId: Scalars['String']
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
}

export type ExcludeContentResult = {
  __typename?: 'ExcludeContentResult'
  numberOfEntitiesAffected: Scalars['Int']
}

export type ExcludeVideoInfo = {
  __typename?: 'ExcludeVideoInfo'
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
  videoId: Scalars['String']
}

export type Exclusion = {
  __typename?: 'Exclusion'
  /** If it's a channel exclusion: ID of the channel being reported (the channel may no longer exist) */
  channelId?: Maybe<Scalars['String']>
  /** Unique identifier of the exclusion */
  id: Scalars['String']
  /** Rationale behind the exclusion */
  rationale: Scalars['String']
  /** Time of the exclusion */
  timestamp: Scalars['DateTime']
  /** If it's a video exclusion: ID of the video being reported (the video may no longer exist) */
  videoId?: Maybe<Scalars['String']>
}

export type ExclusionEdge = {
  __typename?: 'ExclusionEdge'
  cursor: Scalars['String']
  node: Exclusion
}

export enum ExclusionOrderByInput {
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  RationaleAsc = 'rationale_ASC',
  RationaleDesc = 'rationale_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  VideoIdAsc = 'videoId_ASC',
  VideoIdDesc = 'videoId_DESC',
}

export type ExclusionWhereInput = {
  AND?: InputMaybe<Array<ExclusionWhereInput>>
  OR?: InputMaybe<Array<ExclusionWhereInput>>
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  rationale_contains?: InputMaybe<Scalars['String']>
  rationale_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_endsWith?: InputMaybe<Scalars['String']>
  rationale_eq?: InputMaybe<Scalars['String']>
  rationale_gt?: InputMaybe<Scalars['String']>
  rationale_gte?: InputMaybe<Scalars['String']>
  rationale_in?: InputMaybe<Array<Scalars['String']>>
  rationale_isNull?: InputMaybe<Scalars['Boolean']>
  rationale_lt?: InputMaybe<Scalars['String']>
  rationale_lte?: InputMaybe<Scalars['String']>
  rationale_not_contains?: InputMaybe<Scalars['String']>
  rationale_not_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_not_endsWith?: InputMaybe<Scalars['String']>
  rationale_not_eq?: InputMaybe<Scalars['String']>
  rationale_not_in?: InputMaybe<Array<Scalars['String']>>
  rationale_not_startsWith?: InputMaybe<Scalars['String']>
  rationale_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  videoId_contains?: InputMaybe<Scalars['String']>
  videoId_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_endsWith?: InputMaybe<Scalars['String']>
  videoId_eq?: InputMaybe<Scalars['String']>
  videoId_gt?: InputMaybe<Scalars['String']>
  videoId_gte?: InputMaybe<Scalars['String']>
  videoId_in?: InputMaybe<Array<Scalars['String']>>
  videoId_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_lt?: InputMaybe<Scalars['String']>
  videoId_lte?: InputMaybe<Scalars['String']>
  videoId_not_contains?: InputMaybe<Scalars['String']>
  videoId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_not_endsWith?: InputMaybe<Scalars['String']>
  videoId_not_eq?: InputMaybe<Scalars['String']>
  videoId_not_in?: InputMaybe<Array<Scalars['String']>>
  videoId_not_startsWith?: InputMaybe<Scalars['String']>
  videoId_startsWith?: InputMaybe<Scalars['String']>
}

export type ExclusionsConnection = {
  __typename?: 'ExclusionsConnection'
  edges: Array<ExclusionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type ExtendedChannel = {
  __typename?: 'ExtendedChannel'
  activeVideosCount: Scalars['Int']
  channel: Channel
}

export type ExtendedChannelWhereInput = {
  activeVideosCount_gt?: InputMaybe<Scalars['Int']>
  channel?: InputMaybe<ChannelWhereInput>
}

export type ExtendedVideoCategory = {
  __typename?: 'ExtendedVideoCategory'
  activeVideosCount: Scalars['Int']
  category: VideoCategory
}

export type FeaturedVideoInput = {
  videoCutUrl?: InputMaybe<Scalars['String']>
  videoId: Scalars['String']
}

export type FollowedChannel = {
  __typename?: 'FollowedChannel'
  channelId: Scalars['String']
  timestamp: Scalars['String']
}

export type GatewayConfig = {
  __typename?: 'GatewayConfig'
  /** Unique name of the configuration variable */
  id: Scalars['String']
  /** Last time the configuration variable was updated */
  updatedAt: Scalars['DateTime']
  /** Value of the configuration variable serialized to a string */
  value: Scalars['String']
}

export type GatewayConfigEdge = {
  __typename?: 'GatewayConfigEdge'
  cursor: Scalars['String']
  node: GatewayConfig
}

export enum GatewayConfigOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC',
}

export type GatewayConfigWhereInput = {
  AND?: InputMaybe<Array<GatewayConfigWhereInput>>
  OR?: InputMaybe<Array<GatewayConfigWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  updatedAt_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']>
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  updatedAt_not_eq?: InputMaybe<Scalars['DateTime']>
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  value_contains?: InputMaybe<Scalars['String']>
  value_containsInsensitive?: InputMaybe<Scalars['String']>
  value_endsWith?: InputMaybe<Scalars['String']>
  value_eq?: InputMaybe<Scalars['String']>
  value_gt?: InputMaybe<Scalars['String']>
  value_gte?: InputMaybe<Scalars['String']>
  value_in?: InputMaybe<Array<Scalars['String']>>
  value_isNull?: InputMaybe<Scalars['Boolean']>
  value_lt?: InputMaybe<Scalars['String']>
  value_lte?: InputMaybe<Scalars['String']>
  value_not_contains?: InputMaybe<Scalars['String']>
  value_not_containsInsensitive?: InputMaybe<Scalars['String']>
  value_not_endsWith?: InputMaybe<Scalars['String']>
  value_not_eq?: InputMaybe<Scalars['String']>
  value_not_in?: InputMaybe<Array<Scalars['String']>>
  value_not_startsWith?: InputMaybe<Scalars['String']>
  value_startsWith?: InputMaybe<Scalars['String']>
}

export type GatewayConfigsConnection = {
  __typename?: 'GatewayConfigsConnection'
  edges: Array<GatewayConfigEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type GeneratedSignature = {
  __typename?: 'GeneratedSignature'
  /** App signature converted to hexadecimal string. */
  signature: Scalars['String']
}

export type GeoCoordinates = {
  __typename?: 'GeoCoordinates'
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

export type GeoCoordinatesWhereInput = {
  latitude_eq?: InputMaybe<Scalars['Float']>
  latitude_gt?: InputMaybe<Scalars['Float']>
  latitude_gte?: InputMaybe<Scalars['Float']>
  latitude_in?: InputMaybe<Array<Scalars['Float']>>
  latitude_isNull?: InputMaybe<Scalars['Boolean']>
  latitude_lt?: InputMaybe<Scalars['Float']>
  latitude_lte?: InputMaybe<Scalars['Float']>
  latitude_not_eq?: InputMaybe<Scalars['Float']>
  latitude_not_in?: InputMaybe<Array<Scalars['Float']>>
  longitude_eq?: InputMaybe<Scalars['Float']>
  longitude_gt?: InputMaybe<Scalars['Float']>
  longitude_gte?: InputMaybe<Scalars['Float']>
  longitude_in?: InputMaybe<Array<Scalars['Float']>>
  longitude_isNull?: InputMaybe<Scalars['Boolean']>
  longitude_lt?: InputMaybe<Scalars['Float']>
  longitude_lte?: InputMaybe<Scalars['Float']>
  longitude_not_eq?: InputMaybe<Scalars['Float']>
  longitude_not_in?: InputMaybe<Array<Scalars['Float']>>
}

export type GeographicalArea = GeographicalAreaContinent | GeographicalAreaCountry | GeographicalAreaSubdivistion

export type GeographicalAreaContinent = {
  __typename?: 'GeographicalAreaContinent'
  continentCode?: Maybe<Continent>
}

export type GeographicalAreaCountry = {
  __typename?: 'GeographicalAreaCountry'
  /** ISO 3166-1 alpha-2 country code */
  countryCode?: Maybe<Scalars['String']>
}

export type GeographicalAreaSubdivistion = {
  __typename?: 'GeographicalAreaSubdivistion'
  /** ISO 3166-2 subdivision code */
  subdivisionCode?: Maybe<Scalars['String']>
}

export type GetAccountTransferrableBalanceResult = {
  __typename?: 'GetAccountTransferrableBalanceResult'
  transferrableCrtAmount: Scalars['Int']
}

export type GetCumulativeHistoricalShareAllocationResult = {
  __typename?: 'GetCumulativeHistoricalShareAllocationResult'
  cumulativeHistoricalAllocation: Scalars['String']
}

export type GetShareDividendsResult = {
  __typename?: 'GetShareDividendsResult'
  dividendJoyAmount: Scalars['String']
}

export type GrantOrRevokeOperatorPermissionsResult = {
  __typename?: 'GrantOrRevokeOperatorPermissionsResult'
  newPermissions: Array<OperatorPermission>
}

export type HigherBidPlaced = {
  __typename?: 'HigherBidPlaced'
  /** new bidder handle  */
  newBidderHandle: Scalars['String']
  /** new bidder id */
  newBidderId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type InitialIssuanceVestingSource = {
  __typename?: 'InitialIssuanceVestingSource'
  phantom?: Maybe<Scalars['Int']>
}

export type IssuerTransferVestingSource = {
  __typename?: 'IssuerTransferVestingSource'
  phantom?: Maybe<Scalars['Int']>
}

export type KillSwitch = {
  __typename?: 'KillSwitch'
  isKilled: Scalars['Boolean']
}

export type License = {
  __typename?: 'License'
  /** Attribution (if required by the license) */
  attribution?: Maybe<Scalars['String']>
  /** License code defined by Joystream */
  code?: Maybe<Scalars['Int']>
  /** Custom license content */
  customText?: Maybe<Scalars['String']>
  /** Unique identifier */
  id: Scalars['String']
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
  CustomTextAsc = 'customText_ASC',
  CustomTextDesc = 'customText_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
}

export type LicenseWhereInput = {
  AND?: InputMaybe<Array<LicenseWhereInput>>
  OR?: InputMaybe<Array<LicenseWhereInput>>
  attribution_contains?: InputMaybe<Scalars['String']>
  attribution_containsInsensitive?: InputMaybe<Scalars['String']>
  attribution_endsWith?: InputMaybe<Scalars['String']>
  attribution_eq?: InputMaybe<Scalars['String']>
  attribution_gt?: InputMaybe<Scalars['String']>
  attribution_gte?: InputMaybe<Scalars['String']>
  attribution_in?: InputMaybe<Array<Scalars['String']>>
  attribution_isNull?: InputMaybe<Scalars['Boolean']>
  attribution_lt?: InputMaybe<Scalars['String']>
  attribution_lte?: InputMaybe<Scalars['String']>
  attribution_not_contains?: InputMaybe<Scalars['String']>
  attribution_not_containsInsensitive?: InputMaybe<Scalars['String']>
  attribution_not_endsWith?: InputMaybe<Scalars['String']>
  attribution_not_eq?: InputMaybe<Scalars['String']>
  attribution_not_in?: InputMaybe<Array<Scalars['String']>>
  attribution_not_startsWith?: InputMaybe<Scalars['String']>
  attribution_startsWith?: InputMaybe<Scalars['String']>
  code_eq?: InputMaybe<Scalars['Int']>
  code_gt?: InputMaybe<Scalars['Int']>
  code_gte?: InputMaybe<Scalars['Int']>
  code_in?: InputMaybe<Array<Scalars['Int']>>
  code_isNull?: InputMaybe<Scalars['Boolean']>
  code_lt?: InputMaybe<Scalars['Int']>
  code_lte?: InputMaybe<Scalars['Int']>
  code_not_eq?: InputMaybe<Scalars['Int']>
  code_not_in?: InputMaybe<Array<Scalars['Int']>>
  customText_contains?: InputMaybe<Scalars['String']>
  customText_containsInsensitive?: InputMaybe<Scalars['String']>
  customText_endsWith?: InputMaybe<Scalars['String']>
  customText_eq?: InputMaybe<Scalars['String']>
  customText_gt?: InputMaybe<Scalars['String']>
  customText_gte?: InputMaybe<Scalars['String']>
  customText_in?: InputMaybe<Array<Scalars['String']>>
  customText_isNull?: InputMaybe<Scalars['Boolean']>
  customText_lt?: InputMaybe<Scalars['String']>
  customText_lte?: InputMaybe<Scalars['String']>
  customText_not_contains?: InputMaybe<Scalars['String']>
  customText_not_containsInsensitive?: InputMaybe<Scalars['String']>
  customText_not_endsWith?: InputMaybe<Scalars['String']>
  customText_not_eq?: InputMaybe<Scalars['String']>
  customText_not_in?: InputMaybe<Array<Scalars['String']>>
  customText_not_startsWith?: InputMaybe<Scalars['String']>
  customText_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
}

export type LicensesConnection = {
  __typename?: 'LicensesConnection'
  edges: Array<LicenseEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MarkNotificationsAsReadResult = {
  __typename?: 'MarkNotificationsAsReadResult'
  notificationsReadIds: Array<Scalars['String']>
}

export type MarketplaceToken = {
  __typename?: 'MarketplaceToken'
  /** number of accounts to avoid aggregate COUNT */
  accountsNum: Scalars['Int']
  ammVolume?: Maybe<Scalars['BigInt']>
  /** creator annual revenue (minted) */
  annualCreatorRewardPermill: Scalars['Int']
  /** avatar object (profile picture) */
  avatar?: Maybe<TokenAvatar>
  /** channel from which the token is issued uniqueness guaranteed by runtime */
  channelId?: Maybe<Scalars['String']>
  /** date at which this token was created */
  createdAt: Scalars['DateTime']
  cumulativeRevenue?: Maybe<Scalars['BigInt']>
  /** current amm sale if ongoing */
  currentAmmSaleId?: Maybe<Scalars['String']>
  /** current revenue share if ongoing */
  currentRevenueShareId?: Maybe<Scalars['String']>
  /** current sale if ongoing */
  currentSaleId?: Maybe<Scalars['String']>
  /** whether it has been deissued or not */
  deissued: Scalars['Boolean']
  /** about information displayed under the presentation video */
  description?: Maybe<Scalars['String']>
  /** runtime token identifier */
  id: Scalars['String']
  /** Flag to indicate whether the CRT is featured or not */
  isFeatured: Scalars['Boolean']
  /** access status invite only vs anyone */
  isInviteOnly: Scalars['Boolean']
  /** last unit price available */
  lastPrice?: Maybe<Scalars['BigInt']>
  liquidity?: Maybe<Scalars['Int']>
  liquidityChange?: Maybe<Scalars['BigDecimal']>
  marketCap?: Maybe<Scalars['BigInt']>
  /** number of revenue shares issued */
  numberOfRevenueShareActivations: Scalars['Int']
  /** number of vested transfer completed */
  numberOfVestedTransferIssued: Scalars['Int']
  priceChange?: Maybe<Scalars['BigDecimal']>
  /** revenue share ratio between creator and holder */
  revenueShareRatioPermill: Scalars['Int']
  /** status sale / market / idle */
  status: TokenStatus
  /** symbol for the token uniqueness guaranteed by runtime */
  symbol?: Maybe<Scalars['String']>
  /** total supply */
  totalSupply: Scalars['BigInt']
  /** link for creator to member interested in joining the whitelist */
  whitelistApplicantLink?: Maybe<Scalars['String']>
  /** note from creator to member interested in joining the whitelist */
  whitelistApplicantNote?: Maybe<Scalars['String']>
}

export type MarketplaceTokenCount = {
  __typename?: 'MarketplaceTokenCount'
  count: Scalars['Int']
}

export type MarketplaceTokenEdge = {
  __typename?: 'MarketplaceTokenEdge'
  cursor: Scalars['String']
  node: MarketplaceToken
}

export enum MarketplaceTokenOrderByInput {
  AccountsNumAsc = 'accountsNum_ASC',
  AccountsNumDesc = 'accountsNum_DESC',
  AmmVolumeAsc = 'ammVolume_ASC',
  AmmVolumeDesc = 'ammVolume_DESC',
  AnnualCreatorRewardPermillAsc = 'annualCreatorRewardPermill_ASC',
  AnnualCreatorRewardPermillDesc = 'annualCreatorRewardPermill_DESC',
  AvatarAvatarUriAsc = 'avatar_avatarUri_ASC',
  AvatarAvatarUriDesc = 'avatar_avatarUri_DESC',
  AvatarIsTypeOfAsc = 'avatar_isTypeOf_ASC',
  AvatarIsTypeOfDesc = 'avatar_isTypeOf_DESC',
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CumulativeRevenueAsc = 'cumulativeRevenue_ASC',
  CumulativeRevenueDesc = 'cumulativeRevenue_DESC',
  CurrentAmmSaleIdAsc = 'currentAmmSaleId_ASC',
  CurrentAmmSaleIdDesc = 'currentAmmSaleId_DESC',
  CurrentRevenueShareIdAsc = 'currentRevenueShareId_ASC',
  CurrentRevenueShareIdDesc = 'currentRevenueShareId_DESC',
  CurrentSaleIdAsc = 'currentSaleId_ASC',
  CurrentSaleIdDesc = 'currentSaleId_DESC',
  DeissuedAsc = 'deissued_ASC',
  DeissuedDesc = 'deissued_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsFeaturedAsc = 'isFeatured_ASC',
  IsFeaturedDesc = 'isFeatured_DESC',
  IsInviteOnlyAsc = 'isInviteOnly_ASC',
  IsInviteOnlyDesc = 'isInviteOnly_DESC',
  LastPriceAsc = 'lastPrice_ASC',
  LastPriceDesc = 'lastPrice_DESC',
  LiquidityChangeAsc = 'liquidityChange_ASC',
  LiquidityChangeDesc = 'liquidityChange_DESC',
  LiquidityAsc = 'liquidity_ASC',
  LiquidityDesc = 'liquidity_DESC',
  MarketCapAsc = 'marketCap_ASC',
  MarketCapDesc = 'marketCap_DESC',
  NumberOfRevenueShareActivationsAsc = 'numberOfRevenueShareActivations_ASC',
  NumberOfRevenueShareActivationsDesc = 'numberOfRevenueShareActivations_DESC',
  NumberOfVestedTransferIssuedAsc = 'numberOfVestedTransferIssued_ASC',
  NumberOfVestedTransferIssuedDesc = 'numberOfVestedTransferIssued_DESC',
  PriceChangeAsc = 'priceChange_ASC',
  PriceChangeDesc = 'priceChange_DESC',
  RevenueShareRatioPermillAsc = 'revenueShareRatioPermill_ASC',
  RevenueShareRatioPermillDesc = 'revenueShareRatioPermill_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC',
  WhitelistApplicantLinkAsc = 'whitelistApplicantLink_ASC',
  WhitelistApplicantLinkDesc = 'whitelistApplicantLink_DESC',
  WhitelistApplicantNoteAsc = 'whitelistApplicantNote_ASC',
  WhitelistApplicantNoteDesc = 'whitelistApplicantNote_DESC',
}

export type MarketplaceTokenWhereInput = {
  AND?: InputMaybe<Array<MarketplaceTokenWhereInput>>
  OR?: InputMaybe<Array<MarketplaceTokenWhereInput>>
  accountsNum_eq?: InputMaybe<Scalars['Int']>
  accountsNum_gt?: InputMaybe<Scalars['Int']>
  accountsNum_gte?: InputMaybe<Scalars['Int']>
  accountsNum_in?: InputMaybe<Array<Scalars['Int']>>
  accountsNum_isNull?: InputMaybe<Scalars['Boolean']>
  accountsNum_lt?: InputMaybe<Scalars['Int']>
  accountsNum_lte?: InputMaybe<Scalars['Int']>
  accountsNum_not_eq?: InputMaybe<Scalars['Int']>
  accountsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  ammVolume_eq?: InputMaybe<Scalars['BigInt']>
  ammVolume_gt?: InputMaybe<Scalars['BigInt']>
  ammVolume_gte?: InputMaybe<Scalars['BigInt']>
  ammVolume_in?: InputMaybe<Array<Scalars['BigInt']>>
  ammVolume_isNull?: InputMaybe<Scalars['Boolean']>
  ammVolume_lt?: InputMaybe<Scalars['BigInt']>
  ammVolume_lte?: InputMaybe<Scalars['BigInt']>
  ammVolume_not_eq?: InputMaybe<Scalars['BigInt']>
  ammVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  annualCreatorRewardPermill_eq?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_gt?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_gte?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_in?: InputMaybe<Array<Scalars['Int']>>
  annualCreatorRewardPermill_isNull?: InputMaybe<Scalars['Boolean']>
  annualCreatorRewardPermill_lt?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_lte?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_not_eq?: InputMaybe<Scalars['Int']>
  annualCreatorRewardPermill_not_in?: InputMaybe<Array<Scalars['Int']>>
  avatar?: InputMaybe<TokenAvatarWhereInput>
  avatar_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  cumulativeRevenue_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_gt?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_gte?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_in?: InputMaybe<Array<Scalars['BigInt']>>
  cumulativeRevenue_isNull?: InputMaybe<Scalars['Boolean']>
  cumulativeRevenue_lt?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_lte?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_not_eq?: InputMaybe<Scalars['BigInt']>
  cumulativeRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  currentAmmSaleId_contains?: InputMaybe<Scalars['String']>
  currentAmmSaleId_containsInsensitive?: InputMaybe<Scalars['String']>
  currentAmmSaleId_endsWith?: InputMaybe<Scalars['String']>
  currentAmmSaleId_eq?: InputMaybe<Scalars['String']>
  currentAmmSaleId_gt?: InputMaybe<Scalars['String']>
  currentAmmSaleId_gte?: InputMaybe<Scalars['String']>
  currentAmmSaleId_in?: InputMaybe<Array<Scalars['String']>>
  currentAmmSaleId_isNull?: InputMaybe<Scalars['Boolean']>
  currentAmmSaleId_lt?: InputMaybe<Scalars['String']>
  currentAmmSaleId_lte?: InputMaybe<Scalars['String']>
  currentAmmSaleId_not_contains?: InputMaybe<Scalars['String']>
  currentAmmSaleId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  currentAmmSaleId_not_endsWith?: InputMaybe<Scalars['String']>
  currentAmmSaleId_not_eq?: InputMaybe<Scalars['String']>
  currentAmmSaleId_not_in?: InputMaybe<Array<Scalars['String']>>
  currentAmmSaleId_not_startsWith?: InputMaybe<Scalars['String']>
  currentAmmSaleId_startsWith?: InputMaybe<Scalars['String']>
  currentRevenueShareId_contains?: InputMaybe<Scalars['String']>
  currentRevenueShareId_containsInsensitive?: InputMaybe<Scalars['String']>
  currentRevenueShareId_endsWith?: InputMaybe<Scalars['String']>
  currentRevenueShareId_eq?: InputMaybe<Scalars['String']>
  currentRevenueShareId_gt?: InputMaybe<Scalars['String']>
  currentRevenueShareId_gte?: InputMaybe<Scalars['String']>
  currentRevenueShareId_in?: InputMaybe<Array<Scalars['String']>>
  currentRevenueShareId_isNull?: InputMaybe<Scalars['Boolean']>
  currentRevenueShareId_lt?: InputMaybe<Scalars['String']>
  currentRevenueShareId_lte?: InputMaybe<Scalars['String']>
  currentRevenueShareId_not_contains?: InputMaybe<Scalars['String']>
  currentRevenueShareId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  currentRevenueShareId_not_endsWith?: InputMaybe<Scalars['String']>
  currentRevenueShareId_not_eq?: InputMaybe<Scalars['String']>
  currentRevenueShareId_not_in?: InputMaybe<Array<Scalars['String']>>
  currentRevenueShareId_not_startsWith?: InputMaybe<Scalars['String']>
  currentRevenueShareId_startsWith?: InputMaybe<Scalars['String']>
  currentSaleId_contains?: InputMaybe<Scalars['String']>
  currentSaleId_containsInsensitive?: InputMaybe<Scalars['String']>
  currentSaleId_endsWith?: InputMaybe<Scalars['String']>
  currentSaleId_eq?: InputMaybe<Scalars['String']>
  currentSaleId_gt?: InputMaybe<Scalars['String']>
  currentSaleId_gte?: InputMaybe<Scalars['String']>
  currentSaleId_in?: InputMaybe<Array<Scalars['String']>>
  currentSaleId_isNull?: InputMaybe<Scalars['Boolean']>
  currentSaleId_lt?: InputMaybe<Scalars['String']>
  currentSaleId_lte?: InputMaybe<Scalars['String']>
  currentSaleId_not_contains?: InputMaybe<Scalars['String']>
  currentSaleId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  currentSaleId_not_endsWith?: InputMaybe<Scalars['String']>
  currentSaleId_not_eq?: InputMaybe<Scalars['String']>
  currentSaleId_not_in?: InputMaybe<Array<Scalars['String']>>
  currentSaleId_not_startsWith?: InputMaybe<Scalars['String']>
  currentSaleId_startsWith?: InputMaybe<Scalars['String']>
  deissued_eq?: InputMaybe<Scalars['Boolean']>
  deissued_isNull?: InputMaybe<Scalars['Boolean']>
  deissued_not_eq?: InputMaybe<Scalars['Boolean']>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isFeatured_eq?: InputMaybe<Scalars['Boolean']>
  isFeatured_isNull?: InputMaybe<Scalars['Boolean']>
  isFeatured_not_eq?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_eq?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_isNull?: InputMaybe<Scalars['Boolean']>
  isInviteOnly_not_eq?: InputMaybe<Scalars['Boolean']>
  lastPrice_eq?: InputMaybe<Scalars['BigInt']>
  lastPrice_gt?: InputMaybe<Scalars['BigInt']>
  lastPrice_gte?: InputMaybe<Scalars['BigInt']>
  lastPrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  lastPrice_isNull?: InputMaybe<Scalars['Boolean']>
  lastPrice_lt?: InputMaybe<Scalars['BigInt']>
  lastPrice_lte?: InputMaybe<Scalars['BigInt']>
  lastPrice_not_eq?: InputMaybe<Scalars['BigInt']>
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  liquidityChange_eq?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_gt?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_gte?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>
  liquidityChange_isNull?: InputMaybe<Scalars['Boolean']>
  liquidityChange_lt?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_lte?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_not_eq?: InputMaybe<Scalars['BigDecimal']>
  liquidityChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>
  liquidity_eq?: InputMaybe<Scalars['Int']>
  liquidity_gt?: InputMaybe<Scalars['Int']>
  liquidity_gte?: InputMaybe<Scalars['Int']>
  liquidity_in?: InputMaybe<Array<Scalars['Int']>>
  liquidity_isNull?: InputMaybe<Scalars['Boolean']>
  liquidity_lt?: InputMaybe<Scalars['Int']>
  liquidity_lte?: InputMaybe<Scalars['Int']>
  liquidity_not_eq?: InputMaybe<Scalars['Int']>
  liquidity_not_in?: InputMaybe<Array<Scalars['Int']>>
  marketCap_eq?: InputMaybe<Scalars['BigInt']>
  marketCap_gt?: InputMaybe<Scalars['BigInt']>
  marketCap_gte?: InputMaybe<Scalars['BigInt']>
  marketCap_in?: InputMaybe<Array<Scalars['BigInt']>>
  marketCap_isNull?: InputMaybe<Scalars['Boolean']>
  marketCap_lt?: InputMaybe<Scalars['BigInt']>
  marketCap_lte?: InputMaybe<Scalars['BigInt']>
  marketCap_not_eq?: InputMaybe<Scalars['BigInt']>
  marketCap_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  numberOfRevenueShareActivations_eq?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_gt?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_gte?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfRevenueShareActivations_isNull?: InputMaybe<Scalars['Boolean']>
  numberOfRevenueShareActivations_lt?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_lte?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_not_eq?: InputMaybe<Scalars['Int']>
  numberOfRevenueShareActivations_not_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfVestedTransferIssued_eq?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_gt?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_gte?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_in?: InputMaybe<Array<Scalars['Int']>>
  numberOfVestedTransferIssued_isNull?: InputMaybe<Scalars['Boolean']>
  numberOfVestedTransferIssued_lt?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_lte?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_not_eq?: InputMaybe<Scalars['Int']>
  numberOfVestedTransferIssued_not_in?: InputMaybe<Array<Scalars['Int']>>
  priceChange_eq?: InputMaybe<Scalars['BigDecimal']>
  priceChange_gt?: InputMaybe<Scalars['BigDecimal']>
  priceChange_gte?: InputMaybe<Scalars['BigDecimal']>
  priceChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>
  priceChange_isNull?: InputMaybe<Scalars['Boolean']>
  priceChange_lt?: InputMaybe<Scalars['BigDecimal']>
  priceChange_lte?: InputMaybe<Scalars['BigDecimal']>
  priceChange_not_eq?: InputMaybe<Scalars['BigDecimal']>
  priceChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>
  revenueShareRatioPermill_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_gt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_gte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_in?: InputMaybe<Array<Scalars['Int']>>
  revenueShareRatioPermill_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareRatioPermill_lt?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_lte?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_not_eq?: InputMaybe<Scalars['Int']>
  revenueShareRatioPermill_not_in?: InputMaybe<Array<Scalars['Int']>>
  status_eq?: InputMaybe<TokenStatus>
  status_in?: InputMaybe<Array<TokenStatus>>
  status_isNull?: InputMaybe<Scalars['Boolean']>
  status_not_eq?: InputMaybe<TokenStatus>
  status_not_in?: InputMaybe<Array<TokenStatus>>
  symbol_contains?: InputMaybe<Scalars['String']>
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>
  symbol_endsWith?: InputMaybe<Scalars['String']>
  symbol_eq?: InputMaybe<Scalars['String']>
  symbol_gt?: InputMaybe<Scalars['String']>
  symbol_gte?: InputMaybe<Scalars['String']>
  symbol_in?: InputMaybe<Array<Scalars['String']>>
  symbol_isNull?: InputMaybe<Scalars['Boolean']>
  symbol_lt?: InputMaybe<Scalars['String']>
  symbol_lte?: InputMaybe<Scalars['String']>
  symbol_not_contains?: InputMaybe<Scalars['String']>
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>
  symbol_not_endsWith?: InputMaybe<Scalars['String']>
  symbol_not_eq?: InputMaybe<Scalars['String']>
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>
  symbol_not_startsWith?: InputMaybe<Scalars['String']>
  symbol_startsWith?: InputMaybe<Scalars['String']>
  totalSupply_eq?: InputMaybe<Scalars['BigInt']>
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>
  totalSupply_not_eq?: InputMaybe<Scalars['BigInt']>
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  whitelistApplicantLink_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_gt?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_gte?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantLink_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistApplicantLink_lt?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_lte?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_not_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantLink_not_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantLink_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_gt?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_gte?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantNote_isNull?: InputMaybe<Scalars['Boolean']>
  whitelistApplicantNote_lt?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_lte?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_contains?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_containsInsensitive?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_endsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_eq?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_not_in?: InputMaybe<Array<Scalars['String']>>
  whitelistApplicantNote_not_startsWith?: InputMaybe<Scalars['String']>
  whitelistApplicantNote_startsWith?: InputMaybe<Scalars['String']>
}

export type MarketplaceTokensConnection = {
  __typename?: 'MarketplaceTokensConnection'
  edges: Array<MarketplaceTokenEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MarketplaceTokensReturnType = {
  __typename?: 'MarketplaceTokensReturnType'
  creatorToken: CreatorToken
  pricePercentageChange: Scalars['Float']
}

export type MaxAttemptsOnMailDelivery = {
  __typename?: 'MaxAttemptsOnMailDelivery'
  maxAttempts: Scalars['Int']
}

export type MemberBannedFromChannelEventData = {
  __typename?: 'MemberBannedFromChannelEventData'
  /** The action performed. TRUE if the member is being banned, FALSE if the member is being unbanned */
  action: Scalars['Boolean']
  /** The chanel the member is being banned / unbanned from */
  channel: Channel
  /** The member being banned / unbanned */
  member: Membership
}

export type MemberMetadata = {
  __typename?: 'MemberMetadata'
  /** Short text chosen by member to share information about themselves */
  about?: Maybe<Scalars['String']>
  /** Avatar data object */
  avatar?: Maybe<Avatar>
  id: Scalars['String']
  member: Membership
  /** Member's name */
  name?: Maybe<Scalars['String']>
}

export type MemberMetadataConnection = {
  __typename?: 'MemberMetadataConnection'
  edges: Array<MemberMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MemberMetadataEdge = {
  __typename?: 'MemberMetadataEdge'
  cursor: Scalars['String']
  node: MemberMetadata
}

export enum MemberMetadataOrderByInput {
  AboutAsc = 'about_ASC',
  AboutDesc = 'about_DESC',
  AvatarAvatarUriAsc = 'avatar_avatarUri_ASC',
  AvatarAvatarUriDesc = 'avatar_avatarUri_DESC',
  AvatarIsTypeOfAsc = 'avatar_isTypeOf_ASC',
  AvatarIsTypeOfDesc = 'avatar_isTypeOf_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
}

export type MemberMetadataWhereInput = {
  AND?: InputMaybe<Array<MemberMetadataWhereInput>>
  OR?: InputMaybe<Array<MemberMetadataWhereInput>>
  about_contains?: InputMaybe<Scalars['String']>
  about_containsInsensitive?: InputMaybe<Scalars['String']>
  about_endsWith?: InputMaybe<Scalars['String']>
  about_eq?: InputMaybe<Scalars['String']>
  about_gt?: InputMaybe<Scalars['String']>
  about_gte?: InputMaybe<Scalars['String']>
  about_in?: InputMaybe<Array<Scalars['String']>>
  about_isNull?: InputMaybe<Scalars['Boolean']>
  about_lt?: InputMaybe<Scalars['String']>
  about_lte?: InputMaybe<Scalars['String']>
  about_not_contains?: InputMaybe<Scalars['String']>
  about_not_containsInsensitive?: InputMaybe<Scalars['String']>
  about_not_endsWith?: InputMaybe<Scalars['String']>
  about_not_eq?: InputMaybe<Scalars['String']>
  about_not_in?: InputMaybe<Array<Scalars['String']>>
  about_not_startsWith?: InputMaybe<Scalars['String']>
  about_startsWith?: InputMaybe<Scalars['String']>
  avatar?: InputMaybe<AvatarWhereInput>
  avatar_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  name_contains?: InputMaybe<Scalars['String']>
  name_containsInsensitive?: InputMaybe<Scalars['String']>
  name_endsWith?: InputMaybe<Scalars['String']>
  name_eq?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_isNull?: InputMaybe<Scalars['Boolean']>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>
  name_not_endsWith?: InputMaybe<Scalars['String']>
  name_not_eq?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_startsWith?: InputMaybe<Scalars['String']>
  name_startsWith?: InputMaybe<Scalars['String']>
}

export type MemberRecipient = {
  __typename?: 'MemberRecipient'
  /** membership */
  membership: Membership
}

/** Stored information about a registered user */
export type Membership = {
  __typename?: 'Membership'
  /** Channels the member is banned from (in terms of commenting/reacting) */
  bannedFromChannels: Array<BannedMember>
  /** Channels owned by this member */
  channels: Array<Channel>
  /** Member's controller account id */
  controllerAccount: Scalars['String']
  /** Timestamp of the block the membership was created at */
  createdAt: Scalars['DateTime']
  /** The handle coming from decoded handleRaw if possible */
  handle: Scalars['String']
  /** The handle chosen by member coming from event deposit */
  handleRaw: Scalars['String']
  /** MemberId: runtime identifier for a user */
  id: Scalars['String']
  /** Member's metadata */
  metadata?: Maybe<MemberMetadata>
  /** token accounts */
  tokenAccounts: Array<TokenAccount>
  /** Number of channels ever created by this member */
  totalChannelsCreated: Scalars['Int']
  /** Auctions in which is this user whitelisted to participate */
  whitelistedInAuctions: Array<AuctionWhitelistedMember>
}

/** Stored information about a registered user */
export type MembershipBannedFromChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BannedMemberOrderByInput>>
  where?: InputMaybe<BannedMemberWhereInput>
}

/** Stored information about a registered user */
export type MembershipChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

/** Stored information about a registered user */
export type MembershipTokenAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenAccountOrderByInput>>
  where?: InputMaybe<TokenAccountWhereInput>
}

/** Stored information about a registered user */
export type MembershipWhitelistedInAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type MembershipEdge = {
  __typename?: 'MembershipEdge'
  cursor: Scalars['String']
  node: Membership
}

export enum MembershipOrderByInput {
  ControllerAccountAsc = 'controllerAccount_ASC',
  ControllerAccountDesc = 'controllerAccount_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  HandleRawAsc = 'handleRaw_ASC',
  HandleRawDesc = 'handleRaw_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataAboutAsc = 'metadata_about_ASC',
  MetadataAboutDesc = 'metadata_about_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataNameAsc = 'metadata_name_ASC',
  MetadataNameDesc = 'metadata_name_DESC',
  TotalChannelsCreatedAsc = 'totalChannelsCreated_ASC',
  TotalChannelsCreatedDesc = 'totalChannelsCreated_DESC',
}

export type MembershipWhereInput = {
  AND?: InputMaybe<Array<MembershipWhereInput>>
  OR?: InputMaybe<Array<MembershipWhereInput>>
  bannedFromChannels_every?: InputMaybe<BannedMemberWhereInput>
  bannedFromChannels_none?: InputMaybe<BannedMemberWhereInput>
  bannedFromChannels_some?: InputMaybe<BannedMemberWhereInput>
  channels_every?: InputMaybe<ChannelWhereInput>
  channels_none?: InputMaybe<ChannelWhereInput>
  channels_some?: InputMaybe<ChannelWhereInput>
  controllerAccount_contains?: InputMaybe<Scalars['String']>
  controllerAccount_containsInsensitive?: InputMaybe<Scalars['String']>
  controllerAccount_endsWith?: InputMaybe<Scalars['String']>
  controllerAccount_eq?: InputMaybe<Scalars['String']>
  controllerAccount_gt?: InputMaybe<Scalars['String']>
  controllerAccount_gte?: InputMaybe<Scalars['String']>
  controllerAccount_in?: InputMaybe<Array<Scalars['String']>>
  controllerAccount_isNull?: InputMaybe<Scalars['Boolean']>
  controllerAccount_lt?: InputMaybe<Scalars['String']>
  controllerAccount_lte?: InputMaybe<Scalars['String']>
  controllerAccount_not_contains?: InputMaybe<Scalars['String']>
  controllerAccount_not_containsInsensitive?: InputMaybe<Scalars['String']>
  controllerAccount_not_endsWith?: InputMaybe<Scalars['String']>
  controllerAccount_not_eq?: InputMaybe<Scalars['String']>
  controllerAccount_not_in?: InputMaybe<Array<Scalars['String']>>
  controllerAccount_not_startsWith?: InputMaybe<Scalars['String']>
  controllerAccount_startsWith?: InputMaybe<Scalars['String']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  handleRaw_contains?: InputMaybe<Scalars['String']>
  handleRaw_containsInsensitive?: InputMaybe<Scalars['String']>
  handleRaw_endsWith?: InputMaybe<Scalars['String']>
  handleRaw_eq?: InputMaybe<Scalars['String']>
  handleRaw_gt?: InputMaybe<Scalars['String']>
  handleRaw_gte?: InputMaybe<Scalars['String']>
  handleRaw_in?: InputMaybe<Array<Scalars['String']>>
  handleRaw_isNull?: InputMaybe<Scalars['Boolean']>
  handleRaw_lt?: InputMaybe<Scalars['String']>
  handleRaw_lte?: InputMaybe<Scalars['String']>
  handleRaw_not_contains?: InputMaybe<Scalars['String']>
  handleRaw_not_containsInsensitive?: InputMaybe<Scalars['String']>
  handleRaw_not_endsWith?: InputMaybe<Scalars['String']>
  handleRaw_not_eq?: InputMaybe<Scalars['String']>
  handleRaw_not_in?: InputMaybe<Array<Scalars['String']>>
  handleRaw_not_startsWith?: InputMaybe<Scalars['String']>
  handleRaw_startsWith?: InputMaybe<Scalars['String']>
  handle_contains?: InputMaybe<Scalars['String']>
  handle_containsInsensitive?: InputMaybe<Scalars['String']>
  handle_endsWith?: InputMaybe<Scalars['String']>
  handle_eq?: InputMaybe<Scalars['String']>
  handle_gt?: InputMaybe<Scalars['String']>
  handle_gte?: InputMaybe<Scalars['String']>
  handle_in?: InputMaybe<Array<Scalars['String']>>
  handle_isNull?: InputMaybe<Scalars['Boolean']>
  handle_lt?: InputMaybe<Scalars['String']>
  handle_lte?: InputMaybe<Scalars['String']>
  handle_not_contains?: InputMaybe<Scalars['String']>
  handle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  handle_not_endsWith?: InputMaybe<Scalars['String']>
  handle_not_eq?: InputMaybe<Scalars['String']>
  handle_not_in?: InputMaybe<Array<Scalars['String']>>
  handle_not_startsWith?: InputMaybe<Scalars['String']>
  handle_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  metadata?: InputMaybe<MemberMetadataWhereInput>
  metadata_isNull?: InputMaybe<Scalars['Boolean']>
  tokenAccounts_every?: InputMaybe<TokenAccountWhereInput>
  tokenAccounts_none?: InputMaybe<TokenAccountWhereInput>
  tokenAccounts_some?: InputMaybe<TokenAccountWhereInput>
  totalChannelsCreated_eq?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_gt?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_gte?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_in?: InputMaybe<Array<Scalars['Int']>>
  totalChannelsCreated_isNull?: InputMaybe<Scalars['Boolean']>
  totalChannelsCreated_lt?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_lte?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_not_eq?: InputMaybe<Scalars['Int']>
  totalChannelsCreated_not_in?: InputMaybe<Array<Scalars['Int']>>
  whitelistedInAuctions_every?: InputMaybe<AuctionWhitelistedMemberWhereInput>
  whitelistedInAuctions_none?: InputMaybe<AuctionWhitelistedMemberWhereInput>
  whitelistedInAuctions_some?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type MembershipsConnection = {
  __typename?: 'MembershipsConnection'
  edges: Array<MembershipEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type MetaprotocolTransactionResult =
  | MetaprotocolTransactionResultChannelPaid
  | MetaprotocolTransactionResultCommentCreated
  | MetaprotocolTransactionResultCommentDeleted
  | MetaprotocolTransactionResultCommentEdited
  | MetaprotocolTransactionResultCommentModerated
  | MetaprotocolTransactionResultFailed
  | MetaprotocolTransactionResultOk

export type MetaprotocolTransactionResultChannelPaid = {
  __typename?: 'MetaprotocolTransactionResultChannelPaid'
  channelPaid?: Maybe<Channel>
}

export type MetaprotocolTransactionResultCommentCreated = {
  __typename?: 'MetaprotocolTransactionResultCommentCreated'
  commentCreated?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentDeleted = {
  __typename?: 'MetaprotocolTransactionResultCommentDeleted'
  commentDeleted?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentEdited = {
  __typename?: 'MetaprotocolTransactionResultCommentEdited'
  commentEdited?: Maybe<Comment>
}

export type MetaprotocolTransactionResultCommentModerated = {
  __typename?: 'MetaprotocolTransactionResultCommentModerated'
  commentModerated?: Maybe<Comment>
}

export type MetaprotocolTransactionResultFailed = {
  __typename?: 'MetaprotocolTransactionResultFailed'
  errorMessage: Scalars['String']
}

export type MetaprotocolTransactionResultOk = {
  __typename?: 'MetaprotocolTransactionResultOK'
  phantom?: Maybe<Scalars['Int']>
}

export type MetaprotocolTransactionResultWhereInput = {
  channelPaid?: InputMaybe<ChannelWhereInput>
  channelPaid_isNull?: InputMaybe<Scalars['Boolean']>
  commentCreated?: InputMaybe<CommentWhereInput>
  commentCreated_isNull?: InputMaybe<Scalars['Boolean']>
  commentDeleted?: InputMaybe<CommentWhereInput>
  commentDeleted_isNull?: InputMaybe<Scalars['Boolean']>
  commentEdited?: InputMaybe<CommentWhereInput>
  commentEdited_isNull?: InputMaybe<Scalars['Boolean']>
  commentModerated?: InputMaybe<CommentWhereInput>
  commentModerated_isNull?: InputMaybe<Scalars['Boolean']>
  errorMessage_contains?: InputMaybe<Scalars['String']>
  errorMessage_containsInsensitive?: InputMaybe<Scalars['String']>
  errorMessage_endsWith?: InputMaybe<Scalars['String']>
  errorMessage_eq?: InputMaybe<Scalars['String']>
  errorMessage_gt?: InputMaybe<Scalars['String']>
  errorMessage_gte?: InputMaybe<Scalars['String']>
  errorMessage_in?: InputMaybe<Array<Scalars['String']>>
  errorMessage_isNull?: InputMaybe<Scalars['Boolean']>
  errorMessage_lt?: InputMaybe<Scalars['String']>
  errorMessage_lte?: InputMaybe<Scalars['String']>
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  errorMessage_not_containsInsensitive?: InputMaybe<Scalars['String']>
  errorMessage_not_endsWith?: InputMaybe<Scalars['String']>
  errorMessage_not_eq?: InputMaybe<Scalars['String']>
  errorMessage_not_in?: InputMaybe<Array<Scalars['String']>>
  errorMessage_not_startsWith?: InputMaybe<Scalars['String']>
  errorMessage_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export type MetaprotocolTransactionStatusEventData = {
  __typename?: 'MetaprotocolTransactionStatusEventData'
  /** The result of metaprotocol action */
  result: MetaprotocolTransactionResult
}

export type Mutation = {
  __typename?: 'Mutation'
  addVideoView: AddVideoViewResult
  excludeChannel: ExcludeChannelResult
  excludeContent: ExcludeContentResult
  excludeVideo: ExcludeVideoInfo
  followChannel: ChannelFollowResult
  grantPermissions: GrantOrRevokeOperatorPermissionsResult
  markNotificationsAsRead: MarkNotificationsAsReadResult
  reportChannel: ChannelReportInfo
  reportVideo: VideoReportInfo
  requestNftFeatured: NftFeaturedRequstInfo
  restoreContent: RestoreContentResult
  revokePermission: GrantOrRevokeOperatorPermissionsResult
  setAccountNotificationPreferences: AccountNotificationPreferencesOutput
  setAppAssetStorage: SetNewAppAssetStorageResult
  setAppNameAlt: SetNewAppNameAltResult
  setCategoryFeaturedVideos: SetCategoryFeaturedVideosResult
  setChannelsWeights: Array<ChannelWeight>
  setCrtMarketCapMinVolume: CrtMarketCapMinVolume
  setFeaturedCrts: SetFeaturedCrtsResult
  setFeaturedNfts: SetFeaturedNftsResult
  setKillSwitch: KillSwitch
  setMaxAttemptsOnMailDelivery: Scalars['Int']
  setNewAppRootDomain: AppRootDomain
  setNewNotificationAssetRoot: SetNewNotificationAssetRootResult
  setNewNotificationCenterPath: Scalars['Int']
  setOrUnsetPublicFeedVideos: SetOrUnsetPublicFeedResult
  setSupportedCategories: SetSupportedCategoriesResult
  setTipTierAmounts: CommentTipTiers
  setVideoHero: SetVideoHeroResult
  setVideoViewPerUserTimeLimit: VideoViewPerUserTimeLimit
  setVideoWeights: VideoWeights
  signAppActionCommitment: GeneratedSignature
  suspendChannels: Array<SuspendChannelResult>
  unfollowChannel: ChannelUnfollowResult
  verifyChannel: VerifyChannelResult
}

export type MutationAddVideoViewArgs = {
  videoId: Scalars['String']
}

export type MutationExcludeChannelArgs = {
  channelId: Scalars['String']
  rationale: Scalars['String']
}

export type MutationExcludeContentArgs = {
  ids: Array<Scalars['String']>
  type: ExcludableContentType
}

export type MutationExcludeVideoArgs = {
  rationale: Scalars['String']
  videoId: Scalars['String']
}

export type MutationFollowChannelArgs = {
  channelId: Scalars['String']
}

export type MutationGrantPermissionsArgs = {
  permissions?: InputMaybe<Array<OperatorPermission>>
  userId?: InputMaybe<Scalars['String']>
}

export type MutationMarkNotificationsAsReadArgs = {
  notificationIds: Array<Scalars['String']>
}

export type MutationReportChannelArgs = {
  channelId: Scalars['String']
  rationale: Scalars['String']
}

export type MutationReportVideoArgs = {
  rationale: Scalars['String']
  videoId: Scalars['String']
}

export type MutationRequestNftFeaturedArgs = {
  nftId: Scalars['String']
  rationale: Scalars['String']
}

export type MutationRestoreContentArgs = {
  ids: Array<Scalars['String']>
  type: ExcludableContentType
}

export type MutationRevokePermissionArgs = {
  permissions?: InputMaybe<Array<OperatorPermission>>
  userId?: InputMaybe<Scalars['String']>
}

export type MutationSetAccountNotificationPreferencesArgs = {
  notificationPreferences: AccountNotificationPreferencesInput
}

export type MutationSetAppAssetStorageArgs = {
  newAppAssetStorage: Scalars['String']
}

export type MutationSetAppNameAltArgs = {
  newAppNameAlt: Scalars['String']
}

export type MutationSetCategoryFeaturedVideosArgs = {
  categoryId: Scalars['String']
  videos: Array<FeaturedVideoInput>
}

export type MutationSetChannelsWeightsArgs = {
  inputs: Array<ChannelWeightInput>
}

export type MutationSetCrtMarketCapMinVolumeArgs = {
  minVolumeJoy: Scalars['Int']
}

export type MutationSetFeaturedCrtsArgs = {
  featuredCrtsIds: Array<Scalars['String']>
}

export type MutationSetFeaturedNftsArgs = {
  featuredNftsIds: Array<Scalars['String']>
}

export type MutationSetKillSwitchArgs = {
  isKilled: Scalars['Boolean']
}

export type MutationSetMaxAttemptsOnMailDeliveryArgs = {
  newMaxAttempts: Scalars['Int']
}

export type MutationSetNewAppRootDomainArgs = {
  newRootDomain: Scalars['String']
}

export type MutationSetNewNotificationAssetRootArgs = {
  newNotificationAssetRoot: Scalars['String']
}

export type MutationSetNewNotificationCenterPathArgs = {
  newMaxAttempts: Scalars['Int']
}

export type MutationSetOrUnsetPublicFeedVideosArgs = {
  operation: PublicFeedOperationType
  videoIds: Array<Scalars['String']>
}

export type MutationSetSupportedCategoriesArgs = {
  supportNewCategories?: InputMaybe<Scalars['Boolean']>
  supportNoCategoryVideos?: InputMaybe<Scalars['Boolean']>
  supportedCategoriesIds?: InputMaybe<Array<Scalars['String']>>
}

export type MutationSetTipTierAmountsArgs = {
  DIAMOND?: InputMaybe<Scalars['Int']>
  GOLD?: InputMaybe<Scalars['Int']>
  SILVER?: InputMaybe<Scalars['Int']>
}

export type MutationSetVideoHeroArgs = {
  heroPosterUrl: Scalars['String']
  heroTitle: Scalars['String']
  videoCutUrl: Scalars['String']
  videoId: Scalars['String']
}

export type MutationSetVideoViewPerUserTimeLimitArgs = {
  limitInSeconds: Scalars['Int']
}

export type MutationSetVideoWeightsArgs = {
  commentsWeight: Scalars['Float']
  defaultChannelWeight: Scalars['Float']
  joysteamTimestampSubWeight: Scalars['Float']
  newnessWeight: Scalars['Float']
  reactionsWeight: Scalars['Float']
  viewsWeight: Scalars['Float']
  ytTimestampSubWeight: Scalars['Float']
}

export type MutationSignAppActionCommitmentArgs = {
  actionType: AppActionActionType
  assets: Scalars['String']
  creatorId: Scalars['String']
  nonce: Scalars['Float']
  rawAction: Scalars['String']
}

export type MutationSuspendChannelsArgs = {
  channelIds: Array<Scalars['String']>
}

export type MutationUnfollowChannelArgs = {
  channelId: Scalars['String']
}

export type MutationVerifyChannelArgs = {
  channelIds: Array<Scalars['String']>
}

export type NewAuction = {
  __typename?: 'NewAuction'
  /** channel id for notification link */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type NewChannelFollower = {
  __typename?: 'NewChannelFollower'
  /** follower member handle for the text */
  followerHandle: Scalars['String']
  /** follower member id for the avatar and the link */
  followerId: Scalars['String']
}

export type NewNftOnSale = {
  __typename?: 'NewNftOnSale'
  /** channel id for notification link */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type NftActivitiesConnection = {
  __typename?: 'NftActivitiesConnection'
  edges: Array<NftActivityEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftActivity = {
  __typename?: 'NftActivity'
  /** Nft-related activity */
  event: Event
  /** Autoincremented */
  id: Scalars['String']
  /** The member the activity relates to */
  member: Membership
}

export type NftActivityEdge = {
  __typename?: 'NftActivityEdge'
  cursor: Scalars['String']
  node: NftActivity
}

export enum NftActivityOrderByInput {
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
}

export type NftActivityWhereInput = {
  AND?: InputMaybe<Array<NftActivityWhereInput>>
  OR?: InputMaybe<Array<NftActivityWhereInput>>
  event?: InputMaybe<EventWhereInput>
  event_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
}

export type NftBoughtEventData = {
  __typename?: 'NftBoughtEventData'
  /** Member that bought the NFT. */
  buyer: Membership
  /** The NFT that was bought */
  nft: OwnedNft
  /** NFT owner before it was bought */
  previousNftOwner: NftOwner
  /** Price for which the NFT was bought */
  price: Scalars['BigInt']
}

export type NftFeaturedOnMarketPlace = {
  __typename?: 'NftFeaturedOnMarketPlace'
  /** videoId used for link construction */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type NftFeaturedRequstInfo = {
  __typename?: 'NftFeaturedRequstInfo'
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  nftId: Scalars['String']
  rationale: Scalars['String']
}

export type NftFeaturingRequest = {
  __typename?: 'NftFeaturingRequest'
  /** Unique identifier of the request */
  id: Scalars['String']
  /** ID of the nft that is being requested to be featured by operator */
  nftId: Scalars['String']
  /** Rationale behind the request */
  rationale: Scalars['String']
  /** Time of the request */
  timestamp: Scalars['DateTime']
  /** User that requested the nft to be featured */
  user: User
}

export type NftFeaturingRequestEdge = {
  __typename?: 'NftFeaturingRequestEdge'
  cursor: Scalars['String']
  node: NftFeaturingRequest
}

export enum NftFeaturingRequestOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NftIdAsc = 'nftId_ASC',
  NftIdDesc = 'nftId_DESC',
  RationaleAsc = 'rationale_ASC',
  RationaleDesc = 'rationale_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
}

export type NftFeaturingRequestWhereInput = {
  AND?: InputMaybe<Array<NftFeaturingRequestWhereInput>>
  OR?: InputMaybe<Array<NftFeaturingRequestWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  nftId_contains?: InputMaybe<Scalars['String']>
  nftId_containsInsensitive?: InputMaybe<Scalars['String']>
  nftId_endsWith?: InputMaybe<Scalars['String']>
  nftId_eq?: InputMaybe<Scalars['String']>
  nftId_gt?: InputMaybe<Scalars['String']>
  nftId_gte?: InputMaybe<Scalars['String']>
  nftId_in?: InputMaybe<Array<Scalars['String']>>
  nftId_isNull?: InputMaybe<Scalars['Boolean']>
  nftId_lt?: InputMaybe<Scalars['String']>
  nftId_lte?: InputMaybe<Scalars['String']>
  nftId_not_contains?: InputMaybe<Scalars['String']>
  nftId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  nftId_not_endsWith?: InputMaybe<Scalars['String']>
  nftId_not_eq?: InputMaybe<Scalars['String']>
  nftId_not_in?: InputMaybe<Array<Scalars['String']>>
  nftId_not_startsWith?: InputMaybe<Scalars['String']>
  nftId_startsWith?: InputMaybe<Scalars['String']>
  rationale_contains?: InputMaybe<Scalars['String']>
  rationale_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_endsWith?: InputMaybe<Scalars['String']>
  rationale_eq?: InputMaybe<Scalars['String']>
  rationale_gt?: InputMaybe<Scalars['String']>
  rationale_gte?: InputMaybe<Scalars['String']>
  rationale_in?: InputMaybe<Array<Scalars['String']>>
  rationale_isNull?: InputMaybe<Scalars['Boolean']>
  rationale_lt?: InputMaybe<Scalars['String']>
  rationale_lte?: InputMaybe<Scalars['String']>
  rationale_not_contains?: InputMaybe<Scalars['String']>
  rationale_not_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_not_endsWith?: InputMaybe<Scalars['String']>
  rationale_not_eq?: InputMaybe<Scalars['String']>
  rationale_not_in?: InputMaybe<Array<Scalars['String']>>
  rationale_not_startsWith?: InputMaybe<Scalars['String']>
  rationale_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
}

export type NftFeaturingRequestsConnection = {
  __typename?: 'NftFeaturingRequestsConnection'
  edges: Array<NftFeaturingRequestEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftHistoryEntriesConnection = {
  __typename?: 'NftHistoryEntriesConnection'
  edges: Array<NftHistoryEntryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NftHistoryEntry = {
  __typename?: 'NftHistoryEntry'
  /** Nft-related event */
  event: Event
  /** Autoincremented */
  id: Scalars['String']
  /** The NFT the event relates to */
  nft: OwnedNft
}

export type NftHistoryEntryEdge = {
  __typename?: 'NftHistoryEntryEdge'
  cursor: Scalars['String']
  node: NftHistoryEntry
}

export enum NftHistoryEntryOrderByInput {
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
}

export type NftHistoryEntryWhereInput = {
  AND?: InputMaybe<Array<NftHistoryEntryWhereInput>>
  OR?: InputMaybe<Array<NftHistoryEntryWhereInput>>
  event?: InputMaybe<EventWhereInput>
  event_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  nft?: InputMaybe<OwnedNftWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']>
}

export type NftIssuedEventData = {
  __typename?: 'NftIssuedEventData'
  /** Actor that issued the NFT. */
  actor: ContentActor
  /** NFT that was issued. */
  nft: OwnedNft
  /** NFT's initial owner. */
  nftOwner: NftOwner
}

export type NftOfferedEventData = {
  __typename?: 'NftOfferedEventData'
  /** Nft owner at the time the nft was offered */
  nftOwner: NftOwner
}

export type NftOwner = NftOwnerChannel | NftOwnerMember

export type NftOwnerChannel = {
  __typename?: 'NftOwnerChannel'
  channel: Channel
}

export type NftOwnerMember = {
  __typename?: 'NftOwnerMember'
  member: Membership
}

export type NftOwnerWhereInput = {
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
}

export type NftPurchased = {
  __typename?: 'NftPurchased'
  /** buyer handle for notification text */
  buyerHandle: Scalars['String']
  /** buyer id for notification the avatar */
  buyerId: Scalars['String']
  /** price paid */
  price: Scalars['BigInt']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type NftRoyaltyPaid = {
  __typename?: 'NftRoyaltyPaid'
  /** bid amount */
  amount: Scalars['BigInt']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type NftSellOrderMadeEventData = {
  __typename?: 'NftSellOrderMadeEventData'
  /** Content actor acting as NFT owner. */
  actor: ContentActor
  /** NFT being sold */
  nft: OwnedNft
  /** NFT owner at the time it was put on sale */
  nftOwner: NftOwner
  /** Offer's price. */
  price: Scalars['BigInt']
}

export type NodeLocationMetadata = {
  __typename?: 'NodeLocationMetadata'
  /** City name */
  city?: Maybe<Scalars['String']>
  /** Geographic coordinates */
  coordinates?: Maybe<GeoCoordinates>
  /** ISO 3166-1 alpha-2 country code (2 letters) */
  countryCode?: Maybe<Scalars['String']>
}

export type NodeLocationMetadataWhereInput = {
  city_contains?: InputMaybe<Scalars['String']>
  city_containsInsensitive?: InputMaybe<Scalars['String']>
  city_endsWith?: InputMaybe<Scalars['String']>
  city_eq?: InputMaybe<Scalars['String']>
  city_gt?: InputMaybe<Scalars['String']>
  city_gte?: InputMaybe<Scalars['String']>
  city_in?: InputMaybe<Array<Scalars['String']>>
  city_isNull?: InputMaybe<Scalars['Boolean']>
  city_lt?: InputMaybe<Scalars['String']>
  city_lte?: InputMaybe<Scalars['String']>
  city_not_contains?: InputMaybe<Scalars['String']>
  city_not_containsInsensitive?: InputMaybe<Scalars['String']>
  city_not_endsWith?: InputMaybe<Scalars['String']>
  city_not_eq?: InputMaybe<Scalars['String']>
  city_not_in?: InputMaybe<Array<Scalars['String']>>
  city_not_startsWith?: InputMaybe<Scalars['String']>
  city_startsWith?: InputMaybe<Scalars['String']>
  coordinates?: InputMaybe<GeoCoordinatesWhereInput>
  coordinates_isNull?: InputMaybe<Scalars['Boolean']>
  countryCode_contains?: InputMaybe<Scalars['String']>
  countryCode_containsInsensitive?: InputMaybe<Scalars['String']>
  countryCode_endsWith?: InputMaybe<Scalars['String']>
  countryCode_eq?: InputMaybe<Scalars['String']>
  countryCode_gt?: InputMaybe<Scalars['String']>
  countryCode_gte?: InputMaybe<Scalars['String']>
  countryCode_in?: InputMaybe<Array<Scalars['String']>>
  countryCode_isNull?: InputMaybe<Scalars['Boolean']>
  countryCode_lt?: InputMaybe<Scalars['String']>
  countryCode_lte?: InputMaybe<Scalars['String']>
  countryCode_not_contains?: InputMaybe<Scalars['String']>
  countryCode_not_containsInsensitive?: InputMaybe<Scalars['String']>
  countryCode_not_endsWith?: InputMaybe<Scalars['String']>
  countryCode_not_eq?: InputMaybe<Scalars['String']>
  countryCode_not_in?: InputMaybe<Array<Scalars['String']>>
  countryCode_not_startsWith?: InputMaybe<Scalars['String']>
  countryCode_startsWith?: InputMaybe<Scalars['String']>
}

export type Notification = {
  __typename?: 'Notification'
  /** Member that should recieve the notification */
  account: Account
  /** timestamp */
  createdAt: Scalars['DateTime']
  /** block after which notification should be dispatched (if null, then it should be dispatched immediately) */
  dispatchBlock?: Maybe<Scalars['Int']>
  /** related event for on chain notifications */
  event?: Maybe<Event>
  id: Scalars['String']
  /** wether this notification should be displayed in app */
  inApp: Scalars['Boolean']
  /** type of the notification, used for */
  notificationType: NotificationType
  /** recipient */
  recipient: RecipientType
  /** status */
  status: ReadOrUnread
}

export type NotificationEdge = {
  __typename?: 'NotificationEdge'
  cursor: Scalars['String']
  node: Notification
}

export type NotificationEmailDeliveriesConnection = {
  __typename?: 'NotificationEmailDeliveriesConnection'
  edges: Array<NotificationEmailDeliveryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type NotificationEmailDelivery = {
  __typename?: 'NotificationEmailDelivery'
  /** notification delivery status */
  attempts: Array<EmailDeliveryAttempt>
  /** mark as discard after max attempts or successful attempt */
  discard: Scalars['Boolean']
  /** UUID */
  id: Scalars['String']
  /** the notification being delivered */
  notification: Notification
}

export type NotificationEmailDeliveryAttemptsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EmailDeliveryAttemptOrderByInput>>
  where?: InputMaybe<EmailDeliveryAttemptWhereInput>
}

export type NotificationEmailDeliveryEdge = {
  __typename?: 'NotificationEmailDeliveryEdge'
  cursor: Scalars['String']
  node: NotificationEmailDelivery
}

export enum NotificationEmailDeliveryOrderByInput {
  DiscardAsc = 'discard_ASC',
  DiscardDesc = 'discard_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NotificationCreatedAtAsc = 'notification_createdAt_ASC',
  NotificationCreatedAtDesc = 'notification_createdAt_DESC',
  NotificationDispatchBlockAsc = 'notification_dispatchBlock_ASC',
  NotificationDispatchBlockDesc = 'notification_dispatchBlock_DESC',
  NotificationIdAsc = 'notification_id_ASC',
  NotificationIdDesc = 'notification_id_DESC',
  NotificationInAppAsc = 'notification_inApp_ASC',
  NotificationInAppDesc = 'notification_inApp_DESC',
}

export type NotificationEmailDeliveryWhereInput = {
  AND?: InputMaybe<Array<NotificationEmailDeliveryWhereInput>>
  OR?: InputMaybe<Array<NotificationEmailDeliveryWhereInput>>
  attempts_every?: InputMaybe<EmailDeliveryAttemptWhereInput>
  attempts_none?: InputMaybe<EmailDeliveryAttemptWhereInput>
  attempts_some?: InputMaybe<EmailDeliveryAttemptWhereInput>
  discard_eq?: InputMaybe<Scalars['Boolean']>
  discard_isNull?: InputMaybe<Scalars['Boolean']>
  discard_not_eq?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  notification?: InputMaybe<NotificationWhereInput>
  notification_isNull?: InputMaybe<Scalars['Boolean']>
}

export enum NotificationOrderByInput {
  AccountEmailAsc = 'account_email_ASC',
  AccountEmailDesc = 'account_email_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountIsBlockedAsc = 'account_isBlocked_ASC',
  AccountIsBlockedDesc = 'account_isBlocked_DESC',
  AccountIsEmailConfirmedAsc = 'account_isEmailConfirmed_ASC',
  AccountIsEmailConfirmedDesc = 'account_isEmailConfirmed_DESC',
  AccountJoystreamAccountAsc = 'account_joystreamAccount_ASC',
  AccountJoystreamAccountDesc = 'account_joystreamAccount_DESC',
  AccountReferrerChannelIdAsc = 'account_referrerChannelId_ASC',
  AccountReferrerChannelIdDesc = 'account_referrerChannelId_DESC',
  AccountRegisteredAtAsc = 'account_registeredAt_ASC',
  AccountRegisteredAtDesc = 'account_registeredAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DispatchBlockAsc = 'dispatchBlock_ASC',
  DispatchBlockDesc = 'dispatchBlock_DESC',
  EventIdAsc = 'event_id_ASC',
  EventIdDesc = 'event_id_DESC',
  EventInBlockAsc = 'event_inBlock_ASC',
  EventInBlockDesc = 'event_inBlock_DESC',
  EventInExtrinsicAsc = 'event_inExtrinsic_ASC',
  EventInExtrinsicDesc = 'event_inExtrinsic_DESC',
  EventIndexInBlockAsc = 'event_indexInBlock_ASC',
  EventIndexInBlockDesc = 'event_indexInBlock_DESC',
  EventTimestampAsc = 'event_timestamp_ASC',
  EventTimestampDesc = 'event_timestamp_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  InAppAsc = 'inApp_ASC',
  InAppDesc = 'inApp_DESC',
  NotificationTypeAmountAsc = 'notificationType_amount_ASC',
  NotificationTypeAmountDesc = 'notificationType_amount_DESC',
  NotificationTypeBidderHandleAsc = 'notificationType_bidderHandle_ASC',
  NotificationTypeBidderHandleDesc = 'notificationType_bidderHandle_DESC',
  NotificationTypeBidderIdAsc = 'notificationType_bidderId_ASC',
  NotificationTypeBidderIdDesc = 'notificationType_bidderId_DESC',
  NotificationTypeBurnedTokenAmountAsc = 'notificationType_burnedTokenAmount_ASC',
  NotificationTypeBurnedTokenAmountDesc = 'notificationType_burnedTokenAmount_DESC',
  NotificationTypeBurnerHandleAsc = 'notificationType_burnerHandle_ASC',
  NotificationTypeBurnerHandleDesc = 'notificationType_burnerHandle_DESC',
  NotificationTypeBurnerIdAsc = 'notificationType_burnerId_ASC',
  NotificationTypeBurnerIdDesc = 'notificationType_burnerId_DESC',
  NotificationTypeBuyerHandleAsc = 'notificationType_buyerHandle_ASC',
  NotificationTypeBuyerHandleDesc = 'notificationType_buyerHandle_DESC',
  NotificationTypeBuyerIdAsc = 'notificationType_buyerId_ASC',
  NotificationTypeBuyerIdDesc = 'notificationType_buyerId_DESC',
  NotificationTypeChannelIdAsc = 'notificationType_channelId_ASC',
  NotificationTypeChannelIdDesc = 'notificationType_channelId_DESC',
  NotificationTypeChannelTitleAsc = 'notificationType_channelTitle_ASC',
  NotificationTypeChannelTitleDesc = 'notificationType_channelTitle_DESC',
  NotificationTypeComentIdAsc = 'notificationType_comentId_ASC',
  NotificationTypeComentIdDesc = 'notificationType_comentId_DESC',
  NotificationTypeCommentIdAsc = 'notificationType_commentId_ASC',
  NotificationTypeCommentIdDesc = 'notificationType_commentId_DESC',
  NotificationTypeFollowerHandleAsc = 'notificationType_followerHandle_ASC',
  NotificationTypeFollowerHandleDesc = 'notificationType_followerHandle_DESC',
  NotificationTypeFollowerIdAsc = 'notificationType_followerId_ASC',
  NotificationTypeFollowerIdDesc = 'notificationType_followerId_DESC',
  NotificationTypeIsTypeOfAsc = 'notificationType_isTypeOf_ASC',
  NotificationTypeIsTypeOfDesc = 'notificationType_isTypeOf_DESC',
  NotificationTypeMemberHandleAsc = 'notificationType_memberHandle_ASC',
  NotificationTypeMemberHandleDesc = 'notificationType_memberHandle_DESC',
  NotificationTypeMemberIdAsc = 'notificationType_memberId_ASC',
  NotificationTypeMemberIdDesc = 'notificationType_memberId_DESC',
  NotificationTypeMintedTokenAmountAsc = 'notificationType_mintedTokenAmount_ASC',
  NotificationTypeMintedTokenAmountDesc = 'notificationType_mintedTokenAmount_DESC',
  NotificationTypeMinterHandleAsc = 'notificationType_minterHandle_ASC',
  NotificationTypeMinterHandleDesc = 'notificationType_minterHandle_DESC',
  NotificationTypeMinterIdAsc = 'notificationType_minterId_ASC',
  NotificationTypeMinterIdDesc = 'notificationType_minterId_DESC',
  NotificationTypeNewBidderHandleAsc = 'notificationType_newBidderHandle_ASC',
  NotificationTypeNewBidderHandleDesc = 'notificationType_newBidderHandle_DESC',
  NotificationTypeNewBidderIdAsc = 'notificationType_newBidderId_ASC',
  NotificationTypeNewBidderIdDesc = 'notificationType_newBidderId_DESC',
  NotificationTypePaiedJoyAmountAsc = 'notificationType_paiedJoyAmount_ASC',
  NotificationTypePaiedJoyAmountDesc = 'notificationType_paiedJoyAmount_DESC',
  NotificationTypePayerHandleAsc = 'notificationType_payerHandle_ASC',
  NotificationTypePayerHandleDesc = 'notificationType_payerHandle_DESC',
  NotificationTypePayerIdAsc = 'notificationType_payerId_ASC',
  NotificationTypePayerIdDesc = 'notificationType_payerId_DESC',
  NotificationTypePhantomAsc = 'notificationType_phantom_ASC',
  NotificationTypePhantomDesc = 'notificationType_phantom_DESC',
  NotificationTypePlannedAtAsc = 'notificationType_plannedAt_ASC',
  NotificationTypePlannedAtDesc = 'notificationType_plannedAt_DESC',
  NotificationTypePriceAsc = 'notificationType_price_ASC',
  NotificationTypePriceDesc = 'notificationType_price_DESC',
  NotificationTypeReceivedJoyAmountAsc = 'notificationType_receivedJoyAmount_ASC',
  NotificationTypeReceivedJoyAmountDesc = 'notificationType_receivedJoyAmount_DESC',
  NotificationTypeRevenueShareIdAsc = 'notificationType_revenueShareId_ASC',
  NotificationTypeRevenueShareIdDesc = 'notificationType_revenueShareId_DESC',
  NotificationTypeTokenIdAsc = 'notificationType_tokenId_ASC',
  NotificationTypeTokenIdDesc = 'notificationType_tokenId_DESC',
  NotificationTypeTokenSymbolAsc = 'notificationType_tokenSymbol_ASC',
  NotificationTypeTokenSymbolDesc = 'notificationType_tokenSymbol_DESC',
  NotificationTypeVideoIdAsc = 'notificationType_videoId_ASC',
  NotificationTypeVideoIdDesc = 'notificationType_videoId_DESC',
  NotificationTypeVideoTitleAsc = 'notificationType_videoTitle_ASC',
  NotificationTypeVideoTitleDesc = 'notificationType_videoTitle_DESC',
  RecipientIsTypeOfAsc = 'recipient_isTypeOf_ASC',
  RecipientIsTypeOfDesc = 'recipient_isTypeOf_DESC',
  StatusIsTypeOfAsc = 'status_isTypeOf_ASC',
  StatusIsTypeOfDesc = 'status_isTypeOf_DESC',
  StatusPhantomAsc = 'status_phantom_ASC',
  StatusPhantomDesc = 'status_phantom_DESC',
  StatusReadAtAsc = 'status_readAt_ASC',
  StatusReadAtDesc = 'status_readAt_DESC',
}

export type NotificationPreference = {
  __typename?: 'NotificationPreference'
  /** Allows to send email for the notification */
  emailEnabled: Scalars['Boolean']
  /** Notification is enabled in the app */
  inAppEnabled: Scalars['Boolean']
}

export type NotificationPreferenceGql = {
  emailEnabled?: InputMaybe<Scalars['Boolean']>
  inAppEnabled?: InputMaybe<Scalars['Boolean']>
}

export type NotificationPreferenceOutput = {
  __typename?: 'NotificationPreferenceOutput'
  emailEnabled: Scalars['Boolean']
  inAppEnabled: Scalars['Boolean']
}

export type NotificationPreferenceWhereInput = {
  emailEnabled_eq?: InputMaybe<Scalars['Boolean']>
  emailEnabled_isNull?: InputMaybe<Scalars['Boolean']>
  emailEnabled_not_eq?: InputMaybe<Scalars['Boolean']>
  inAppEnabled_eq?: InputMaybe<Scalars['Boolean']>
  inAppEnabled_isNull?: InputMaybe<Scalars['Boolean']>
  inAppEnabled_not_eq?: InputMaybe<Scalars['Boolean']>
}

export type NotificationType =
  | AuctionLost
  | AuctionWon
  | ChannelCreated
  | ChannelExcluded
  | ChannelFundsWithdrawn
  | ChannelSuspended
  | ChannelVerified
  | CommentPostedToVideo
  | CommentReply
  | CreatorReceivesAuctionBid
  | CreatorTokenIssued
  | CreatorTokenMarketBurn
  | CreatorTokenMarketMint
  | CreatorTokenMarketStarted
  | CreatorTokenRevenueShareEnded
  | CreatorTokenRevenueSharePlanned
  | CreatorTokenRevenueShareStarted
  | CreatorTokenSaleMint
  | CreatorTokenSaleStarted
  | DirectChannelPaymentByMember
  | HigherBidPlaced
  | NewAuction
  | NewChannelFollower
  | NewNftOnSale
  | NftFeaturedOnMarketPlace
  | NftPurchased
  | NftRoyaltyPaid
  | ReactionToComment
  | VideoDisliked
  | VideoExcluded
  | VideoLiked
  | VideoPosted

export type NotificationTypeWhereInput = {
  amount_eq?: InputMaybe<Scalars['BigInt']>
  amount_gt?: InputMaybe<Scalars['BigInt']>
  amount_gte?: InputMaybe<Scalars['BigInt']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>
  amount_isNull?: InputMaybe<Scalars['Boolean']>
  amount_lt?: InputMaybe<Scalars['BigInt']>
  amount_lte?: InputMaybe<Scalars['BigInt']>
  amount_not_eq?: InputMaybe<Scalars['BigInt']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  bidderHandle_contains?: InputMaybe<Scalars['String']>
  bidderHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  bidderHandle_endsWith?: InputMaybe<Scalars['String']>
  bidderHandle_eq?: InputMaybe<Scalars['String']>
  bidderHandle_gt?: InputMaybe<Scalars['String']>
  bidderHandle_gte?: InputMaybe<Scalars['String']>
  bidderHandle_in?: InputMaybe<Array<Scalars['String']>>
  bidderHandle_isNull?: InputMaybe<Scalars['Boolean']>
  bidderHandle_lt?: InputMaybe<Scalars['String']>
  bidderHandle_lte?: InputMaybe<Scalars['String']>
  bidderHandle_not_contains?: InputMaybe<Scalars['String']>
  bidderHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  bidderHandle_not_endsWith?: InputMaybe<Scalars['String']>
  bidderHandle_not_eq?: InputMaybe<Scalars['String']>
  bidderHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  bidderHandle_not_startsWith?: InputMaybe<Scalars['String']>
  bidderHandle_startsWith?: InputMaybe<Scalars['String']>
  bidderId_contains?: InputMaybe<Scalars['String']>
  bidderId_containsInsensitive?: InputMaybe<Scalars['String']>
  bidderId_endsWith?: InputMaybe<Scalars['String']>
  bidderId_eq?: InputMaybe<Scalars['String']>
  bidderId_gt?: InputMaybe<Scalars['String']>
  bidderId_gte?: InputMaybe<Scalars['String']>
  bidderId_in?: InputMaybe<Array<Scalars['String']>>
  bidderId_isNull?: InputMaybe<Scalars['Boolean']>
  bidderId_lt?: InputMaybe<Scalars['String']>
  bidderId_lte?: InputMaybe<Scalars['String']>
  bidderId_not_contains?: InputMaybe<Scalars['String']>
  bidderId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  bidderId_not_endsWith?: InputMaybe<Scalars['String']>
  bidderId_not_eq?: InputMaybe<Scalars['String']>
  bidderId_not_in?: InputMaybe<Array<Scalars['String']>>
  bidderId_not_startsWith?: InputMaybe<Scalars['String']>
  bidderId_startsWith?: InputMaybe<Scalars['String']>
  burnedTokenAmount_eq?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  burnedTokenAmount_isNull?: InputMaybe<Scalars['Boolean']>
  burnedTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  burnedTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  burnerHandle_contains?: InputMaybe<Scalars['String']>
  burnerHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  burnerHandle_endsWith?: InputMaybe<Scalars['String']>
  burnerHandle_eq?: InputMaybe<Scalars['String']>
  burnerHandle_gt?: InputMaybe<Scalars['String']>
  burnerHandle_gte?: InputMaybe<Scalars['String']>
  burnerHandle_in?: InputMaybe<Array<Scalars['String']>>
  burnerHandle_isNull?: InputMaybe<Scalars['Boolean']>
  burnerHandle_lt?: InputMaybe<Scalars['String']>
  burnerHandle_lte?: InputMaybe<Scalars['String']>
  burnerHandle_not_contains?: InputMaybe<Scalars['String']>
  burnerHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  burnerHandle_not_endsWith?: InputMaybe<Scalars['String']>
  burnerHandle_not_eq?: InputMaybe<Scalars['String']>
  burnerHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  burnerHandle_not_startsWith?: InputMaybe<Scalars['String']>
  burnerHandle_startsWith?: InputMaybe<Scalars['String']>
  burnerId_contains?: InputMaybe<Scalars['String']>
  burnerId_containsInsensitive?: InputMaybe<Scalars['String']>
  burnerId_endsWith?: InputMaybe<Scalars['String']>
  burnerId_eq?: InputMaybe<Scalars['String']>
  burnerId_gt?: InputMaybe<Scalars['String']>
  burnerId_gte?: InputMaybe<Scalars['String']>
  burnerId_in?: InputMaybe<Array<Scalars['String']>>
  burnerId_isNull?: InputMaybe<Scalars['Boolean']>
  burnerId_lt?: InputMaybe<Scalars['String']>
  burnerId_lte?: InputMaybe<Scalars['String']>
  burnerId_not_contains?: InputMaybe<Scalars['String']>
  burnerId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  burnerId_not_endsWith?: InputMaybe<Scalars['String']>
  burnerId_not_eq?: InputMaybe<Scalars['String']>
  burnerId_not_in?: InputMaybe<Array<Scalars['String']>>
  burnerId_not_startsWith?: InputMaybe<Scalars['String']>
  burnerId_startsWith?: InputMaybe<Scalars['String']>
  buyerHandle_contains?: InputMaybe<Scalars['String']>
  buyerHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  buyerHandle_endsWith?: InputMaybe<Scalars['String']>
  buyerHandle_eq?: InputMaybe<Scalars['String']>
  buyerHandle_gt?: InputMaybe<Scalars['String']>
  buyerHandle_gte?: InputMaybe<Scalars['String']>
  buyerHandle_in?: InputMaybe<Array<Scalars['String']>>
  buyerHandle_isNull?: InputMaybe<Scalars['Boolean']>
  buyerHandle_lt?: InputMaybe<Scalars['String']>
  buyerHandle_lte?: InputMaybe<Scalars['String']>
  buyerHandle_not_contains?: InputMaybe<Scalars['String']>
  buyerHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  buyerHandle_not_endsWith?: InputMaybe<Scalars['String']>
  buyerHandle_not_eq?: InputMaybe<Scalars['String']>
  buyerHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  buyerHandle_not_startsWith?: InputMaybe<Scalars['String']>
  buyerHandle_startsWith?: InputMaybe<Scalars['String']>
  buyerId_contains?: InputMaybe<Scalars['String']>
  buyerId_containsInsensitive?: InputMaybe<Scalars['String']>
  buyerId_endsWith?: InputMaybe<Scalars['String']>
  buyerId_eq?: InputMaybe<Scalars['String']>
  buyerId_gt?: InputMaybe<Scalars['String']>
  buyerId_gte?: InputMaybe<Scalars['String']>
  buyerId_in?: InputMaybe<Array<Scalars['String']>>
  buyerId_isNull?: InputMaybe<Scalars['Boolean']>
  buyerId_lt?: InputMaybe<Scalars['String']>
  buyerId_lte?: InputMaybe<Scalars['String']>
  buyerId_not_contains?: InputMaybe<Scalars['String']>
  buyerId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  buyerId_not_endsWith?: InputMaybe<Scalars['String']>
  buyerId_not_eq?: InputMaybe<Scalars['String']>
  buyerId_not_in?: InputMaybe<Array<Scalars['String']>>
  buyerId_not_startsWith?: InputMaybe<Scalars['String']>
  buyerId_startsWith?: InputMaybe<Scalars['String']>
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  channelTitle_contains?: InputMaybe<Scalars['String']>
  channelTitle_containsInsensitive?: InputMaybe<Scalars['String']>
  channelTitle_endsWith?: InputMaybe<Scalars['String']>
  channelTitle_eq?: InputMaybe<Scalars['String']>
  channelTitle_gt?: InputMaybe<Scalars['String']>
  channelTitle_gte?: InputMaybe<Scalars['String']>
  channelTitle_in?: InputMaybe<Array<Scalars['String']>>
  channelTitle_isNull?: InputMaybe<Scalars['Boolean']>
  channelTitle_lt?: InputMaybe<Scalars['String']>
  channelTitle_lte?: InputMaybe<Scalars['String']>
  channelTitle_not_contains?: InputMaybe<Scalars['String']>
  channelTitle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelTitle_not_endsWith?: InputMaybe<Scalars['String']>
  channelTitle_not_eq?: InputMaybe<Scalars['String']>
  channelTitle_not_in?: InputMaybe<Array<Scalars['String']>>
  channelTitle_not_startsWith?: InputMaybe<Scalars['String']>
  channelTitle_startsWith?: InputMaybe<Scalars['String']>
  comentId_contains?: InputMaybe<Scalars['String']>
  comentId_containsInsensitive?: InputMaybe<Scalars['String']>
  comentId_endsWith?: InputMaybe<Scalars['String']>
  comentId_eq?: InputMaybe<Scalars['String']>
  comentId_gt?: InputMaybe<Scalars['String']>
  comentId_gte?: InputMaybe<Scalars['String']>
  comentId_in?: InputMaybe<Array<Scalars['String']>>
  comentId_isNull?: InputMaybe<Scalars['Boolean']>
  comentId_lt?: InputMaybe<Scalars['String']>
  comentId_lte?: InputMaybe<Scalars['String']>
  comentId_not_contains?: InputMaybe<Scalars['String']>
  comentId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  comentId_not_endsWith?: InputMaybe<Scalars['String']>
  comentId_not_eq?: InputMaybe<Scalars['String']>
  comentId_not_in?: InputMaybe<Array<Scalars['String']>>
  comentId_not_startsWith?: InputMaybe<Scalars['String']>
  comentId_startsWith?: InputMaybe<Scalars['String']>
  commentId_contains?: InputMaybe<Scalars['String']>
  commentId_containsInsensitive?: InputMaybe<Scalars['String']>
  commentId_endsWith?: InputMaybe<Scalars['String']>
  commentId_eq?: InputMaybe<Scalars['String']>
  commentId_gt?: InputMaybe<Scalars['String']>
  commentId_gte?: InputMaybe<Scalars['String']>
  commentId_in?: InputMaybe<Array<Scalars['String']>>
  commentId_isNull?: InputMaybe<Scalars['Boolean']>
  commentId_lt?: InputMaybe<Scalars['String']>
  commentId_lte?: InputMaybe<Scalars['String']>
  commentId_not_contains?: InputMaybe<Scalars['String']>
  commentId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  commentId_not_endsWith?: InputMaybe<Scalars['String']>
  commentId_not_eq?: InputMaybe<Scalars['String']>
  commentId_not_in?: InputMaybe<Array<Scalars['String']>>
  commentId_not_startsWith?: InputMaybe<Scalars['String']>
  commentId_startsWith?: InputMaybe<Scalars['String']>
  followerHandle_contains?: InputMaybe<Scalars['String']>
  followerHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  followerHandle_endsWith?: InputMaybe<Scalars['String']>
  followerHandle_eq?: InputMaybe<Scalars['String']>
  followerHandle_gt?: InputMaybe<Scalars['String']>
  followerHandle_gte?: InputMaybe<Scalars['String']>
  followerHandle_in?: InputMaybe<Array<Scalars['String']>>
  followerHandle_isNull?: InputMaybe<Scalars['Boolean']>
  followerHandle_lt?: InputMaybe<Scalars['String']>
  followerHandle_lte?: InputMaybe<Scalars['String']>
  followerHandle_not_contains?: InputMaybe<Scalars['String']>
  followerHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  followerHandle_not_endsWith?: InputMaybe<Scalars['String']>
  followerHandle_not_eq?: InputMaybe<Scalars['String']>
  followerHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  followerHandle_not_startsWith?: InputMaybe<Scalars['String']>
  followerHandle_startsWith?: InputMaybe<Scalars['String']>
  followerId_contains?: InputMaybe<Scalars['String']>
  followerId_containsInsensitive?: InputMaybe<Scalars['String']>
  followerId_endsWith?: InputMaybe<Scalars['String']>
  followerId_eq?: InputMaybe<Scalars['String']>
  followerId_gt?: InputMaybe<Scalars['String']>
  followerId_gte?: InputMaybe<Scalars['String']>
  followerId_in?: InputMaybe<Array<Scalars['String']>>
  followerId_isNull?: InputMaybe<Scalars['Boolean']>
  followerId_lt?: InputMaybe<Scalars['String']>
  followerId_lte?: InputMaybe<Scalars['String']>
  followerId_not_contains?: InputMaybe<Scalars['String']>
  followerId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  followerId_not_endsWith?: InputMaybe<Scalars['String']>
  followerId_not_eq?: InputMaybe<Scalars['String']>
  followerId_not_in?: InputMaybe<Array<Scalars['String']>>
  followerId_not_startsWith?: InputMaybe<Scalars['String']>
  followerId_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  memberHandle_contains?: InputMaybe<Scalars['String']>
  memberHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  memberHandle_endsWith?: InputMaybe<Scalars['String']>
  memberHandle_eq?: InputMaybe<Scalars['String']>
  memberHandle_gt?: InputMaybe<Scalars['String']>
  memberHandle_gte?: InputMaybe<Scalars['String']>
  memberHandle_in?: InputMaybe<Array<Scalars['String']>>
  memberHandle_isNull?: InputMaybe<Scalars['Boolean']>
  memberHandle_lt?: InputMaybe<Scalars['String']>
  memberHandle_lte?: InputMaybe<Scalars['String']>
  memberHandle_not_contains?: InputMaybe<Scalars['String']>
  memberHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  memberHandle_not_endsWith?: InputMaybe<Scalars['String']>
  memberHandle_not_eq?: InputMaybe<Scalars['String']>
  memberHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  memberHandle_not_startsWith?: InputMaybe<Scalars['String']>
  memberHandle_startsWith?: InputMaybe<Scalars['String']>
  memberId_contains?: InputMaybe<Scalars['String']>
  memberId_containsInsensitive?: InputMaybe<Scalars['String']>
  memberId_endsWith?: InputMaybe<Scalars['String']>
  memberId_eq?: InputMaybe<Scalars['String']>
  memberId_gt?: InputMaybe<Scalars['String']>
  memberId_gte?: InputMaybe<Scalars['String']>
  memberId_in?: InputMaybe<Array<Scalars['String']>>
  memberId_isNull?: InputMaybe<Scalars['Boolean']>
  memberId_lt?: InputMaybe<Scalars['String']>
  memberId_lte?: InputMaybe<Scalars['String']>
  memberId_not_contains?: InputMaybe<Scalars['String']>
  memberId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  memberId_not_endsWith?: InputMaybe<Scalars['String']>
  memberId_not_eq?: InputMaybe<Scalars['String']>
  memberId_not_in?: InputMaybe<Array<Scalars['String']>>
  memberId_not_startsWith?: InputMaybe<Scalars['String']>
  memberId_startsWith?: InputMaybe<Scalars['String']>
  mintedTokenAmount_eq?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_gt?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_gte?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  mintedTokenAmount_isNull?: InputMaybe<Scalars['Boolean']>
  mintedTokenAmount_lt?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_lte?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  mintedTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  minterHandle_contains?: InputMaybe<Scalars['String']>
  minterHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  minterHandle_endsWith?: InputMaybe<Scalars['String']>
  minterHandle_eq?: InputMaybe<Scalars['String']>
  minterHandle_gt?: InputMaybe<Scalars['String']>
  minterHandle_gte?: InputMaybe<Scalars['String']>
  minterHandle_in?: InputMaybe<Array<Scalars['String']>>
  minterHandle_isNull?: InputMaybe<Scalars['Boolean']>
  minterHandle_lt?: InputMaybe<Scalars['String']>
  minterHandle_lte?: InputMaybe<Scalars['String']>
  minterHandle_not_contains?: InputMaybe<Scalars['String']>
  minterHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  minterHandle_not_endsWith?: InputMaybe<Scalars['String']>
  minterHandle_not_eq?: InputMaybe<Scalars['String']>
  minterHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  minterHandle_not_startsWith?: InputMaybe<Scalars['String']>
  minterHandle_startsWith?: InputMaybe<Scalars['String']>
  minterId_contains?: InputMaybe<Scalars['String']>
  minterId_containsInsensitive?: InputMaybe<Scalars['String']>
  minterId_endsWith?: InputMaybe<Scalars['String']>
  minterId_eq?: InputMaybe<Scalars['String']>
  minterId_gt?: InputMaybe<Scalars['String']>
  minterId_gte?: InputMaybe<Scalars['String']>
  minterId_in?: InputMaybe<Array<Scalars['String']>>
  minterId_isNull?: InputMaybe<Scalars['Boolean']>
  minterId_lt?: InputMaybe<Scalars['String']>
  minterId_lte?: InputMaybe<Scalars['String']>
  minterId_not_contains?: InputMaybe<Scalars['String']>
  minterId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  minterId_not_endsWith?: InputMaybe<Scalars['String']>
  minterId_not_eq?: InputMaybe<Scalars['String']>
  minterId_not_in?: InputMaybe<Array<Scalars['String']>>
  minterId_not_startsWith?: InputMaybe<Scalars['String']>
  minterId_startsWith?: InputMaybe<Scalars['String']>
  newBidderHandle_contains?: InputMaybe<Scalars['String']>
  newBidderHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  newBidderHandle_endsWith?: InputMaybe<Scalars['String']>
  newBidderHandle_eq?: InputMaybe<Scalars['String']>
  newBidderHandle_gt?: InputMaybe<Scalars['String']>
  newBidderHandle_gte?: InputMaybe<Scalars['String']>
  newBidderHandle_in?: InputMaybe<Array<Scalars['String']>>
  newBidderHandle_isNull?: InputMaybe<Scalars['Boolean']>
  newBidderHandle_lt?: InputMaybe<Scalars['String']>
  newBidderHandle_lte?: InputMaybe<Scalars['String']>
  newBidderHandle_not_contains?: InputMaybe<Scalars['String']>
  newBidderHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  newBidderHandle_not_endsWith?: InputMaybe<Scalars['String']>
  newBidderHandle_not_eq?: InputMaybe<Scalars['String']>
  newBidderHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  newBidderHandle_not_startsWith?: InputMaybe<Scalars['String']>
  newBidderHandle_startsWith?: InputMaybe<Scalars['String']>
  newBidderId_contains?: InputMaybe<Scalars['String']>
  newBidderId_containsInsensitive?: InputMaybe<Scalars['String']>
  newBidderId_endsWith?: InputMaybe<Scalars['String']>
  newBidderId_eq?: InputMaybe<Scalars['String']>
  newBidderId_gt?: InputMaybe<Scalars['String']>
  newBidderId_gte?: InputMaybe<Scalars['String']>
  newBidderId_in?: InputMaybe<Array<Scalars['String']>>
  newBidderId_isNull?: InputMaybe<Scalars['Boolean']>
  newBidderId_lt?: InputMaybe<Scalars['String']>
  newBidderId_lte?: InputMaybe<Scalars['String']>
  newBidderId_not_contains?: InputMaybe<Scalars['String']>
  newBidderId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  newBidderId_not_endsWith?: InputMaybe<Scalars['String']>
  newBidderId_not_eq?: InputMaybe<Scalars['String']>
  newBidderId_not_in?: InputMaybe<Array<Scalars['String']>>
  newBidderId_not_startsWith?: InputMaybe<Scalars['String']>
  newBidderId_startsWith?: InputMaybe<Scalars['String']>
  paiedJoyAmount_eq?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_gt?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_gte?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  paiedJoyAmount_isNull?: InputMaybe<Scalars['Boolean']>
  paiedJoyAmount_lt?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_lte?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  paiedJoyAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  payerHandle_contains?: InputMaybe<Scalars['String']>
  payerHandle_containsInsensitive?: InputMaybe<Scalars['String']>
  payerHandle_endsWith?: InputMaybe<Scalars['String']>
  payerHandle_eq?: InputMaybe<Scalars['String']>
  payerHandle_gt?: InputMaybe<Scalars['String']>
  payerHandle_gte?: InputMaybe<Scalars['String']>
  payerHandle_in?: InputMaybe<Array<Scalars['String']>>
  payerHandle_isNull?: InputMaybe<Scalars['Boolean']>
  payerHandle_lt?: InputMaybe<Scalars['String']>
  payerHandle_lte?: InputMaybe<Scalars['String']>
  payerHandle_not_contains?: InputMaybe<Scalars['String']>
  payerHandle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  payerHandle_not_endsWith?: InputMaybe<Scalars['String']>
  payerHandle_not_eq?: InputMaybe<Scalars['String']>
  payerHandle_not_in?: InputMaybe<Array<Scalars['String']>>
  payerHandle_not_startsWith?: InputMaybe<Scalars['String']>
  payerHandle_startsWith?: InputMaybe<Scalars['String']>
  payerId_contains?: InputMaybe<Scalars['String']>
  payerId_containsInsensitive?: InputMaybe<Scalars['String']>
  payerId_endsWith?: InputMaybe<Scalars['String']>
  payerId_eq?: InputMaybe<Scalars['String']>
  payerId_gt?: InputMaybe<Scalars['String']>
  payerId_gte?: InputMaybe<Scalars['String']>
  payerId_in?: InputMaybe<Array<Scalars['String']>>
  payerId_isNull?: InputMaybe<Scalars['Boolean']>
  payerId_lt?: InputMaybe<Scalars['String']>
  payerId_lte?: InputMaybe<Scalars['String']>
  payerId_not_contains?: InputMaybe<Scalars['String']>
  payerId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  payerId_not_endsWith?: InputMaybe<Scalars['String']>
  payerId_not_eq?: InputMaybe<Scalars['String']>
  payerId_not_in?: InputMaybe<Array<Scalars['String']>>
  payerId_not_startsWith?: InputMaybe<Scalars['String']>
  payerId_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  plannedAt_eq?: InputMaybe<Scalars['Int']>
  plannedAt_gt?: InputMaybe<Scalars['Int']>
  plannedAt_gte?: InputMaybe<Scalars['Int']>
  plannedAt_in?: InputMaybe<Array<Scalars['Int']>>
  plannedAt_isNull?: InputMaybe<Scalars['Boolean']>
  plannedAt_lt?: InputMaybe<Scalars['Int']>
  plannedAt_lte?: InputMaybe<Scalars['Int']>
  plannedAt_not_eq?: InputMaybe<Scalars['Int']>
  plannedAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  price_eq?: InputMaybe<Scalars['BigInt']>
  price_gt?: InputMaybe<Scalars['BigInt']>
  price_gte?: InputMaybe<Scalars['BigInt']>
  price_in?: InputMaybe<Array<Scalars['BigInt']>>
  price_isNull?: InputMaybe<Scalars['Boolean']>
  price_lt?: InputMaybe<Scalars['BigInt']>
  price_lte?: InputMaybe<Scalars['BigInt']>
  price_not_eq?: InputMaybe<Scalars['BigInt']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  receivedJoyAmount_eq?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_gt?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_gte?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  receivedJoyAmount_isNull?: InputMaybe<Scalars['Boolean']>
  receivedJoyAmount_lt?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_lte?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  receivedJoyAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  revenueShareId_contains?: InputMaybe<Scalars['String']>
  revenueShareId_containsInsensitive?: InputMaybe<Scalars['String']>
  revenueShareId_endsWith?: InputMaybe<Scalars['String']>
  revenueShareId_eq?: InputMaybe<Scalars['String']>
  revenueShareId_gt?: InputMaybe<Scalars['String']>
  revenueShareId_gte?: InputMaybe<Scalars['String']>
  revenueShareId_in?: InputMaybe<Array<Scalars['String']>>
  revenueShareId_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareId_lt?: InputMaybe<Scalars['String']>
  revenueShareId_lte?: InputMaybe<Scalars['String']>
  revenueShareId_not_contains?: InputMaybe<Scalars['String']>
  revenueShareId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  revenueShareId_not_endsWith?: InputMaybe<Scalars['String']>
  revenueShareId_not_eq?: InputMaybe<Scalars['String']>
  revenueShareId_not_in?: InputMaybe<Array<Scalars['String']>>
  revenueShareId_not_startsWith?: InputMaybe<Scalars['String']>
  revenueShareId_startsWith?: InputMaybe<Scalars['String']>
  tokenId_contains?: InputMaybe<Scalars['String']>
  tokenId_containsInsensitive?: InputMaybe<Scalars['String']>
  tokenId_endsWith?: InputMaybe<Scalars['String']>
  tokenId_eq?: InputMaybe<Scalars['String']>
  tokenId_gt?: InputMaybe<Scalars['String']>
  tokenId_gte?: InputMaybe<Scalars['String']>
  tokenId_in?: InputMaybe<Array<Scalars['String']>>
  tokenId_isNull?: InputMaybe<Scalars['Boolean']>
  tokenId_lt?: InputMaybe<Scalars['String']>
  tokenId_lte?: InputMaybe<Scalars['String']>
  tokenId_not_contains?: InputMaybe<Scalars['String']>
  tokenId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  tokenId_not_endsWith?: InputMaybe<Scalars['String']>
  tokenId_not_eq?: InputMaybe<Scalars['String']>
  tokenId_not_in?: InputMaybe<Array<Scalars['String']>>
  tokenId_not_startsWith?: InputMaybe<Scalars['String']>
  tokenId_startsWith?: InputMaybe<Scalars['String']>
  tokenSymbol_contains?: InputMaybe<Scalars['String']>
  tokenSymbol_containsInsensitive?: InputMaybe<Scalars['String']>
  tokenSymbol_endsWith?: InputMaybe<Scalars['String']>
  tokenSymbol_eq?: InputMaybe<Scalars['String']>
  tokenSymbol_gt?: InputMaybe<Scalars['String']>
  tokenSymbol_gte?: InputMaybe<Scalars['String']>
  tokenSymbol_in?: InputMaybe<Array<Scalars['String']>>
  tokenSymbol_isNull?: InputMaybe<Scalars['Boolean']>
  tokenSymbol_lt?: InputMaybe<Scalars['String']>
  tokenSymbol_lte?: InputMaybe<Scalars['String']>
  tokenSymbol_not_contains?: InputMaybe<Scalars['String']>
  tokenSymbol_not_containsInsensitive?: InputMaybe<Scalars['String']>
  tokenSymbol_not_endsWith?: InputMaybe<Scalars['String']>
  tokenSymbol_not_eq?: InputMaybe<Scalars['String']>
  tokenSymbol_not_in?: InputMaybe<Array<Scalars['String']>>
  tokenSymbol_not_startsWith?: InputMaybe<Scalars['String']>
  tokenSymbol_startsWith?: InputMaybe<Scalars['String']>
  type?: InputMaybe<AuctionTypeWhereInput>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_contains?: InputMaybe<Scalars['String']>
  videoId_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_endsWith?: InputMaybe<Scalars['String']>
  videoId_eq?: InputMaybe<Scalars['String']>
  videoId_gt?: InputMaybe<Scalars['String']>
  videoId_gte?: InputMaybe<Scalars['String']>
  videoId_in?: InputMaybe<Array<Scalars['String']>>
  videoId_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_lt?: InputMaybe<Scalars['String']>
  videoId_lte?: InputMaybe<Scalars['String']>
  videoId_not_contains?: InputMaybe<Scalars['String']>
  videoId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_not_endsWith?: InputMaybe<Scalars['String']>
  videoId_not_eq?: InputMaybe<Scalars['String']>
  videoId_not_in?: InputMaybe<Array<Scalars['String']>>
  videoId_not_startsWith?: InputMaybe<Scalars['String']>
  videoId_startsWith?: InputMaybe<Scalars['String']>
  videoTitle_contains?: InputMaybe<Scalars['String']>
  videoTitle_containsInsensitive?: InputMaybe<Scalars['String']>
  videoTitle_endsWith?: InputMaybe<Scalars['String']>
  videoTitle_eq?: InputMaybe<Scalars['String']>
  videoTitle_gt?: InputMaybe<Scalars['String']>
  videoTitle_gte?: InputMaybe<Scalars['String']>
  videoTitle_in?: InputMaybe<Array<Scalars['String']>>
  videoTitle_isNull?: InputMaybe<Scalars['Boolean']>
  videoTitle_lt?: InputMaybe<Scalars['String']>
  videoTitle_lte?: InputMaybe<Scalars['String']>
  videoTitle_not_contains?: InputMaybe<Scalars['String']>
  videoTitle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoTitle_not_endsWith?: InputMaybe<Scalars['String']>
  videoTitle_not_eq?: InputMaybe<Scalars['String']>
  videoTitle_not_in?: InputMaybe<Array<Scalars['String']>>
  videoTitle_not_startsWith?: InputMaybe<Scalars['String']>
  videoTitle_startsWith?: InputMaybe<Scalars['String']>
}

export type NotificationWhereInput = {
  AND?: InputMaybe<Array<NotificationWhereInput>>
  OR?: InputMaybe<Array<NotificationWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  dispatchBlock_eq?: InputMaybe<Scalars['Int']>
  dispatchBlock_gt?: InputMaybe<Scalars['Int']>
  dispatchBlock_gte?: InputMaybe<Scalars['Int']>
  dispatchBlock_in?: InputMaybe<Array<Scalars['Int']>>
  dispatchBlock_isNull?: InputMaybe<Scalars['Boolean']>
  dispatchBlock_lt?: InputMaybe<Scalars['Int']>
  dispatchBlock_lte?: InputMaybe<Scalars['Int']>
  dispatchBlock_not_eq?: InputMaybe<Scalars['Int']>
  dispatchBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  event?: InputMaybe<EventWhereInput>
  event_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  inApp_eq?: InputMaybe<Scalars['Boolean']>
  inApp_isNull?: InputMaybe<Scalars['Boolean']>
  inApp_not_eq?: InputMaybe<Scalars['Boolean']>
  notificationType?: InputMaybe<NotificationTypeWhereInput>
  notificationType_isNull?: InputMaybe<Scalars['Boolean']>
  recipient?: InputMaybe<RecipientTypeWhereInput>
  recipient_isNull?: InputMaybe<Scalars['Boolean']>
  status?: InputMaybe<ReadOrUnreadWhereInput>
  status_isNull?: InputMaybe<Scalars['Boolean']>
}

export type NotificationsConnection = {
  __typename?: 'NotificationsConnection'
  edges: Array<NotificationEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type OpenAuctionBidAcceptedEventData = {
  __typename?: 'OpenAuctionBidAcceptedEventData'
  /** Content actor that accepted the bid. */
  actor: ContentActor
  /** NFT owner before the auction was completed */
  previousNftOwner: NftOwner
  /** Accepted/winning bid */
  winningBid: Bid
}

export type OpenAuctionStartedEventData = {
  __typename?: 'OpenAuctionStartedEventData'
  /** Actor that started this auction. */
  actor: ContentActor
  /** Auction started. */
  auction: Auction
  /** owner of the NFT being auctioned */
  nftOwner: NftOwner
}

export enum OperatorPermission {
  ExcludeContent = 'EXCLUDE_CONTENT',
  GrantOperatorPermissions = 'GRANT_OPERATOR_PERMISSIONS',
  RestoreContent = 'RESTORE_CONTENT',
  RevokeOperatorPermissions = 'REVOKE_OPERATOR_PERMISSIONS',
  SetCategoryFeaturedVideos = 'SET_CATEGORY_FEATURED_VIDEOS',
  SetChannelWeights = 'SET_CHANNEL_WEIGHTS',
  SetCrtMarketcapMinVolume = 'SET_CRT_MARKETCAP_MIN_VOLUME',
  SetFeaturedCrts = 'SET_FEATURED_CRTS',
  SetFeaturedNfts = 'SET_FEATURED_NFTS',
  SetKillSwitch = 'SET_KILL_SWITCH',
  SetPublicFeedVideos = 'SET_PUBLIC_FEED_VIDEOS',
  SetSupportedCategories = 'SET_SUPPORTED_CATEGORIES',
  SetTipTiers = 'SET_TIP_TIERS',
  SetVideoHero = 'SET_VIDEO_HERO',
  SetVideoViewPerUserTimeLimit = 'SET_VIDEO_VIEW_PER_USER_TIME_LIMIT',
  SetVideoWeights = 'SET_VIDEO_WEIGHTS',
}

/** Represents NFT details */
export type OwnedNft = {
  __typename?: 'OwnedNft'
  /** Auctions done for this NFT */
  auctions: Array<Auction>
  /** All NFT auction bids */
  bids: Array<Bid>
  /** Timestamp of the block the NFT was created at */
  createdAt: Scalars['DateTime']
  /** Creator royalty (if any) */
  creatorRoyalty?: Maybe<Scalars['Float']>
  id: Scalars['String']
  /** Flag to indicate whether the NFT is featured or not */
  isFeatured: Scalars['Boolean']
  /** NFT's last sale date (if any) */
  lastSaleDate?: Maybe<Scalars['DateTime']>
  /** NFT's last sale price (if any) */
  lastSalePrice?: Maybe<Scalars['BigInt']>
  /** Current owner of the NFT. */
  owner: NftOwner
  /** NFT's transactional status */
  transactionalStatus?: Maybe<TransactionalStatus>
  /** NFT's video */
  video: Video
}

/** Represents NFT details */
export type OwnedNftAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionOrderByInput>>
  where?: InputMaybe<AuctionWhereInput>
}

/** Represents NFT details */
export type OwnedNftBidsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BidOrderByInput>>
  where?: InputMaybe<BidWhereInput>
}

export type OwnedNftEdge = {
  __typename?: 'OwnedNftEdge'
  cursor: Scalars['String']
  node: OwnedNft
}

export enum OwnedNftOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatorRoyaltyAsc = 'creatorRoyalty_ASC',
  CreatorRoyaltyDesc = 'creatorRoyalty_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsFeaturedAsc = 'isFeatured_ASC',
  IsFeaturedDesc = 'isFeatured_DESC',
  LastSaleDateAsc = 'lastSaleDate_ASC',
  LastSaleDateDesc = 'lastSaleDate_DESC',
  LastSalePriceAsc = 'lastSalePrice_ASC',
  LastSalePriceDesc = 'lastSalePrice_DESC',
  OwnerIsTypeOfAsc = 'owner_isTypeOf_ASC',
  OwnerIsTypeOfDesc = 'owner_isTypeOf_DESC',
  TransactionalStatusIsTypeOfAsc = 'transactionalStatus_isTypeOf_ASC',
  TransactionalStatusIsTypeOfDesc = 'transactionalStatus_isTypeOf_DESC',
  TransactionalStatusPhantomAsc = 'transactionalStatus_phantom_ASC',
  TransactionalStatusPhantomDesc = 'transactionalStatus_phantom_DESC',
  TransactionalStatusPriceAsc = 'transactionalStatus_price_ASC',
  TransactionalStatusPriceDesc = 'transactionalStatus_price_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type OwnedNftWhereInput = {
  AND?: InputMaybe<Array<OwnedNftWhereInput>>
  OR?: InputMaybe<Array<OwnedNftWhereInput>>
  auctions_every?: InputMaybe<AuctionWhereInput>
  auctions_none?: InputMaybe<AuctionWhereInput>
  auctions_some?: InputMaybe<AuctionWhereInput>
  bids_every?: InputMaybe<BidWhereInput>
  bids_none?: InputMaybe<BidWhereInput>
  bids_some?: InputMaybe<BidWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  creatorRoyalty_eq?: InputMaybe<Scalars['Float']>
  creatorRoyalty_gt?: InputMaybe<Scalars['Float']>
  creatorRoyalty_gte?: InputMaybe<Scalars['Float']>
  creatorRoyalty_in?: InputMaybe<Array<Scalars['Float']>>
  creatorRoyalty_isNull?: InputMaybe<Scalars['Boolean']>
  creatorRoyalty_lt?: InputMaybe<Scalars['Float']>
  creatorRoyalty_lte?: InputMaybe<Scalars['Float']>
  creatorRoyalty_not_eq?: InputMaybe<Scalars['Float']>
  creatorRoyalty_not_in?: InputMaybe<Array<Scalars['Float']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isFeatured_eq?: InputMaybe<Scalars['Boolean']>
  isFeatured_isNull?: InputMaybe<Scalars['Boolean']>
  isFeatured_not_eq?: InputMaybe<Scalars['Boolean']>
  lastSaleDate_eq?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_gt?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_gte?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_in?: InputMaybe<Array<Scalars['DateTime']>>
  lastSaleDate_isNull?: InputMaybe<Scalars['Boolean']>
  lastSaleDate_lt?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_lte?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_not_eq?: InputMaybe<Scalars['DateTime']>
  lastSaleDate_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  lastSalePrice_eq?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_gt?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_gte?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_in?: InputMaybe<Array<Scalars['BigInt']>>
  lastSalePrice_isNull?: InputMaybe<Scalars['Boolean']>
  lastSalePrice_lt?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_lte?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_not_eq?: InputMaybe<Scalars['BigInt']>
  lastSalePrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  owner?: InputMaybe<NftOwnerWhereInput>
  owner_isNull?: InputMaybe<Scalars['Boolean']>
  transactionalStatus?: InputMaybe<TransactionalStatusWhereInput>
  transactionalStatus_isNull?: InputMaybe<Scalars['Boolean']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type OwnedNftsConnection = {
  __typename?: 'OwnedNftsConnection'
  edges: Array<OwnedNftEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Scalars['String']
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor: Scalars['String']
}

/** Various Channel Payment Contexts */
export type PaymentContext = PaymentContextChannel | PaymentContextVideo

export type PaymentContextChannel = {
  __typename?: 'PaymentContextChannel'
  /** Channel for which the payment was made */
  channel: Channel
}

export type PaymentContextVideo = {
  __typename?: 'PaymentContextVideo'
  /** Video for which the payment was made */
  video: Video
}

export type PaymentContextWhereInput = {
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type ProcessorState = {
  __typename?: 'ProcessorState'
  lastProcessedBlock: Scalars['Int']
}

export enum PublicFeedOperationType {
  Set = 'SET',
  Unset = 'UNSET',
}

export type Query = {
  __typename?: 'Query'
  accountById?: Maybe<Account>
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>
  accountData: AccountData
  accounts: Array<Account>
  accountsConnection: AccountsConnection
  ammCurveById?: Maybe<AmmCurve>
  /** @deprecated Use ammCurveById */
  ammCurveByUniqueInput?: Maybe<AmmCurve>
  ammCurves: Array<AmmCurve>
  ammCurvesConnection: AmmCurvesConnection
  ammTransactionById?: Maybe<AmmTransaction>
  /** @deprecated Use ammTransactionById */
  ammTransactionByUniqueInput?: Maybe<AmmTransaction>
  ammTransactions: Array<AmmTransaction>
  ammTransactionsConnection: AmmTransactionsConnection
  appById?: Maybe<App>
  /** @deprecated Use appById */
  appByUniqueInput?: Maybe<App>
  apps: Array<App>
  appsConnection: AppsConnection
  auctionById?: Maybe<Auction>
  /** @deprecated Use auctionById */
  auctionByUniqueInput?: Maybe<Auction>
  auctionWhitelistedMemberById?: Maybe<AuctionWhitelistedMember>
  /** @deprecated Use auctionWhitelistedMemberById */
  auctionWhitelistedMemberByUniqueInput?: Maybe<AuctionWhitelistedMember>
  auctionWhitelistedMembers: Array<AuctionWhitelistedMember>
  auctionWhitelistedMembersConnection: AuctionWhitelistedMembersConnection
  auctions: Array<Auction>
  auctionsConnection: AuctionsConnection
  bannedMemberById?: Maybe<BannedMember>
  /** @deprecated Use bannedMemberById */
  bannedMemberByUniqueInput?: Maybe<BannedMember>
  bannedMembers: Array<BannedMember>
  bannedMembersConnection: BannedMembersConnection
  benefitById?: Maybe<Benefit>
  /** @deprecated Use benefitById */
  benefitByUniqueInput?: Maybe<Benefit>
  benefits: Array<Benefit>
  benefitsConnection: BenefitsConnection
  bidById?: Maybe<Bid>
  /** @deprecated Use bidById */
  bidByUniqueInput?: Maybe<Bid>
  bids: Array<Bid>
  bidsConnection: BidsConnection
  channelById?: Maybe<Channel>
  /** @deprecated Use channelById */
  channelByUniqueInput?: Maybe<Channel>
  channelFollowById?: Maybe<ChannelFollow>
  /** @deprecated Use channelFollowById */
  channelFollowByUniqueInput?: Maybe<ChannelFollow>
  channelFollows: Array<ChannelFollow>
  channelFollowsConnection: ChannelFollowsConnection
  channelNftCollectors: Array<ChannelNftCollector>
  channelSuspensionById?: Maybe<ChannelSuspension>
  /** @deprecated Use channelSuspensionById */
  channelSuspensionByUniqueInput?: Maybe<ChannelSuspension>
  channelSuspensions: Array<ChannelSuspension>
  channelSuspensionsConnection: ChannelSuspensionsConnection
  channelVerificationById?: Maybe<ChannelVerification>
  /** @deprecated Use channelVerificationById */
  channelVerificationByUniqueInput?: Maybe<ChannelVerification>
  channelVerifications: Array<ChannelVerification>
  channelVerificationsConnection: ChannelVerificationsConnection
  channels: Array<Channel>
  channelsConnection: ChannelsConnection
  commentById?: Maybe<Comment>
  /** @deprecated Use commentById */
  commentByUniqueInput?: Maybe<Comment>
  commentReactionById?: Maybe<CommentReaction>
  /** @deprecated Use commentReactionById */
  commentReactionByUniqueInput?: Maybe<CommentReaction>
  commentReactions: Array<CommentReaction>
  commentReactionsConnection: CommentReactionsConnection
  comments: Array<Comment>
  commentsConnection: CommentsConnection
  creatorTokenById?: Maybe<CreatorToken>
  /** @deprecated Use creatorTokenById */
  creatorTokenByUniqueInput?: Maybe<CreatorToken>
  creatorTokens: Array<CreatorToken>
  creatorTokensConnection: CreatorTokensConnection
  curatorById?: Maybe<Curator>
  /** @deprecated Use curatorById */
  curatorByUniqueInput?: Maybe<Curator>
  curatorGroupById?: Maybe<CuratorGroup>
  /** @deprecated Use curatorGroupById */
  curatorGroupByUniqueInput?: Maybe<CuratorGroup>
  curatorGroups: Array<CuratorGroup>
  curatorGroupsConnection: CuratorGroupsConnection
  curators: Array<Curator>
  curatorsConnection: CuratorsConnection
  distributionBucketBagById?: Maybe<DistributionBucketBag>
  /** @deprecated Use distributionBucketBagById */
  distributionBucketBagByUniqueInput?: Maybe<DistributionBucketBag>
  distributionBucketBags: Array<DistributionBucketBag>
  distributionBucketBagsConnection: DistributionBucketBagsConnection
  distributionBucketById?: Maybe<DistributionBucket>
  /** @deprecated Use distributionBucketById */
  distributionBucketByUniqueInput?: Maybe<DistributionBucket>
  distributionBucketFamilies: Array<DistributionBucketFamily>
  distributionBucketFamiliesConnection: DistributionBucketFamiliesConnection
  distributionBucketFamilyById?: Maybe<DistributionBucketFamily>
  /** @deprecated Use distributionBucketFamilyById */
  distributionBucketFamilyByUniqueInput?: Maybe<DistributionBucketFamily>
  distributionBucketFamilyMetadata: Array<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataById?: Maybe<DistributionBucketFamilyMetadata>
  /** @deprecated Use distributionBucketFamilyMetadataById */
  distributionBucketFamilyMetadataByUniqueInput?: Maybe<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataConnection: DistributionBucketFamilyMetadataConnection
  distributionBucketOperatorById?: Maybe<DistributionBucketOperator>
  /** @deprecated Use distributionBucketOperatorById */
  distributionBucketOperatorByUniqueInput?: Maybe<DistributionBucketOperator>
  distributionBucketOperatorMetadata: Array<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataById?: Maybe<DistributionBucketOperatorMetadata>
  /** @deprecated Use distributionBucketOperatorMetadataById */
  distributionBucketOperatorMetadataByUniqueInput?: Maybe<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataConnection: DistributionBucketOperatorMetadataConnection
  distributionBucketOperators: Array<DistributionBucketOperator>
  distributionBucketOperatorsConnection: DistributionBucketOperatorsConnection
  distributionBuckets: Array<DistributionBucket>
  distributionBucketsConnection: DistributionBucketsConnection
  dumbPublicFeedVideos: Array<Video>
  emailDeliveryAttemptById?: Maybe<EmailDeliveryAttempt>
  /** @deprecated Use emailDeliveryAttemptById */
  emailDeliveryAttemptByUniqueInput?: Maybe<EmailDeliveryAttempt>
  emailDeliveryAttempts: Array<EmailDeliveryAttempt>
  emailDeliveryAttemptsConnection: EmailDeliveryAttemptsConnection
  encryptionArtifacts: Array<EncryptionArtifacts>
  encryptionArtifactsById?: Maybe<EncryptionArtifacts>
  /** @deprecated Use encryptionArtifactsById */
  encryptionArtifactsByUniqueInput?: Maybe<EncryptionArtifacts>
  encryptionArtifactsConnection: EncryptionArtifactsConnection
  endingAuctionsNfts: Array<OwnedNft>
  eventById?: Maybe<Event>
  /** @deprecated Use eventById */
  eventByUniqueInput?: Maybe<Event>
  events: Array<Event>
  eventsConnection: EventsConnection
  exclusionById?: Maybe<Exclusion>
  /** @deprecated Use exclusionById */
  exclusionByUniqueInput?: Maybe<Exclusion>
  exclusions: Array<Exclusion>
  exclusionsConnection: ExclusionsConnection
  extendedChannels: Array<ExtendedChannel>
  extendedVideoCategories: Array<ExtendedVideoCategory>
  gatewayConfigById?: Maybe<GatewayConfig>
  /** @deprecated Use gatewayConfigById */
  gatewayConfigByUniqueInput?: Maybe<GatewayConfig>
  gatewayConfigs: Array<GatewayConfig>
  gatewayConfigsConnection: GatewayConfigsConnection
  getAccountTransferrableBalance: GetAccountTransferrableBalanceResult
  getCumulativeHistoricalShareAllocation: GetCumulativeHistoricalShareAllocationResult
  getKillSwitch: KillSwitch
  getMarketplaceTokens: Array<MarketplaceToken>
  getMarketplaceTokensCount: MarketplaceTokenCount
  getShareDividend: GetShareDividendsResult
  getTopInteractedEntities: Array<TopInteractedEntity>
  licenseById?: Maybe<License>
  /** @deprecated Use licenseById */
  licenseByUniqueInput?: Maybe<License>
  licenses: Array<License>
  licensesConnection: LicensesConnection
  marketplaceTokenById?: Maybe<MarketplaceToken>
  /** @deprecated Use marketplaceTokenById */
  marketplaceTokenByUniqueInput?: Maybe<MarketplaceToken>
  marketplaceTokens: Array<MarketplaceToken>
  marketplaceTokensConnection: MarketplaceTokensConnection
  memberMetadata: Array<MemberMetadata>
  memberMetadataById?: Maybe<MemberMetadata>
  /** @deprecated Use memberMetadataById */
  memberMetadataByUniqueInput?: Maybe<MemberMetadata>
  memberMetadataConnection: MemberMetadataConnection
  membershipById?: Maybe<Membership>
  /** @deprecated Use membershipById */
  membershipByUniqueInput?: Maybe<Membership>
  memberships: Array<Membership>
  membershipsConnection: MembershipsConnection
  mostRecentChannels: Array<ExtendedChannel>
  mostViewedVideosConnection: VideosConnection
  nftActivities: Array<NftActivity>
  nftActivitiesConnection: NftActivitiesConnection
  nftActivityById?: Maybe<NftActivity>
  /** @deprecated Use nftActivityById */
  nftActivityByUniqueInput?: Maybe<NftActivity>
  nftFeaturingRequestById?: Maybe<NftFeaturingRequest>
  /** @deprecated Use nftFeaturingRequestById */
  nftFeaturingRequestByUniqueInput?: Maybe<NftFeaturingRequest>
  nftFeaturingRequests: Array<NftFeaturingRequest>
  nftFeaturingRequestsConnection: NftFeaturingRequestsConnection
  nftHistoryEntries: Array<NftHistoryEntry>
  nftHistoryEntriesConnection: NftHistoryEntriesConnection
  nftHistoryEntryById?: Maybe<NftHistoryEntry>
  /** @deprecated Use nftHistoryEntryById */
  nftHistoryEntryByUniqueInput?: Maybe<NftHistoryEntry>
  notificationById?: Maybe<Notification>
  /** @deprecated Use notificationById */
  notificationByUniqueInput?: Maybe<Notification>
  notificationEmailDeliveries: Array<NotificationEmailDelivery>
  notificationEmailDeliveriesConnection: NotificationEmailDeliveriesConnection
  notificationEmailDeliveryById?: Maybe<NotificationEmailDelivery>
  /** @deprecated Use notificationEmailDeliveryById */
  notificationEmailDeliveryByUniqueInput?: Maybe<NotificationEmailDelivery>
  notifications: Array<Notification>
  notificationsConnection: NotificationsConnection
  ownedNftById?: Maybe<OwnedNft>
  /** @deprecated Use ownedNftById */
  ownedNftByUniqueInput?: Maybe<OwnedNft>
  ownedNfts: Array<OwnedNft>
  ownedNftsConnection: OwnedNftsConnection
  reportById?: Maybe<Report>
  /** @deprecated Use reportById */
  reportByUniqueInput?: Maybe<Report>
  reports: Array<Report>
  reportsConnection: ReportsConnection
  revenueShareById?: Maybe<RevenueShare>
  /** @deprecated Use revenueShareById */
  revenueShareByUniqueInput?: Maybe<RevenueShare>
  revenueShareParticipationById?: Maybe<RevenueShareParticipation>
  /** @deprecated Use revenueShareParticipationById */
  revenueShareParticipationByUniqueInput?: Maybe<RevenueShareParticipation>
  revenueShareParticipations: Array<RevenueShareParticipation>
  revenueShareParticipationsConnection: RevenueShareParticipationsConnection
  revenueShares: Array<RevenueShare>
  revenueSharesConnection: RevenueSharesConnection
  saleById?: Maybe<Sale>
  /** @deprecated Use saleById */
  saleByUniqueInput?: Maybe<Sale>
  saleTransactionById?: Maybe<SaleTransaction>
  /** @deprecated Use saleTransactionById */
  saleTransactionByUniqueInput?: Maybe<SaleTransaction>
  saleTransactions: Array<SaleTransaction>
  saleTransactionsConnection: SaleTransactionsConnection
  sales: Array<Sale>
  salesConnection: SalesConnection
  sessionById?: Maybe<Session>
  /** @deprecated Use sessionById */
  sessionByUniqueInput?: Maybe<Session>
  sessionEncryptionArtifacts: Array<SessionEncryptionArtifacts>
  sessionEncryptionArtifactsById?: Maybe<SessionEncryptionArtifacts>
  /** @deprecated Use sessionEncryptionArtifactsById */
  sessionEncryptionArtifactsByUniqueInput?: Maybe<SessionEncryptionArtifacts>
  sessionEncryptionArtifactsConnection: SessionEncryptionArtifactsConnection
  sessions: Array<Session>
  sessionsConnection: SessionsConnection
  squidStatus?: Maybe<SquidStatus>
  storageBagById?: Maybe<StorageBag>
  /** @deprecated Use storageBagById */
  storageBagByUniqueInput?: Maybe<StorageBag>
  storageBags: Array<StorageBag>
  storageBagsConnection: StorageBagsConnection
  storageBucketBagById?: Maybe<StorageBucketBag>
  /** @deprecated Use storageBucketBagById */
  storageBucketBagByUniqueInput?: Maybe<StorageBucketBag>
  storageBucketBags: Array<StorageBucketBag>
  storageBucketBagsConnection: StorageBucketBagsConnection
  storageBucketById?: Maybe<StorageBucket>
  /** @deprecated Use storageBucketById */
  storageBucketByUniqueInput?: Maybe<StorageBucket>
  storageBucketOperatorMetadata: Array<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataById?: Maybe<StorageBucketOperatorMetadata>
  /** @deprecated Use storageBucketOperatorMetadataById */
  storageBucketOperatorMetadataByUniqueInput?: Maybe<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataConnection: StorageBucketOperatorMetadataConnection
  storageBuckets: Array<StorageBucket>
  storageBucketsConnection: StorageBucketsConnection
  storageDataObjectById?: Maybe<StorageDataObject>
  /** @deprecated Use storageDataObjectById */
  storageDataObjectByUniqueInput?: Maybe<StorageDataObject>
  storageDataObjects: Array<StorageDataObject>
  storageDataObjectsConnection: StorageDataObjectsConnection
  tipTiers: CommentTipTiers
  tokenAccountById?: Maybe<TokenAccount>
  /** @deprecated Use tokenAccountById */
  tokenAccountByUniqueInput?: Maybe<TokenAccount>
  tokenAccounts: Array<TokenAccount>
  tokenAccountsConnection: TokenAccountsConnection
  tokenById?: Maybe<Token>
  /** @deprecated Use tokenById */
  tokenByUniqueInput?: Maybe<Token>
  tokenChannelById?: Maybe<TokenChannel>
  /** @deprecated Use tokenChannelById */
  tokenChannelByUniqueInput?: Maybe<TokenChannel>
  tokenChannels: Array<TokenChannel>
  tokenChannelsConnection: TokenChannelsConnection
  tokens: Array<Token>
  tokensConnection: TokensConnection
  tokensWithPriceChange: Array<MarketplaceTokensReturnType>
  topSellingChannels: Array<TopSellingChannelsResult>
  topSellingToken: Array<TopSellingTokensReturnType>
  totalJoystreamEarnings: EarningStatsOutput
  trailerVideoById?: Maybe<TrailerVideo>
  /** @deprecated Use trailerVideoById */
  trailerVideoByUniqueInput?: Maybe<TrailerVideo>
  trailerVideos: Array<TrailerVideo>
  trailerVideosConnection: TrailerVideosConnection
  userById?: Maybe<User>
  /** @deprecated Use userById */
  userByUniqueInput?: Maybe<User>
  userInteractionCountById?: Maybe<UserInteractionCount>
  /** @deprecated Use userInteractionCountById */
  userInteractionCountByUniqueInput?: Maybe<UserInteractionCount>
  userInteractionCounts: Array<UserInteractionCount>
  userInteractionCountsConnection: UserInteractionCountsConnection
  users: Array<User>
  usersConnection: UsersConnection
  vestedAccountById?: Maybe<VestedAccount>
  /** @deprecated Use vestedAccountById */
  vestedAccountByUniqueInput?: Maybe<VestedAccount>
  vestedAccounts: Array<VestedAccount>
  vestedAccountsConnection: VestedAccountsConnection
  vestedSaleById?: Maybe<VestedSale>
  /** @deprecated Use vestedSaleById */
  vestedSaleByUniqueInput?: Maybe<VestedSale>
  vestedSales: Array<VestedSale>
  vestedSalesConnection: VestedSalesConnection
  vestingScheduleById?: Maybe<VestingSchedule>
  /** @deprecated Use vestingScheduleById */
  vestingScheduleByUniqueInput?: Maybe<VestingSchedule>
  vestingSchedules: Array<VestingSchedule>
  vestingSchedulesConnection: VestingSchedulesConnection
  videoById?: Maybe<Video>
  /** @deprecated Use videoById */
  videoByUniqueInput?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  videoCategoriesConnection: VideoCategoriesConnection
  videoCategoryById?: Maybe<VideoCategory>
  /** @deprecated Use videoCategoryById */
  videoCategoryByUniqueInput?: Maybe<VideoCategory>
  videoFeaturedInCategories: Array<VideoFeaturedInCategory>
  videoFeaturedInCategoriesConnection: VideoFeaturedInCategoriesConnection
  videoFeaturedInCategoryById?: Maybe<VideoFeaturedInCategory>
  /** @deprecated Use videoFeaturedInCategoryById */
  videoFeaturedInCategoryByUniqueInput?: Maybe<VideoFeaturedInCategory>
  videoHero?: Maybe<VideoHero>
  videoHeroById?: Maybe<VideoHero>
  /** @deprecated Use videoHeroById */
  videoHeroByUniqueInput?: Maybe<VideoHero>
  videoHeros: Array<VideoHero>
  videoHerosConnection: VideoHerosConnection
  videoMediaEncodingById?: Maybe<VideoMediaEncoding>
  /** @deprecated Use videoMediaEncodingById */
  videoMediaEncodingByUniqueInput?: Maybe<VideoMediaEncoding>
  videoMediaEncodings: Array<VideoMediaEncoding>
  videoMediaEncodingsConnection: VideoMediaEncodingsConnection
  videoMediaMetadata: Array<VideoMediaMetadata>
  videoMediaMetadataById?: Maybe<VideoMediaMetadata>
  /** @deprecated Use videoMediaMetadataById */
  videoMediaMetadataByUniqueInput?: Maybe<VideoMediaMetadata>
  videoMediaMetadataConnection: VideoMediaMetadataConnection
  videoReactionById?: Maybe<VideoReaction>
  /** @deprecated Use videoReactionById */
  videoReactionByUniqueInput?: Maybe<VideoReaction>
  videoReactions: Array<VideoReaction>
  videoReactionsConnection: VideoReactionsConnection
  videoSubtitleById?: Maybe<VideoSubtitle>
  /** @deprecated Use videoSubtitleById */
  videoSubtitleByUniqueInput?: Maybe<VideoSubtitle>
  videoSubtitles: Array<VideoSubtitle>
  videoSubtitlesConnection: VideoSubtitlesConnection
  videoViewEventById?: Maybe<VideoViewEvent>
  /** @deprecated Use videoViewEventById */
  videoViewEventByUniqueInput?: Maybe<VideoViewEvent>
  videoViewEvents: Array<VideoViewEvent>
  videoViewEventsConnection: VideoViewEventsConnection
  videos: Array<Video>
  videosConnection: VideosConnection
}

export type QueryAccountByIdArgs = {
  id: Scalars['String']
}

export type QueryAccountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountOrderByInput>>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AccountOrderByInput>
  where?: InputMaybe<AccountWhereInput>
}

export type QueryAmmCurveByIdArgs = {
  id: Scalars['String']
}

export type QueryAmmCurveByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAmmCurvesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmCurveOrderByInput>>
  where?: InputMaybe<AmmCurveWhereInput>
}

export type QueryAmmCurvesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AmmCurveOrderByInput>
  where?: InputMaybe<AmmCurveWhereInput>
}

export type QueryAmmTransactionByIdArgs = {
  id: Scalars['String']
}

export type QueryAmmTransactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAmmTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmTransactionOrderByInput>>
  where?: InputMaybe<AmmTransactionWhereInput>
}

export type QueryAmmTransactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AmmTransactionOrderByInput>
  where?: InputMaybe<AmmTransactionWhereInput>
}

export type QueryAppByIdArgs = {
  id: Scalars['String']
}

export type QueryAppByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAppsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AppOrderByInput>>
  where?: InputMaybe<AppWhereInput>
}

export type QueryAppsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AppOrderByInput>
  where?: InputMaybe<AppWhereInput>
}

export type QueryAuctionByIdArgs = {
  id: Scalars['String']
}

export type QueryAuctionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAuctionWhitelistedMemberByIdArgs = {
  id: Scalars['String']
}

export type QueryAuctionWhitelistedMemberByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryAuctionWhitelistedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type QueryAuctionWhitelistedMembersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AuctionWhitelistedMemberOrderByInput>
  where?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type QueryAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionOrderByInput>>
  where?: InputMaybe<AuctionWhereInput>
}

export type QueryAuctionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<AuctionOrderByInput>
  where?: InputMaybe<AuctionWhereInput>
}

export type QueryBannedMemberByIdArgs = {
  id: Scalars['String']
}

export type QueryBannedMemberByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBannedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BannedMemberOrderByInput>>
  where?: InputMaybe<BannedMemberWhereInput>
}

export type QueryBannedMembersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<BannedMemberOrderByInput>
  where?: InputMaybe<BannedMemberWhereInput>
}

export type QueryBenefitByIdArgs = {
  id: Scalars['String']
}

export type QueryBenefitByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBenefitsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BenefitOrderByInput>>
  where?: InputMaybe<BenefitWhereInput>
}

export type QueryBenefitsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<BenefitOrderByInput>
  where?: InputMaybe<BenefitWhereInput>
}

export type QueryBidByIdArgs = {
  id: Scalars['String']
}

export type QueryBidByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryBidsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BidOrderByInput>>
  where?: InputMaybe<BidWhereInput>
}

export type QueryBidsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<BidOrderByInput>
  where?: InputMaybe<BidWhereInput>
}

export type QueryChannelByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelFollowByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelFollowByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelFollowsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelFollowOrderByInput>>
  where?: InputMaybe<ChannelFollowWhereInput>
}

export type QueryChannelFollowsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ChannelFollowOrderByInput>
  where?: InputMaybe<ChannelFollowWhereInput>
}

export type QueryChannelNftCollectorsArgs = {
  channelId: Scalars['String']
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<ChannelNftCollectorsOrderByInput>
}

export type QueryChannelSuspensionByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelSuspensionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelSuspensionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelSuspensionOrderByInput>>
  where?: InputMaybe<ChannelSuspensionWhereInput>
}

export type QueryChannelSuspensionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ChannelSuspensionOrderByInput>
  where?: InputMaybe<ChannelSuspensionWhereInput>
}

export type QueryChannelVerificationByIdArgs = {
  id: Scalars['String']
}

export type QueryChannelVerificationByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryChannelVerificationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelVerificationOrderByInput>>
  where?: InputMaybe<ChannelVerificationWhereInput>
}

export type QueryChannelVerificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ChannelVerificationOrderByInput>
  where?: InputMaybe<ChannelVerificationWhereInput>
}

export type QueryChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryChannelsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ChannelOrderByInput>
  where?: InputMaybe<ChannelWhereInput>
}

export type QueryCommentByIdArgs = {
  id: Scalars['String']
}

export type QueryCommentByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCommentReactionByIdArgs = {
  id: Scalars['String']
}

export type QueryCommentReactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCommentReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentReactionOrderByInput>>
  where?: InputMaybe<CommentReactionWhereInput>
}

export type QueryCommentReactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<CommentReactionOrderByInput>
  where?: InputMaybe<CommentReactionWhereInput>
}

export type QueryCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentOrderByInput>>
  where?: InputMaybe<CommentWhereInput>
}

export type QueryCommentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<CommentOrderByInput>
  where?: InputMaybe<CommentWhereInput>
}

export type QueryCreatorTokenByIdArgs = {
  id: Scalars['String']
}

export type QueryCreatorTokenByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCreatorTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CreatorTokenOrderByInput>>
  where?: InputMaybe<CreatorTokenWhereInput>
}

export type QueryCreatorTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<CreatorTokenOrderByInput>
  where?: InputMaybe<CreatorTokenWhereInput>
}

export type QueryCuratorByIdArgs = {
  id: Scalars['String']
}

export type QueryCuratorByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCuratorGroupByIdArgs = {
  id: Scalars['String']
}

export type QueryCuratorGroupByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryCuratorGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorGroupOrderByInput>>
  where?: InputMaybe<CuratorGroupWhereInput>
}

export type QueryCuratorGroupsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<CuratorGroupOrderByInput>
  where?: InputMaybe<CuratorGroupWhereInput>
}

export type QueryCuratorsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorOrderByInput>>
  where?: InputMaybe<CuratorWhereInput>
}

export type QueryCuratorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<CuratorOrderByInput>
  where?: InputMaybe<CuratorWhereInput>
}

export type QueryDistributionBucketBagByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketBagOrderByInput>>
  where?: InputMaybe<DistributionBucketBagWhereInput>
}

export type QueryDistributionBucketBagsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketBagOrderByInput>
  where?: InputMaybe<DistributionBucketBagWhereInput>
}

export type QueryDistributionBucketByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamiliesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamiliesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketFamilyOrderByInput>
  where?: InputMaybe<DistributionBucketFamilyWhereInput>
}

export type QueryDistributionBucketFamilyByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketFamilyByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamilyMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketFamilyMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketFamilyMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketFamilyMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketFamilyMetadataOrderByInput>
  where?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
}

export type QueryDistributionBucketOperatorByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketOperatorByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
}

export type QueryDistributionBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryDistributionBucketOperatorMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryDistributionBucketOperatorMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOperatorMetadataOrderByInput>
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
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOperatorOrderByInput>
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
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<DistributionBucketOrderByInput>
  where?: InputMaybe<DistributionBucketWhereInput>
}

export type QueryDumbPublicFeedVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  skipVideoIds?: InputMaybe<Array<Scalars['String']>>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryEmailDeliveryAttemptByIdArgs = {
  id: Scalars['String']
}

export type QueryEmailDeliveryAttemptByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEmailDeliveryAttemptsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EmailDeliveryAttemptOrderByInput>>
  where?: InputMaybe<EmailDeliveryAttemptWhereInput>
}

export type QueryEmailDeliveryAttemptsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<EmailDeliveryAttemptOrderByInput>
  where?: InputMaybe<EmailDeliveryAttemptWhereInput>
}

export type QueryEncryptionArtifactsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EncryptionArtifactsOrderByInput>>
  where?: InputMaybe<EncryptionArtifactsWhereInput>
}

export type QueryEncryptionArtifactsByIdArgs = {
  id: Scalars['String']
}

export type QueryEncryptionArtifactsByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEncryptionArtifactsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<EncryptionArtifactsOrderByInput>
  where?: InputMaybe<EncryptionArtifactsWhereInput>
}

export type QueryEndingAuctionsNftsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<OwnedNftWhereInput>
}

export type QueryEventByIdArgs = {
  id: Scalars['String']
}

export type QueryEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type QueryEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<EventOrderByInput>
  where?: InputMaybe<EventWhereInput>
}

export type QueryExclusionByIdArgs = {
  id: Scalars['String']
}

export type QueryExclusionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryExclusionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ExclusionOrderByInput>>
  where?: InputMaybe<ExclusionWhereInput>
}

export type QueryExclusionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ExclusionOrderByInput>
  where?: InputMaybe<ExclusionWhereInput>
}

export type QueryExtendedChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ExtendedChannelWhereInput>
}

export type QueryGatewayConfigByIdArgs = {
  id: Scalars['String']
}

export type QueryGatewayConfigByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryGatewayConfigsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<GatewayConfigOrderByInput>>
  where?: InputMaybe<GatewayConfigWhereInput>
}

export type QueryGatewayConfigsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<GatewayConfigOrderByInput>
  where?: InputMaybe<GatewayConfigWhereInput>
}

export type QueryGetAccountTransferrableBalanceArgs = {
  currentBlockHeight: Scalars['Int']
  memberId: Scalars['String']
  tokenId: Scalars['String']
}

export type QueryGetCumulativeHistoricalShareAllocationArgs = {
  tokenId: Scalars['String']
}

export type QueryGetMarketplaceTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<Scalars['id_ASC']>>
  where?: InputMaybe<MarketplaceTokenWhereInput>
}

export type QueryGetMarketplaceTokensCountArgs = {
  where?: InputMaybe<MarketplaceTokenWhereInput>
}

export type QueryGetShareDividendArgs = {
  stakingAmount: Scalars['Int']
  tokenId: Scalars['String']
}

export type QueryGetTopInteractedEntitiesArgs = {
  period: Scalars['Int']
  type: Scalars['String']
}

export type QueryLicenseByIdArgs = {
  id: Scalars['String']
}

export type QueryLicenseByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryLicensesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LicenseOrderByInput>>
  where?: InputMaybe<LicenseWhereInput>
}

export type QueryLicensesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<LicenseOrderByInput>
  where?: InputMaybe<LicenseWhereInput>
}

export type QueryMarketplaceTokenByIdArgs = {
  id: Scalars['String']
}

export type QueryMarketplaceTokenByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryMarketplaceTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MarketplaceTokenOrderByInput>>
  where?: InputMaybe<MarketplaceTokenWhereInput>
}

export type QueryMarketplaceTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<MarketplaceTokenOrderByInput>
  where?: InputMaybe<MarketplaceTokenWhereInput>
}

export type QueryMemberMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MemberMetadataOrderByInput>>
  where?: InputMaybe<MemberMetadataWhereInput>
}

export type QueryMemberMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryMemberMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryMemberMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<MemberMetadataOrderByInput>
  where?: InputMaybe<MemberMetadataWhereInput>
}

export type QueryMembershipByIdArgs = {
  id: Scalars['String']
}

export type QueryMembershipByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryMembershipsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MembershipOrderByInput>>
  where?: InputMaybe<MembershipWhereInput>
}

export type QueryMembershipsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<MembershipOrderByInput>
  where?: InputMaybe<MembershipWhereInput>
}

export type QueryMostRecentChannelsArgs = {
  mostRecentLimit: Scalars['Int']
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  resultsLimit?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ExtendedChannelWhereInput>
}

export type QueryMostViewedVideosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  limit: Scalars['Int']
  orderBy: Array<VideoOrderByInput>
  periodDays?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryNftActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftActivityOrderByInput>>
  where?: InputMaybe<NftActivityWhereInput>
}

export type QueryNftActivitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<NftActivityOrderByInput>
  where?: InputMaybe<NftActivityWhereInput>
}

export type QueryNftActivityByIdArgs = {
  id: Scalars['String']
}

export type QueryNftActivityByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNftFeaturingRequestByIdArgs = {
  id: Scalars['String']
}

export type QueryNftFeaturingRequestByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNftFeaturingRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftFeaturingRequestOrderByInput>>
  where?: InputMaybe<NftFeaturingRequestWhereInput>
}

export type QueryNftFeaturingRequestsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<NftFeaturingRequestOrderByInput>
  where?: InputMaybe<NftFeaturingRequestWhereInput>
}

export type QueryNftHistoryEntriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftHistoryEntryOrderByInput>>
  where?: InputMaybe<NftHistoryEntryWhereInput>
}

export type QueryNftHistoryEntriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<NftHistoryEntryOrderByInput>
  where?: InputMaybe<NftHistoryEntryWhereInput>
}

export type QueryNftHistoryEntryByIdArgs = {
  id: Scalars['String']
}

export type QueryNftHistoryEntryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNotificationByIdArgs = {
  id: Scalars['String']
}

export type QueryNotificationByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNotificationEmailDeliveriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NotificationEmailDeliveryOrderByInput>>
  where?: InputMaybe<NotificationEmailDeliveryWhereInput>
}

export type QueryNotificationEmailDeliveriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<NotificationEmailDeliveryOrderByInput>
  where?: InputMaybe<NotificationEmailDeliveryWhereInput>
}

export type QueryNotificationEmailDeliveryByIdArgs = {
  id: Scalars['String']
}

export type QueryNotificationEmailDeliveryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>
  where?: InputMaybe<NotificationWhereInput>
}

export type QueryNotificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<NotificationOrderByInput>
  where?: InputMaybe<NotificationWhereInput>
}

export type QueryOwnedNftByIdArgs = {
  id: Scalars['String']
}

export type QueryOwnedNftByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryOwnedNftsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<OwnedNftOrderByInput>>
  where?: InputMaybe<OwnedNftWhereInput>
}

export type QueryOwnedNftsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<OwnedNftOrderByInput>
  where?: InputMaybe<OwnedNftWhereInput>
}

export type QueryReportByIdArgs = {
  id: Scalars['String']
}

export type QueryReportByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ReportOrderByInput>>
  where?: InputMaybe<ReportWhereInput>
}

export type QueryReportsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<ReportOrderByInput>
  where?: InputMaybe<ReportWhereInput>
}

export type QueryRevenueShareByIdArgs = {
  id: Scalars['String']
}

export type QueryRevenueShareByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryRevenueShareParticipationByIdArgs = {
  id: Scalars['String']
}

export type QueryRevenueShareParticipationByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryRevenueShareParticipationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareParticipationOrderByInput>>
  where?: InputMaybe<RevenueShareParticipationWhereInput>
}

export type QueryRevenueShareParticipationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<RevenueShareParticipationOrderByInput>
  where?: InputMaybe<RevenueShareParticipationWhereInput>
}

export type QueryRevenueSharesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareOrderByInput>>
  where?: InputMaybe<RevenueShareWhereInput>
}

export type QueryRevenueSharesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<RevenueShareOrderByInput>
  where?: InputMaybe<RevenueShareWhereInput>
}

export type QuerySaleByIdArgs = {
  id: Scalars['String']
}

export type QuerySaleByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySaleTransactionByIdArgs = {
  id: Scalars['String']
}

export type QuerySaleTransactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySaleTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleTransactionOrderByInput>>
  where?: InputMaybe<SaleTransactionWhereInput>
}

export type QuerySaleTransactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<SaleTransactionOrderByInput>
  where?: InputMaybe<SaleTransactionWhereInput>
}

export type QuerySalesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleOrderByInput>>
  where?: InputMaybe<SaleWhereInput>
}

export type QuerySalesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<SaleOrderByInput>
  where?: InputMaybe<SaleWhereInput>
}

export type QuerySessionByIdArgs = {
  id: Scalars['String']
}

export type QuerySessionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySessionEncryptionArtifactsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SessionEncryptionArtifactsOrderByInput>>
  where?: InputMaybe<SessionEncryptionArtifactsWhereInput>
}

export type QuerySessionEncryptionArtifactsByIdArgs = {
  id: Scalars['String']
}

export type QuerySessionEncryptionArtifactsByUniqueInputArgs = {
  where: WhereIdInput
}

export type QuerySessionEncryptionArtifactsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<SessionEncryptionArtifactsOrderByInput>
  where?: InputMaybe<SessionEncryptionArtifactsWhereInput>
}

export type QuerySessionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SessionOrderByInput>>
  where?: InputMaybe<SessionWhereInput>
}

export type QuerySessionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<SessionOrderByInput>
  where?: InputMaybe<SessionWhereInput>
}

export type QueryStorageBagByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBagOrderByInput>>
  where?: InputMaybe<StorageBagWhereInput>
}

export type QueryStorageBagsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<StorageBagOrderByInput>
  where?: InputMaybe<StorageBagWhereInput>
}

export type QueryStorageBucketBagByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketBagByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketBagOrderByInput>>
  where?: InputMaybe<StorageBucketBagWhereInput>
}

export type QueryStorageBucketBagsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<StorageBucketBagOrderByInput>
  where?: InputMaybe<StorageBucketBagWhereInput>
}

export type QueryStorageBucketByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
}

export type QueryStorageBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageBucketOperatorMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageBucketOperatorMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<StorageBucketOperatorMetadataOrderByInput>
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
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<StorageBucketOrderByInput>
  where?: InputMaybe<StorageBucketWhereInput>
}

export type QueryStorageDataObjectByIdArgs = {
  id: Scalars['String']
}

export type QueryStorageDataObjectByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryStorageDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageDataObjectOrderByInput>>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type QueryStorageDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<StorageDataObjectOrderByInput>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type QueryTokenAccountByIdArgs = {
  id: Scalars['String']
}

export type QueryTokenAccountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryTokenAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenAccountOrderByInput>>
  where?: InputMaybe<TokenAccountWhereInput>
}

export type QueryTokenAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<TokenAccountOrderByInput>
  where?: InputMaybe<TokenAccountWhereInput>
}

export type QueryTokenByIdArgs = {
  id: Scalars['String']
}

export type QueryTokenByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryTokenChannelByIdArgs = {
  id: Scalars['String']
}

export type QueryTokenChannelByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryTokenChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenChannelOrderByInput>>
  where?: InputMaybe<TokenChannelWhereInput>
}

export type QueryTokenChannelsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<TokenChannelOrderByInput>
  where?: InputMaybe<TokenChannelWhereInput>
}

export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenOrderByInput>>
  where?: InputMaybe<TokenWhereInput>
}

export type QueryTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<TokenOrderByInput>
  where?: InputMaybe<TokenWhereInput>
}

export type QueryTokensWithPriceChangeArgs = {
  limit?: InputMaybe<Scalars['Int']>
  minVolume?: InputMaybe<Scalars['BigInt']>
  orderByPriceDesc?: InputMaybe<Scalars['Boolean']>
  periodDays: Scalars['Int']
  where?: InputMaybe<CreatorTokenWhereInput>
}

export type QueryTopSellingChannelsArgs = {
  limit: Scalars['Int']
  periodDays: Scalars['Int']
  where?: InputMaybe<ExtendedChannelWhereInput>
}

export type QueryTopSellingTokenArgs = {
  limit?: InputMaybe<Scalars['Int']>
  minVolume?: InputMaybe<Scalars['BigInt']>
  orderByPriceDesc?: InputMaybe<Scalars['Boolean']>
  periodDays: Scalars['Int']
  where?: InputMaybe<CreatorTokenWhereInput>
}

export type QueryTrailerVideoByIdArgs = {
  id: Scalars['String']
}

export type QueryTrailerVideoByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryTrailerVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TrailerVideoOrderByInput>>
  where?: InputMaybe<TrailerVideoWhereInput>
}

export type QueryTrailerVideosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<TrailerVideoOrderByInput>
  where?: InputMaybe<TrailerVideoWhereInput>
}

export type QueryUserByIdArgs = {
  id: Scalars['String']
}

export type QueryUserByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryUserInteractionCountByIdArgs = {
  id: Scalars['String']
}

export type QueryUserInteractionCountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryUserInteractionCountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UserInteractionCountOrderByInput>>
  where?: InputMaybe<UserInteractionCountWhereInput>
}

export type QueryUserInteractionCountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<UserInteractionCountOrderByInput>
  where?: InputMaybe<UserInteractionCountWhereInput>
}

export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UserOrderByInput>>
  where?: InputMaybe<UserWhereInput>
}

export type QueryUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<UserOrderByInput>
  where?: InputMaybe<UserWhereInput>
}

export type QueryVestedAccountByIdArgs = {
  id: Scalars['String']
}

export type QueryVestedAccountByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVestedAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedAccountOrderByInput>>
  where?: InputMaybe<VestedAccountWhereInput>
}

export type QueryVestedAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VestedAccountOrderByInput>
  where?: InputMaybe<VestedAccountWhereInput>
}

export type QueryVestedSaleByIdArgs = {
  id: Scalars['String']
}

export type QueryVestedSaleByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVestedSalesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedSaleOrderByInput>>
  where?: InputMaybe<VestedSaleWhereInput>
}

export type QueryVestedSalesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VestedSaleOrderByInput>
  where?: InputMaybe<VestedSaleWhereInput>
}

export type QueryVestingScheduleByIdArgs = {
  id: Scalars['String']
}

export type QueryVestingScheduleByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVestingSchedulesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestingScheduleOrderByInput>>
  where?: InputMaybe<VestingScheduleWhereInput>
}

export type QueryVestingSchedulesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VestingScheduleOrderByInput>
  where?: InputMaybe<VestingScheduleWhereInput>
}

export type QueryVideoByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoCategoryOrderByInput>>
  where?: InputMaybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoCategoryOrderByInput>
  where?: InputMaybe<VideoCategoryWhereInput>
}

export type QueryVideoCategoryByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoCategoryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoFeaturedInCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: InputMaybe<VideoFeaturedInCategoryWhereInput>
}

export type QueryVideoFeaturedInCategoriesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoFeaturedInCategoryOrderByInput>
  where?: InputMaybe<VideoFeaturedInCategoryWhereInput>
}

export type QueryVideoFeaturedInCategoryByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoFeaturedInCategoryByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoHeroByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoHeroByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoHerosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoHeroOrderByInput>>
  where?: InputMaybe<VideoHeroWhereInput>
}

export type QueryVideoHerosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoHeroOrderByInput>
  where?: InputMaybe<VideoHeroWhereInput>
}

export type QueryVideoMediaEncodingByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoMediaEncodingByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoMediaEncodingsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaEncodingOrderByInput>>
  where?: InputMaybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaEncodingsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoMediaEncodingOrderByInput>
  where?: InputMaybe<VideoMediaEncodingWhereInput>
}

export type QueryVideoMediaMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaMetadataOrderByInput>>
  where?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoMediaMetadataByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoMediaMetadataByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoMediaMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoMediaMetadataOrderByInput>
  where?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type QueryVideoReactionByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoReactionByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoReactionOrderByInput>>
  where?: InputMaybe<VideoReactionWhereInput>
}

export type QueryVideoReactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoReactionOrderByInput>
  where?: InputMaybe<VideoReactionWhereInput>
}

export type QueryVideoSubtitleByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoSubtitleByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoSubtitlesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoSubtitleOrderByInput>>
  where?: InputMaybe<VideoSubtitleWhereInput>
}

export type QueryVideoSubtitlesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoSubtitleOrderByInput>
  where?: InputMaybe<VideoSubtitleWhereInput>
}

export type QueryVideoViewEventByIdArgs = {
  id: Scalars['String']
}

export type QueryVideoViewEventByUniqueInputArgs = {
  where: WhereIdInput
}

export type QueryVideoViewEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoViewEventOrderByInput>>
  where?: InputMaybe<VideoViewEventWhereInput>
}

export type QueryVideoViewEventsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoViewEventOrderByInput>
  where?: InputMaybe<VideoViewEventWhereInput>
}

export type QueryVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type QueryVideosConnectionArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  orderBy: Array<VideoOrderByInput>
  where?: InputMaybe<VideoWhereInput>
}

export type ReactionToComment = {
  __typename?: 'ReactionToComment'
  /** commentId for link */
  commentId: Scalars['String']
  /** member who replied */
  memberHandle: Scalars['String']
  /** member who replied */
  memberId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type Read = {
  __typename?: 'Read'
  /** timestamp */
  readAt: Scalars['DateTime']
}

export type ReadOrUnread = Read | Unread

export type ReadOrUnreadWhereInput = {
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  readAt_eq?: InputMaybe<Scalars['DateTime']>
  readAt_gt?: InputMaybe<Scalars['DateTime']>
  readAt_gte?: InputMaybe<Scalars['DateTime']>
  readAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  readAt_isNull?: InputMaybe<Scalars['Boolean']>
  readAt_lt?: InputMaybe<Scalars['DateTime']>
  readAt_lte?: InputMaybe<Scalars['DateTime']>
  readAt_not_eq?: InputMaybe<Scalars['DateTime']>
  readAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type RecipientType = ChannelRecipient | MemberRecipient

export type RecipientTypeWhereInput = {
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  membership?: InputMaybe<MembershipWhereInput>
  membership_isNull?: InputMaybe<Scalars['Boolean']>
}

export type Report = {
  __typename?: 'Report'
  /** If it's a channel report: ID of the channel being reported (the channel may no longer exist) */
  channelId?: Maybe<Scalars['String']>
  /** Unique identifier of the report */
  id: Scalars['String']
  /** Rationale behind the report */
  rationale: Scalars['String']
  /** Time of the report */
  timestamp: Scalars['DateTime']
  /** User that reported the channel / video */
  user: User
  /** If it's a video report: ID of the video being reported (the video may no longer exist) */
  videoId?: Maybe<Scalars['String']>
}

export type ReportEdge = {
  __typename?: 'ReportEdge'
  cursor: Scalars['String']
  node: Report
}

export enum ReportOrderByInput {
  ChannelIdAsc = 'channelId_ASC',
  ChannelIdDesc = 'channelId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  RationaleAsc = 'rationale_ASC',
  RationaleDesc = 'rationale_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
  VideoIdAsc = 'videoId_ASC',
  VideoIdDesc = 'videoId_DESC',
}

export type ReportWhereInput = {
  AND?: InputMaybe<Array<ReportWhereInput>>
  OR?: InputMaybe<Array<ReportWhereInput>>
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  rationale_contains?: InputMaybe<Scalars['String']>
  rationale_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_endsWith?: InputMaybe<Scalars['String']>
  rationale_eq?: InputMaybe<Scalars['String']>
  rationale_gt?: InputMaybe<Scalars['String']>
  rationale_gte?: InputMaybe<Scalars['String']>
  rationale_in?: InputMaybe<Array<Scalars['String']>>
  rationale_isNull?: InputMaybe<Scalars['Boolean']>
  rationale_lt?: InputMaybe<Scalars['String']>
  rationale_lte?: InputMaybe<Scalars['String']>
  rationale_not_contains?: InputMaybe<Scalars['String']>
  rationale_not_containsInsensitive?: InputMaybe<Scalars['String']>
  rationale_not_endsWith?: InputMaybe<Scalars['String']>
  rationale_not_eq?: InputMaybe<Scalars['String']>
  rationale_not_in?: InputMaybe<Array<Scalars['String']>>
  rationale_not_startsWith?: InputMaybe<Scalars['String']>
  rationale_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_contains?: InputMaybe<Scalars['String']>
  videoId_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_endsWith?: InputMaybe<Scalars['String']>
  videoId_eq?: InputMaybe<Scalars['String']>
  videoId_gt?: InputMaybe<Scalars['String']>
  videoId_gte?: InputMaybe<Scalars['String']>
  videoId_in?: InputMaybe<Array<Scalars['String']>>
  videoId_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_lt?: InputMaybe<Scalars['String']>
  videoId_lte?: InputMaybe<Scalars['String']>
  videoId_not_contains?: InputMaybe<Scalars['String']>
  videoId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_not_endsWith?: InputMaybe<Scalars['String']>
  videoId_not_eq?: InputMaybe<Scalars['String']>
  videoId_not_in?: InputMaybe<Array<Scalars['String']>>
  videoId_not_startsWith?: InputMaybe<Scalars['String']>
  videoId_startsWith?: InputMaybe<Scalars['String']>
}

export type ReportsConnection = {
  __typename?: 'ReportsConnection'
  edges: Array<ReportEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type RestoreContentResult = {
  __typename?: 'RestoreContentResult'
  numberOfEntitiesAffected: Scalars['Int']
}

export type RevenueShare = {
  __typename?: 'RevenueShare'
  /** total number of HAPI allocated */
  allocation: Scalars['BigInt']
  /** amounts claimed so far in order to avoid SUM aggregations */
  claimed: Scalars['BigInt']
  /** block at which the revenue share was issued */
  createdIn: Scalars['Int']
  /** ending block */
  endsAt: Scalars['Int']
  /** finalized */
  finalized: Scalars['Boolean']
  /** counter */
  id: Scalars['String']
  /** Number of participants (stackers) */
  participantsNum: Scalars['Int']
  /** number of holders that could join the split before it ended */
  potentialParticipantsNum?: Maybe<Scalars['Int']>
  /** list of participating members */
  stakers: Array<RevenueShareParticipation>
  /** starting block */
  startingAt: Scalars['Int']
  /** token which this revenue share is for */
  token: CreatorToken
}

export type RevenueShareStakersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareParticipationOrderByInput>>
  where?: InputMaybe<RevenueShareParticipationWhereInput>
}

export type RevenueShareEdge = {
  __typename?: 'RevenueShareEdge'
  cursor: Scalars['String']
  node: RevenueShare
}

export enum RevenueShareOrderByInput {
  AllocationAsc = 'allocation_ASC',
  AllocationDesc = 'allocation_DESC',
  ClaimedAsc = 'claimed_ASC',
  ClaimedDesc = 'claimed_DESC',
  CreatedInAsc = 'createdIn_ASC',
  CreatedInDesc = 'createdIn_DESC',
  EndsAtAsc = 'endsAt_ASC',
  EndsAtDesc = 'endsAt_DESC',
  FinalizedAsc = 'finalized_ASC',
  FinalizedDesc = 'finalized_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ParticipantsNumAsc = 'participantsNum_ASC',
  ParticipantsNumDesc = 'participantsNum_DESC',
  PotentialParticipantsNumAsc = 'potentialParticipantsNum_ASC',
  PotentialParticipantsNumDesc = 'potentialParticipantsNum_DESC',
  StartingAtAsc = 'startingAt_ASC',
  StartingAtDesc = 'startingAt_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
}

export type RevenueShareParticipation = {
  __typename?: 'RevenueShareParticipation'
  /** participating Account */
  account: TokenAccount
  /** block */
  createdIn: Scalars['Int']
  /** eearned joy amounts */
  earnings: Scalars['BigInt']
  /** counter */
  id: Scalars['String']
  /** whether the account unstaked funds, recoving the participation */
  recovered: Scalars['Boolean']
  /** revenue share the account is participating in */
  revenueShare: RevenueShare
  /** staked amount */
  stakedAmount: Scalars['BigInt']
}

export type RevenueShareParticipationEdge = {
  __typename?: 'RevenueShareParticipationEdge'
  cursor: Scalars['String']
  node: RevenueShareParticipation
}

export enum RevenueShareParticipationOrderByInput {
  AccountDeletedAsc = 'account_deleted_ASC',
  AccountDeletedDesc = 'account_deleted_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountStakedAmountAsc = 'account_stakedAmount_ASC',
  AccountStakedAmountDesc = 'account_stakedAmount_DESC',
  AccountTotalAmountAsc = 'account_totalAmount_ASC',
  AccountTotalAmountDesc = 'account_totalAmount_DESC',
  CreatedInAsc = 'createdIn_ASC',
  CreatedInDesc = 'createdIn_DESC',
  EarningsAsc = 'earnings_ASC',
  EarningsDesc = 'earnings_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  RecoveredAsc = 'recovered_ASC',
  RecoveredDesc = 'recovered_DESC',
  RevenueShareAllocationAsc = 'revenueShare_allocation_ASC',
  RevenueShareAllocationDesc = 'revenueShare_allocation_DESC',
  RevenueShareClaimedAsc = 'revenueShare_claimed_ASC',
  RevenueShareClaimedDesc = 'revenueShare_claimed_DESC',
  RevenueShareCreatedInAsc = 'revenueShare_createdIn_ASC',
  RevenueShareCreatedInDesc = 'revenueShare_createdIn_DESC',
  RevenueShareEndsAtAsc = 'revenueShare_endsAt_ASC',
  RevenueShareEndsAtDesc = 'revenueShare_endsAt_DESC',
  RevenueShareFinalizedAsc = 'revenueShare_finalized_ASC',
  RevenueShareFinalizedDesc = 'revenueShare_finalized_DESC',
  RevenueShareIdAsc = 'revenueShare_id_ASC',
  RevenueShareIdDesc = 'revenueShare_id_DESC',
  RevenueShareParticipantsNumAsc = 'revenueShare_participantsNum_ASC',
  RevenueShareParticipantsNumDesc = 'revenueShare_participantsNum_DESC',
  RevenueSharePotentialParticipantsNumAsc = 'revenueShare_potentialParticipantsNum_ASC',
  RevenueSharePotentialParticipantsNumDesc = 'revenueShare_potentialParticipantsNum_DESC',
  RevenueShareStartingAtAsc = 'revenueShare_startingAt_ASC',
  RevenueShareStartingAtDesc = 'revenueShare_startingAt_DESC',
  StakedAmountAsc = 'stakedAmount_ASC',
  StakedAmountDesc = 'stakedAmount_DESC',
}

export type RevenueShareParticipationWhereInput = {
  AND?: InputMaybe<Array<RevenueShareParticipationWhereInput>>
  OR?: InputMaybe<Array<RevenueShareParticipationWhereInput>>
  account?: InputMaybe<TokenAccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_eq?: InputMaybe<Scalars['Int']>
  createdIn_gt?: InputMaybe<Scalars['Int']>
  createdIn_gte?: InputMaybe<Scalars['Int']>
  createdIn_in?: InputMaybe<Array<Scalars['Int']>>
  createdIn_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_lt?: InputMaybe<Scalars['Int']>
  createdIn_lte?: InputMaybe<Scalars['Int']>
  createdIn_not_eq?: InputMaybe<Scalars['Int']>
  createdIn_not_in?: InputMaybe<Array<Scalars['Int']>>
  earnings_eq?: InputMaybe<Scalars['BigInt']>
  earnings_gt?: InputMaybe<Scalars['BigInt']>
  earnings_gte?: InputMaybe<Scalars['BigInt']>
  earnings_in?: InputMaybe<Array<Scalars['BigInt']>>
  earnings_isNull?: InputMaybe<Scalars['Boolean']>
  earnings_lt?: InputMaybe<Scalars['BigInt']>
  earnings_lte?: InputMaybe<Scalars['BigInt']>
  earnings_not_eq?: InputMaybe<Scalars['BigInt']>
  earnings_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  recovered_eq?: InputMaybe<Scalars['Boolean']>
  recovered_isNull?: InputMaybe<Scalars['Boolean']>
  recovered_not_eq?: InputMaybe<Scalars['Boolean']>
  revenueShare?: InputMaybe<RevenueShareWhereInput>
  revenueShare_isNull?: InputMaybe<Scalars['Boolean']>
  stakedAmount_eq?: InputMaybe<Scalars['BigInt']>
  stakedAmount_gt?: InputMaybe<Scalars['BigInt']>
  stakedAmount_gte?: InputMaybe<Scalars['BigInt']>
  stakedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  stakedAmount_isNull?: InputMaybe<Scalars['Boolean']>
  stakedAmount_lt?: InputMaybe<Scalars['BigInt']>
  stakedAmount_lte?: InputMaybe<Scalars['BigInt']>
  stakedAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  stakedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export type RevenueShareParticipationsConnection = {
  __typename?: 'RevenueShareParticipationsConnection'
  edges: Array<RevenueShareParticipationEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type RevenueShareWhereInput = {
  AND?: InputMaybe<Array<RevenueShareWhereInput>>
  OR?: InputMaybe<Array<RevenueShareWhereInput>>
  allocation_eq?: InputMaybe<Scalars['BigInt']>
  allocation_gt?: InputMaybe<Scalars['BigInt']>
  allocation_gte?: InputMaybe<Scalars['BigInt']>
  allocation_in?: InputMaybe<Array<Scalars['BigInt']>>
  allocation_isNull?: InputMaybe<Scalars['Boolean']>
  allocation_lt?: InputMaybe<Scalars['BigInt']>
  allocation_lte?: InputMaybe<Scalars['BigInt']>
  allocation_not_eq?: InputMaybe<Scalars['BigInt']>
  allocation_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  claimed_eq?: InputMaybe<Scalars['BigInt']>
  claimed_gt?: InputMaybe<Scalars['BigInt']>
  claimed_gte?: InputMaybe<Scalars['BigInt']>
  claimed_in?: InputMaybe<Array<Scalars['BigInt']>>
  claimed_isNull?: InputMaybe<Scalars['Boolean']>
  claimed_lt?: InputMaybe<Scalars['BigInt']>
  claimed_lte?: InputMaybe<Scalars['BigInt']>
  claimed_not_eq?: InputMaybe<Scalars['BigInt']>
  claimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  createdIn_eq?: InputMaybe<Scalars['Int']>
  createdIn_gt?: InputMaybe<Scalars['Int']>
  createdIn_gte?: InputMaybe<Scalars['Int']>
  createdIn_in?: InputMaybe<Array<Scalars['Int']>>
  createdIn_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_lt?: InputMaybe<Scalars['Int']>
  createdIn_lte?: InputMaybe<Scalars['Int']>
  createdIn_not_eq?: InputMaybe<Scalars['Int']>
  createdIn_not_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_eq?: InputMaybe<Scalars['Int']>
  endsAt_gt?: InputMaybe<Scalars['Int']>
  endsAt_gte?: InputMaybe<Scalars['Int']>
  endsAt_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_isNull?: InputMaybe<Scalars['Boolean']>
  endsAt_lt?: InputMaybe<Scalars['Int']>
  endsAt_lte?: InputMaybe<Scalars['Int']>
  endsAt_not_eq?: InputMaybe<Scalars['Int']>
  endsAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  finalized_eq?: InputMaybe<Scalars['Boolean']>
  finalized_isNull?: InputMaybe<Scalars['Boolean']>
  finalized_not_eq?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  participantsNum_eq?: InputMaybe<Scalars['Int']>
  participantsNum_gt?: InputMaybe<Scalars['Int']>
  participantsNum_gte?: InputMaybe<Scalars['Int']>
  participantsNum_in?: InputMaybe<Array<Scalars['Int']>>
  participantsNum_isNull?: InputMaybe<Scalars['Boolean']>
  participantsNum_lt?: InputMaybe<Scalars['Int']>
  participantsNum_lte?: InputMaybe<Scalars['Int']>
  participantsNum_not_eq?: InputMaybe<Scalars['Int']>
  participantsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  potentialParticipantsNum_eq?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_gt?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_gte?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_in?: InputMaybe<Array<Scalars['Int']>>
  potentialParticipantsNum_isNull?: InputMaybe<Scalars['Boolean']>
  potentialParticipantsNum_lt?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_lte?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_not_eq?: InputMaybe<Scalars['Int']>
  potentialParticipantsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  stakers_every?: InputMaybe<RevenueShareParticipationWhereInput>
  stakers_none?: InputMaybe<RevenueShareParticipationWhereInput>
  stakers_some?: InputMaybe<RevenueShareParticipationWhereInput>
  startingAt_eq?: InputMaybe<Scalars['Int']>
  startingAt_gt?: InputMaybe<Scalars['Int']>
  startingAt_gte?: InputMaybe<Scalars['Int']>
  startingAt_in?: InputMaybe<Array<Scalars['Int']>>
  startingAt_isNull?: InputMaybe<Scalars['Boolean']>
  startingAt_lt?: InputMaybe<Scalars['Int']>
  startingAt_lte?: InputMaybe<Scalars['Int']>
  startingAt_not_eq?: InputMaybe<Scalars['Int']>
  startingAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
}

export type RevenueSharesConnection = {
  __typename?: 'RevenueSharesConnection'
  edges: Array<RevenueShareEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Sale = {
  __typename?: 'Sale'
  /** creation block */
  createdIn: Scalars['Int']
  /** ending block */
  endsAt: Scalars['Int']
  /** finalized */
  finalized: Scalars['Boolean']
  /** sale funds source */
  fundsSourceAccount: TokenAccount
  /** counter */
  id: Scalars['String']
  /** max amount that member can purchase */
  maxAmountPerMember?: Maybe<Scalars['BigInt']>
  /** constant price in HAPI for each token */
  pricePerUnit: Scalars['BigInt']
  /** sale start block */
  startBlock: Scalars['Int']
  /** terms and conditions text */
  termsAndConditions: Scalars['String']
  /** token for which the sale is issued */
  token: CreatorToken
  /** total amount of token on sale */
  tokenSaleAllocation: Scalars['BigInt']
  /** amount of tokens that has been sold */
  tokensSold: Scalars['BigInt']
  /** transactions references */
  transactions: Array<SaleTransaction>
  /** vesting schedule for sale */
  vestedSale?: Maybe<VestedSale>
}

export type SaleTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleTransactionOrderByInput>>
  where?: InputMaybe<SaleTransactionWhereInput>
}

export type SaleEdge = {
  __typename?: 'SaleEdge'
  cursor: Scalars['String']
  node: Sale
}

export enum SaleOrderByInput {
  CreatedInAsc = 'createdIn_ASC',
  CreatedInDesc = 'createdIn_DESC',
  EndsAtAsc = 'endsAt_ASC',
  EndsAtDesc = 'endsAt_DESC',
  FinalizedAsc = 'finalized_ASC',
  FinalizedDesc = 'finalized_DESC',
  FundsSourceAccountDeletedAsc = 'fundsSourceAccount_deleted_ASC',
  FundsSourceAccountDeletedDesc = 'fundsSourceAccount_deleted_DESC',
  FundsSourceAccountIdAsc = 'fundsSourceAccount_id_ASC',
  FundsSourceAccountIdDesc = 'fundsSourceAccount_id_DESC',
  FundsSourceAccountStakedAmountAsc = 'fundsSourceAccount_stakedAmount_ASC',
  FundsSourceAccountStakedAmountDesc = 'fundsSourceAccount_stakedAmount_DESC',
  FundsSourceAccountTotalAmountAsc = 'fundsSourceAccount_totalAmount_ASC',
  FundsSourceAccountTotalAmountDesc = 'fundsSourceAccount_totalAmount_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MaxAmountPerMemberAsc = 'maxAmountPerMember_ASC',
  MaxAmountPerMemberDesc = 'maxAmountPerMember_DESC',
  PricePerUnitAsc = 'pricePerUnit_ASC',
  PricePerUnitDesc = 'pricePerUnit_DESC',
  StartBlockAsc = 'startBlock_ASC',
  StartBlockDesc = 'startBlock_DESC',
  TermsAndConditionsAsc = 'termsAndConditions_ASC',
  TermsAndConditionsDesc = 'termsAndConditions_DESC',
  TokenSaleAllocationAsc = 'tokenSaleAllocation_ASC',
  TokenSaleAllocationDesc = 'tokenSaleAllocation_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
  TokensSoldAsc = 'tokensSold_ASC',
  TokensSoldDesc = 'tokensSold_DESC',
  VestedSaleIdAsc = 'vestedSale_id_ASC',
  VestedSaleIdDesc = 'vestedSale_id_DESC',
}

export type SaleTransaction = {
  __typename?: 'SaleTransaction'
  /** buyer account */
  account: TokenAccount
  /** block */
  createdIn: Scalars['Int']
  /** counter */
  id: Scalars['String']
  /** amount of token bought */
  quantity: Scalars['BigInt']
  /** sale */
  sale: Sale
}

export type SaleTransactionEdge = {
  __typename?: 'SaleTransactionEdge'
  cursor: Scalars['String']
  node: SaleTransaction
}

export enum SaleTransactionOrderByInput {
  AccountDeletedAsc = 'account_deleted_ASC',
  AccountDeletedDesc = 'account_deleted_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountStakedAmountAsc = 'account_stakedAmount_ASC',
  AccountStakedAmountDesc = 'account_stakedAmount_DESC',
  AccountTotalAmountAsc = 'account_totalAmount_ASC',
  AccountTotalAmountDesc = 'account_totalAmount_DESC',
  CreatedInAsc = 'createdIn_ASC',
  CreatedInDesc = 'createdIn_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  QuantityAsc = 'quantity_ASC',
  QuantityDesc = 'quantity_DESC',
  SaleCreatedInAsc = 'sale_createdIn_ASC',
  SaleCreatedInDesc = 'sale_createdIn_DESC',
  SaleEndsAtAsc = 'sale_endsAt_ASC',
  SaleEndsAtDesc = 'sale_endsAt_DESC',
  SaleFinalizedAsc = 'sale_finalized_ASC',
  SaleFinalizedDesc = 'sale_finalized_DESC',
  SaleIdAsc = 'sale_id_ASC',
  SaleIdDesc = 'sale_id_DESC',
  SaleMaxAmountPerMemberAsc = 'sale_maxAmountPerMember_ASC',
  SaleMaxAmountPerMemberDesc = 'sale_maxAmountPerMember_DESC',
  SalePricePerUnitAsc = 'sale_pricePerUnit_ASC',
  SalePricePerUnitDesc = 'sale_pricePerUnit_DESC',
  SaleStartBlockAsc = 'sale_startBlock_ASC',
  SaleStartBlockDesc = 'sale_startBlock_DESC',
  SaleTermsAndConditionsAsc = 'sale_termsAndConditions_ASC',
  SaleTermsAndConditionsDesc = 'sale_termsAndConditions_DESC',
  SaleTokenSaleAllocationAsc = 'sale_tokenSaleAllocation_ASC',
  SaleTokenSaleAllocationDesc = 'sale_tokenSaleAllocation_DESC',
  SaleTokensSoldAsc = 'sale_tokensSold_ASC',
  SaleTokensSoldDesc = 'sale_tokensSold_DESC',
}

export type SaleTransactionWhereInput = {
  AND?: InputMaybe<Array<SaleTransactionWhereInput>>
  OR?: InputMaybe<Array<SaleTransactionWhereInput>>
  account?: InputMaybe<TokenAccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_eq?: InputMaybe<Scalars['Int']>
  createdIn_gt?: InputMaybe<Scalars['Int']>
  createdIn_gte?: InputMaybe<Scalars['Int']>
  createdIn_in?: InputMaybe<Array<Scalars['Int']>>
  createdIn_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_lt?: InputMaybe<Scalars['Int']>
  createdIn_lte?: InputMaybe<Scalars['Int']>
  createdIn_not_eq?: InputMaybe<Scalars['Int']>
  createdIn_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  quantity_eq?: InputMaybe<Scalars['BigInt']>
  quantity_gt?: InputMaybe<Scalars['BigInt']>
  quantity_gte?: InputMaybe<Scalars['BigInt']>
  quantity_in?: InputMaybe<Array<Scalars['BigInt']>>
  quantity_isNull?: InputMaybe<Scalars['Boolean']>
  quantity_lt?: InputMaybe<Scalars['BigInt']>
  quantity_lte?: InputMaybe<Scalars['BigInt']>
  quantity_not_eq?: InputMaybe<Scalars['BigInt']>
  quantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  sale?: InputMaybe<SaleWhereInput>
  sale_isNull?: InputMaybe<Scalars['Boolean']>
}

export type SaleTransactionsConnection = {
  __typename?: 'SaleTransactionsConnection'
  edges: Array<SaleTransactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type SaleVestingSource = {
  __typename?: 'SaleVestingSource'
  sale: Sale
}

export type SaleWhereInput = {
  AND?: InputMaybe<Array<SaleWhereInput>>
  OR?: InputMaybe<Array<SaleWhereInput>>
  createdIn_eq?: InputMaybe<Scalars['Int']>
  createdIn_gt?: InputMaybe<Scalars['Int']>
  createdIn_gte?: InputMaybe<Scalars['Int']>
  createdIn_in?: InputMaybe<Array<Scalars['Int']>>
  createdIn_isNull?: InputMaybe<Scalars['Boolean']>
  createdIn_lt?: InputMaybe<Scalars['Int']>
  createdIn_lte?: InputMaybe<Scalars['Int']>
  createdIn_not_eq?: InputMaybe<Scalars['Int']>
  createdIn_not_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_eq?: InputMaybe<Scalars['Int']>
  endsAt_gt?: InputMaybe<Scalars['Int']>
  endsAt_gte?: InputMaybe<Scalars['Int']>
  endsAt_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_isNull?: InputMaybe<Scalars['Boolean']>
  endsAt_lt?: InputMaybe<Scalars['Int']>
  endsAt_lte?: InputMaybe<Scalars['Int']>
  endsAt_not_eq?: InputMaybe<Scalars['Int']>
  endsAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  finalized_eq?: InputMaybe<Scalars['Boolean']>
  finalized_isNull?: InputMaybe<Scalars['Boolean']>
  finalized_not_eq?: InputMaybe<Scalars['Boolean']>
  fundsSourceAccount?: InputMaybe<TokenAccountWhereInput>
  fundsSourceAccount_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  maxAmountPerMember_eq?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_gt?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_gte?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_in?: InputMaybe<Array<Scalars['BigInt']>>
  maxAmountPerMember_isNull?: InputMaybe<Scalars['Boolean']>
  maxAmountPerMember_lt?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_lte?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_not_eq?: InputMaybe<Scalars['BigInt']>
  maxAmountPerMember_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  pricePerUnit_eq?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_gt?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_gte?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_in?: InputMaybe<Array<Scalars['BigInt']>>
  pricePerUnit_isNull?: InputMaybe<Scalars['Boolean']>
  pricePerUnit_lt?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_lte?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_not_eq?: InputMaybe<Scalars['BigInt']>
  pricePerUnit_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  startBlock_eq?: InputMaybe<Scalars['Int']>
  startBlock_gt?: InputMaybe<Scalars['Int']>
  startBlock_gte?: InputMaybe<Scalars['Int']>
  startBlock_in?: InputMaybe<Array<Scalars['Int']>>
  startBlock_isNull?: InputMaybe<Scalars['Boolean']>
  startBlock_lt?: InputMaybe<Scalars['Int']>
  startBlock_lte?: InputMaybe<Scalars['Int']>
  startBlock_not_eq?: InputMaybe<Scalars['Int']>
  startBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  termsAndConditions_contains?: InputMaybe<Scalars['String']>
  termsAndConditions_containsInsensitive?: InputMaybe<Scalars['String']>
  termsAndConditions_endsWith?: InputMaybe<Scalars['String']>
  termsAndConditions_eq?: InputMaybe<Scalars['String']>
  termsAndConditions_gt?: InputMaybe<Scalars['String']>
  termsAndConditions_gte?: InputMaybe<Scalars['String']>
  termsAndConditions_in?: InputMaybe<Array<Scalars['String']>>
  termsAndConditions_isNull?: InputMaybe<Scalars['Boolean']>
  termsAndConditions_lt?: InputMaybe<Scalars['String']>
  termsAndConditions_lte?: InputMaybe<Scalars['String']>
  termsAndConditions_not_contains?: InputMaybe<Scalars['String']>
  termsAndConditions_not_containsInsensitive?: InputMaybe<Scalars['String']>
  termsAndConditions_not_endsWith?: InputMaybe<Scalars['String']>
  termsAndConditions_not_eq?: InputMaybe<Scalars['String']>
  termsAndConditions_not_in?: InputMaybe<Array<Scalars['String']>>
  termsAndConditions_not_startsWith?: InputMaybe<Scalars['String']>
  termsAndConditions_startsWith?: InputMaybe<Scalars['String']>
  token?: InputMaybe<CreatorTokenWhereInput>
  tokenSaleAllocation_eq?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_gt?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_gte?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_in?: InputMaybe<Array<Scalars['BigInt']>>
  tokenSaleAllocation_isNull?: InputMaybe<Scalars['Boolean']>
  tokenSaleAllocation_lt?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_lte?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_not_eq?: InputMaybe<Scalars['BigInt']>
  tokenSaleAllocation_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  token_isNull?: InputMaybe<Scalars['Boolean']>
  tokensSold_eq?: InputMaybe<Scalars['BigInt']>
  tokensSold_gt?: InputMaybe<Scalars['BigInt']>
  tokensSold_gte?: InputMaybe<Scalars['BigInt']>
  tokensSold_in?: InputMaybe<Array<Scalars['BigInt']>>
  tokensSold_isNull?: InputMaybe<Scalars['Boolean']>
  tokensSold_lt?: InputMaybe<Scalars['BigInt']>
  tokensSold_lte?: InputMaybe<Scalars['BigInt']>
  tokensSold_not_eq?: InputMaybe<Scalars['BigInt']>
  tokensSold_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  transactions_every?: InputMaybe<SaleTransactionWhereInput>
  transactions_none?: InputMaybe<SaleTransactionWhereInput>
  transactions_some?: InputMaybe<SaleTransactionWhereInput>
  vestedSale?: InputMaybe<VestedSaleWhereInput>
  vestedSale_isNull?: InputMaybe<Scalars['Boolean']>
}

export type SalesConnection = {
  __typename?: 'SalesConnection'
  edges: Array<SaleEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Session = {
  __typename?: 'Session'
  /** Account associated with the session (if any) */
  account?: Maybe<Account>
  /** Browser (as deterimned based on user-agent header) */
  browser: Scalars['String']
  /** Device (as deterimned based on user-agent header) */
  device: Scalars['String']
  /** Device type (as deterimned based on user-agent header) */
  deviceType?: Maybe<Scalars['String']>
  /** Time when the session expires or did expire */
  expiry: Scalars['DateTime']
  /** Unique identifier (32-byte string, securely random) */
  id: Scalars['String']
  /** IP address associated with the session */
  ip: Scalars['String']
  /** Operating system (as deterimned based on user-agent header) */
  os: Scalars['String']
  /** Time when the session started */
  startedAt: Scalars['DateTime']
  /** User associated with the session */
  user: User
}

export type SessionEdge = {
  __typename?: 'SessionEdge'
  cursor: Scalars['String']
  node: Session
}

export type SessionEncryptionArtifacts = {
  __typename?: 'SessionEncryptionArtifacts'
  /** The IV used to encrypt the seed with cipherKey */
  cipherIv: Scalars['String']
  /** cipherKey used to encrypt the seed stored client-side for the duration of the session */
  cipherKey: Scalars['String']
  /** Unique identifier */
  id: Scalars['String']
  /** The session the encryption artifacts are associated with */
  session: Session
}

export type SessionEncryptionArtifactsConnection = {
  __typename?: 'SessionEncryptionArtifactsConnection'
  edges: Array<SessionEncryptionArtifactsEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type SessionEncryptionArtifactsEdge = {
  __typename?: 'SessionEncryptionArtifactsEdge'
  cursor: Scalars['String']
  node: SessionEncryptionArtifacts
}

export enum SessionEncryptionArtifactsOrderByInput {
  CipherIvAsc = 'cipherIv_ASC',
  CipherIvDesc = 'cipherIv_DESC',
  CipherKeyAsc = 'cipherKey_ASC',
  CipherKeyDesc = 'cipherKey_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SessionBrowserAsc = 'session_browser_ASC',
  SessionBrowserDesc = 'session_browser_DESC',
  SessionDeviceTypeAsc = 'session_deviceType_ASC',
  SessionDeviceTypeDesc = 'session_deviceType_DESC',
  SessionDeviceAsc = 'session_device_ASC',
  SessionDeviceDesc = 'session_device_DESC',
  SessionExpiryAsc = 'session_expiry_ASC',
  SessionExpiryDesc = 'session_expiry_DESC',
  SessionIdAsc = 'session_id_ASC',
  SessionIdDesc = 'session_id_DESC',
  SessionIpAsc = 'session_ip_ASC',
  SessionIpDesc = 'session_ip_DESC',
  SessionOsAsc = 'session_os_ASC',
  SessionOsDesc = 'session_os_DESC',
  SessionStartedAtAsc = 'session_startedAt_ASC',
  SessionStartedAtDesc = 'session_startedAt_DESC',
}

export type SessionEncryptionArtifactsWhereInput = {
  AND?: InputMaybe<Array<SessionEncryptionArtifactsWhereInput>>
  OR?: InputMaybe<Array<SessionEncryptionArtifactsWhereInput>>
  cipherIv_contains?: InputMaybe<Scalars['String']>
  cipherIv_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherIv_endsWith?: InputMaybe<Scalars['String']>
  cipherIv_eq?: InputMaybe<Scalars['String']>
  cipherIv_gt?: InputMaybe<Scalars['String']>
  cipherIv_gte?: InputMaybe<Scalars['String']>
  cipherIv_in?: InputMaybe<Array<Scalars['String']>>
  cipherIv_isNull?: InputMaybe<Scalars['Boolean']>
  cipherIv_lt?: InputMaybe<Scalars['String']>
  cipherIv_lte?: InputMaybe<Scalars['String']>
  cipherIv_not_contains?: InputMaybe<Scalars['String']>
  cipherIv_not_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherIv_not_endsWith?: InputMaybe<Scalars['String']>
  cipherIv_not_eq?: InputMaybe<Scalars['String']>
  cipherIv_not_in?: InputMaybe<Array<Scalars['String']>>
  cipherIv_not_startsWith?: InputMaybe<Scalars['String']>
  cipherIv_startsWith?: InputMaybe<Scalars['String']>
  cipherKey_contains?: InputMaybe<Scalars['String']>
  cipherKey_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherKey_endsWith?: InputMaybe<Scalars['String']>
  cipherKey_eq?: InputMaybe<Scalars['String']>
  cipherKey_gt?: InputMaybe<Scalars['String']>
  cipherKey_gte?: InputMaybe<Scalars['String']>
  cipherKey_in?: InputMaybe<Array<Scalars['String']>>
  cipherKey_isNull?: InputMaybe<Scalars['Boolean']>
  cipherKey_lt?: InputMaybe<Scalars['String']>
  cipherKey_lte?: InputMaybe<Scalars['String']>
  cipherKey_not_contains?: InputMaybe<Scalars['String']>
  cipherKey_not_containsInsensitive?: InputMaybe<Scalars['String']>
  cipherKey_not_endsWith?: InputMaybe<Scalars['String']>
  cipherKey_not_eq?: InputMaybe<Scalars['String']>
  cipherKey_not_in?: InputMaybe<Array<Scalars['String']>>
  cipherKey_not_startsWith?: InputMaybe<Scalars['String']>
  cipherKey_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  session?: InputMaybe<SessionWhereInput>
  session_isNull?: InputMaybe<Scalars['Boolean']>
}

export enum SessionOrderByInput {
  AccountEmailAsc = 'account_email_ASC',
  AccountEmailDesc = 'account_email_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountIsBlockedAsc = 'account_isBlocked_ASC',
  AccountIsBlockedDesc = 'account_isBlocked_DESC',
  AccountIsEmailConfirmedAsc = 'account_isEmailConfirmed_ASC',
  AccountIsEmailConfirmedDesc = 'account_isEmailConfirmed_DESC',
  AccountJoystreamAccountAsc = 'account_joystreamAccount_ASC',
  AccountJoystreamAccountDesc = 'account_joystreamAccount_DESC',
  AccountReferrerChannelIdAsc = 'account_referrerChannelId_ASC',
  AccountReferrerChannelIdDesc = 'account_referrerChannelId_DESC',
  AccountRegisteredAtAsc = 'account_registeredAt_ASC',
  AccountRegisteredAtDesc = 'account_registeredAt_DESC',
  BrowserAsc = 'browser_ASC',
  BrowserDesc = 'browser_DESC',
  DeviceTypeAsc = 'deviceType_ASC',
  DeviceTypeDesc = 'deviceType_DESC',
  DeviceAsc = 'device_ASC',
  DeviceDesc = 'device_DESC',
  ExpiryAsc = 'expiry_ASC',
  ExpiryDesc = 'expiry_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpAsc = 'ip_ASC',
  IpDesc = 'ip_DESC',
  OsAsc = 'os_ASC',
  OsDesc = 'os_DESC',
  StartedAtAsc = 'startedAt_ASC',
  StartedAtDesc = 'startedAt_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
}

export type SessionWhereInput = {
  AND?: InputMaybe<Array<SessionWhereInput>>
  OR?: InputMaybe<Array<SessionWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  browser_contains?: InputMaybe<Scalars['String']>
  browser_containsInsensitive?: InputMaybe<Scalars['String']>
  browser_endsWith?: InputMaybe<Scalars['String']>
  browser_eq?: InputMaybe<Scalars['String']>
  browser_gt?: InputMaybe<Scalars['String']>
  browser_gte?: InputMaybe<Scalars['String']>
  browser_in?: InputMaybe<Array<Scalars['String']>>
  browser_isNull?: InputMaybe<Scalars['Boolean']>
  browser_lt?: InputMaybe<Scalars['String']>
  browser_lte?: InputMaybe<Scalars['String']>
  browser_not_contains?: InputMaybe<Scalars['String']>
  browser_not_containsInsensitive?: InputMaybe<Scalars['String']>
  browser_not_endsWith?: InputMaybe<Scalars['String']>
  browser_not_eq?: InputMaybe<Scalars['String']>
  browser_not_in?: InputMaybe<Array<Scalars['String']>>
  browser_not_startsWith?: InputMaybe<Scalars['String']>
  browser_startsWith?: InputMaybe<Scalars['String']>
  deviceType_contains?: InputMaybe<Scalars['String']>
  deviceType_containsInsensitive?: InputMaybe<Scalars['String']>
  deviceType_endsWith?: InputMaybe<Scalars['String']>
  deviceType_eq?: InputMaybe<Scalars['String']>
  deviceType_gt?: InputMaybe<Scalars['String']>
  deviceType_gte?: InputMaybe<Scalars['String']>
  deviceType_in?: InputMaybe<Array<Scalars['String']>>
  deviceType_isNull?: InputMaybe<Scalars['Boolean']>
  deviceType_lt?: InputMaybe<Scalars['String']>
  deviceType_lte?: InputMaybe<Scalars['String']>
  deviceType_not_contains?: InputMaybe<Scalars['String']>
  deviceType_not_containsInsensitive?: InputMaybe<Scalars['String']>
  deviceType_not_endsWith?: InputMaybe<Scalars['String']>
  deviceType_not_eq?: InputMaybe<Scalars['String']>
  deviceType_not_in?: InputMaybe<Array<Scalars['String']>>
  deviceType_not_startsWith?: InputMaybe<Scalars['String']>
  deviceType_startsWith?: InputMaybe<Scalars['String']>
  device_contains?: InputMaybe<Scalars['String']>
  device_containsInsensitive?: InputMaybe<Scalars['String']>
  device_endsWith?: InputMaybe<Scalars['String']>
  device_eq?: InputMaybe<Scalars['String']>
  device_gt?: InputMaybe<Scalars['String']>
  device_gte?: InputMaybe<Scalars['String']>
  device_in?: InputMaybe<Array<Scalars['String']>>
  device_isNull?: InputMaybe<Scalars['Boolean']>
  device_lt?: InputMaybe<Scalars['String']>
  device_lte?: InputMaybe<Scalars['String']>
  device_not_contains?: InputMaybe<Scalars['String']>
  device_not_containsInsensitive?: InputMaybe<Scalars['String']>
  device_not_endsWith?: InputMaybe<Scalars['String']>
  device_not_eq?: InputMaybe<Scalars['String']>
  device_not_in?: InputMaybe<Array<Scalars['String']>>
  device_not_startsWith?: InputMaybe<Scalars['String']>
  device_startsWith?: InputMaybe<Scalars['String']>
  expiry_eq?: InputMaybe<Scalars['DateTime']>
  expiry_gt?: InputMaybe<Scalars['DateTime']>
  expiry_gte?: InputMaybe<Scalars['DateTime']>
  expiry_in?: InputMaybe<Array<Scalars['DateTime']>>
  expiry_isNull?: InputMaybe<Scalars['Boolean']>
  expiry_lt?: InputMaybe<Scalars['DateTime']>
  expiry_lte?: InputMaybe<Scalars['DateTime']>
  expiry_not_eq?: InputMaybe<Scalars['DateTime']>
  expiry_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  ip_contains?: InputMaybe<Scalars['String']>
  ip_containsInsensitive?: InputMaybe<Scalars['String']>
  ip_endsWith?: InputMaybe<Scalars['String']>
  ip_eq?: InputMaybe<Scalars['String']>
  ip_gt?: InputMaybe<Scalars['String']>
  ip_gte?: InputMaybe<Scalars['String']>
  ip_in?: InputMaybe<Array<Scalars['String']>>
  ip_isNull?: InputMaybe<Scalars['Boolean']>
  ip_lt?: InputMaybe<Scalars['String']>
  ip_lte?: InputMaybe<Scalars['String']>
  ip_not_contains?: InputMaybe<Scalars['String']>
  ip_not_containsInsensitive?: InputMaybe<Scalars['String']>
  ip_not_endsWith?: InputMaybe<Scalars['String']>
  ip_not_eq?: InputMaybe<Scalars['String']>
  ip_not_in?: InputMaybe<Array<Scalars['String']>>
  ip_not_startsWith?: InputMaybe<Scalars['String']>
  ip_startsWith?: InputMaybe<Scalars['String']>
  os_contains?: InputMaybe<Scalars['String']>
  os_containsInsensitive?: InputMaybe<Scalars['String']>
  os_endsWith?: InputMaybe<Scalars['String']>
  os_eq?: InputMaybe<Scalars['String']>
  os_gt?: InputMaybe<Scalars['String']>
  os_gte?: InputMaybe<Scalars['String']>
  os_in?: InputMaybe<Array<Scalars['String']>>
  os_isNull?: InputMaybe<Scalars['Boolean']>
  os_lt?: InputMaybe<Scalars['String']>
  os_lte?: InputMaybe<Scalars['String']>
  os_not_contains?: InputMaybe<Scalars['String']>
  os_not_containsInsensitive?: InputMaybe<Scalars['String']>
  os_not_endsWith?: InputMaybe<Scalars['String']>
  os_not_eq?: InputMaybe<Scalars['String']>
  os_not_in?: InputMaybe<Array<Scalars['String']>>
  os_not_startsWith?: InputMaybe<Scalars['String']>
  os_startsWith?: InputMaybe<Scalars['String']>
  startedAt_eq?: InputMaybe<Scalars['DateTime']>
  startedAt_gt?: InputMaybe<Scalars['DateTime']>
  startedAt_gte?: InputMaybe<Scalars['DateTime']>
  startedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  startedAt_isNull?: InputMaybe<Scalars['Boolean']>
  startedAt_lt?: InputMaybe<Scalars['DateTime']>
  startedAt_lte?: InputMaybe<Scalars['DateTime']>
  startedAt_not_eq?: InputMaybe<Scalars['DateTime']>
  startedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
}

export type SessionsConnection = {
  __typename?: 'SessionsConnection'
  edges: Array<SessionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type SetCategoryFeaturedVideosResult = {
  __typename?: 'SetCategoryFeaturedVideosResult'
  categoryId: Scalars['String']
  numberOfFeaturedVideosSet: Scalars['Int']
  numberOfFeaturedVideosUnset: Scalars['Int']
}

export type SetFeaturedCrtsResult = {
  __typename?: 'SetFeaturedCrtsResult'
  /** The updated number of crts that are now explicitly featured by the Gateway */
  newNumberOfCrtsFeatured?: Maybe<Scalars['Int']>
}

export type SetFeaturedNftsResult = {
  __typename?: 'SetFeaturedNftsResult'
  /** The updated number of nft that are now explicitly featured by the Gateway */
  newNumberOfNftsFeatured?: Maybe<Scalars['Int']>
}

export type SetNewAppAssetStorageResult = {
  __typename?: 'SetNewAppAssetStorageResult'
  /** The app asset storage link just set */
  newAppAssetStorage: Scalars['String']
}

export type SetNewAppNameAltResult = {
  __typename?: 'SetNewAppNameAltResult'
  /** The app name alternative just set */
  newAppNameAlt: Scalars['String']
}

export type SetNewNotificationAssetRootResult = {
  __typename?: 'SetNewNotificationAssetRootResult'
  /** The notification asset root link just set */
  newNotificationAssetRoot: Scalars['String']
}

export type SetOrUnsetPublicFeedResult = {
  __typename?: 'SetOrUnsetPublicFeedResult'
  numberOfEntitiesAffected: Scalars['Int']
}

export type SetSupportedCategoriesResult = {
  __typename?: 'SetSupportedCategoriesResult'
  /** The updated number of categories that are now explicitly supported by the Gateway */
  newNumberOfCategoriesSupported?: Maybe<Scalars['Int']>
  /** Whether or not newly created video categories will be automatically supported */
  newlyCreatedCategoriesSupported: Scalars['Boolean']
  /** Whether or not vidoes w/o any category assigned will be supported */
  noCategoryVideosSupported: Scalars['Boolean']
}

export type SetVideoHeroResult = {
  __typename?: 'SetVideoHeroResult'
  id: Scalars['String']
}

export type SquidStatus = {
  __typename?: 'SquidStatus'
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>
}

export type StorageBag = {
  __typename?: 'StorageBag'
  /** Distribution buckets assigned to the bag */
  distributionBuckets: Array<DistributionBucketBag>
  /** Storage bag id */
  id: Scalars['String']
  /** Data objects in the bag */
  objects: Array<StorageDataObject>
  /** Owner of the storage bag */
  owner: StorageBagOwner
  /** Storage buckets assigned to the bag */
  storageBuckets: Array<StorageBucketBag>
}

export type StorageBagDistributionBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketBagOrderByInput>>
  where?: InputMaybe<DistributionBucketBagWhereInput>
}

export type StorageBagObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageDataObjectOrderByInput>>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type StorageBagStorageBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketBagOrderByInput>>
  where?: InputMaybe<StorageBucketBagWhereInput>
}

export type StorageBagEdge = {
  __typename?: 'StorageBagEdge'
  cursor: Scalars['String']
  node: StorageBag
}

export enum StorageBagOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OwnerChannelIdAsc = 'owner_channelId_ASC',
  OwnerChannelIdDesc = 'owner_channelId_DESC',
  OwnerDaoIdAsc = 'owner_daoId_ASC',
  OwnerDaoIdDesc = 'owner_daoId_DESC',
  OwnerIsTypeOfAsc = 'owner_isTypeOf_ASC',
  OwnerIsTypeOfDesc = 'owner_isTypeOf_DESC',
  OwnerMemberIdAsc = 'owner_memberId_ASC',
  OwnerMemberIdDesc = 'owner_memberId_DESC',
  OwnerPhantomAsc = 'owner_phantom_ASC',
  OwnerPhantomDesc = 'owner_phantom_DESC',
  OwnerWorkingGroupIdAsc = 'owner_workingGroupId_ASC',
  OwnerWorkingGroupIdDesc = 'owner_workingGroupId_DESC',
}

export type StorageBagOwner =
  | StorageBagOwnerChannel
  | StorageBagOwnerCouncil
  | StorageBagOwnerDao
  | StorageBagOwnerMember
  | StorageBagOwnerWorkingGroup

export type StorageBagOwnerChannel = {
  __typename?: 'StorageBagOwnerChannel'
  channelId: Scalars['String']
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
  memberId: Scalars['String']
}

export type StorageBagOwnerWhereInput = {
  channelId_contains?: InputMaybe<Scalars['String']>
  channelId_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_endsWith?: InputMaybe<Scalars['String']>
  channelId_eq?: InputMaybe<Scalars['String']>
  channelId_gt?: InputMaybe<Scalars['String']>
  channelId_gte?: InputMaybe<Scalars['String']>
  channelId_in?: InputMaybe<Array<Scalars['String']>>
  channelId_isNull?: InputMaybe<Scalars['Boolean']>
  channelId_lt?: InputMaybe<Scalars['String']>
  channelId_lte?: InputMaybe<Scalars['String']>
  channelId_not_contains?: InputMaybe<Scalars['String']>
  channelId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  channelId_not_endsWith?: InputMaybe<Scalars['String']>
  channelId_not_eq?: InputMaybe<Scalars['String']>
  channelId_not_in?: InputMaybe<Array<Scalars['String']>>
  channelId_not_startsWith?: InputMaybe<Scalars['String']>
  channelId_startsWith?: InputMaybe<Scalars['String']>
  daoId_eq?: InputMaybe<Scalars['Int']>
  daoId_gt?: InputMaybe<Scalars['Int']>
  daoId_gte?: InputMaybe<Scalars['Int']>
  daoId_in?: InputMaybe<Array<Scalars['Int']>>
  daoId_isNull?: InputMaybe<Scalars['Boolean']>
  daoId_lt?: InputMaybe<Scalars['Int']>
  daoId_lte?: InputMaybe<Scalars['Int']>
  daoId_not_eq?: InputMaybe<Scalars['Int']>
  daoId_not_in?: InputMaybe<Array<Scalars['Int']>>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  memberId_contains?: InputMaybe<Scalars['String']>
  memberId_containsInsensitive?: InputMaybe<Scalars['String']>
  memberId_endsWith?: InputMaybe<Scalars['String']>
  memberId_eq?: InputMaybe<Scalars['String']>
  memberId_gt?: InputMaybe<Scalars['String']>
  memberId_gte?: InputMaybe<Scalars['String']>
  memberId_in?: InputMaybe<Array<Scalars['String']>>
  memberId_isNull?: InputMaybe<Scalars['Boolean']>
  memberId_lt?: InputMaybe<Scalars['String']>
  memberId_lte?: InputMaybe<Scalars['String']>
  memberId_not_contains?: InputMaybe<Scalars['String']>
  memberId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  memberId_not_endsWith?: InputMaybe<Scalars['String']>
  memberId_not_eq?: InputMaybe<Scalars['String']>
  memberId_not_in?: InputMaybe<Array<Scalars['String']>>
  memberId_not_startsWith?: InputMaybe<Scalars['String']>
  memberId_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  workingGroupId_contains?: InputMaybe<Scalars['String']>
  workingGroupId_containsInsensitive?: InputMaybe<Scalars['String']>
  workingGroupId_endsWith?: InputMaybe<Scalars['String']>
  workingGroupId_eq?: InputMaybe<Scalars['String']>
  workingGroupId_gt?: InputMaybe<Scalars['String']>
  workingGroupId_gte?: InputMaybe<Scalars['String']>
  workingGroupId_in?: InputMaybe<Array<Scalars['String']>>
  workingGroupId_isNull?: InputMaybe<Scalars['Boolean']>
  workingGroupId_lt?: InputMaybe<Scalars['String']>
  workingGroupId_lte?: InputMaybe<Scalars['String']>
  workingGroupId_not_contains?: InputMaybe<Scalars['String']>
  workingGroupId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  workingGroupId_not_endsWith?: InputMaybe<Scalars['String']>
  workingGroupId_not_eq?: InputMaybe<Scalars['String']>
  workingGroupId_not_in?: InputMaybe<Array<Scalars['String']>>
  workingGroupId_not_startsWith?: InputMaybe<Scalars['String']>
  workingGroupId_startsWith?: InputMaybe<Scalars['String']>
}

export type StorageBagOwnerWorkingGroup = {
  __typename?: 'StorageBagOwnerWorkingGroup'
  workingGroupId?: Maybe<Scalars['String']>
}

export type StorageBagWhereInput = {
  AND?: InputMaybe<Array<StorageBagWhereInput>>
  OR?: InputMaybe<Array<StorageBagWhereInput>>
  distributionBuckets_every?: InputMaybe<DistributionBucketBagWhereInput>
  distributionBuckets_none?: InputMaybe<DistributionBucketBagWhereInput>
  distributionBuckets_some?: InputMaybe<DistributionBucketBagWhereInput>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  objects_every?: InputMaybe<StorageDataObjectWhereInput>
  objects_none?: InputMaybe<StorageDataObjectWhereInput>
  objects_some?: InputMaybe<StorageDataObjectWhereInput>
  owner?: InputMaybe<StorageBagOwnerWhereInput>
  owner_isNull?: InputMaybe<Scalars['Boolean']>
  storageBuckets_every?: InputMaybe<StorageBucketBagWhereInput>
  storageBuckets_none?: InputMaybe<StorageBucketBagWhereInput>
  storageBuckets_some?: InputMaybe<StorageBucketBagWhereInput>
}

export type StorageBagsConnection = {
  __typename?: 'StorageBagsConnection'
  edges: Array<StorageBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucket = {
  __typename?: 'StorageBucket'
  /** Whether the bucket is accepting any new storage bags */
  acceptingNewBags: Scalars['Boolean']
  /** Storage bags assigned to the bucket */
  bags: Array<StorageBucketBag>
  /** Bucket's data object count limit */
  dataObjectCountLimit: Scalars['BigInt']
  /** Number of assigned data objects */
  dataObjectsCount: Scalars['BigInt']
  /** Total size of assigned data objects */
  dataObjectsSize: Scalars['BigInt']
  /** Bucket's data object size limit in bytes */
  dataObjectsSizeLimit: Scalars['BigInt']
  /** Runtime bucket id */
  id: Scalars['String']
  /** Storage bucket operator metadata */
  operatorMetadata?: Maybe<StorageBucketOperatorMetadata>
  /** Current bucket operator status */
  operatorStatus: StorageBucketOperatorStatus
}

export type StorageBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketBagOrderByInput>>
  where?: InputMaybe<StorageBucketBagWhereInput>
}

export type StorageBucketBag = {
  __typename?: 'StorageBucketBag'
  bag: StorageBag
  /** {storageBucketId}-{storageBagId} */
  id: Scalars['String']
  storageBucket: StorageBucket
}

export type StorageBucketBagEdge = {
  __typename?: 'StorageBucketBagEdge'
  cursor: Scalars['String']
  node: StorageBucketBag
}

export enum StorageBucketBagOrderByInput {
  BagIdAsc = 'bag_id_ASC',
  BagIdDesc = 'bag_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  StorageBucketAcceptingNewBagsAsc = 'storageBucket_acceptingNewBags_ASC',
  StorageBucketAcceptingNewBagsDesc = 'storageBucket_acceptingNewBags_DESC',
  StorageBucketDataObjectCountLimitAsc = 'storageBucket_dataObjectCountLimit_ASC',
  StorageBucketDataObjectCountLimitDesc = 'storageBucket_dataObjectCountLimit_DESC',
  StorageBucketDataObjectsCountAsc = 'storageBucket_dataObjectsCount_ASC',
  StorageBucketDataObjectsCountDesc = 'storageBucket_dataObjectsCount_DESC',
  StorageBucketDataObjectsSizeLimitAsc = 'storageBucket_dataObjectsSizeLimit_ASC',
  StorageBucketDataObjectsSizeLimitDesc = 'storageBucket_dataObjectsSizeLimit_DESC',
  StorageBucketDataObjectsSizeAsc = 'storageBucket_dataObjectsSize_ASC',
  StorageBucketDataObjectsSizeDesc = 'storageBucket_dataObjectsSize_DESC',
  StorageBucketIdAsc = 'storageBucket_id_ASC',
  StorageBucketIdDesc = 'storageBucket_id_DESC',
}

export type StorageBucketBagWhereInput = {
  AND?: InputMaybe<Array<StorageBucketBagWhereInput>>
  OR?: InputMaybe<Array<StorageBucketBagWhereInput>>
  bag?: InputMaybe<StorageBagWhereInput>
  bag_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  storageBucket?: InputMaybe<StorageBucketWhereInput>
  storageBucket_isNull?: InputMaybe<Scalars['Boolean']>
}

export type StorageBucketBagsConnection = {
  __typename?: 'StorageBucketBagsConnection'
  edges: Array<StorageBucketBagEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketEdge = {
  __typename?: 'StorageBucketEdge'
  cursor: Scalars['String']
  node: StorageBucket
}

export type StorageBucketOperatorMetadata = {
  __typename?: 'StorageBucketOperatorMetadata'
  /** Additional information about the node/operator */
  extra?: Maybe<Scalars['String']>
  id: Scalars['String']
  /** Root node endpoint */
  nodeEndpoint?: Maybe<Scalars['String']>
  /** Optional node location metadata */
  nodeLocation?: Maybe<NodeLocationMetadata>
  /** Storage bucket to which the metadata is assigned */
  storageBucket: StorageBucket
}

export type StorageBucketOperatorMetadataConnection = {
  __typename?: 'StorageBucketOperatorMetadataConnection'
  edges: Array<StorageBucketOperatorMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageBucketOperatorMetadataEdge = {
  __typename?: 'StorageBucketOperatorMetadataEdge'
  cursor: Scalars['String']
  node: StorageBucketOperatorMetadata
}

export enum StorageBucketOperatorMetadataOrderByInput {
  ExtraAsc = 'extra_ASC',
  ExtraDesc = 'extra_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeEndpointAsc = 'nodeEndpoint_ASC',
  NodeEndpointDesc = 'nodeEndpoint_DESC',
  NodeLocationCityAsc = 'nodeLocation_city_ASC',
  NodeLocationCityDesc = 'nodeLocation_city_DESC',
  NodeLocationCountryCodeAsc = 'nodeLocation_countryCode_ASC',
  NodeLocationCountryCodeDesc = 'nodeLocation_countryCode_DESC',
  StorageBucketAcceptingNewBagsAsc = 'storageBucket_acceptingNewBags_ASC',
  StorageBucketAcceptingNewBagsDesc = 'storageBucket_acceptingNewBags_DESC',
  StorageBucketDataObjectCountLimitAsc = 'storageBucket_dataObjectCountLimit_ASC',
  StorageBucketDataObjectCountLimitDesc = 'storageBucket_dataObjectCountLimit_DESC',
  StorageBucketDataObjectsCountAsc = 'storageBucket_dataObjectsCount_ASC',
  StorageBucketDataObjectsCountDesc = 'storageBucket_dataObjectsCount_DESC',
  StorageBucketDataObjectsSizeLimitAsc = 'storageBucket_dataObjectsSizeLimit_ASC',
  StorageBucketDataObjectsSizeLimitDesc = 'storageBucket_dataObjectsSizeLimit_DESC',
  StorageBucketDataObjectsSizeAsc = 'storageBucket_dataObjectsSize_ASC',
  StorageBucketDataObjectsSizeDesc = 'storageBucket_dataObjectsSize_DESC',
  StorageBucketIdAsc = 'storageBucket_id_ASC',
  StorageBucketIdDesc = 'storageBucket_id_DESC',
}

export type StorageBucketOperatorMetadataWhereInput = {
  AND?: InputMaybe<Array<StorageBucketOperatorMetadataWhereInput>>
  OR?: InputMaybe<Array<StorageBucketOperatorMetadataWhereInput>>
  extra_contains?: InputMaybe<Scalars['String']>
  extra_containsInsensitive?: InputMaybe<Scalars['String']>
  extra_endsWith?: InputMaybe<Scalars['String']>
  extra_eq?: InputMaybe<Scalars['String']>
  extra_gt?: InputMaybe<Scalars['String']>
  extra_gte?: InputMaybe<Scalars['String']>
  extra_in?: InputMaybe<Array<Scalars['String']>>
  extra_isNull?: InputMaybe<Scalars['Boolean']>
  extra_lt?: InputMaybe<Scalars['String']>
  extra_lte?: InputMaybe<Scalars['String']>
  extra_not_contains?: InputMaybe<Scalars['String']>
  extra_not_containsInsensitive?: InputMaybe<Scalars['String']>
  extra_not_endsWith?: InputMaybe<Scalars['String']>
  extra_not_eq?: InputMaybe<Scalars['String']>
  extra_not_in?: InputMaybe<Array<Scalars['String']>>
  extra_not_startsWith?: InputMaybe<Scalars['String']>
  extra_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_containsInsensitive?: InputMaybe<Scalars['String']>
  nodeEndpoint_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_gt?: InputMaybe<Scalars['String']>
  nodeEndpoint_gte?: InputMaybe<Scalars['String']>
  nodeEndpoint_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_isNull?: InputMaybe<Scalars['Boolean']>
  nodeEndpoint_lt?: InputMaybe<Scalars['String']>
  nodeEndpoint_lte?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_contains?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_containsInsensitive?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_endsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_eq?: InputMaybe<Scalars['String']>
  nodeEndpoint_not_in?: InputMaybe<Array<Scalars['String']>>
  nodeEndpoint_not_startsWith?: InputMaybe<Scalars['String']>
  nodeEndpoint_startsWith?: InputMaybe<Scalars['String']>
  nodeLocation?: InputMaybe<NodeLocationMetadataWhereInput>
  nodeLocation_isNull?: InputMaybe<Scalars['Boolean']>
  storageBucket?: InputMaybe<StorageBucketWhereInput>
  storageBucket_isNull?: InputMaybe<Scalars['Boolean']>
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

export type StorageBucketOperatorStatusWhereInput = {
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  transactorAccountId_contains?: InputMaybe<Scalars['String']>
  transactorAccountId_containsInsensitive?: InputMaybe<Scalars['String']>
  transactorAccountId_endsWith?: InputMaybe<Scalars['String']>
  transactorAccountId_eq?: InputMaybe<Scalars['String']>
  transactorAccountId_gt?: InputMaybe<Scalars['String']>
  transactorAccountId_gte?: InputMaybe<Scalars['String']>
  transactorAccountId_in?: InputMaybe<Array<Scalars['String']>>
  transactorAccountId_isNull?: InputMaybe<Scalars['Boolean']>
  transactorAccountId_lt?: InputMaybe<Scalars['String']>
  transactorAccountId_lte?: InputMaybe<Scalars['String']>
  transactorAccountId_not_contains?: InputMaybe<Scalars['String']>
  transactorAccountId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  transactorAccountId_not_endsWith?: InputMaybe<Scalars['String']>
  transactorAccountId_not_eq?: InputMaybe<Scalars['String']>
  transactorAccountId_not_in?: InputMaybe<Array<Scalars['String']>>
  transactorAccountId_not_startsWith?: InputMaybe<Scalars['String']>
  transactorAccountId_startsWith?: InputMaybe<Scalars['String']>
  workerId_eq?: InputMaybe<Scalars['Int']>
  workerId_gt?: InputMaybe<Scalars['Int']>
  workerId_gte?: InputMaybe<Scalars['Int']>
  workerId_in?: InputMaybe<Array<Scalars['Int']>>
  workerId_isNull?: InputMaybe<Scalars['Boolean']>
  workerId_lt?: InputMaybe<Scalars['Int']>
  workerId_lte?: InputMaybe<Scalars['Int']>
  workerId_not_eq?: InputMaybe<Scalars['Int']>
  workerId_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export enum StorageBucketOrderByInput {
  AcceptingNewBagsAsc = 'acceptingNewBags_ASC',
  AcceptingNewBagsDesc = 'acceptingNewBags_DESC',
  DataObjectCountLimitAsc = 'dataObjectCountLimit_ASC',
  DataObjectCountLimitDesc = 'dataObjectCountLimit_DESC',
  DataObjectsCountAsc = 'dataObjectsCount_ASC',
  DataObjectsCountDesc = 'dataObjectsCount_DESC',
  DataObjectsSizeLimitAsc = 'dataObjectsSizeLimit_ASC',
  DataObjectsSizeLimitDesc = 'dataObjectsSizeLimit_DESC',
  DataObjectsSizeAsc = 'dataObjectsSize_ASC',
  DataObjectsSizeDesc = 'dataObjectsSize_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OperatorMetadataExtraAsc = 'operatorMetadata_extra_ASC',
  OperatorMetadataExtraDesc = 'operatorMetadata_extra_DESC',
  OperatorMetadataIdAsc = 'operatorMetadata_id_ASC',
  OperatorMetadataIdDesc = 'operatorMetadata_id_DESC',
  OperatorMetadataNodeEndpointAsc = 'operatorMetadata_nodeEndpoint_ASC',
  OperatorMetadataNodeEndpointDesc = 'operatorMetadata_nodeEndpoint_DESC',
  OperatorStatusIsTypeOfAsc = 'operatorStatus_isTypeOf_ASC',
  OperatorStatusIsTypeOfDesc = 'operatorStatus_isTypeOf_DESC',
  OperatorStatusPhantomAsc = 'operatorStatus_phantom_ASC',
  OperatorStatusPhantomDesc = 'operatorStatus_phantom_DESC',
  OperatorStatusTransactorAccountIdAsc = 'operatorStatus_transactorAccountId_ASC',
  OperatorStatusTransactorAccountIdDesc = 'operatorStatus_transactorAccountId_DESC',
  OperatorStatusWorkerIdAsc = 'operatorStatus_workerId_ASC',
  OperatorStatusWorkerIdDesc = 'operatorStatus_workerId_DESC',
}

export type StorageBucketWhereInput = {
  AND?: InputMaybe<Array<StorageBucketWhereInput>>
  OR?: InputMaybe<Array<StorageBucketWhereInput>>
  acceptingNewBags_eq?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_isNull?: InputMaybe<Scalars['Boolean']>
  acceptingNewBags_not_eq?: InputMaybe<Scalars['Boolean']>
  bags_every?: InputMaybe<StorageBucketBagWhereInput>
  bags_none?: InputMaybe<StorageBucketBagWhereInput>
  bags_some?: InputMaybe<StorageBucketBagWhereInput>
  dataObjectCountLimit_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectCountLimit_isNull?: InputMaybe<Scalars['Boolean']>
  dataObjectCountLimit_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_not_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectCountLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsCount_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsCount_isNull?: InputMaybe<Scalars['Boolean']>
  dataObjectsCount_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_not_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSizeLimit_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSizeLimit_isNull?: InputMaybe<Scalars['Boolean']>
  dataObjectsSizeLimit_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_not_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSizeLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSize_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_gt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_gte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_in?: InputMaybe<Array<Scalars['BigInt']>>
  dataObjectsSize_isNull?: InputMaybe<Scalars['Boolean']>
  dataObjectsSize_lt?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_lte?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_not_eq?: InputMaybe<Scalars['BigInt']>
  dataObjectsSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  operatorMetadata?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
  operatorMetadata_isNull?: InputMaybe<Scalars['Boolean']>
  operatorStatus?: InputMaybe<StorageBucketOperatorStatusWhereInput>
  operatorStatus_isNull?: InputMaybe<Scalars['Boolean']>
}

export type StorageBucketsConnection = {
  __typename?: 'StorageBucketsConnection'
  edges: Array<StorageBucketEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type StorageDataObject = {
  __typename?: 'StorageDataObject'
  /** Timestamp of the block the data object was created at */
  createdAt: Scalars['DateTime']
  /** Data object runtime id */
  id: Scalars['String']
  /** IPFS content hash */
  ipfsHash: Scalars['String']
  /** Whether the data object was uploaded and accepted by the storage provider */
  isAccepted: Scalars['Boolean']
  /** Resolved asset urls */
  resolvedUrls: Array<Scalars['String']>
  /** Data object size in bytes */
  size: Scalars['BigInt']
  /** State Bloat Bond for removing the data object */
  stateBloatBond: Scalars['BigInt']
  /** Storage bag the data object is part of */
  storageBag: StorageBag
  /** The type of the asset that the data object represents (if known) */
  type?: Maybe<DataObjectType>
  /** If the object is no longer used as an asset - the time at which it was unset (if known) */
  unsetAt?: Maybe<Scalars['DateTime']>
}

export type StorageDataObjectEdge = {
  __typename?: 'StorageDataObjectEdge'
  cursor: Scalars['String']
  node: StorageDataObject
}

export enum StorageDataObjectOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IpfsHashAsc = 'ipfsHash_ASC',
  IpfsHashDesc = 'ipfsHash_DESC',
  IsAcceptedAsc = 'isAccepted_ASC',
  IsAcceptedDesc = 'isAccepted_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  StateBloatBondAsc = 'stateBloatBond_ASC',
  StateBloatBondDesc = 'stateBloatBond_DESC',
  StorageBagIdAsc = 'storageBag_id_ASC',
  StorageBagIdDesc = 'storageBag_id_DESC',
  TypeIsTypeOfAsc = 'type_isTypeOf_ASC',
  TypeIsTypeOfDesc = 'type_isTypeOf_DESC',
  TypePhantomAsc = 'type_phantom_ASC',
  TypePhantomDesc = 'type_phantom_DESC',
  UnsetAtAsc = 'unsetAt_ASC',
  UnsetAtDesc = 'unsetAt_DESC',
}

export type StorageDataObjectWhereInput = {
  AND?: InputMaybe<Array<StorageDataObjectWhereInput>>
  OR?: InputMaybe<Array<StorageDataObjectWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  ipfsHash_contains?: InputMaybe<Scalars['String']>
  ipfsHash_containsInsensitive?: InputMaybe<Scalars['String']>
  ipfsHash_endsWith?: InputMaybe<Scalars['String']>
  ipfsHash_eq?: InputMaybe<Scalars['String']>
  ipfsHash_gt?: InputMaybe<Scalars['String']>
  ipfsHash_gte?: InputMaybe<Scalars['String']>
  ipfsHash_in?: InputMaybe<Array<Scalars['String']>>
  ipfsHash_isNull?: InputMaybe<Scalars['Boolean']>
  ipfsHash_lt?: InputMaybe<Scalars['String']>
  ipfsHash_lte?: InputMaybe<Scalars['String']>
  ipfsHash_not_contains?: InputMaybe<Scalars['String']>
  ipfsHash_not_containsInsensitive?: InputMaybe<Scalars['String']>
  ipfsHash_not_endsWith?: InputMaybe<Scalars['String']>
  ipfsHash_not_eq?: InputMaybe<Scalars['String']>
  ipfsHash_not_in?: InputMaybe<Array<Scalars['String']>>
  ipfsHash_not_startsWith?: InputMaybe<Scalars['String']>
  ipfsHash_startsWith?: InputMaybe<Scalars['String']>
  isAccepted_eq?: InputMaybe<Scalars['Boolean']>
  isAccepted_isNull?: InputMaybe<Scalars['Boolean']>
  isAccepted_not_eq?: InputMaybe<Scalars['Boolean']>
  resolvedUrls_containsAll?: InputMaybe<Array<Scalars['String']>>
  resolvedUrls_containsAny?: InputMaybe<Array<Scalars['String']>>
  resolvedUrls_containsNone?: InputMaybe<Array<Scalars['String']>>
  resolvedUrls_isNull?: InputMaybe<Scalars['Boolean']>
  size_eq?: InputMaybe<Scalars['BigInt']>
  size_gt?: InputMaybe<Scalars['BigInt']>
  size_gte?: InputMaybe<Scalars['BigInt']>
  size_in?: InputMaybe<Array<Scalars['BigInt']>>
  size_isNull?: InputMaybe<Scalars['Boolean']>
  size_lt?: InputMaybe<Scalars['BigInt']>
  size_lte?: InputMaybe<Scalars['BigInt']>
  size_not_eq?: InputMaybe<Scalars['BigInt']>
  size_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  stateBloatBond_eq?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_gt?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_gte?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_in?: InputMaybe<Array<Scalars['BigInt']>>
  stateBloatBond_isNull?: InputMaybe<Scalars['Boolean']>
  stateBloatBond_lt?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_lte?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_not_eq?: InputMaybe<Scalars['BigInt']>
  stateBloatBond_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  storageBag?: InputMaybe<StorageBagWhereInput>
  storageBag_isNull?: InputMaybe<Scalars['Boolean']>
  type?: InputMaybe<DataObjectTypeWhereInput>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  unsetAt_eq?: InputMaybe<Scalars['DateTime']>
  unsetAt_gt?: InputMaybe<Scalars['DateTime']>
  unsetAt_gte?: InputMaybe<Scalars['DateTime']>
  unsetAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  unsetAt_isNull?: InputMaybe<Scalars['Boolean']>
  unsetAt_lt?: InputMaybe<Scalars['DateTime']>
  unsetAt_lte?: InputMaybe<Scalars['DateTime']>
  unsetAt_not_eq?: InputMaybe<Scalars['DateTime']>
  unsetAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export type StorageDataObjectsConnection = {
  __typename?: 'StorageDataObjectsConnection'
  edges: Array<StorageDataObjectEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type Subscription = {
  __typename?: 'Subscription'
  accountById?: Maybe<Account>
  accounts: Array<Account>
  ammCurveById?: Maybe<AmmCurve>
  ammCurves: Array<AmmCurve>
  ammTransactionById?: Maybe<AmmTransaction>
  ammTransactions: Array<AmmTransaction>
  appById?: Maybe<App>
  apps: Array<App>
  auctionById?: Maybe<Auction>
  auctionWhitelistedMemberById?: Maybe<AuctionWhitelistedMember>
  auctionWhitelistedMembers: Array<AuctionWhitelistedMember>
  auctions: Array<Auction>
  bannedMemberById?: Maybe<BannedMember>
  bannedMembers: Array<BannedMember>
  benefitById?: Maybe<Benefit>
  benefits: Array<Benefit>
  bidById?: Maybe<Bid>
  bids: Array<Bid>
  channelById?: Maybe<Channel>
  channelFollowById?: Maybe<ChannelFollow>
  channelFollows: Array<ChannelFollow>
  channelSuspensionById?: Maybe<ChannelSuspension>
  channelSuspensions: Array<ChannelSuspension>
  channelVerificationById?: Maybe<ChannelVerification>
  channelVerifications: Array<ChannelVerification>
  channels: Array<Channel>
  commentById?: Maybe<Comment>
  commentReactionById?: Maybe<CommentReaction>
  commentReactions: Array<CommentReaction>
  comments: Array<Comment>
  creatorTokenById?: Maybe<CreatorToken>
  creatorTokens: Array<CreatorToken>
  curatorById?: Maybe<Curator>
  curatorGroupById?: Maybe<CuratorGroup>
  curatorGroups: Array<CuratorGroup>
  curators: Array<Curator>
  distributionBucketBagById?: Maybe<DistributionBucketBag>
  distributionBucketBags: Array<DistributionBucketBag>
  distributionBucketById?: Maybe<DistributionBucket>
  distributionBucketFamilies: Array<DistributionBucketFamily>
  distributionBucketFamilyById?: Maybe<DistributionBucketFamily>
  distributionBucketFamilyMetadata: Array<DistributionBucketFamilyMetadata>
  distributionBucketFamilyMetadataById?: Maybe<DistributionBucketFamilyMetadata>
  distributionBucketOperatorById?: Maybe<DistributionBucketOperator>
  distributionBucketOperatorMetadata: Array<DistributionBucketOperatorMetadata>
  distributionBucketOperatorMetadataById?: Maybe<DistributionBucketOperatorMetadata>
  distributionBucketOperators: Array<DistributionBucketOperator>
  distributionBuckets: Array<DistributionBucket>
  emailDeliveryAttemptById?: Maybe<EmailDeliveryAttempt>
  emailDeliveryAttempts: Array<EmailDeliveryAttempt>
  encryptionArtifacts: Array<EncryptionArtifacts>
  encryptionArtifactsById?: Maybe<EncryptionArtifacts>
  eventById?: Maybe<Event>
  events: Array<Event>
  exclusionById?: Maybe<Exclusion>
  exclusions: Array<Exclusion>
  gatewayConfigById?: Maybe<GatewayConfig>
  gatewayConfigs: Array<GatewayConfig>
  licenseById?: Maybe<License>
  licenses: Array<License>
  marketplaceTokenById?: Maybe<MarketplaceToken>
  marketplaceTokens: Array<MarketplaceToken>
  memberMetadata: Array<MemberMetadata>
  memberMetadataById?: Maybe<MemberMetadata>
  membershipById?: Maybe<Membership>
  memberships: Array<Membership>
  nftActivities: Array<NftActivity>
  nftActivityById?: Maybe<NftActivity>
  nftFeaturingRequestById?: Maybe<NftFeaturingRequest>
  nftFeaturingRequests: Array<NftFeaturingRequest>
  nftHistoryEntries: Array<NftHistoryEntry>
  nftHistoryEntryById?: Maybe<NftHistoryEntry>
  notificationById?: Maybe<Notification>
  notificationEmailDeliveries: Array<NotificationEmailDelivery>
  notificationEmailDeliveryById?: Maybe<NotificationEmailDelivery>
  notifications: Array<Notification>
  ownedNftById?: Maybe<OwnedNft>
  ownedNfts: Array<OwnedNft>
  processorState: ProcessorState
  reportById?: Maybe<Report>
  reports: Array<Report>
  revenueShareById?: Maybe<RevenueShare>
  revenueShareParticipationById?: Maybe<RevenueShareParticipation>
  revenueShareParticipations: Array<RevenueShareParticipation>
  revenueShares: Array<RevenueShare>
  saleById?: Maybe<Sale>
  saleTransactionById?: Maybe<SaleTransaction>
  saleTransactions: Array<SaleTransaction>
  sales: Array<Sale>
  sessionById?: Maybe<Session>
  sessionEncryptionArtifacts: Array<SessionEncryptionArtifacts>
  sessionEncryptionArtifactsById?: Maybe<SessionEncryptionArtifacts>
  sessions: Array<Session>
  storageBagById?: Maybe<StorageBag>
  storageBags: Array<StorageBag>
  storageBucketBagById?: Maybe<StorageBucketBag>
  storageBucketBags: Array<StorageBucketBag>
  storageBucketById?: Maybe<StorageBucket>
  storageBucketOperatorMetadata: Array<StorageBucketOperatorMetadata>
  storageBucketOperatorMetadataById?: Maybe<StorageBucketOperatorMetadata>
  storageBuckets: Array<StorageBucket>
  storageDataObjectById?: Maybe<StorageDataObject>
  storageDataObjects: Array<StorageDataObject>
  tokenAccountById?: Maybe<TokenAccount>
  tokenAccounts: Array<TokenAccount>
  tokenById?: Maybe<Token>
  tokenChannelById?: Maybe<TokenChannel>
  tokenChannels: Array<TokenChannel>
  tokens: Array<Token>
  trailerVideoById?: Maybe<TrailerVideo>
  trailerVideos: Array<TrailerVideo>
  userById?: Maybe<User>
  userInteractionCountById?: Maybe<UserInteractionCount>
  userInteractionCounts: Array<UserInteractionCount>
  users: Array<User>
  vestedAccountById?: Maybe<VestedAccount>
  vestedAccounts: Array<VestedAccount>
  vestedSaleById?: Maybe<VestedSale>
  vestedSales: Array<VestedSale>
  vestingScheduleById?: Maybe<VestingSchedule>
  vestingSchedules: Array<VestingSchedule>
  videoById?: Maybe<Video>
  videoCategories: Array<VideoCategory>
  videoCategoryById?: Maybe<VideoCategory>
  videoFeaturedInCategories: Array<VideoFeaturedInCategory>
  videoFeaturedInCategoryById?: Maybe<VideoFeaturedInCategory>
  videoHeroById?: Maybe<VideoHero>
  videoHeros: Array<VideoHero>
  videoMediaEncodingById?: Maybe<VideoMediaEncoding>
  videoMediaEncodings: Array<VideoMediaEncoding>
  videoMediaMetadata: Array<VideoMediaMetadata>
  videoMediaMetadataById?: Maybe<VideoMediaMetadata>
  videoReactionById?: Maybe<VideoReaction>
  videoReactions: Array<VideoReaction>
  videoSubtitleById?: Maybe<VideoSubtitle>
  videoSubtitles: Array<VideoSubtitle>
  videoViewEventById?: Maybe<VideoViewEvent>
  videoViewEvents: Array<VideoViewEvent>
  videos: Array<Video>
}

export type SubscriptionAccountByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AccountOrderByInput>>
  where?: InputMaybe<AccountWhereInput>
}

export type SubscriptionAmmCurveByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAmmCurvesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmCurveOrderByInput>>
  where?: InputMaybe<AmmCurveWhereInput>
}

export type SubscriptionAmmTransactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAmmTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmTransactionOrderByInput>>
  where?: InputMaybe<AmmTransactionWhereInput>
}

export type SubscriptionAppByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAppsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AppOrderByInput>>
  where?: InputMaybe<AppWhereInput>
}

export type SubscriptionAuctionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAuctionWhitelistedMemberByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionAuctionWhitelistedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionWhitelistedMemberOrderByInput>>
  where?: InputMaybe<AuctionWhitelistedMemberWhereInput>
}

export type SubscriptionAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AuctionOrderByInput>>
  where?: InputMaybe<AuctionWhereInput>
}

export type SubscriptionBannedMemberByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionBannedMembersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BannedMemberOrderByInput>>
  where?: InputMaybe<BannedMemberWhereInput>
}

export type SubscriptionBenefitByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionBenefitsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BenefitOrderByInput>>
  where?: InputMaybe<BenefitWhereInput>
}

export type SubscriptionBidByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionBidsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<BidOrderByInput>>
  where?: InputMaybe<BidWhereInput>
}

export type SubscriptionChannelByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelFollowByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelFollowsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelFollowOrderByInput>>
  where?: InputMaybe<ChannelFollowWhereInput>
}

export type SubscriptionChannelSuspensionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelSuspensionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelSuspensionOrderByInput>>
  where?: InputMaybe<ChannelSuspensionWhereInput>
}

export type SubscriptionChannelVerificationByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionChannelVerificationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelVerificationOrderByInput>>
  where?: InputMaybe<ChannelVerificationWhereInput>
}

export type SubscriptionChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelOrderByInput>>
  where?: InputMaybe<ChannelWhereInput>
}

export type SubscriptionCommentByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCommentReactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCommentReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentReactionOrderByInput>>
  where?: InputMaybe<CommentReactionWhereInput>
}

export type SubscriptionCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentOrderByInput>>
  where?: InputMaybe<CommentWhereInput>
}

export type SubscriptionCreatorTokenByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCreatorTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CreatorTokenOrderByInput>>
  where?: InputMaybe<CreatorTokenWhereInput>
}

export type SubscriptionCuratorByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCuratorGroupByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionCuratorGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorGroupOrderByInput>>
  where?: InputMaybe<CuratorGroupWhereInput>
}

export type SubscriptionCuratorsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CuratorOrderByInput>>
  where?: InputMaybe<CuratorWhereInput>
}

export type SubscriptionDistributionBucketBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketBagOrderByInput>>
  where?: InputMaybe<DistributionBucketBagWhereInput>
}

export type SubscriptionDistributionBucketByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketFamiliesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyWhereInput>
}

export type SubscriptionDistributionBucketFamilyByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketFamilyMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketFamilyMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketFamilyMetadataWhereInput>
}

export type SubscriptionDistributionBucketFamilyMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorMetadataWhereInput>
}

export type SubscriptionDistributionBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionDistributionBucketOperatorsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOperatorOrderByInput>>
  where?: InputMaybe<DistributionBucketOperatorWhereInput>
}

export type SubscriptionDistributionBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<DistributionBucketOrderByInput>>
  where?: InputMaybe<DistributionBucketWhereInput>
}

export type SubscriptionEmailDeliveryAttemptByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionEmailDeliveryAttemptsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EmailDeliveryAttemptOrderByInput>>
  where?: InputMaybe<EmailDeliveryAttemptWhereInput>
}

export type SubscriptionEncryptionArtifactsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EncryptionArtifactsOrderByInput>>
  where?: InputMaybe<EncryptionArtifactsWhereInput>
}

export type SubscriptionEncryptionArtifactsByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionEventByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<EventOrderByInput>>
  where?: InputMaybe<EventWhereInput>
}

export type SubscriptionExclusionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionExclusionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ExclusionOrderByInput>>
  where?: InputMaybe<ExclusionWhereInput>
}

export type SubscriptionGatewayConfigByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionGatewayConfigsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<GatewayConfigOrderByInput>>
  where?: InputMaybe<GatewayConfigWhereInput>
}

export type SubscriptionLicenseByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionLicensesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<LicenseOrderByInput>>
  where?: InputMaybe<LicenseWhereInput>
}

export type SubscriptionMarketplaceTokenByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionMarketplaceTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MarketplaceTokenOrderByInput>>
  where?: InputMaybe<MarketplaceTokenWhereInput>
}

export type SubscriptionMemberMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MemberMetadataOrderByInput>>
  where?: InputMaybe<MemberMetadataWhereInput>
}

export type SubscriptionMemberMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionMembershipByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionMembershipsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<MembershipOrderByInput>>
  where?: InputMaybe<MembershipWhereInput>
}

export type SubscriptionNftActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftActivityOrderByInput>>
  where?: InputMaybe<NftActivityWhereInput>
}

export type SubscriptionNftActivityByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNftFeaturingRequestByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNftFeaturingRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftFeaturingRequestOrderByInput>>
  where?: InputMaybe<NftFeaturingRequestWhereInput>
}

export type SubscriptionNftHistoryEntriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftHistoryEntryOrderByInput>>
  where?: InputMaybe<NftHistoryEntryWhereInput>
}

export type SubscriptionNftHistoryEntryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNotificationByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNotificationEmailDeliveriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NotificationEmailDeliveryOrderByInput>>
  where?: InputMaybe<NotificationEmailDeliveryWhereInput>
}

export type SubscriptionNotificationEmailDeliveryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>
  where?: InputMaybe<NotificationWhereInput>
}

export type SubscriptionOwnedNftByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionOwnedNftsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<OwnedNftOrderByInput>>
  where?: InputMaybe<OwnedNftWhereInput>
}

export type SubscriptionReportByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionReportsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ReportOrderByInput>>
  where?: InputMaybe<ReportWhereInput>
}

export type SubscriptionRevenueShareByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionRevenueShareParticipationByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionRevenueShareParticipationsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareParticipationOrderByInput>>
  where?: InputMaybe<RevenueShareParticipationWhereInput>
}

export type SubscriptionRevenueSharesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareOrderByInput>>
  where?: InputMaybe<RevenueShareWhereInput>
}

export type SubscriptionSaleByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionSaleTransactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionSaleTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleTransactionOrderByInput>>
  where?: InputMaybe<SaleTransactionWhereInput>
}

export type SubscriptionSalesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleOrderByInput>>
  where?: InputMaybe<SaleWhereInput>
}

export type SubscriptionSessionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionSessionEncryptionArtifactsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SessionEncryptionArtifactsOrderByInput>>
  where?: InputMaybe<SessionEncryptionArtifactsWhereInput>
}

export type SubscriptionSessionEncryptionArtifactsByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionSessionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SessionOrderByInput>>
  where?: InputMaybe<SessionWhereInput>
}

export type SubscriptionStorageBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBagOrderByInput>>
  where?: InputMaybe<StorageBagWhereInput>
}

export type SubscriptionStorageBucketBagByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketBagsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketBagOrderByInput>>
  where?: InputMaybe<StorageBucketBagWhereInput>
}

export type SubscriptionStorageBucketByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketOperatorMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOperatorMetadataOrderByInput>>
  where?: InputMaybe<StorageBucketOperatorMetadataWhereInput>
}

export type SubscriptionStorageBucketOperatorMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageBucketsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageBucketOrderByInput>>
  where?: InputMaybe<StorageBucketWhereInput>
}

export type SubscriptionStorageDataObjectByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionStorageDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<StorageDataObjectOrderByInput>>
  where?: InputMaybe<StorageDataObjectWhereInput>
}

export type SubscriptionTokenAccountByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionTokenAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenAccountOrderByInput>>
  where?: InputMaybe<TokenAccountWhereInput>
}

export type SubscriptionTokenByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionTokenChannelByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionTokenChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenChannelOrderByInput>>
  where?: InputMaybe<TokenChannelWhereInput>
}

export type SubscriptionTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TokenOrderByInput>>
  where?: InputMaybe<TokenWhereInput>
}

export type SubscriptionTrailerVideoByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionTrailerVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TrailerVideoOrderByInput>>
  where?: InputMaybe<TrailerVideoWhereInput>
}

export type SubscriptionUserByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionUserInteractionCountByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionUserInteractionCountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UserInteractionCountOrderByInput>>
  where?: InputMaybe<UserInteractionCountWhereInput>
}

export type SubscriptionUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<UserOrderByInput>>
  where?: InputMaybe<UserWhereInput>
}

export type SubscriptionVestedAccountByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVestedAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedAccountOrderByInput>>
  where?: InputMaybe<VestedAccountWhereInput>
}

export type SubscriptionVestedSaleByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVestedSalesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedSaleOrderByInput>>
  where?: InputMaybe<VestedSaleWhereInput>
}

export type SubscriptionVestingScheduleByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVestingSchedulesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestingScheduleOrderByInput>>
  where?: InputMaybe<VestingScheduleWhereInput>
}

export type SubscriptionVideoByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoCategoryOrderByInput>>
  where?: InputMaybe<VideoCategoryWhereInput>
}

export type SubscriptionVideoCategoryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoFeaturedInCategoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: InputMaybe<VideoFeaturedInCategoryWhereInput>
}

export type SubscriptionVideoFeaturedInCategoryByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoHeroByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoHerosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoHeroOrderByInput>>
  where?: InputMaybe<VideoHeroWhereInput>
}

export type SubscriptionVideoMediaEncodingByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoMediaEncodingsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaEncodingOrderByInput>>
  where?: InputMaybe<VideoMediaEncodingWhereInput>
}

export type SubscriptionVideoMediaMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoMediaMetadataOrderByInput>>
  where?: InputMaybe<VideoMediaMetadataWhereInput>
}

export type SubscriptionVideoMediaMetadataByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoReactionByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoReactionOrderByInput>>
  where?: InputMaybe<VideoReactionWhereInput>
}

export type SubscriptionVideoSubtitleByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoSubtitlesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoSubtitleOrderByInput>>
  where?: InputMaybe<VideoSubtitleWhereInput>
}

export type SubscriptionVideoViewEventByIdArgs = {
  id: Scalars['String']
}

export type SubscriptionVideoViewEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoViewEventOrderByInput>>
  where?: InputMaybe<VideoViewEventWhereInput>
}

export type SubscriptionVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type SuspendChannelResult = {
  __typename?: 'SuspendChannelResult'
  channelId: Scalars['String']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
}

export type Token = {
  __typename?: 'Token'
  /** When does the token expire or when has it expired */
  expiry: Scalars['DateTime']
  /** The token itself (32-byte string, securely random) */
  id: Scalars['String']
  /** When was the token issued */
  issuedAt: Scalars['DateTime']
  /** The account the token was issued for */
  issuedFor: Account
  /** Type of the token (its intended purpose) */
  type: TokenType
}

export type TokenAccount = {
  __typename?: 'TokenAccount'
  /** amm transactions for this account */
  ammTransactions: Array<AmmTransaction>
  /** has been deleted or not */
  deleted: Scalars['Boolean']
  /** counter */
  id: Scalars['String']
  /** member id ref */
  member: Membership
  /** information about token account's participation in revenue shares */
  revenueShareParticipation: Array<RevenueShareParticipation>
  /** sale transactions for this account */
  saleTransactions: Array<SaleTransaction>
  /** staked amount, to avoid walking to split participations */
  stakedAmount: Scalars['BigInt']
  /** token for which the account is created */
  token: CreatorToken
  /** total token amount (not necessarely liqud) for the account */
  totalAmount: Scalars['BigInt']
  /** vesting schedule info, it can be empty if no vesting schedules are pending */
  vestingSchedules: Array<VestedAccount>
}

export type TokenAccountAmmTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<AmmTransactionOrderByInput>>
  where?: InputMaybe<AmmTransactionWhereInput>
}

export type TokenAccountRevenueShareParticipationArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<RevenueShareParticipationOrderByInput>>
  where?: InputMaybe<RevenueShareParticipationWhereInput>
}

export type TokenAccountSaleTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<SaleTransactionOrderByInput>>
  where?: InputMaybe<SaleTransactionWhereInput>
}

export type TokenAccountVestingSchedulesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedAccountOrderByInput>>
  where?: InputMaybe<VestedAccountWhereInput>
}

export type TokenAccountEdge = {
  __typename?: 'TokenAccountEdge'
  cursor: Scalars['String']
  node: TokenAccount
}

export enum TokenAccountOrderByInput {
  DeletedAsc = 'deleted_ASC',
  DeletedDesc = 'deleted_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  StakedAmountAsc = 'stakedAmount_ASC',
  StakedAmountDesc = 'stakedAmount_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
  TotalAmountAsc = 'totalAmount_ASC',
  TotalAmountDesc = 'totalAmount_DESC',
}

export type TokenAccountWhereInput = {
  AND?: InputMaybe<Array<TokenAccountWhereInput>>
  OR?: InputMaybe<Array<TokenAccountWhereInput>>
  ammTransactions_every?: InputMaybe<AmmTransactionWhereInput>
  ammTransactions_none?: InputMaybe<AmmTransactionWhereInput>
  ammTransactions_some?: InputMaybe<AmmTransactionWhereInput>
  deleted_eq?: InputMaybe<Scalars['Boolean']>
  deleted_isNull?: InputMaybe<Scalars['Boolean']>
  deleted_not_eq?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  revenueShareParticipation_every?: InputMaybe<RevenueShareParticipationWhereInput>
  revenueShareParticipation_none?: InputMaybe<RevenueShareParticipationWhereInput>
  revenueShareParticipation_some?: InputMaybe<RevenueShareParticipationWhereInput>
  saleTransactions_every?: InputMaybe<SaleTransactionWhereInput>
  saleTransactions_none?: InputMaybe<SaleTransactionWhereInput>
  saleTransactions_some?: InputMaybe<SaleTransactionWhereInput>
  stakedAmount_eq?: InputMaybe<Scalars['BigInt']>
  stakedAmount_gt?: InputMaybe<Scalars['BigInt']>
  stakedAmount_gte?: InputMaybe<Scalars['BigInt']>
  stakedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  stakedAmount_isNull?: InputMaybe<Scalars['Boolean']>
  stakedAmount_lt?: InputMaybe<Scalars['BigInt']>
  stakedAmount_lte?: InputMaybe<Scalars['BigInt']>
  stakedAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  stakedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
  totalAmount_eq?: InputMaybe<Scalars['BigInt']>
  totalAmount_gt?: InputMaybe<Scalars['BigInt']>
  totalAmount_gte?: InputMaybe<Scalars['BigInt']>
  totalAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalAmount_isNull?: InputMaybe<Scalars['Boolean']>
  totalAmount_lt?: InputMaybe<Scalars['BigInt']>
  totalAmount_lte?: InputMaybe<Scalars['BigInt']>
  totalAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  vestingSchedules_every?: InputMaybe<VestedAccountWhereInput>
  vestingSchedules_none?: InputMaybe<VestedAccountWhereInput>
  vestingSchedules_some?: InputMaybe<VestedAccountWhereInput>
}

export type TokenAccountsConnection = {
  __typename?: 'TokenAccountsConnection'
  edges: Array<TokenAccountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type TokenAvatar = TokenAvatarObject | TokenAvatarUri

export type TokenAvatarObject = {
  __typename?: 'TokenAvatarObject'
  /** The avatar data object */
  avatarObject: StorageDataObject
}

export type TokenAvatarUri = {
  __typename?: 'TokenAvatarUri'
  /** The avatar URL */
  avatarUri: Scalars['String']
}

export type TokenAvatarWhereInput = {
  avatarObject?: InputMaybe<StorageDataObjectWhereInput>
  avatarObject_isNull?: InputMaybe<Scalars['Boolean']>
  avatarUri_contains?: InputMaybe<Scalars['String']>
  avatarUri_containsInsensitive?: InputMaybe<Scalars['String']>
  avatarUri_endsWith?: InputMaybe<Scalars['String']>
  avatarUri_eq?: InputMaybe<Scalars['String']>
  avatarUri_gt?: InputMaybe<Scalars['String']>
  avatarUri_gte?: InputMaybe<Scalars['String']>
  avatarUri_in?: InputMaybe<Array<Scalars['String']>>
  avatarUri_isNull?: InputMaybe<Scalars['Boolean']>
  avatarUri_lt?: InputMaybe<Scalars['String']>
  avatarUri_lte?: InputMaybe<Scalars['String']>
  avatarUri_not_contains?: InputMaybe<Scalars['String']>
  avatarUri_not_containsInsensitive?: InputMaybe<Scalars['String']>
  avatarUri_not_endsWith?: InputMaybe<Scalars['String']>
  avatarUri_not_eq?: InputMaybe<Scalars['String']>
  avatarUri_not_in?: InputMaybe<Array<Scalars['String']>>
  avatarUri_not_startsWith?: InputMaybe<Scalars['String']>
  avatarUri_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
}

export type TokenChannel = {
  __typename?: 'TokenChannel'
  /** channel reference */
  channel: Channel
  /** counter */
  id: Scalars['String']
  /** token reference */
  token: CreatorToken
}

export type TokenChannelEdge = {
  __typename?: 'TokenChannelEdge'
  cursor: Scalars['String']
  node: TokenChannel
}

export enum TokenChannelOrderByInput {
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelChannelWeightAsc = 'channel_channelWeight_ASC',
  ChannelChannelWeightDesc = 'channel_channelWeight_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRevenueAsc = 'channel_cumulativeRevenue_ASC',
  ChannelCumulativeRevenueDesc = 'channel_cumulativeRevenue_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelCumulativeRewardAsc = 'channel_cumulativeReward_ASC',
  ChannelCumulativeRewardDesc = 'channel_cumulativeReward_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRevenueShareRatioPercentAsc = 'channel_revenueShareRatioPercent_ASC',
  ChannelRevenueShareRatioPercentDesc = 'channel_revenueShareRatioPercent_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
}

export type TokenChannelWhereInput = {
  AND?: InputMaybe<Array<TokenChannelWhereInput>>
  OR?: InputMaybe<Array<TokenChannelWhereInput>>
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
}

export type TokenChannelsConnection = {
  __typename?: 'TokenChannelsConnection'
  edges: Array<TokenChannelEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type TokenEdge = {
  __typename?: 'TokenEdge'
  cursor: Scalars['String']
  node: Token
}

export enum TokenOrderByInput {
  ExpiryAsc = 'expiry_ASC',
  ExpiryDesc = 'expiry_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IssuedAtAsc = 'issuedAt_ASC',
  IssuedAtDesc = 'issuedAt_DESC',
  IssuedForEmailAsc = 'issuedFor_email_ASC',
  IssuedForEmailDesc = 'issuedFor_email_DESC',
  IssuedForIdAsc = 'issuedFor_id_ASC',
  IssuedForIdDesc = 'issuedFor_id_DESC',
  IssuedForIsBlockedAsc = 'issuedFor_isBlocked_ASC',
  IssuedForIsBlockedDesc = 'issuedFor_isBlocked_DESC',
  IssuedForIsEmailConfirmedAsc = 'issuedFor_isEmailConfirmed_ASC',
  IssuedForIsEmailConfirmedDesc = 'issuedFor_isEmailConfirmed_DESC',
  IssuedForJoystreamAccountAsc = 'issuedFor_joystreamAccount_ASC',
  IssuedForJoystreamAccountDesc = 'issuedFor_joystreamAccount_DESC',
  IssuedForReferrerChannelIdAsc = 'issuedFor_referrerChannelId_ASC',
  IssuedForReferrerChannelIdDesc = 'issuedFor_referrerChannelId_DESC',
  IssuedForRegisteredAtAsc = 'issuedFor_registeredAt_ASC',
  IssuedForRegisteredAtDesc = 'issuedFor_registeredAt_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export enum TokenStatus {
  Idle = 'IDLE',
  Market = 'MARKET',
  Sale = 'SALE',
}

export enum TokenType {
  EmailConfirmation = 'EMAIL_CONFIRMATION',
}

export type TokenWhereInput = {
  AND?: InputMaybe<Array<TokenWhereInput>>
  OR?: InputMaybe<Array<TokenWhereInput>>
  expiry_eq?: InputMaybe<Scalars['DateTime']>
  expiry_gt?: InputMaybe<Scalars['DateTime']>
  expiry_gte?: InputMaybe<Scalars['DateTime']>
  expiry_in?: InputMaybe<Array<Scalars['DateTime']>>
  expiry_isNull?: InputMaybe<Scalars['Boolean']>
  expiry_lt?: InputMaybe<Scalars['DateTime']>
  expiry_lte?: InputMaybe<Scalars['DateTime']>
  expiry_not_eq?: InputMaybe<Scalars['DateTime']>
  expiry_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  issuedAt_eq?: InputMaybe<Scalars['DateTime']>
  issuedAt_gt?: InputMaybe<Scalars['DateTime']>
  issuedAt_gte?: InputMaybe<Scalars['DateTime']>
  issuedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  issuedAt_isNull?: InputMaybe<Scalars['Boolean']>
  issuedAt_lt?: InputMaybe<Scalars['DateTime']>
  issuedAt_lte?: InputMaybe<Scalars['DateTime']>
  issuedAt_not_eq?: InputMaybe<Scalars['DateTime']>
  issuedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  issuedFor?: InputMaybe<AccountWhereInput>
  issuedFor_isNull?: InputMaybe<Scalars['Boolean']>
  type_eq?: InputMaybe<TokenType>
  type_in?: InputMaybe<Array<TokenType>>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  type_not_eq?: InputMaybe<TokenType>
  type_not_in?: InputMaybe<Array<TokenType>>
}

export type TokensConnection = {
  __typename?: 'TokensConnection'
  edges: Array<TokenEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type TopInteractedEntity = {
  __typename?: 'TopInteractedEntity'
  entityId: Scalars['String']
  interactionCount: Scalars['Float']
}

export type TopSellingChannelsResult = {
  __typename?: 'TopSellingChannelsResult'
  amount: Scalars['String']
  channel: Channel
  nftSold: Scalars['Int']
}

export type TopSellingTokensReturnType = {
  __typename?: 'TopSellingTokensReturnType'
  ammVolume: Scalars['String']
  creatorToken: CreatorToken
}

export type TrailerVideo = {
  __typename?: 'TrailerVideo'
  /** counter */
  id: Scalars['String']
  /** token reference, unique as one token cannot have multiple trailers */
  token: CreatorToken
  /** video reference */
  video: Video
}

export type TrailerVideoEdge = {
  __typename?: 'TrailerVideoEdge'
  cursor: Scalars['String']
  node: TrailerVideo
}

export enum TrailerVideoOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TokenAccountsNumAsc = 'token_accountsNum_ASC',
  TokenAccountsNumDesc = 'token_accountsNum_DESC',
  TokenAnnualCreatorRewardPermillAsc = 'token_annualCreatorRewardPermill_ASC',
  TokenAnnualCreatorRewardPermillDesc = 'token_annualCreatorRewardPermill_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenDeissuedAsc = 'token_deissued_ASC',
  TokenDeissuedDesc = 'token_deissued_DESC',
  TokenDescriptionAsc = 'token_description_ASC',
  TokenDescriptionDesc = 'token_description_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenIsFeaturedAsc = 'token_isFeatured_ASC',
  TokenIsFeaturedDesc = 'token_isFeatured_DESC',
  TokenIsInviteOnlyAsc = 'token_isInviteOnly_ASC',
  TokenIsInviteOnlyDesc = 'token_isInviteOnly_DESC',
  TokenLastPriceAsc = 'token_lastPrice_ASC',
  TokenLastPriceDesc = 'token_lastPrice_DESC',
  TokenNumberOfRevenueShareActivationsAsc = 'token_numberOfRevenueShareActivations_ASC',
  TokenNumberOfRevenueShareActivationsDesc = 'token_numberOfRevenueShareActivations_DESC',
  TokenNumberOfVestedTransferIssuedAsc = 'token_numberOfVestedTransferIssued_ASC',
  TokenNumberOfVestedTransferIssuedDesc = 'token_numberOfVestedTransferIssued_DESC',
  TokenRevenueShareRatioPermillAsc = 'token_revenueShareRatioPermill_ASC',
  TokenRevenueShareRatioPermillDesc = 'token_revenueShareRatioPermill_DESC',
  TokenStatusAsc = 'token_status_ASC',
  TokenStatusDesc = 'token_status_DESC',
  TokenSymbolAsc = 'token_symbol_ASC',
  TokenSymbolDesc = 'token_symbol_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenWhitelistApplicantLinkAsc = 'token_whitelistApplicantLink_ASC',
  TokenWhitelistApplicantLinkDesc = 'token_whitelistApplicantLink_DESC',
  TokenWhitelistApplicantNoteAsc = 'token_whitelistApplicantNote_ASC',
  TokenWhitelistApplicantNoteDesc = 'token_whitelistApplicantNote_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type TrailerVideoWhereInput = {
  AND?: InputMaybe<Array<TrailerVideoWhereInput>>
  OR?: InputMaybe<Array<TrailerVideoWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  token?: InputMaybe<CreatorTokenWhereInput>
  token_isNull?: InputMaybe<Scalars['Boolean']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type TrailerVideosConnection = {
  __typename?: 'TrailerVideosConnection'
  edges: Array<TrailerVideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

/** NFT transactional state */
export type TransactionalStatus =
  | TransactionalStatusAuction
  | TransactionalStatusBuyNow
  | TransactionalStatusIdle
  | TransactionalStatusInitiatedOfferToMember

/** Represents TransactionalStatus Auction */
export type TransactionalStatusAuction = {
  __typename?: 'TransactionalStatusAuction'
  auction: Auction
}

/** Represents TransactionalStatus BuyNow */
export type TransactionalStatusBuyNow = {
  __typename?: 'TransactionalStatusBuyNow'
  price: Scalars['BigInt']
}

/** Represents TransactionalStatus Idle */
export type TransactionalStatusIdle = {
  __typename?: 'TransactionalStatusIdle'
  phantom?: Maybe<Scalars['Int']>
}

/** Represents TransactionalStatus InitiatedOfferToMember */
export type TransactionalStatusInitiatedOfferToMember = {
  __typename?: 'TransactionalStatusInitiatedOfferToMember'
  /** Member that recieved the offer */
  member: Membership
  /** The price that the member should pay to accept offer (optional) */
  price?: Maybe<Scalars['BigInt']>
}

export type TransactionalStatusWhereInput = {
  auction?: InputMaybe<AuctionWhereInput>
  auction_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  price_eq?: InputMaybe<Scalars['BigInt']>
  price_gt?: InputMaybe<Scalars['BigInt']>
  price_gte?: InputMaybe<Scalars['BigInt']>
  price_in?: InputMaybe<Array<Scalars['BigInt']>>
  price_isNull?: InputMaybe<Scalars['Boolean']>
  price_lt?: InputMaybe<Scalars['BigInt']>
  price_lte?: InputMaybe<Scalars['BigInt']>
  price_not_eq?: InputMaybe<Scalars['BigInt']>
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>
}

export type Unread = {
  __typename?: 'Unread'
  phantom?: Maybe<Scalars['Int']>
}

export type User = {
  __typename?: 'User'
  /** The account associated with the user (if any) */
  account?: Maybe<Account>
  /** User's channel follows */
  channelFollows: Array<ChannelFollow>
  /** Unique identifier (32-byte string, securely random) */
  id: Scalars['String']
  /** Whether the user has root (gateway operator) privileges */
  isRoot: Scalars['Boolean']
  /** NFT featuring requests associated with the user */
  nftFeaturingRequests: Array<NftFeaturingRequest>
  /** List of all the gateway operator permissions that this user has */
  permissions?: Maybe<Array<OperatorPermission>>
  /** Reports associated with the user */
  reports: Array<Report>
  /** Video views associated with the user */
  videoViewEvents: Array<VideoViewEvent>
}

export type UserChannelFollowsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ChannelFollowOrderByInput>>
  where?: InputMaybe<ChannelFollowWhereInput>
}

export type UserNftFeaturingRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<NftFeaturingRequestOrderByInput>>
  where?: InputMaybe<NftFeaturingRequestWhereInput>
}

export type UserReportsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<ReportOrderByInput>>
  where?: InputMaybe<ReportWhereInput>
}

export type UserVideoViewEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoViewEventOrderByInput>>
  where?: InputMaybe<VideoViewEventWhereInput>
}

export type UserEdge = {
  __typename?: 'UserEdge'
  cursor: Scalars['String']
  node: User
}

export type UserInteractionCount = {
  __typename?: 'UserInteractionCount'
  /** Count of the interactions */
  count: Scalars['Int']
  /** Timestamp of the day that is used to count the interactions */
  dayTimestamp: Scalars['DateTime']
  /** ID of the entity that the event is related to for 'tokenMarketplaceEntry' it would be token ID */
  entityId?: Maybe<Scalars['String']>
  /** Autoincremented ID */
  id: Scalars['String']
  /** Type of the user interaction eg. 'tokenMarketplaceEntry' */
  type?: Maybe<Scalars['String']>
}

export type UserInteractionCountEdge = {
  __typename?: 'UserInteractionCountEdge'
  cursor: Scalars['String']
  node: UserInteractionCount
}

export enum UserInteractionCountOrderByInput {
  CountAsc = 'count_ASC',
  CountDesc = 'count_DESC',
  DayTimestampAsc = 'dayTimestamp_ASC',
  DayTimestampDesc = 'dayTimestamp_DESC',
  EntityIdAsc = 'entityId_ASC',
  EntityIdDesc = 'entityId_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
}

export type UserInteractionCountWhereInput = {
  AND?: InputMaybe<Array<UserInteractionCountWhereInput>>
  OR?: InputMaybe<Array<UserInteractionCountWhereInput>>
  count_eq?: InputMaybe<Scalars['Int']>
  count_gt?: InputMaybe<Scalars['Int']>
  count_gte?: InputMaybe<Scalars['Int']>
  count_in?: InputMaybe<Array<Scalars['Int']>>
  count_isNull?: InputMaybe<Scalars['Boolean']>
  count_lt?: InputMaybe<Scalars['Int']>
  count_lte?: InputMaybe<Scalars['Int']>
  count_not_eq?: InputMaybe<Scalars['Int']>
  count_not_in?: InputMaybe<Array<Scalars['Int']>>
  dayTimestamp_eq?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_gt?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_gte?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  dayTimestamp_isNull?: InputMaybe<Scalars['Boolean']>
  dayTimestamp_lt?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_lte?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  dayTimestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  entityId_contains?: InputMaybe<Scalars['String']>
  entityId_containsInsensitive?: InputMaybe<Scalars['String']>
  entityId_endsWith?: InputMaybe<Scalars['String']>
  entityId_eq?: InputMaybe<Scalars['String']>
  entityId_gt?: InputMaybe<Scalars['String']>
  entityId_gte?: InputMaybe<Scalars['String']>
  entityId_in?: InputMaybe<Array<Scalars['String']>>
  entityId_isNull?: InputMaybe<Scalars['Boolean']>
  entityId_lt?: InputMaybe<Scalars['String']>
  entityId_lte?: InputMaybe<Scalars['String']>
  entityId_not_contains?: InputMaybe<Scalars['String']>
  entityId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  entityId_not_endsWith?: InputMaybe<Scalars['String']>
  entityId_not_eq?: InputMaybe<Scalars['String']>
  entityId_not_in?: InputMaybe<Array<Scalars['String']>>
  entityId_not_startsWith?: InputMaybe<Scalars['String']>
  entityId_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_containsInsensitive?: InputMaybe<Scalars['String']>
  type_endsWith?: InputMaybe<Scalars['String']>
  type_eq?: InputMaybe<Scalars['String']>
  type_gt?: InputMaybe<Scalars['String']>
  type_gte?: InputMaybe<Scalars['String']>
  type_in?: InputMaybe<Array<Scalars['String']>>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  type_lt?: InputMaybe<Scalars['String']>
  type_lte?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_containsInsensitive?: InputMaybe<Scalars['String']>
  type_not_endsWith?: InputMaybe<Scalars['String']>
  type_not_eq?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<Scalars['String']>>
  type_not_startsWith?: InputMaybe<Scalars['String']>
  type_startsWith?: InputMaybe<Scalars['String']>
}

export type UserInteractionCountsConnection = {
  __typename?: 'UserInteractionCountsConnection'
  edges: Array<UserInteractionCountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export enum UserOrderByInput {
  AccountEmailAsc = 'account_email_ASC',
  AccountEmailDesc = 'account_email_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountIsBlockedAsc = 'account_isBlocked_ASC',
  AccountIsBlockedDesc = 'account_isBlocked_DESC',
  AccountIsEmailConfirmedAsc = 'account_isEmailConfirmed_ASC',
  AccountIsEmailConfirmedDesc = 'account_isEmailConfirmed_DESC',
  AccountJoystreamAccountAsc = 'account_joystreamAccount_ASC',
  AccountJoystreamAccountDesc = 'account_joystreamAccount_DESC',
  AccountReferrerChannelIdAsc = 'account_referrerChannelId_ASC',
  AccountReferrerChannelIdDesc = 'account_referrerChannelId_DESC',
  AccountRegisteredAtAsc = 'account_registeredAt_ASC',
  AccountRegisteredAtDesc = 'account_registeredAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsRootAsc = 'isRoot_ASC',
  IsRootDesc = 'isRoot_DESC',
}

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>
  OR?: InputMaybe<Array<UserWhereInput>>
  account?: InputMaybe<AccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  channelFollows_every?: InputMaybe<ChannelFollowWhereInput>
  channelFollows_none?: InputMaybe<ChannelFollowWhereInput>
  channelFollows_some?: InputMaybe<ChannelFollowWhereInput>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isRoot_eq?: InputMaybe<Scalars['Boolean']>
  isRoot_isNull?: InputMaybe<Scalars['Boolean']>
  isRoot_not_eq?: InputMaybe<Scalars['Boolean']>
  nftFeaturingRequests_every?: InputMaybe<NftFeaturingRequestWhereInput>
  nftFeaturingRequests_none?: InputMaybe<NftFeaturingRequestWhereInput>
  nftFeaturingRequests_some?: InputMaybe<NftFeaturingRequestWhereInput>
  permissions_containsAll?: InputMaybe<Array<OperatorPermission>>
  permissions_containsAny?: InputMaybe<Array<OperatorPermission>>
  permissions_containsNone?: InputMaybe<Array<OperatorPermission>>
  permissions_isNull?: InputMaybe<Scalars['Boolean']>
  reports_every?: InputMaybe<ReportWhereInput>
  reports_none?: InputMaybe<ReportWhereInput>
  reports_some?: InputMaybe<ReportWhereInput>
  videoViewEvents_every?: InputMaybe<VideoViewEventWhereInput>
  videoViewEvents_none?: InputMaybe<VideoViewEventWhereInput>
  videoViewEvents_some?: InputMaybe<VideoViewEventWhereInput>
}

export type UsersConnection = {
  __typename?: 'UsersConnection'
  edges: Array<UserEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VerifyChannelResult = {
  __typename?: 'VerifyChannelResult'
  channelId: Scalars['String']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
}

export type VestedAccount = {
  __typename?: 'VestedAccount'
  /** account reference */
  account: TokenAccount
  /** acquired at block */
  acquiredAt: Scalars['Int']
  /** counter */
  id: Scalars['String']
  /** total amount the schedule is vested */
  totalVestingAmount: Scalars['BigInt']
  /** vesting schedule reference */
  vesting: VestingSchedule
  /** vesting source */
  vestingSource: VestingSource
}

export type VestedAccountEdge = {
  __typename?: 'VestedAccountEdge'
  cursor: Scalars['String']
  node: VestedAccount
}

export enum VestedAccountOrderByInput {
  AccountDeletedAsc = 'account_deleted_ASC',
  AccountDeletedDesc = 'account_deleted_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountStakedAmountAsc = 'account_stakedAmount_ASC',
  AccountStakedAmountDesc = 'account_stakedAmount_DESC',
  AccountTotalAmountAsc = 'account_totalAmount_ASC',
  AccountTotalAmountDesc = 'account_totalAmount_DESC',
  AcquiredAtAsc = 'acquiredAt_ASC',
  AcquiredAtDesc = 'acquiredAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TotalVestingAmountAsc = 'totalVestingAmount_ASC',
  TotalVestingAmountDesc = 'totalVestingAmount_DESC',
  VestingSourceIsTypeOfAsc = 'vestingSource_isTypeOf_ASC',
  VestingSourceIsTypeOfDesc = 'vestingSource_isTypeOf_DESC',
  VestingSourcePhantomAsc = 'vestingSource_phantom_ASC',
  VestingSourcePhantomDesc = 'vestingSource_phantom_DESC',
  VestingCliffBlockAsc = 'vesting_cliffBlock_ASC',
  VestingCliffBlockDesc = 'vesting_cliffBlock_DESC',
  VestingCliffDurationBlocksAsc = 'vesting_cliffDurationBlocks_ASC',
  VestingCliffDurationBlocksDesc = 'vesting_cliffDurationBlocks_DESC',
  VestingCliffRatioPermillAsc = 'vesting_cliffRatioPermill_ASC',
  VestingCliffRatioPermillDesc = 'vesting_cliffRatioPermill_DESC',
  VestingEndsAtAsc = 'vesting_endsAt_ASC',
  VestingEndsAtDesc = 'vesting_endsAt_DESC',
  VestingIdAsc = 'vesting_id_ASC',
  VestingIdDesc = 'vesting_id_DESC',
  VestingVestingDurationBlocksAsc = 'vesting_vestingDurationBlocks_ASC',
  VestingVestingDurationBlocksDesc = 'vesting_vestingDurationBlocks_DESC',
}

export type VestedAccountWhereInput = {
  AND?: InputMaybe<Array<VestedAccountWhereInput>>
  OR?: InputMaybe<Array<VestedAccountWhereInput>>
  account?: InputMaybe<TokenAccountWhereInput>
  account_isNull?: InputMaybe<Scalars['Boolean']>
  acquiredAt_eq?: InputMaybe<Scalars['Int']>
  acquiredAt_gt?: InputMaybe<Scalars['Int']>
  acquiredAt_gte?: InputMaybe<Scalars['Int']>
  acquiredAt_in?: InputMaybe<Array<Scalars['Int']>>
  acquiredAt_isNull?: InputMaybe<Scalars['Boolean']>
  acquiredAt_lt?: InputMaybe<Scalars['Int']>
  acquiredAt_lte?: InputMaybe<Scalars['Int']>
  acquiredAt_not_eq?: InputMaybe<Scalars['Int']>
  acquiredAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  totalVestingAmount_eq?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_gt?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_gte?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_in?: InputMaybe<Array<Scalars['BigInt']>>
  totalVestingAmount_isNull?: InputMaybe<Scalars['Boolean']>
  totalVestingAmount_lt?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_lte?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_not_eq?: InputMaybe<Scalars['BigInt']>
  totalVestingAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  vesting?: InputMaybe<VestingScheduleWhereInput>
  vestingSource?: InputMaybe<VestingSourceWhereInput>
  vestingSource_isNull?: InputMaybe<Scalars['Boolean']>
  vesting_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VestedAccountsConnection = {
  __typename?: 'VestedAccountsConnection'
  edges: Array<VestedAccountEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VestedSale = {
  __typename?: 'VestedSale'
  /** counter */
  id: Scalars['String']
  /** Sale reference */
  sale: Sale
  /** vesting schedule reference */
  vesting: VestingSchedule
}

export type VestedSaleEdge = {
  __typename?: 'VestedSaleEdge'
  cursor: Scalars['String']
  node: VestedSale
}

export enum VestedSaleOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SaleCreatedInAsc = 'sale_createdIn_ASC',
  SaleCreatedInDesc = 'sale_createdIn_DESC',
  SaleEndsAtAsc = 'sale_endsAt_ASC',
  SaleEndsAtDesc = 'sale_endsAt_DESC',
  SaleFinalizedAsc = 'sale_finalized_ASC',
  SaleFinalizedDesc = 'sale_finalized_DESC',
  SaleIdAsc = 'sale_id_ASC',
  SaleIdDesc = 'sale_id_DESC',
  SaleMaxAmountPerMemberAsc = 'sale_maxAmountPerMember_ASC',
  SaleMaxAmountPerMemberDesc = 'sale_maxAmountPerMember_DESC',
  SalePricePerUnitAsc = 'sale_pricePerUnit_ASC',
  SalePricePerUnitDesc = 'sale_pricePerUnit_DESC',
  SaleStartBlockAsc = 'sale_startBlock_ASC',
  SaleStartBlockDesc = 'sale_startBlock_DESC',
  SaleTermsAndConditionsAsc = 'sale_termsAndConditions_ASC',
  SaleTermsAndConditionsDesc = 'sale_termsAndConditions_DESC',
  SaleTokenSaleAllocationAsc = 'sale_tokenSaleAllocation_ASC',
  SaleTokenSaleAllocationDesc = 'sale_tokenSaleAllocation_DESC',
  SaleTokensSoldAsc = 'sale_tokensSold_ASC',
  SaleTokensSoldDesc = 'sale_tokensSold_DESC',
  VestingCliffBlockAsc = 'vesting_cliffBlock_ASC',
  VestingCliffBlockDesc = 'vesting_cliffBlock_DESC',
  VestingCliffDurationBlocksAsc = 'vesting_cliffDurationBlocks_ASC',
  VestingCliffDurationBlocksDesc = 'vesting_cliffDurationBlocks_DESC',
  VestingCliffRatioPermillAsc = 'vesting_cliffRatioPermill_ASC',
  VestingCliffRatioPermillDesc = 'vesting_cliffRatioPermill_DESC',
  VestingEndsAtAsc = 'vesting_endsAt_ASC',
  VestingEndsAtDesc = 'vesting_endsAt_DESC',
  VestingIdAsc = 'vesting_id_ASC',
  VestingIdDesc = 'vesting_id_DESC',
  VestingVestingDurationBlocksAsc = 'vesting_vestingDurationBlocks_ASC',
  VestingVestingDurationBlocksDesc = 'vesting_vestingDurationBlocks_DESC',
}

export type VestedSaleWhereInput = {
  AND?: InputMaybe<Array<VestedSaleWhereInput>>
  OR?: InputMaybe<Array<VestedSaleWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  sale?: InputMaybe<SaleWhereInput>
  sale_isNull?: InputMaybe<Scalars['Boolean']>
  vesting?: InputMaybe<VestingScheduleWhereInput>
  vesting_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VestedSalesConnection = {
  __typename?: 'VestedSalesConnection'
  edges: Array<VestedSaleEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VestingSchedule = {
  __typename?: 'VestingSchedule'
  /** accounts reference */
  accounts: Array<VestedAccount>
  /** cliff block */
  cliffBlock: Scalars['Int']
  /** cliff duration in blocks */
  cliffDurationBlocks: Scalars['Int']
  /** Permill of amount vested immediately after cliff period */
  cliffRatioPermill: Scalars['Int']
  /** vesting ending block */
  endsAt: Scalars['Int']
  /** counter */
  id: Scalars['String']
  /** vesting schedule for sale */
  vestedSale?: Maybe<VestedSale>
  /** vesting duration in blocks */
  vestingDurationBlocks: Scalars['Int']
}

export type VestingScheduleAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VestedAccountOrderByInput>>
  where?: InputMaybe<VestedAccountWhereInput>
}

export type VestingScheduleEdge = {
  __typename?: 'VestingScheduleEdge'
  cursor: Scalars['String']
  node: VestingSchedule
}

export enum VestingScheduleOrderByInput {
  CliffBlockAsc = 'cliffBlock_ASC',
  CliffBlockDesc = 'cliffBlock_DESC',
  CliffDurationBlocksAsc = 'cliffDurationBlocks_ASC',
  CliffDurationBlocksDesc = 'cliffDurationBlocks_DESC',
  CliffRatioPermillAsc = 'cliffRatioPermill_ASC',
  CliffRatioPermillDesc = 'cliffRatioPermill_DESC',
  EndsAtAsc = 'endsAt_ASC',
  EndsAtDesc = 'endsAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  VestedSaleIdAsc = 'vestedSale_id_ASC',
  VestedSaleIdDesc = 'vestedSale_id_DESC',
  VestingDurationBlocksAsc = 'vestingDurationBlocks_ASC',
  VestingDurationBlocksDesc = 'vestingDurationBlocks_DESC',
}

export type VestingScheduleWhereInput = {
  AND?: InputMaybe<Array<VestingScheduleWhereInput>>
  OR?: InputMaybe<Array<VestingScheduleWhereInput>>
  accounts_every?: InputMaybe<VestedAccountWhereInput>
  accounts_none?: InputMaybe<VestedAccountWhereInput>
  accounts_some?: InputMaybe<VestedAccountWhereInput>
  cliffBlock_eq?: InputMaybe<Scalars['Int']>
  cliffBlock_gt?: InputMaybe<Scalars['Int']>
  cliffBlock_gte?: InputMaybe<Scalars['Int']>
  cliffBlock_in?: InputMaybe<Array<Scalars['Int']>>
  cliffBlock_isNull?: InputMaybe<Scalars['Boolean']>
  cliffBlock_lt?: InputMaybe<Scalars['Int']>
  cliffBlock_lte?: InputMaybe<Scalars['Int']>
  cliffBlock_not_eq?: InputMaybe<Scalars['Int']>
  cliffBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  cliffDurationBlocks_eq?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_gt?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_gte?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_in?: InputMaybe<Array<Scalars['Int']>>
  cliffDurationBlocks_isNull?: InputMaybe<Scalars['Boolean']>
  cliffDurationBlocks_lt?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_lte?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_not_eq?: InputMaybe<Scalars['Int']>
  cliffDurationBlocks_not_in?: InputMaybe<Array<Scalars['Int']>>
  cliffRatioPermill_eq?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_gt?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_gte?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_in?: InputMaybe<Array<Scalars['Int']>>
  cliffRatioPermill_isNull?: InputMaybe<Scalars['Boolean']>
  cliffRatioPermill_lt?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_lte?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_not_eq?: InputMaybe<Scalars['Int']>
  cliffRatioPermill_not_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_eq?: InputMaybe<Scalars['Int']>
  endsAt_gt?: InputMaybe<Scalars['Int']>
  endsAt_gte?: InputMaybe<Scalars['Int']>
  endsAt_in?: InputMaybe<Array<Scalars['Int']>>
  endsAt_isNull?: InputMaybe<Scalars['Boolean']>
  endsAt_lt?: InputMaybe<Scalars['Int']>
  endsAt_lte?: InputMaybe<Scalars['Int']>
  endsAt_not_eq?: InputMaybe<Scalars['Int']>
  endsAt_not_in?: InputMaybe<Array<Scalars['Int']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  vestedSale?: InputMaybe<VestedSaleWhereInput>
  vestedSale_isNull?: InputMaybe<Scalars['Boolean']>
  vestingDurationBlocks_eq?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_gt?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_gte?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_in?: InputMaybe<Array<Scalars['Int']>>
  vestingDurationBlocks_isNull?: InputMaybe<Scalars['Boolean']>
  vestingDurationBlocks_lt?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_lte?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_not_eq?: InputMaybe<Scalars['Int']>
  vestingDurationBlocks_not_in?: InputMaybe<Array<Scalars['Int']>>
}

export type VestingSchedulesConnection = {
  __typename?: 'VestingSchedulesConnection'
  edges: Array<VestingScheduleEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VestingSource = InitialIssuanceVestingSource | IssuerTransferVestingSource | SaleVestingSource

export type VestingSourceWhereInput = {
  isTypeOf_contains?: InputMaybe<Scalars['String']>
  isTypeOf_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_eq?: InputMaybe<Scalars['String']>
  isTypeOf_gt?: InputMaybe<Scalars['String']>
  isTypeOf_gte?: InputMaybe<Scalars['String']>
  isTypeOf_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_isNull?: InputMaybe<Scalars['Boolean']>
  isTypeOf_lt?: InputMaybe<Scalars['String']>
  isTypeOf_lte?: InputMaybe<Scalars['String']>
  isTypeOf_not_contains?: InputMaybe<Scalars['String']>
  isTypeOf_not_containsInsensitive?: InputMaybe<Scalars['String']>
  isTypeOf_not_endsWith?: InputMaybe<Scalars['String']>
  isTypeOf_not_eq?: InputMaybe<Scalars['String']>
  isTypeOf_not_in?: InputMaybe<Array<Scalars['String']>>
  isTypeOf_not_startsWith?: InputMaybe<Scalars['String']>
  isTypeOf_startsWith?: InputMaybe<Scalars['String']>
  phantom_eq?: InputMaybe<Scalars['Int']>
  phantom_gt?: InputMaybe<Scalars['Int']>
  phantom_gte?: InputMaybe<Scalars['Int']>
  phantom_in?: InputMaybe<Array<Scalars['Int']>>
  phantom_isNull?: InputMaybe<Scalars['Boolean']>
  phantom_lt?: InputMaybe<Scalars['Int']>
  phantom_lte?: InputMaybe<Scalars['Int']>
  phantom_not_eq?: InputMaybe<Scalars['Int']>
  phantom_not_in?: InputMaybe<Array<Scalars['Int']>>
  sale?: InputMaybe<SaleWhereInput>
  sale_isNull?: InputMaybe<Scalars['Boolean']>
}

export type Video = {
  __typename?: 'Video'
  /** Reference to a video category */
  category?: Maybe<VideoCategory>
  /** Reference to videos's channel */
  channel: Channel
  /** List of all video comments */
  comments: Array<Comment>
  /** Comments count */
  commentsCount: Scalars['Int']
  /** Timestamp of the block the video was created at */
  createdAt: Scalars['DateTime']
  /** Block the video was created in */
  createdInBlock: Scalars['Int']
  /** The description of the Video */
  description?: Maybe<Scalars['String']>
  /** Video duration in seconds */
  duration?: Maybe<Scalars['Int']>
  /** Application used for video creation */
  entryApp?: Maybe<App>
  /** Whether or not Video contains marketing */
  hasMarketing?: Maybe<Scalars['Boolean']>
  /** Runtime identifier */
  id: Scalars['String']
  /** Optional boolean flag to indicate if the video should be included in the home feed/page. */
  includeInHomeFeed?: Maybe<Scalars['Boolean']>
  /** Flag signaling whether a video is censored. */
  isCensored: Scalars['Boolean']
  /** Is comment section enabled (true if enabled) */
  isCommentSectionEnabled: Scalars['Boolean']
  /** Whether a video has been excluded/hidden (by the gateway operator) */
  isExcluded: Scalars['Boolean']
  /** Whether the Video contains explicit material. */
  isExplicit?: Maybe<Scalars['Boolean']>
  /** Whether the Video is supposed to be publically displayed */
  isPublic?: Maybe<Scalars['Boolean']>
  /** Is reactions feature enabled on video (true if enabled i.e. video can be reacted) */
  isReactionFeatureEnabled: Scalars['Boolean']
  /** Whether the video is a short format, vertical video (e.g. Youtube Shorts, TikTok, Instagram Reels) */
  isShort?: Maybe<Scalars['Boolean']>
  /** Whether the video is a short format, vertical video, and it derived based on video dimension (i.e. was not set in metadata) */
  isShortDerived?: Maybe<Scalars['Boolean']>
  /** Video's main langauge */
  language?: Maybe<Scalars['String']>
  /** License under the video is published */
  license?: Maybe<License>
  /** Video media asset */
  media?: Maybe<StorageDataObject>
  /** Video file metadata */
  mediaMetadata?: Maybe<VideoMediaMetadata>
  /** Video NFT details */
  nft?: Maybe<OwnedNft>
  /** Video's orion langauge */
  orionLanguage?: Maybe<Scalars['String']>
  /** channel owner pinned comment */
  pinnedComment?: Maybe<Comment>
  /** If the Video was published on other platform before beeing published on Joystream - the original publication date */
  publishedBeforeJoystream?: Maybe<Scalars['DateTime']>
  /** List of all video reactions */
  reactions: Array<VideoReaction>
  /** Reactions count */
  reactionsCount: Scalars['Int']
  /** Reactions count by reaction Id */
  reactionsCountByReactionId?: Maybe<Array<VideoReactionsCountByReactionType>>
  /** List of video subtitles */
  subtitles: Array<VideoSubtitle>
  /** Video thumbnail asset (recommended ratio: 16:9) */
  thumbnailPhoto?: Maybe<StorageDataObject>
  /** The title of the video */
  title?: Maybe<Scalars['String']>
  /** token for which this video is trailer */
  trailerVideoForToken: Array<TrailerVideo>
  /** Video relevance score based on the views, reactions, comments and update date */
  videoRelevance: Scalars['Float']
  /** Value of video state bloat bond fee paid by channel owner */
  videoStateBloatBond: Scalars['BigInt']
  /** Number of video views (to speed up orderBy queries by avoiding COUNT aggregation) */
  viewsNum: Scalars['Int']
  /** Video ID coming from YPP */
  ytVideoId?: Maybe<Scalars['String']>
}

export type VideoCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<CommentOrderByInput>>
  where?: InputMaybe<CommentWhereInput>
}

export type VideoReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoReactionOrderByInput>>
  where?: InputMaybe<VideoReactionWhereInput>
}

export type VideoSubtitlesArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoSubtitleOrderByInput>>
  where?: InputMaybe<VideoSubtitleWhereInput>
}

export type VideoTrailerVideoForTokenArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<TrailerVideoOrderByInput>>
  where?: InputMaybe<TrailerVideoWhereInput>
}

export type VideoAssetsDeletedByModeratorEventData = {
  __typename?: 'VideoAssetsDeletedByModeratorEventData'
  /** IDs of video assets being deleted by moderator */
  assetIds?: Maybe<Array<Scalars['BigInt']>>
  /** Actor who deleted the video assets. */
  deletedBy: ContentActor
  /** why the video assets were deleted */
  rationale: Scalars['String']
  /** Video whose assets were deleted */
  video: Video
}

export type VideoCategoriesConnection = {
  __typename?: 'VideoCategoriesConnection'
  edges: Array<VideoCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoCategory = {
  __typename?: 'VideoCategory'
  createdInBlock: Scalars['Int']
  /** The description of the category */
  description?: Maybe<Scalars['String']>
  featuredVideos: Array<VideoFeaturedInCategory>
  /** Runtime identifier */
  id: Scalars['String']
  /** Indicates whether the category is supported by the Gateway */
  isSupported: Scalars['Boolean']
  /** The name of the category */
  name?: Maybe<Scalars['String']>
  /** Parent category if defined */
  parentCategory?: Maybe<VideoCategory>
  videos: Array<Video>
}

export type VideoCategoryFeaturedVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoFeaturedInCategoryOrderByInput>>
  where?: InputMaybe<VideoFeaturedInCategoryWhereInput>
}

export type VideoCategoryVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
  orderBy?: InputMaybe<Array<VideoOrderByInput>>
  where?: InputMaybe<VideoWhereInput>
}

export type VideoCategoryEdge = {
  __typename?: 'VideoCategoryEdge'
  cursor: Scalars['String']
  node: VideoCategory
}

export enum VideoCategoryOrderByInput {
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsSupportedAsc = 'isSupported_ASC',
  IsSupportedDesc = 'isSupported_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  ParentCategoryCreatedInBlockAsc = 'parentCategory_createdInBlock_ASC',
  ParentCategoryCreatedInBlockDesc = 'parentCategory_createdInBlock_DESC',
  ParentCategoryDescriptionAsc = 'parentCategory_description_ASC',
  ParentCategoryDescriptionDesc = 'parentCategory_description_DESC',
  ParentCategoryIdAsc = 'parentCategory_id_ASC',
  ParentCategoryIdDesc = 'parentCategory_id_DESC',
  ParentCategoryIsSupportedAsc = 'parentCategory_isSupported_ASC',
  ParentCategoryIsSupportedDesc = 'parentCategory_isSupported_DESC',
  ParentCategoryNameAsc = 'parentCategory_name_ASC',
  ParentCategoryNameDesc = 'parentCategory_name_DESC',
}

export type VideoCategoryWhereInput = {
  AND?: InputMaybe<Array<VideoCategoryWhereInput>>
  OR?: InputMaybe<Array<VideoCategoryWhereInput>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  createdInBlock_not_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  featuredVideos_every?: InputMaybe<VideoFeaturedInCategoryWhereInput>
  featuredVideos_none?: InputMaybe<VideoFeaturedInCategoryWhereInput>
  featuredVideos_some?: InputMaybe<VideoFeaturedInCategoryWhereInput>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  isSupported_eq?: InputMaybe<Scalars['Boolean']>
  isSupported_isNull?: InputMaybe<Scalars['Boolean']>
  isSupported_not_eq?: InputMaybe<Scalars['Boolean']>
  name_contains?: InputMaybe<Scalars['String']>
  name_containsInsensitive?: InputMaybe<Scalars['String']>
  name_endsWith?: InputMaybe<Scalars['String']>
  name_eq?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_isNull?: InputMaybe<Scalars['Boolean']>
  name_lt?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>
  name_not_endsWith?: InputMaybe<Scalars['String']>
  name_not_eq?: InputMaybe<Scalars['String']>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_not_startsWith?: InputMaybe<Scalars['String']>
  name_startsWith?: InputMaybe<Scalars['String']>
  parentCategory?: InputMaybe<VideoCategoryWhereInput>
  parentCategory_isNull?: InputMaybe<Scalars['Boolean']>
  videos_every?: InputMaybe<VideoWhereInput>
  videos_none?: InputMaybe<VideoWhereInput>
  videos_some?: InputMaybe<VideoWhereInput>
}

export type VideoCreatedEventData = {
  __typename?: 'VideoCreatedEventData'
  /** channel the video lives in */
  channel: Channel
  /** video just created */
  video: Video
}

export type VideoDisliked = {
  __typename?: 'VideoDisliked'
  /** handle for the member that dropped the dislike */
  memberHandle: Scalars['String']
  /** id for the member that dropped the dislike */
  memberId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type VideoEdge = {
  __typename?: 'VideoEdge'
  cursor: Scalars['String']
  node: Video
}

export type VideoExcluded = {
  __typename?: 'VideoExcluded'
  /** video title used for notification text */
  videoTitle: Scalars['String']
}

export type VideoFeaturedInCategoriesConnection = {
  __typename?: 'VideoFeaturedInCategoriesConnection'
  edges: Array<VideoFeaturedInCategoryEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoFeaturedInCategory = {
  __typename?: 'VideoFeaturedInCategory'
  /** Category the video is featured in */
  category: VideoCategory
  /** {categoryId-videoId} */
  id: Scalars['String']
  /** Video being featured */
  video: Video
  /** Url to video fragment to be displayed in the UI */
  videoCutUrl?: Maybe<Scalars['String']>
}

export type VideoFeaturedInCategoryEdge = {
  __typename?: 'VideoFeaturedInCategoryEdge'
  cursor: Scalars['String']
  node: VideoFeaturedInCategory
}

export enum VideoFeaturedInCategoryOrderByInput {
  CategoryCreatedInBlockAsc = 'category_createdInBlock_ASC',
  CategoryCreatedInBlockDesc = 'category_createdInBlock_DESC',
  CategoryDescriptionAsc = 'category_description_ASC',
  CategoryDescriptionDesc = 'category_description_DESC',
  CategoryIdAsc = 'category_id_ASC',
  CategoryIdDesc = 'category_id_DESC',
  CategoryIsSupportedAsc = 'category_isSupported_ASC',
  CategoryIsSupportedDesc = 'category_isSupported_DESC',
  CategoryNameAsc = 'category_name_ASC',
  CategoryNameDesc = 'category_name_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  VideoCutUrlAsc = 'videoCutUrl_ASC',
  VideoCutUrlDesc = 'videoCutUrl_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoFeaturedInCategoryWhereInput = {
  AND?: InputMaybe<Array<VideoFeaturedInCategoryWhereInput>>
  OR?: InputMaybe<Array<VideoFeaturedInCategoryWhereInput>>
  category?: InputMaybe<VideoCategoryWhereInput>
  category_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  video?: InputMaybe<VideoWhereInput>
  videoCutUrl_contains?: InputMaybe<Scalars['String']>
  videoCutUrl_containsInsensitive?: InputMaybe<Scalars['String']>
  videoCutUrl_endsWith?: InputMaybe<Scalars['String']>
  videoCutUrl_eq?: InputMaybe<Scalars['String']>
  videoCutUrl_gt?: InputMaybe<Scalars['String']>
  videoCutUrl_gte?: InputMaybe<Scalars['String']>
  videoCutUrl_in?: InputMaybe<Array<Scalars['String']>>
  videoCutUrl_isNull?: InputMaybe<Scalars['Boolean']>
  videoCutUrl_lt?: InputMaybe<Scalars['String']>
  videoCutUrl_lte?: InputMaybe<Scalars['String']>
  videoCutUrl_not_contains?: InputMaybe<Scalars['String']>
  videoCutUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoCutUrl_not_endsWith?: InputMaybe<Scalars['String']>
  videoCutUrl_not_eq?: InputMaybe<Scalars['String']>
  videoCutUrl_not_in?: InputMaybe<Array<Scalars['String']>>
  videoCutUrl_not_startsWith?: InputMaybe<Scalars['String']>
  videoCutUrl_startsWith?: InputMaybe<Scalars['String']>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VideoHero = {
  __typename?: 'VideoHero'
  /** Time at which this VideoHero was created/activated */
  activatedAt?: Maybe<Scalars['DateTime']>
  /** Url to the poster to be displayed in the Hero section */
  heroPosterUrl: Scalars['String']
  /** Title of the Hero section */
  heroTitle: Scalars['String']
  /** Url to video fragment to be displayed in the Hero section */
  heroVideoCutUrl: Scalars['String']
  /** Unique ID */
  id: Scalars['String']
  /** Video being featured in the Hero section */
  video: Video
}

export type VideoHeroEdge = {
  __typename?: 'VideoHeroEdge'
  cursor: Scalars['String']
  node: VideoHero
}

export enum VideoHeroOrderByInput {
  ActivatedAtAsc = 'activatedAt_ASC',
  ActivatedAtDesc = 'activatedAt_DESC',
  HeroPosterUrlAsc = 'heroPosterUrl_ASC',
  HeroPosterUrlDesc = 'heroPosterUrl_DESC',
  HeroTitleAsc = 'heroTitle_ASC',
  HeroTitleDesc = 'heroTitle_DESC',
  HeroVideoCutUrlAsc = 'heroVideoCutUrl_ASC',
  HeroVideoCutUrlDesc = 'heroVideoCutUrl_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoHeroWhereInput = {
  AND?: InputMaybe<Array<VideoHeroWhereInput>>
  OR?: InputMaybe<Array<VideoHeroWhereInput>>
  activatedAt_eq?: InputMaybe<Scalars['DateTime']>
  activatedAt_gt?: InputMaybe<Scalars['DateTime']>
  activatedAt_gte?: InputMaybe<Scalars['DateTime']>
  activatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  activatedAt_isNull?: InputMaybe<Scalars['Boolean']>
  activatedAt_lt?: InputMaybe<Scalars['DateTime']>
  activatedAt_lte?: InputMaybe<Scalars['DateTime']>
  activatedAt_not_eq?: InputMaybe<Scalars['DateTime']>
  activatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  heroPosterUrl_contains?: InputMaybe<Scalars['String']>
  heroPosterUrl_containsInsensitive?: InputMaybe<Scalars['String']>
  heroPosterUrl_endsWith?: InputMaybe<Scalars['String']>
  heroPosterUrl_eq?: InputMaybe<Scalars['String']>
  heroPosterUrl_gt?: InputMaybe<Scalars['String']>
  heroPosterUrl_gte?: InputMaybe<Scalars['String']>
  heroPosterUrl_in?: InputMaybe<Array<Scalars['String']>>
  heroPosterUrl_isNull?: InputMaybe<Scalars['Boolean']>
  heroPosterUrl_lt?: InputMaybe<Scalars['String']>
  heroPosterUrl_lte?: InputMaybe<Scalars['String']>
  heroPosterUrl_not_contains?: InputMaybe<Scalars['String']>
  heroPosterUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>
  heroPosterUrl_not_endsWith?: InputMaybe<Scalars['String']>
  heroPosterUrl_not_eq?: InputMaybe<Scalars['String']>
  heroPosterUrl_not_in?: InputMaybe<Array<Scalars['String']>>
  heroPosterUrl_not_startsWith?: InputMaybe<Scalars['String']>
  heroPosterUrl_startsWith?: InputMaybe<Scalars['String']>
  heroTitle_contains?: InputMaybe<Scalars['String']>
  heroTitle_containsInsensitive?: InputMaybe<Scalars['String']>
  heroTitle_endsWith?: InputMaybe<Scalars['String']>
  heroTitle_eq?: InputMaybe<Scalars['String']>
  heroTitle_gt?: InputMaybe<Scalars['String']>
  heroTitle_gte?: InputMaybe<Scalars['String']>
  heroTitle_in?: InputMaybe<Array<Scalars['String']>>
  heroTitle_isNull?: InputMaybe<Scalars['Boolean']>
  heroTitle_lt?: InputMaybe<Scalars['String']>
  heroTitle_lte?: InputMaybe<Scalars['String']>
  heroTitle_not_contains?: InputMaybe<Scalars['String']>
  heroTitle_not_containsInsensitive?: InputMaybe<Scalars['String']>
  heroTitle_not_endsWith?: InputMaybe<Scalars['String']>
  heroTitle_not_eq?: InputMaybe<Scalars['String']>
  heroTitle_not_in?: InputMaybe<Array<Scalars['String']>>
  heroTitle_not_startsWith?: InputMaybe<Scalars['String']>
  heroTitle_startsWith?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_contains?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_containsInsensitive?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_endsWith?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_eq?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_gt?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_gte?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_in?: InputMaybe<Array<Scalars['String']>>
  heroVideoCutUrl_isNull?: InputMaybe<Scalars['Boolean']>
  heroVideoCutUrl_lt?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_lte?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_not_contains?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_not_endsWith?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_not_eq?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_not_in?: InputMaybe<Array<Scalars['String']>>
  heroVideoCutUrl_not_startsWith?: InputMaybe<Scalars['String']>
  heroVideoCutUrl_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VideoHerosConnection = {
  __typename?: 'VideoHerosConnection'
  edges: Array<VideoHeroEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoLiked = {
  __typename?: 'VideoLiked'
  /** handle for the member that dropped the like */
  memberHandle: Scalars['String']
  /** id for the member that dropped the like */
  memberId: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type VideoMediaEncoding = {
  __typename?: 'VideoMediaEncoding'
  /** Encoding of the video media object */
  codecName?: Maybe<Scalars['String']>
  /** Media container format */
  container?: Maybe<Scalars['String']>
  id: Scalars['String']
  /** Content MIME type */
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
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MimeMediaTypeAsc = 'mimeMediaType_ASC',
  MimeMediaTypeDesc = 'mimeMediaType_DESC',
}

export type VideoMediaEncodingWhereInput = {
  AND?: InputMaybe<Array<VideoMediaEncodingWhereInput>>
  OR?: InputMaybe<Array<VideoMediaEncodingWhereInput>>
  codecName_contains?: InputMaybe<Scalars['String']>
  codecName_containsInsensitive?: InputMaybe<Scalars['String']>
  codecName_endsWith?: InputMaybe<Scalars['String']>
  codecName_eq?: InputMaybe<Scalars['String']>
  codecName_gt?: InputMaybe<Scalars['String']>
  codecName_gte?: InputMaybe<Scalars['String']>
  codecName_in?: InputMaybe<Array<Scalars['String']>>
  codecName_isNull?: InputMaybe<Scalars['Boolean']>
  codecName_lt?: InputMaybe<Scalars['String']>
  codecName_lte?: InputMaybe<Scalars['String']>
  codecName_not_contains?: InputMaybe<Scalars['String']>
  codecName_not_containsInsensitive?: InputMaybe<Scalars['String']>
  codecName_not_endsWith?: InputMaybe<Scalars['String']>
  codecName_not_eq?: InputMaybe<Scalars['String']>
  codecName_not_in?: InputMaybe<Array<Scalars['String']>>
  codecName_not_startsWith?: InputMaybe<Scalars['String']>
  codecName_startsWith?: InputMaybe<Scalars['String']>
  container_contains?: InputMaybe<Scalars['String']>
  container_containsInsensitive?: InputMaybe<Scalars['String']>
  container_endsWith?: InputMaybe<Scalars['String']>
  container_eq?: InputMaybe<Scalars['String']>
  container_gt?: InputMaybe<Scalars['String']>
  container_gte?: InputMaybe<Scalars['String']>
  container_in?: InputMaybe<Array<Scalars['String']>>
  container_isNull?: InputMaybe<Scalars['Boolean']>
  container_lt?: InputMaybe<Scalars['String']>
  container_lte?: InputMaybe<Scalars['String']>
  container_not_contains?: InputMaybe<Scalars['String']>
  container_not_containsInsensitive?: InputMaybe<Scalars['String']>
  container_not_endsWith?: InputMaybe<Scalars['String']>
  container_not_eq?: InputMaybe<Scalars['String']>
  container_not_in?: InputMaybe<Array<Scalars['String']>>
  container_not_startsWith?: InputMaybe<Scalars['String']>
  container_startsWith?: InputMaybe<Scalars['String']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  mimeMediaType_contains?: InputMaybe<Scalars['String']>
  mimeMediaType_containsInsensitive?: InputMaybe<Scalars['String']>
  mimeMediaType_endsWith?: InputMaybe<Scalars['String']>
  mimeMediaType_eq?: InputMaybe<Scalars['String']>
  mimeMediaType_gt?: InputMaybe<Scalars['String']>
  mimeMediaType_gte?: InputMaybe<Scalars['String']>
  mimeMediaType_in?: InputMaybe<Array<Scalars['String']>>
  mimeMediaType_isNull?: InputMaybe<Scalars['Boolean']>
  mimeMediaType_lt?: InputMaybe<Scalars['String']>
  mimeMediaType_lte?: InputMaybe<Scalars['String']>
  mimeMediaType_not_contains?: InputMaybe<Scalars['String']>
  mimeMediaType_not_containsInsensitive?: InputMaybe<Scalars['String']>
  mimeMediaType_not_endsWith?: InputMaybe<Scalars['String']>
  mimeMediaType_not_eq?: InputMaybe<Scalars['String']>
  mimeMediaType_not_in?: InputMaybe<Array<Scalars['String']>>
  mimeMediaType_not_startsWith?: InputMaybe<Scalars['String']>
  mimeMediaType_startsWith?: InputMaybe<Scalars['String']>
}

export type VideoMediaEncodingsConnection = {
  __typename?: 'VideoMediaEncodingsConnection'
  edges: Array<VideoMediaEncodingEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaMetadata = {
  __typename?: 'VideoMediaMetadata'
  createdInBlock: Scalars['Int']
  /** Encoding of the video media object */
  encoding?: Maybe<VideoMediaEncoding>
  /** Unique identifier */
  id: Scalars['String']
  /** Video media height in pixels */
  pixelHeight?: Maybe<Scalars['Int']>
  /** Video media width in pixels */
  pixelWidth?: Maybe<Scalars['Int']>
  /** Video media size in bytes */
  size?: Maybe<Scalars['BigInt']>
  video: Video
}

export type VideoMediaMetadataConnection = {
  __typename?: 'VideoMediaMetadataConnection'
  edges: Array<VideoMediaMetadataEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoMediaMetadataEdge = {
  __typename?: 'VideoMediaMetadataEdge'
  cursor: Scalars['String']
  node: VideoMediaMetadata
}

export enum VideoMediaMetadataOrderByInput {
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  EncodingCodecNameAsc = 'encoding_codecName_ASC',
  EncodingCodecNameDesc = 'encoding_codecName_DESC',
  EncodingContainerAsc = 'encoding_container_ASC',
  EncodingContainerDesc = 'encoding_container_DESC',
  EncodingIdAsc = 'encoding_id_ASC',
  EncodingIdDesc = 'encoding_id_DESC',
  EncodingMimeMediaTypeAsc = 'encoding_mimeMediaType_ASC',
  EncodingMimeMediaTypeDesc = 'encoding_mimeMediaType_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PixelHeightAsc = 'pixelHeight_ASC',
  PixelHeightDesc = 'pixelHeight_DESC',
  PixelWidthAsc = 'pixelWidth_ASC',
  PixelWidthDesc = 'pixelWidth_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoMediaMetadataWhereInput = {
  AND?: InputMaybe<Array<VideoMediaMetadataWhereInput>>
  OR?: InputMaybe<Array<VideoMediaMetadataWhereInput>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  createdInBlock_not_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  encoding?: InputMaybe<VideoMediaEncodingWhereInput>
  encoding_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  pixelHeight_eq?: InputMaybe<Scalars['Int']>
  pixelHeight_gt?: InputMaybe<Scalars['Int']>
  pixelHeight_gte?: InputMaybe<Scalars['Int']>
  pixelHeight_in?: InputMaybe<Array<Scalars['Int']>>
  pixelHeight_isNull?: InputMaybe<Scalars['Boolean']>
  pixelHeight_lt?: InputMaybe<Scalars['Int']>
  pixelHeight_lte?: InputMaybe<Scalars['Int']>
  pixelHeight_not_eq?: InputMaybe<Scalars['Int']>
  pixelHeight_not_in?: InputMaybe<Array<Scalars['Int']>>
  pixelWidth_eq?: InputMaybe<Scalars['Int']>
  pixelWidth_gt?: InputMaybe<Scalars['Int']>
  pixelWidth_gte?: InputMaybe<Scalars['Int']>
  pixelWidth_in?: InputMaybe<Array<Scalars['Int']>>
  pixelWidth_isNull?: InputMaybe<Scalars['Boolean']>
  pixelWidth_lt?: InputMaybe<Scalars['Int']>
  pixelWidth_lte?: InputMaybe<Scalars['Int']>
  pixelWidth_not_eq?: InputMaybe<Scalars['Int']>
  pixelWidth_not_in?: InputMaybe<Array<Scalars['Int']>>
  size_eq?: InputMaybe<Scalars['BigInt']>
  size_gt?: InputMaybe<Scalars['BigInt']>
  size_gte?: InputMaybe<Scalars['BigInt']>
  size_in?: InputMaybe<Array<Scalars['BigInt']>>
  size_isNull?: InputMaybe<Scalars['Boolean']>
  size_lt?: InputMaybe<Scalars['BigInt']>
  size_lte?: InputMaybe<Scalars['BigInt']>
  size_not_eq?: InputMaybe<Scalars['BigInt']>
  size_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export enum VideoOrderByInput {
  CategoryCreatedInBlockAsc = 'category_createdInBlock_ASC',
  CategoryCreatedInBlockDesc = 'category_createdInBlock_DESC',
  CategoryDescriptionAsc = 'category_description_ASC',
  CategoryDescriptionDesc = 'category_description_DESC',
  CategoryIdAsc = 'category_id_ASC',
  CategoryIdDesc = 'category_id_DESC',
  CategoryIsSupportedAsc = 'category_isSupported_ASC',
  CategoryIsSupportedDesc = 'category_isSupported_DESC',
  CategoryNameAsc = 'category_name_ASC',
  CategoryNameDesc = 'category_name_DESC',
  ChannelChannelStateBloatBondAsc = 'channel_channelStateBloatBond_ASC',
  ChannelChannelStateBloatBondDesc = 'channel_channelStateBloatBond_DESC',
  ChannelChannelWeightAsc = 'channel_channelWeight_ASC',
  ChannelChannelWeightDesc = 'channel_channelWeight_DESC',
  ChannelCreatedAtAsc = 'channel_createdAt_ASC',
  ChannelCreatedAtDesc = 'channel_createdAt_DESC',
  ChannelCreatedInBlockAsc = 'channel_createdInBlock_ASC',
  ChannelCreatedInBlockDesc = 'channel_createdInBlock_DESC',
  ChannelCumulativeRevenueAsc = 'channel_cumulativeRevenue_ASC',
  ChannelCumulativeRevenueDesc = 'channel_cumulativeRevenue_DESC',
  ChannelCumulativeRewardClaimedAsc = 'channel_cumulativeRewardClaimed_ASC',
  ChannelCumulativeRewardClaimedDesc = 'channel_cumulativeRewardClaimed_DESC',
  ChannelCumulativeRewardAsc = 'channel_cumulativeReward_ASC',
  ChannelCumulativeRewardDesc = 'channel_cumulativeReward_DESC',
  ChannelDescriptionAsc = 'channel_description_ASC',
  ChannelDescriptionDesc = 'channel_description_DESC',
  ChannelFollowsNumAsc = 'channel_followsNum_ASC',
  ChannelFollowsNumDesc = 'channel_followsNum_DESC',
  ChannelIdAsc = 'channel_id_ASC',
  ChannelIdDesc = 'channel_id_DESC',
  ChannelIsCensoredAsc = 'channel_isCensored_ASC',
  ChannelIsCensoredDesc = 'channel_isCensored_DESC',
  ChannelIsExcludedAsc = 'channel_isExcluded_ASC',
  ChannelIsExcludedDesc = 'channel_isExcluded_DESC',
  ChannelIsPublicAsc = 'channel_isPublic_ASC',
  ChannelIsPublicDesc = 'channel_isPublic_DESC',
  ChannelLanguageAsc = 'channel_language_ASC',
  ChannelLanguageDesc = 'channel_language_DESC',
  ChannelRevenueShareRatioPercentAsc = 'channel_revenueShareRatioPercent_ASC',
  ChannelRevenueShareRatioPercentDesc = 'channel_revenueShareRatioPercent_DESC',
  ChannelRewardAccountAsc = 'channel_rewardAccount_ASC',
  ChannelRewardAccountDesc = 'channel_rewardAccount_DESC',
  ChannelTitleAsc = 'channel_title_ASC',
  ChannelTitleDesc = 'channel_title_DESC',
  ChannelTotalVideosCreatedAsc = 'channel_totalVideosCreated_ASC',
  ChannelTotalVideosCreatedDesc = 'channel_totalVideosCreated_DESC',
  ChannelVideoViewsNumAsc = 'channel_videoViewsNum_ASC',
  ChannelVideoViewsNumDesc = 'channel_videoViewsNum_DESC',
  CommentsCountAsc = 'commentsCount_ASC',
  CommentsCountDesc = 'commentsCount_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedInBlockAsc = 'createdInBlock_ASC',
  CreatedInBlockDesc = 'createdInBlock_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  DurationAsc = 'duration_ASC',
  DurationDesc = 'duration_DESC',
  EntryAppAuthKeyAsc = 'entryApp_authKey_ASC',
  EntryAppAuthKeyDesc = 'entryApp_authKey_DESC',
  EntryAppBigIconAsc = 'entryApp_bigIcon_ASC',
  EntryAppBigIconDesc = 'entryApp_bigIcon_DESC',
  EntryAppCategoryAsc = 'entryApp_category_ASC',
  EntryAppCategoryDesc = 'entryApp_category_DESC',
  EntryAppDescriptionAsc = 'entryApp_description_ASC',
  EntryAppDescriptionDesc = 'entryApp_description_DESC',
  EntryAppIdAsc = 'entryApp_id_ASC',
  EntryAppIdDesc = 'entryApp_id_DESC',
  EntryAppMediumIconAsc = 'entryApp_mediumIcon_ASC',
  EntryAppMediumIconDesc = 'entryApp_mediumIcon_DESC',
  EntryAppNameAsc = 'entryApp_name_ASC',
  EntryAppNameDesc = 'entryApp_name_DESC',
  EntryAppOneLinerAsc = 'entryApp_oneLiner_ASC',
  EntryAppOneLinerDesc = 'entryApp_oneLiner_DESC',
  EntryAppSmallIconAsc = 'entryApp_smallIcon_ASC',
  EntryAppSmallIconDesc = 'entryApp_smallIcon_DESC',
  EntryAppTermsOfServiceAsc = 'entryApp_termsOfService_ASC',
  EntryAppTermsOfServiceDesc = 'entryApp_termsOfService_DESC',
  EntryAppUseUriAsc = 'entryApp_useUri_ASC',
  EntryAppUseUriDesc = 'entryApp_useUri_DESC',
  EntryAppWebsiteUrlAsc = 'entryApp_websiteUrl_ASC',
  EntryAppWebsiteUrlDesc = 'entryApp_websiteUrl_DESC',
  HasMarketingAsc = 'hasMarketing_ASC',
  HasMarketingDesc = 'hasMarketing_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IncludeInHomeFeedAsc = 'includeInHomeFeed_ASC',
  IncludeInHomeFeedDesc = 'includeInHomeFeed_DESC',
  IsCensoredAsc = 'isCensored_ASC',
  IsCensoredDesc = 'isCensored_DESC',
  IsCommentSectionEnabledAsc = 'isCommentSectionEnabled_ASC',
  IsCommentSectionEnabledDesc = 'isCommentSectionEnabled_DESC',
  IsExcludedAsc = 'isExcluded_ASC',
  IsExcludedDesc = 'isExcluded_DESC',
  IsExplicitAsc = 'isExplicit_ASC',
  IsExplicitDesc = 'isExplicit_DESC',
  IsPublicAsc = 'isPublic_ASC',
  IsPublicDesc = 'isPublic_DESC',
  IsReactionFeatureEnabledAsc = 'isReactionFeatureEnabled_ASC',
  IsReactionFeatureEnabledDesc = 'isReactionFeatureEnabled_DESC',
  IsShortDerivedAsc = 'isShortDerived_ASC',
  IsShortDerivedDesc = 'isShortDerived_DESC',
  IsShortAsc = 'isShort_ASC',
  IsShortDesc = 'isShort_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  LicenseAttributionAsc = 'license_attribution_ASC',
  LicenseAttributionDesc = 'license_attribution_DESC',
  LicenseCodeAsc = 'license_code_ASC',
  LicenseCodeDesc = 'license_code_DESC',
  LicenseCustomTextAsc = 'license_customText_ASC',
  LicenseCustomTextDesc = 'license_customText_DESC',
  LicenseIdAsc = 'license_id_ASC',
  LicenseIdDesc = 'license_id_DESC',
  MediaMetadataCreatedInBlockAsc = 'mediaMetadata_createdInBlock_ASC',
  MediaMetadataCreatedInBlockDesc = 'mediaMetadata_createdInBlock_DESC',
  MediaMetadataIdAsc = 'mediaMetadata_id_ASC',
  MediaMetadataIdDesc = 'mediaMetadata_id_DESC',
  MediaMetadataPixelHeightAsc = 'mediaMetadata_pixelHeight_ASC',
  MediaMetadataPixelHeightDesc = 'mediaMetadata_pixelHeight_DESC',
  MediaMetadataPixelWidthAsc = 'mediaMetadata_pixelWidth_ASC',
  MediaMetadataPixelWidthDesc = 'mediaMetadata_pixelWidth_DESC',
  MediaMetadataSizeAsc = 'mediaMetadata_size_ASC',
  MediaMetadataSizeDesc = 'mediaMetadata_size_DESC',
  MediaCreatedAtAsc = 'media_createdAt_ASC',
  MediaCreatedAtDesc = 'media_createdAt_DESC',
  MediaIdAsc = 'media_id_ASC',
  MediaIdDesc = 'media_id_DESC',
  MediaIpfsHashAsc = 'media_ipfsHash_ASC',
  MediaIpfsHashDesc = 'media_ipfsHash_DESC',
  MediaIsAcceptedAsc = 'media_isAccepted_ASC',
  MediaIsAcceptedDesc = 'media_isAccepted_DESC',
  MediaSizeAsc = 'media_size_ASC',
  MediaSizeDesc = 'media_size_DESC',
  MediaStateBloatBondAsc = 'media_stateBloatBond_ASC',
  MediaStateBloatBondDesc = 'media_stateBloatBond_DESC',
  MediaUnsetAtAsc = 'media_unsetAt_ASC',
  MediaUnsetAtDesc = 'media_unsetAt_DESC',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatorRoyaltyAsc = 'nft_creatorRoyalty_ASC',
  NftCreatorRoyaltyDesc = 'nft_creatorRoyalty_DESC',
  NftIdAsc = 'nft_id_ASC',
  NftIdDesc = 'nft_id_DESC',
  NftIsFeaturedAsc = 'nft_isFeatured_ASC',
  NftIsFeaturedDesc = 'nft_isFeatured_DESC',
  NftLastSaleDateAsc = 'nft_lastSaleDate_ASC',
  NftLastSaleDateDesc = 'nft_lastSaleDate_DESC',
  NftLastSalePriceAsc = 'nft_lastSalePrice_ASC',
  NftLastSalePriceDesc = 'nft_lastSalePrice_DESC',
  OrionLanguageAsc = 'orionLanguage_ASC',
  OrionLanguageDesc = 'orionLanguage_DESC',
  PinnedCommentCreatedAtAsc = 'pinnedComment_createdAt_ASC',
  PinnedCommentCreatedAtDesc = 'pinnedComment_createdAt_DESC',
  PinnedCommentIdAsc = 'pinnedComment_id_ASC',
  PinnedCommentIdDesc = 'pinnedComment_id_DESC',
  PinnedCommentIsEditedAsc = 'pinnedComment_isEdited_ASC',
  PinnedCommentIsEditedDesc = 'pinnedComment_isEdited_DESC',
  PinnedCommentIsExcludedAsc = 'pinnedComment_isExcluded_ASC',
  PinnedCommentIsExcludedDesc = 'pinnedComment_isExcluded_DESC',
  PinnedCommentReactionsAndRepliesCountAsc = 'pinnedComment_reactionsAndRepliesCount_ASC',
  PinnedCommentReactionsAndRepliesCountDesc = 'pinnedComment_reactionsAndRepliesCount_DESC',
  PinnedCommentReactionsCountAsc = 'pinnedComment_reactionsCount_ASC',
  PinnedCommentReactionsCountDesc = 'pinnedComment_reactionsCount_DESC',
  PinnedCommentRepliesCountAsc = 'pinnedComment_repliesCount_ASC',
  PinnedCommentRepliesCountDesc = 'pinnedComment_repliesCount_DESC',
  PinnedCommentSortPriorityAsc = 'pinnedComment_sortPriority_ASC',
  PinnedCommentSortPriorityDesc = 'pinnedComment_sortPriority_DESC',
  PinnedCommentStatusAsc = 'pinnedComment_status_ASC',
  PinnedCommentStatusDesc = 'pinnedComment_status_DESC',
  PinnedCommentTextAsc = 'pinnedComment_text_ASC',
  PinnedCommentTextDesc = 'pinnedComment_text_DESC',
  PinnedCommentTipAmountAsc = 'pinnedComment_tipAmount_ASC',
  PinnedCommentTipAmountDesc = 'pinnedComment_tipAmount_DESC',
  PinnedCommentTipTierAsc = 'pinnedComment_tipTier_ASC',
  PinnedCommentTipTierDesc = 'pinnedComment_tipTier_DESC',
  PublishedBeforeJoystreamAsc = 'publishedBeforeJoystream_ASC',
  PublishedBeforeJoystreamDesc = 'publishedBeforeJoystream_DESC',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountDesc = 'reactionsCount_DESC',
  ThumbnailPhotoCreatedAtAsc = 'thumbnailPhoto_createdAt_ASC',
  ThumbnailPhotoCreatedAtDesc = 'thumbnailPhoto_createdAt_DESC',
  ThumbnailPhotoIdAsc = 'thumbnailPhoto_id_ASC',
  ThumbnailPhotoIdDesc = 'thumbnailPhoto_id_DESC',
  ThumbnailPhotoIpfsHashAsc = 'thumbnailPhoto_ipfsHash_ASC',
  ThumbnailPhotoIpfsHashDesc = 'thumbnailPhoto_ipfsHash_DESC',
  ThumbnailPhotoIsAcceptedAsc = 'thumbnailPhoto_isAccepted_ASC',
  ThumbnailPhotoIsAcceptedDesc = 'thumbnailPhoto_isAccepted_DESC',
  ThumbnailPhotoSizeAsc = 'thumbnailPhoto_size_ASC',
  ThumbnailPhotoSizeDesc = 'thumbnailPhoto_size_DESC',
  ThumbnailPhotoStateBloatBondAsc = 'thumbnailPhoto_stateBloatBond_ASC',
  ThumbnailPhotoStateBloatBondDesc = 'thumbnailPhoto_stateBloatBond_DESC',
  ThumbnailPhotoUnsetAtAsc = 'thumbnailPhoto_unsetAt_ASC',
  ThumbnailPhotoUnsetAtDesc = 'thumbnailPhoto_unsetAt_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  VideoRelevanceAsc = 'videoRelevance_ASC',
  VideoRelevanceDesc = 'videoRelevance_DESC',
  VideoStateBloatBondAsc = 'videoStateBloatBond_ASC',
  VideoStateBloatBondDesc = 'videoStateBloatBond_DESC',
  ViewsNumAsc = 'viewsNum_ASC',
  ViewsNumDesc = 'viewsNum_DESC',
  YtVideoIdAsc = 'ytVideoId_ASC',
  YtVideoIdDesc = 'ytVideoId_DESC',
}

export type VideoPosted = {
  __typename?: 'VideoPosted'
  /** id for the channel used in link construction */
  channelId: Scalars['String']
  /** channel title for notification text */
  channelTitle: Scalars['String']
  /** video Id used for link */
  videoId: Scalars['String']
  /** video title for notification text */
  videoTitle: Scalars['String']
}

export type VideoReaction = {
  __typename?: 'VideoReaction'
  /** Timestamp of the block the reaction was created at */
  createdAt: Scalars['DateTime']
  /** {memberId}-{videoId} */
  id: Scalars['String']
  /** The member that reacted */
  member: Membership
  /** The Reaction */
  reaction: VideoReactionOptions
  /** The video that has been reacted to */
  video: Video
}

export type VideoReactionEdge = {
  __typename?: 'VideoReactionEdge'
  cursor: Scalars['String']
  node: VideoReaction
}

export type VideoReactionEventData = {
  __typename?: 'VideoReactionEventData'
  /** video reaction reference */
  videoReaction: VideoReaction
}

export enum VideoReactionOptions {
  Like = 'LIKE',
  Unlike = 'UNLIKE',
}

export enum VideoReactionOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberControllerAccountAsc = 'member_controllerAccount_ASC',
  MemberControllerAccountDesc = 'member_controllerAccount_DESC',
  MemberCreatedAtAsc = 'member_createdAt_ASC',
  MemberCreatedAtDesc = 'member_createdAt_DESC',
  MemberHandleRawAsc = 'member_handleRaw_ASC',
  MemberHandleRawDesc = 'member_handleRaw_DESC',
  MemberHandleAsc = 'member_handle_ASC',
  MemberHandleDesc = 'member_handle_DESC',
  MemberIdAsc = 'member_id_ASC',
  MemberIdDesc = 'member_id_DESC',
  MemberTotalChannelsCreatedAsc = 'member_totalChannelsCreated_ASC',
  MemberTotalChannelsCreatedDesc = 'member_totalChannelsCreated_DESC',
  ReactionAsc = 'reaction_ASC',
  ReactionDesc = 'reaction_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoReactionWhereInput = {
  AND?: InputMaybe<Array<VideoReactionWhereInput>>
  OR?: InputMaybe<Array<VideoReactionWhereInput>>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  member?: InputMaybe<MembershipWhereInput>
  member_isNull?: InputMaybe<Scalars['Boolean']>
  reaction_eq?: InputMaybe<VideoReactionOptions>
  reaction_in?: InputMaybe<Array<VideoReactionOptions>>
  reaction_isNull?: InputMaybe<Scalars['Boolean']>
  reaction_not_eq?: InputMaybe<VideoReactionOptions>
  reaction_not_in?: InputMaybe<Array<VideoReactionOptions>>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VideoReactionsConnection = {
  __typename?: 'VideoReactionsConnection'
  edges: Array<VideoReactionEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoReactionsCountByReactionType = {
  __typename?: 'VideoReactionsCountByReactionType'
  /** No of times the video has been reacted with given reaction */
  count: Scalars['Int']
  /** The reaction option */
  reaction: VideoReactionOptions
}

export type VideoReportInfo = {
  __typename?: 'VideoReportInfo'
  created: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['String']
  rationale: Scalars['String']
  videoId: Scalars['String']
}

export type VideoSubtitle = {
  __typename?: 'VideoSubtitle'
  /** Storage object representing the subtitle file */
  asset?: Maybe<StorageDataObject>
  /** {type}-{language} */
  id: Scalars['String']
  /** Subtitle's language */
  language?: Maybe<Scalars['String']>
  /** MIME type description of format used for this subtitle */
  mimeType: Scalars['String']
  /** Subtitle's type */
  type: Scalars['String']
  /** Subtitle's video */
  video: Video
}

export type VideoSubtitleEdge = {
  __typename?: 'VideoSubtitleEdge'
  cursor: Scalars['String']
  node: VideoSubtitle
}

export enum VideoSubtitleOrderByInput {
  AssetCreatedAtAsc = 'asset_createdAt_ASC',
  AssetCreatedAtDesc = 'asset_createdAt_DESC',
  AssetIdAsc = 'asset_id_ASC',
  AssetIdDesc = 'asset_id_DESC',
  AssetIpfsHashAsc = 'asset_ipfsHash_ASC',
  AssetIpfsHashDesc = 'asset_ipfsHash_DESC',
  AssetIsAcceptedAsc = 'asset_isAccepted_ASC',
  AssetIsAcceptedDesc = 'asset_isAccepted_DESC',
  AssetSizeAsc = 'asset_size_ASC',
  AssetSizeDesc = 'asset_size_DESC',
  AssetStateBloatBondAsc = 'asset_stateBloatBond_ASC',
  AssetStateBloatBondDesc = 'asset_stateBloatBond_DESC',
  AssetUnsetAtAsc = 'asset_unsetAt_ASC',
  AssetUnsetAtDesc = 'asset_unsetAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  MimeTypeAsc = 'mimeType_ASC',
  MimeTypeDesc = 'mimeType_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  VideoCommentsCountAsc = 'video_commentsCount_ASC',
  VideoCommentsCountDesc = 'video_commentsCount_DESC',
  VideoCreatedAtAsc = 'video_createdAt_ASC',
  VideoCreatedAtDesc = 'video_createdAt_DESC',
  VideoCreatedInBlockAsc = 'video_createdInBlock_ASC',
  VideoCreatedInBlockDesc = 'video_createdInBlock_DESC',
  VideoDescriptionAsc = 'video_description_ASC',
  VideoDescriptionDesc = 'video_description_DESC',
  VideoDurationAsc = 'video_duration_ASC',
  VideoDurationDesc = 'video_duration_DESC',
  VideoHasMarketingAsc = 'video_hasMarketing_ASC',
  VideoHasMarketingDesc = 'video_hasMarketing_DESC',
  VideoIdAsc = 'video_id_ASC',
  VideoIdDesc = 'video_id_DESC',
  VideoIncludeInHomeFeedAsc = 'video_includeInHomeFeed_ASC',
  VideoIncludeInHomeFeedDesc = 'video_includeInHomeFeed_DESC',
  VideoIsCensoredAsc = 'video_isCensored_ASC',
  VideoIsCensoredDesc = 'video_isCensored_DESC',
  VideoIsCommentSectionEnabledAsc = 'video_isCommentSectionEnabled_ASC',
  VideoIsCommentSectionEnabledDesc = 'video_isCommentSectionEnabled_DESC',
  VideoIsExcludedAsc = 'video_isExcluded_ASC',
  VideoIsExcludedDesc = 'video_isExcluded_DESC',
  VideoIsExplicitAsc = 'video_isExplicit_ASC',
  VideoIsExplicitDesc = 'video_isExplicit_DESC',
  VideoIsPublicAsc = 'video_isPublic_ASC',
  VideoIsPublicDesc = 'video_isPublic_DESC',
  VideoIsReactionFeatureEnabledAsc = 'video_isReactionFeatureEnabled_ASC',
  VideoIsReactionFeatureEnabledDesc = 'video_isReactionFeatureEnabled_DESC',
  VideoIsShortDerivedAsc = 'video_isShortDerived_ASC',
  VideoIsShortDerivedDesc = 'video_isShortDerived_DESC',
  VideoIsShortAsc = 'video_isShort_ASC',
  VideoIsShortDesc = 'video_isShort_DESC',
  VideoLanguageAsc = 'video_language_ASC',
  VideoLanguageDesc = 'video_language_DESC',
  VideoOrionLanguageAsc = 'video_orionLanguage_ASC',
  VideoOrionLanguageDesc = 'video_orionLanguage_DESC',
  VideoPublishedBeforeJoystreamAsc = 'video_publishedBeforeJoystream_ASC',
  VideoPublishedBeforeJoystreamDesc = 'video_publishedBeforeJoystream_DESC',
  VideoReactionsCountAsc = 'video_reactionsCount_ASC',
  VideoReactionsCountDesc = 'video_reactionsCount_DESC',
  VideoTitleAsc = 'video_title_ASC',
  VideoTitleDesc = 'video_title_DESC',
  VideoVideoRelevanceAsc = 'video_videoRelevance_ASC',
  VideoVideoRelevanceDesc = 'video_videoRelevance_DESC',
  VideoVideoStateBloatBondAsc = 'video_videoStateBloatBond_ASC',
  VideoVideoStateBloatBondDesc = 'video_videoStateBloatBond_DESC',
  VideoViewsNumAsc = 'video_viewsNum_ASC',
  VideoViewsNumDesc = 'video_viewsNum_DESC',
  VideoYtVideoIdAsc = 'video_ytVideoId_ASC',
  VideoYtVideoIdDesc = 'video_ytVideoId_DESC',
}

export type VideoSubtitleWhereInput = {
  AND?: InputMaybe<Array<VideoSubtitleWhereInput>>
  OR?: InputMaybe<Array<VideoSubtitleWhereInput>>
  asset?: InputMaybe<StorageDataObjectWhereInput>
  asset_isNull?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  language_contains?: InputMaybe<Scalars['String']>
  language_containsInsensitive?: InputMaybe<Scalars['String']>
  language_endsWith?: InputMaybe<Scalars['String']>
  language_eq?: InputMaybe<Scalars['String']>
  language_gt?: InputMaybe<Scalars['String']>
  language_gte?: InputMaybe<Scalars['String']>
  language_in?: InputMaybe<Array<Scalars['String']>>
  language_isNull?: InputMaybe<Scalars['Boolean']>
  language_lt?: InputMaybe<Scalars['String']>
  language_lte?: InputMaybe<Scalars['String']>
  language_not_contains?: InputMaybe<Scalars['String']>
  language_not_containsInsensitive?: InputMaybe<Scalars['String']>
  language_not_endsWith?: InputMaybe<Scalars['String']>
  language_not_eq?: InputMaybe<Scalars['String']>
  language_not_in?: InputMaybe<Array<Scalars['String']>>
  language_not_startsWith?: InputMaybe<Scalars['String']>
  language_startsWith?: InputMaybe<Scalars['String']>
  mimeType_contains?: InputMaybe<Scalars['String']>
  mimeType_containsInsensitive?: InputMaybe<Scalars['String']>
  mimeType_endsWith?: InputMaybe<Scalars['String']>
  mimeType_eq?: InputMaybe<Scalars['String']>
  mimeType_gt?: InputMaybe<Scalars['String']>
  mimeType_gte?: InputMaybe<Scalars['String']>
  mimeType_in?: InputMaybe<Array<Scalars['String']>>
  mimeType_isNull?: InputMaybe<Scalars['Boolean']>
  mimeType_lt?: InputMaybe<Scalars['String']>
  mimeType_lte?: InputMaybe<Scalars['String']>
  mimeType_not_contains?: InputMaybe<Scalars['String']>
  mimeType_not_containsInsensitive?: InputMaybe<Scalars['String']>
  mimeType_not_endsWith?: InputMaybe<Scalars['String']>
  mimeType_not_eq?: InputMaybe<Scalars['String']>
  mimeType_not_in?: InputMaybe<Array<Scalars['String']>>
  mimeType_not_startsWith?: InputMaybe<Scalars['String']>
  mimeType_startsWith?: InputMaybe<Scalars['String']>
  type_contains?: InputMaybe<Scalars['String']>
  type_containsInsensitive?: InputMaybe<Scalars['String']>
  type_endsWith?: InputMaybe<Scalars['String']>
  type_eq?: InputMaybe<Scalars['String']>
  type_gt?: InputMaybe<Scalars['String']>
  type_gte?: InputMaybe<Scalars['String']>
  type_in?: InputMaybe<Array<Scalars['String']>>
  type_isNull?: InputMaybe<Scalars['Boolean']>
  type_lt?: InputMaybe<Scalars['String']>
  type_lte?: InputMaybe<Scalars['String']>
  type_not_contains?: InputMaybe<Scalars['String']>
  type_not_containsInsensitive?: InputMaybe<Scalars['String']>
  type_not_endsWith?: InputMaybe<Scalars['String']>
  type_not_eq?: InputMaybe<Scalars['String']>
  type_not_in?: InputMaybe<Array<Scalars['String']>>
  type_not_startsWith?: InputMaybe<Scalars['String']>
  type_startsWith?: InputMaybe<Scalars['String']>
  video?: InputMaybe<VideoWhereInput>
  video_isNull?: InputMaybe<Scalars['Boolean']>
}

export type VideoSubtitlesConnection = {
  __typename?: 'VideoSubtitlesConnection'
  edges: Array<VideoSubtitleEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoViewEvent = {
  __typename?: 'VideoViewEvent'
  /** Unique identifier of the video view event */
  id: Scalars['String']
  /** Video view event timestamp */
  timestamp: Scalars['DateTime']
  /** User that viewed the video */
  user: User
  /** ID of the video that was viewed (the video may no longer exist) */
  videoId: Scalars['String']
}

export type VideoViewEventEdge = {
  __typename?: 'VideoViewEventEdge'
  cursor: Scalars['String']
  node: VideoViewEvent
}

export enum VideoViewEventOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  UserIdAsc = 'user_id_ASC',
  UserIdDesc = 'user_id_DESC',
  UserIsRootAsc = 'user_isRoot_ASC',
  UserIsRootDesc = 'user_isRoot_DESC',
  VideoIdAsc = 'videoId_ASC',
  VideoIdDesc = 'videoId_DESC',
}

export type VideoViewEventWhereInput = {
  AND?: InputMaybe<Array<VideoViewEventWhereInput>>
  OR?: InputMaybe<Array<VideoViewEventWhereInput>>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  timestamp_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_gt?: InputMaybe<Scalars['DateTime']>
  timestamp_gte?: InputMaybe<Scalars['DateTime']>
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']>>
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>
  timestamp_lt?: InputMaybe<Scalars['DateTime']>
  timestamp_lte?: InputMaybe<Scalars['DateTime']>
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']>
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  user?: InputMaybe<UserWhereInput>
  user_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_contains?: InputMaybe<Scalars['String']>
  videoId_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_endsWith?: InputMaybe<Scalars['String']>
  videoId_eq?: InputMaybe<Scalars['String']>
  videoId_gt?: InputMaybe<Scalars['String']>
  videoId_gte?: InputMaybe<Scalars['String']>
  videoId_in?: InputMaybe<Array<Scalars['String']>>
  videoId_isNull?: InputMaybe<Scalars['Boolean']>
  videoId_lt?: InputMaybe<Scalars['String']>
  videoId_lte?: InputMaybe<Scalars['String']>
  videoId_not_contains?: InputMaybe<Scalars['String']>
  videoId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  videoId_not_endsWith?: InputMaybe<Scalars['String']>
  videoId_not_eq?: InputMaybe<Scalars['String']>
  videoId_not_in?: InputMaybe<Array<Scalars['String']>>
  videoId_not_startsWith?: InputMaybe<Scalars['String']>
  videoId_startsWith?: InputMaybe<Scalars['String']>
}

export type VideoViewEventsConnection = {
  __typename?: 'VideoViewEventsConnection'
  edges: Array<VideoViewEventEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideoViewPerUserTimeLimit = {
  __typename?: 'VideoViewPerUserTimeLimit'
  limitInSeconds: Scalars['Int']
}

export type VideoWeights = {
  __typename?: 'VideoWeights'
  isApplied: Scalars['Boolean']
}

export type VideoWhereInput = {
  AND?: InputMaybe<Array<VideoWhereInput>>
  OR?: InputMaybe<Array<VideoWhereInput>>
  category?: InputMaybe<VideoCategoryWhereInput>
  category_isNull?: InputMaybe<Scalars['Boolean']>
  channel?: InputMaybe<ChannelWhereInput>
  channel_isNull?: InputMaybe<Scalars['Boolean']>
  commentsCount_eq?: InputMaybe<Scalars['Int']>
  commentsCount_gt?: InputMaybe<Scalars['Int']>
  commentsCount_gte?: InputMaybe<Scalars['Int']>
  commentsCount_in?: InputMaybe<Array<Scalars['Int']>>
  commentsCount_isNull?: InputMaybe<Scalars['Boolean']>
  commentsCount_lt?: InputMaybe<Scalars['Int']>
  commentsCount_lte?: InputMaybe<Scalars['Int']>
  commentsCount_not_eq?: InputMaybe<Scalars['Int']>
  commentsCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  comments_every?: InputMaybe<CommentWhereInput>
  comments_none?: InputMaybe<CommentWhereInput>
  comments_some?: InputMaybe<CommentWhereInput>
  createdAt_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  createdAt_not_eq?: InputMaybe<Scalars['DateTime']>
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdInBlock_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_gt?: InputMaybe<Scalars['Int']>
  createdInBlock_gte?: InputMaybe<Scalars['Int']>
  createdInBlock_in?: InputMaybe<Array<Scalars['Int']>>
  createdInBlock_isNull?: InputMaybe<Scalars['Boolean']>
  createdInBlock_lt?: InputMaybe<Scalars['Int']>
  createdInBlock_lte?: InputMaybe<Scalars['Int']>
  createdInBlock_not_eq?: InputMaybe<Scalars['Int']>
  createdInBlock_not_in?: InputMaybe<Array<Scalars['Int']>>
  description_contains?: InputMaybe<Scalars['String']>
  description_containsInsensitive?: InputMaybe<Scalars['String']>
  description_endsWith?: InputMaybe<Scalars['String']>
  description_eq?: InputMaybe<Scalars['String']>
  description_gt?: InputMaybe<Scalars['String']>
  description_gte?: InputMaybe<Scalars['String']>
  description_in?: InputMaybe<Array<Scalars['String']>>
  description_isNull?: InputMaybe<Scalars['Boolean']>
  description_lt?: InputMaybe<Scalars['String']>
  description_lte?: InputMaybe<Scalars['String']>
  description_not_contains?: InputMaybe<Scalars['String']>
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>
  description_not_endsWith?: InputMaybe<Scalars['String']>
  description_not_eq?: InputMaybe<Scalars['String']>
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  description_not_startsWith?: InputMaybe<Scalars['String']>
  description_startsWith?: InputMaybe<Scalars['String']>
  duration_eq?: InputMaybe<Scalars['Int']>
  duration_gt?: InputMaybe<Scalars['Int']>
  duration_gte?: InputMaybe<Scalars['Int']>
  duration_in?: InputMaybe<Array<Scalars['Int']>>
  duration_isNull?: InputMaybe<Scalars['Boolean']>
  duration_lt?: InputMaybe<Scalars['Int']>
  duration_lte?: InputMaybe<Scalars['Int']>
  duration_not_eq?: InputMaybe<Scalars['Int']>
  duration_not_in?: InputMaybe<Array<Scalars['Int']>>
  entryApp?: InputMaybe<AppWhereInput>
  entryApp_isNull?: InputMaybe<Scalars['Boolean']>
  hasMarketing_eq?: InputMaybe<Scalars['Boolean']>
  hasMarketing_isNull?: InputMaybe<Scalars['Boolean']>
  hasMarketing_not_eq?: InputMaybe<Scalars['Boolean']>
  id_contains?: InputMaybe<Scalars['String']>
  id_containsInsensitive?: InputMaybe<Scalars['String']>
  id_endsWith?: InputMaybe<Scalars['String']>
  id_eq?: InputMaybe<Scalars['String']>
  id_gt?: InputMaybe<Scalars['String']>
  id_gte?: InputMaybe<Scalars['String']>
  id_in?: InputMaybe<Array<Scalars['String']>>
  id_isNull?: InputMaybe<Scalars['Boolean']>
  id_lt?: InputMaybe<Scalars['String']>
  id_lte?: InputMaybe<Scalars['String']>
  id_not_contains?: InputMaybe<Scalars['String']>
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>
  id_not_endsWith?: InputMaybe<Scalars['String']>
  id_not_eq?: InputMaybe<Scalars['String']>
  id_not_in?: InputMaybe<Array<Scalars['String']>>
  id_not_startsWith?: InputMaybe<Scalars['String']>
  id_startsWith?: InputMaybe<Scalars['String']>
  includeInHomeFeed_eq?: InputMaybe<Scalars['Boolean']>
  includeInHomeFeed_isNull?: InputMaybe<Scalars['Boolean']>
  includeInHomeFeed_not_eq?: InputMaybe<Scalars['Boolean']>
  isCensored_eq?: InputMaybe<Scalars['Boolean']>
  isCensored_isNull?: InputMaybe<Scalars['Boolean']>
  isCensored_not_eq?: InputMaybe<Scalars['Boolean']>
  isCommentSectionEnabled_eq?: InputMaybe<Scalars['Boolean']>
  isCommentSectionEnabled_isNull?: InputMaybe<Scalars['Boolean']>
  isCommentSectionEnabled_not_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_eq?: InputMaybe<Scalars['Boolean']>
  isExcluded_isNull?: InputMaybe<Scalars['Boolean']>
  isExcluded_not_eq?: InputMaybe<Scalars['Boolean']>
  isExplicit_eq?: InputMaybe<Scalars['Boolean']>
  isExplicit_isNull?: InputMaybe<Scalars['Boolean']>
  isExplicit_not_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_eq?: InputMaybe<Scalars['Boolean']>
  isPublic_isNull?: InputMaybe<Scalars['Boolean']>
  isPublic_not_eq?: InputMaybe<Scalars['Boolean']>
  isReactionFeatureEnabled_eq?: InputMaybe<Scalars['Boolean']>
  isReactionFeatureEnabled_isNull?: InputMaybe<Scalars['Boolean']>
  isReactionFeatureEnabled_not_eq?: InputMaybe<Scalars['Boolean']>
  isShortDerived_eq?: InputMaybe<Scalars['Boolean']>
  isShortDerived_isNull?: InputMaybe<Scalars['Boolean']>
  isShortDerived_not_eq?: InputMaybe<Scalars['Boolean']>
  isShort_eq?: InputMaybe<Scalars['Boolean']>
  isShort_isNull?: InputMaybe<Scalars['Boolean']>
  isShort_not_eq?: InputMaybe<Scalars['Boolean']>
  language_contains?: InputMaybe<Scalars['String']>
  language_containsInsensitive?: InputMaybe<Scalars['String']>
  language_endsWith?: InputMaybe<Scalars['String']>
  language_eq?: InputMaybe<Scalars['String']>
  language_gt?: InputMaybe<Scalars['String']>
  language_gte?: InputMaybe<Scalars['String']>
  language_in?: InputMaybe<Array<Scalars['String']>>
  language_isNull?: InputMaybe<Scalars['Boolean']>
  language_lt?: InputMaybe<Scalars['String']>
  language_lte?: InputMaybe<Scalars['String']>
  language_not_contains?: InputMaybe<Scalars['String']>
  language_not_containsInsensitive?: InputMaybe<Scalars['String']>
  language_not_endsWith?: InputMaybe<Scalars['String']>
  language_not_eq?: InputMaybe<Scalars['String']>
  language_not_in?: InputMaybe<Array<Scalars['String']>>
  language_not_startsWith?: InputMaybe<Scalars['String']>
  language_startsWith?: InputMaybe<Scalars['String']>
  license?: InputMaybe<LicenseWhereInput>
  license_isNull?: InputMaybe<Scalars['Boolean']>
  media?: InputMaybe<StorageDataObjectWhereInput>
  mediaMetadata?: InputMaybe<VideoMediaMetadataWhereInput>
  mediaMetadata_isNull?: InputMaybe<Scalars['Boolean']>
  media_isNull?: InputMaybe<Scalars['Boolean']>
  nft?: InputMaybe<OwnedNftWhereInput>
  nft_isNull?: InputMaybe<Scalars['Boolean']>
  orionLanguage_contains?: InputMaybe<Scalars['String']>
  orionLanguage_containsInsensitive?: InputMaybe<Scalars['String']>
  orionLanguage_endsWith?: InputMaybe<Scalars['String']>
  orionLanguage_eq?: InputMaybe<Scalars['String']>
  orionLanguage_gt?: InputMaybe<Scalars['String']>
  orionLanguage_gte?: InputMaybe<Scalars['String']>
  orionLanguage_in?: InputMaybe<Array<Scalars['String']>>
  orionLanguage_isNull?: InputMaybe<Scalars['Boolean']>
  orionLanguage_lt?: InputMaybe<Scalars['String']>
  orionLanguage_lte?: InputMaybe<Scalars['String']>
  orionLanguage_not_contains?: InputMaybe<Scalars['String']>
  orionLanguage_not_containsInsensitive?: InputMaybe<Scalars['String']>
  orionLanguage_not_endsWith?: InputMaybe<Scalars['String']>
  orionLanguage_not_eq?: InputMaybe<Scalars['String']>
  orionLanguage_not_in?: InputMaybe<Array<Scalars['String']>>
  orionLanguage_not_startsWith?: InputMaybe<Scalars['String']>
  orionLanguage_startsWith?: InputMaybe<Scalars['String']>
  pinnedComment?: InputMaybe<CommentWhereInput>
  pinnedComment_isNull?: InputMaybe<Scalars['Boolean']>
  publishedBeforeJoystream_eq?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_gt?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_gte?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBeforeJoystream_isNull?: InputMaybe<Scalars['Boolean']>
  publishedBeforeJoystream_lt?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_lte?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_not_eq?: InputMaybe<Scalars['DateTime']>
  publishedBeforeJoystream_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  reactionsCountByReactionId_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsCount_eq?: InputMaybe<Scalars['Int']>
  reactionsCount_gt?: InputMaybe<Scalars['Int']>
  reactionsCount_gte?: InputMaybe<Scalars['Int']>
  reactionsCount_in?: InputMaybe<Array<Scalars['Int']>>
  reactionsCount_isNull?: InputMaybe<Scalars['Boolean']>
  reactionsCount_lt?: InputMaybe<Scalars['Int']>
  reactionsCount_lte?: InputMaybe<Scalars['Int']>
  reactionsCount_not_eq?: InputMaybe<Scalars['Int']>
  reactionsCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  reactions_every?: InputMaybe<VideoReactionWhereInput>
  reactions_none?: InputMaybe<VideoReactionWhereInput>
  reactions_some?: InputMaybe<VideoReactionWhereInput>
  subtitles_every?: InputMaybe<VideoSubtitleWhereInput>
  subtitles_none?: InputMaybe<VideoSubtitleWhereInput>
  subtitles_some?: InputMaybe<VideoSubtitleWhereInput>
  thumbnailPhoto?: InputMaybe<StorageDataObjectWhereInput>
  thumbnailPhoto_isNull?: InputMaybe<Scalars['Boolean']>
  title_contains?: InputMaybe<Scalars['String']>
  title_containsInsensitive?: InputMaybe<Scalars['String']>
  title_endsWith?: InputMaybe<Scalars['String']>
  title_eq?: InputMaybe<Scalars['String']>
  title_gt?: InputMaybe<Scalars['String']>
  title_gte?: InputMaybe<Scalars['String']>
  title_in?: InputMaybe<Array<Scalars['String']>>
  title_isNull?: InputMaybe<Scalars['Boolean']>
  title_lt?: InputMaybe<Scalars['String']>
  title_lte?: InputMaybe<Scalars['String']>
  title_not_contains?: InputMaybe<Scalars['String']>
  title_not_containsInsensitive?: InputMaybe<Scalars['String']>
  title_not_endsWith?: InputMaybe<Scalars['String']>
  title_not_eq?: InputMaybe<Scalars['String']>
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  title_not_startsWith?: InputMaybe<Scalars['String']>
  title_startsWith?: InputMaybe<Scalars['String']>
  trailerVideoForToken_every?: InputMaybe<TrailerVideoWhereInput>
  trailerVideoForToken_none?: InputMaybe<TrailerVideoWhereInput>
  trailerVideoForToken_some?: InputMaybe<TrailerVideoWhereInput>
  videoRelevance_eq?: InputMaybe<Scalars['Float']>
  videoRelevance_gt?: InputMaybe<Scalars['Float']>
  videoRelevance_gte?: InputMaybe<Scalars['Float']>
  videoRelevance_in?: InputMaybe<Array<Scalars['Float']>>
  videoRelevance_isNull?: InputMaybe<Scalars['Boolean']>
  videoRelevance_lt?: InputMaybe<Scalars['Float']>
  videoRelevance_lte?: InputMaybe<Scalars['Float']>
  videoRelevance_not_eq?: InputMaybe<Scalars['Float']>
  videoRelevance_not_in?: InputMaybe<Array<Scalars['Float']>>
  videoStateBloatBond_eq?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_gt?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_gte?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_in?: InputMaybe<Array<Scalars['BigInt']>>
  videoStateBloatBond_isNull?: InputMaybe<Scalars['Boolean']>
  videoStateBloatBond_lt?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_lte?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_not_eq?: InputMaybe<Scalars['BigInt']>
  videoStateBloatBond_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  viewsNum_eq?: InputMaybe<Scalars['Int']>
  viewsNum_gt?: InputMaybe<Scalars['Int']>
  viewsNum_gte?: InputMaybe<Scalars['Int']>
  viewsNum_in?: InputMaybe<Array<Scalars['Int']>>
  viewsNum_isNull?: InputMaybe<Scalars['Boolean']>
  viewsNum_lt?: InputMaybe<Scalars['Int']>
  viewsNum_lte?: InputMaybe<Scalars['Int']>
  viewsNum_not_eq?: InputMaybe<Scalars['Int']>
  viewsNum_not_in?: InputMaybe<Array<Scalars['Int']>>
  ytVideoId_contains?: InputMaybe<Scalars['String']>
  ytVideoId_containsInsensitive?: InputMaybe<Scalars['String']>
  ytVideoId_endsWith?: InputMaybe<Scalars['String']>
  ytVideoId_eq?: InputMaybe<Scalars['String']>
  ytVideoId_gt?: InputMaybe<Scalars['String']>
  ytVideoId_gte?: InputMaybe<Scalars['String']>
  ytVideoId_in?: InputMaybe<Array<Scalars['String']>>
  ytVideoId_isNull?: InputMaybe<Scalars['Boolean']>
  ytVideoId_lt?: InputMaybe<Scalars['String']>
  ytVideoId_lte?: InputMaybe<Scalars['String']>
  ytVideoId_not_contains?: InputMaybe<Scalars['String']>
  ytVideoId_not_containsInsensitive?: InputMaybe<Scalars['String']>
  ytVideoId_not_endsWith?: InputMaybe<Scalars['String']>
  ytVideoId_not_eq?: InputMaybe<Scalars['String']>
  ytVideoId_not_in?: InputMaybe<Array<Scalars['String']>>
  ytVideoId_not_startsWith?: InputMaybe<Scalars['String']>
  ytVideoId_startsWith?: InputMaybe<Scalars['String']>
}

export type VideosConnection = {
  __typename?: 'VideosConnection'
  edges: Array<VideoEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type VideosSearchResult = {
  __typename?: 'VideosSearchResult'
  relevance: Scalars['Int']
  video: Video
}

export type WhereIdInput = {
  id: Scalars['String']
}

export type YppSuspended = {
  __typename?: 'YppSuspended'
  suspension: ChannelSuspension
}

export type YppUnverified = {
  __typename?: 'YppUnverified'
  phantom?: Maybe<Scalars['Int']>
}

export type YppVerified = {
  __typename?: 'YppVerified'
  verification: ChannelVerification
}
