import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicAmmTransactionFragmentDoc,
  BasicCreatorTokenFragmentDoc,
  BasicCreatorTokenHolderFragmentDoc,
  BasicRevenueShareFragmentDoc,
  FullAmmCurveFragmentDoc,
  FullCreatorTokenFragmentDoc,
  StorageDataObjectFieldsFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetBasicCreatorTokensQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.CreatorTokenWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.CreatorTokenOrderByInput> | Types.CreatorTokenOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetBasicCreatorTokensQuery = {
  __typename?: 'Query'
  creatorTokens: Array<{
    __typename?: 'CreatorToken'
    id: string
    accountsNum: number
    symbol?: string | null
    isInviteOnly: boolean
    deissued: boolean
    status: Types.TokenStatus
    createdAt: Date
    lastPrice?: string | null
    totalSupply: string
    description?: string | null
    trailerVideo?: {
      __typename?: 'TrailerVideo'
      id: string
      video: {
        __typename?: 'Video'
        id: string
        media?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
        thumbnailPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
    } | null
    currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
    currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
    channel?: {
      __typename?: 'TokenChannel'
      id: string
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
        cumulativeRevenue: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
        creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
      }
    } | null
    avatar?:
      | {
          __typename?: 'TokenAvatarObject'
          avatarObject: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          }
        }
      | { __typename?: 'TokenAvatarUri'; avatarUri: string }
      | null
  }>
}

export type GetFullCreatorTokenQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetFullCreatorTokenQuery = {
  __typename?: 'Query'
  creatorTokenById?: {
    __typename?: 'CreatorToken'
    annualCreatorRewardPermill: number
    revenueShareRatioPermill: number
    description?: string | null
    totalSupply: string
    id: string
    accountsNum: number
    symbol?: string | null
    isInviteOnly: boolean
    deissued: boolean
    status: Types.TokenStatus
    createdAt: Date
    lastPrice?: string | null
    ammCurves: Array<{
      __typename?: 'AmmCurve'
      id: string
      finalized: boolean
      ammInitPrice: string
      burnedByAmm: string
      mintedByAmm: string
      ammSlopeParameter: string
    }>
    sales: Array<{
      __typename?: 'Sale'
      id: string
      maxAmountPerMember?: string | null
      pricePerUnit: string
      tokensSold: string
      finalized: boolean
    }>
    benefits: Array<{
      __typename?: 'Benefit'
      id: string
      description: string
      title: string
      displayOrder: number
      emojiCode?: string | null
    }>
    trailerVideo?: {
      __typename?: 'TrailerVideo'
      id: string
      video: {
        __typename?: 'Video'
        id: string
        title?: string | null
        media?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
        thumbnailPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
    } | null
    revenueShares: Array<{
      __typename?: 'RevenueShare'
      id: string
      allocation: string
      claimed: string
      endsAt: number
      createdIn: number
      finalized: boolean
      participantsNum: number
      potentialParticipantsNum?: number | null
      startingAt: number
      token: { __typename?: 'CreatorToken'; id: string; symbol?: string | null }
      stakers: Array<{
        __typename?: 'RevenueShareParticipation'
        id: string
        stakedAmount: string
        recovered: boolean
        earnings: string
        createdIn: number
        account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
      }>
    }>
    currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
    currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
    channel?: {
      __typename?: 'TokenChannel'
      id: string
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
        cumulativeRevenue: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
        creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
      }
    } | null
    avatar?:
      | {
          __typename?: 'TokenAvatarObject'
          avatarObject: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          }
        }
      | { __typename?: 'TokenAvatarUri'; avatarUri: string }
      | null
  } | null
}

export type GetCreatorTokensCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.CreatorTokenWhereInput>
}>

export type GetCreatorTokensCountQuery = {
  __typename?: 'Query'
  creatorTokensConnection: { __typename?: 'CreatorTokensConnection'; totalCount: number }
}

export type GetCreatorTokenHoldersQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.TokenAccountWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.TokenAccountOrderByInput> | Types.TokenAccountOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetCreatorTokenHoldersQuery = {
  __typename?: 'Query'
  tokenAccounts: Array<{
    __typename?: 'TokenAccount'
    id: string
    stakedAmount: string
    deleted: boolean
    totalAmount: string
    member: {
      __typename?: 'Membership'
      id: string
      handle: string
      metadata?: {
        __typename?: 'MemberMetadata'
        about?: string | null
        avatar?:
          | {
              __typename?: 'AvatarObject'
              avatarObject: {
                __typename?: 'StorageDataObject'
                id: string
                resolvedUrls: Array<string>
                createdAt: Date
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type?:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoSubtitle' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
                  | null
              }
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      } | null
    }
    token: {
      __typename?: 'CreatorToken'
      id: string
      symbol?: string | null
      status: Types.TokenStatus
      lastPrice?: string | null
      channel?: { __typename?: 'TokenChannel'; id: string; channel: { __typename?: 'Channel'; id: string } } | null
    }
    vestingSchedules: Array<{
      __typename?: 'VestedAccount'
      id: string
      totalVestingAmount: string
      vestingSource:
        | { __typename: 'InitialIssuanceVestingSource' }
        | { __typename: 'IssuerTransferVestingSource' }
        | { __typename: 'SaleVestingSource' }
      vesting: {
        __typename?: 'VestingSchedule'
        id: string
        endsAt: number
        cliffBlock: number
        cliffDurationBlocks: number
        cliffRatioPermill: number
        vestingDurationBlocks: number
      }
    }>
  }>
}

export type GetCreatorTokenHoldersCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.TokenAccountWhereInput>
}>

export type GetCreatorTokenHoldersCountQuery = {
  __typename?: 'Query'
  tokenAccountsConnection: { __typename?: 'TokenAccountsConnection'; totalCount: number }
}

export type GetChannelTokenBalanceQueryVariables = Types.Exact<{
  currentBlockHeight: Types.Scalars['Int']
  memberId: Types.Scalars['String']
  tokenId: Types.Scalars['String']
}>

export type GetChannelTokenBalanceQuery = {
  __typename?: 'Query'
  getAccountTransferrableBalance: {
    __typename?: 'GetAccountTransferrableBalanceResult'
    transferrableCrtAmount: number
  }
}

export type GetRevenueShareDividendQueryVariables = Types.Exact<{
  stakingAmount: Types.Scalars['Int']
  tokenId: Types.Scalars['String']
}>

export type GetRevenueShareDividendQuery = {
  __typename?: 'Query'
  getShareDividend: { __typename?: 'GetShareDividendsResult'; dividendJoyAmount: string }
}

export type GetHistoricalTokenAllocationQueryVariables = Types.Exact<{
  tokenId: Types.Scalars['String']
}>

export type GetHistoricalTokenAllocationQuery = {
  __typename?: 'Query'
  getCumulativeHistoricalShareAllocation: {
    __typename?: 'GetCumulativeHistoricalShareAllocationResult'
    cumulativeHistoricalAllocation: string
  }
}

export type GetFullAmmCurveQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.AmmCurveWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.AmmCurveOrderByInput> | Types.AmmCurveOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetFullAmmCurveQuery = {
  __typename?: 'Query'
  ammCurves: Array<{
    __typename?: 'AmmCurve'
    id: string
    ammSlopeParameter: string
    mintedByAmm: string
    burnedByAmm: string
    ammInitPrice: string
    finalized: boolean
    transactions: Array<{
      __typename?: 'AmmTransaction'
      id: string
      createdIn: number
      pricePaid: string
      pricePerUnit: string
      transactionType: Types.AmmTransactionType
      quantity: string
      account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
    }>
  }>
}

export type GetTokenRevenueSharesQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.RevenueShareWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetTokenRevenueSharesQuery = {
  __typename?: 'Query'
  revenueShares: Array<{
    __typename?: 'RevenueShare'
    id: string
    allocation: string
    claimed: string
    endsAt: number
    createdIn: number
    finalized: boolean
    participantsNum: number
    potentialParticipantsNum?: number | null
    startingAt: number
    token: { __typename?: 'CreatorToken'; id: string; symbol?: string | null }
    stakers: Array<{
      __typename?: 'RevenueShareParticipation'
      id: string
      stakedAmount: string
      recovered: boolean
      earnings: string
      createdIn: number
      account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
    }>
  }>
}

export type GetTokenRevenueSharesCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.RevenueShareWhereInput>
}>

export type GetTokenRevenueSharesCountQuery = {
  __typename?: 'Query'
  revenueSharesConnection: { __typename?: 'RevenueSharesConnection'; totalCount: number }
}

export type GetMarketplaceTokensCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MarketplaceTokenWhereInput>
}>

export type GetMarketplaceTokensCountQuery = {
  __typename?: 'Query'
  getMarketplaceTokensCount: { __typename?: 'MarketplaceTokenCount'; count: number }
}

export type GetMarketplaceTokensQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MarketplaceTokenWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  orderBy?: Types.InputMaybe<Array<Types.Scalars['id_ASC']> | Types.Scalars['id_ASC']>
}>

export type GetMarketplaceTokensQuery = {
  __typename?: 'Query'
  getMarketplaceTokens: Array<{
    __typename?: 'MarketplaceToken'
    ammVolume?: string | null
    liquidity?: number | null
    cumulativeRevenue?: string | null
    priceChange?: string | null
    liquidityChange?: string | null
    marketCap?: string | null
    id: string
    accountsNum: number
    symbol?: string | null
    isInviteOnly: boolean
    deissued: boolean
    status: Types.TokenStatus
    createdAt: Date
    lastPrice?: string | null
    totalSupply: string
    description?: string | null
    currentAmmSaleId?: string | null
    currentSaleId?: string | null
    channelId?: string | null
    avatar?:
      | {
          __typename?: 'TokenAvatarObject'
          avatarObject: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          }
        }
      | { __typename?: 'TokenAvatarUri'; avatarUri: string }
      | null
  }>
}

export type GetHotAndColdTokensQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.CreatorTokenWhereInput>
  periodDays: Types.Scalars['Int']
  priceDesc?: Types.InputMaybe<Types.Scalars['Boolean']>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  minVolume?: Types.InputMaybe<Types.Scalars['BigInt']>
}>

export type GetHotAndColdTokensQuery = {
  __typename?: 'Query'
  tokensWithPriceChange: Array<{
    __typename?: 'MarketplaceTokensReturnType'
    pricePercentageChange: number
    creatorToken: {
      __typename?: 'CreatorToken'
      id: string
      accountsNum: number
      symbol?: string | null
      isInviteOnly: boolean
      deissued: boolean
      status: Types.TokenStatus
      createdAt: Date
      lastPrice?: string | null
      totalSupply: string
      description?: string | null
      trailerVideo?: {
        __typename?: 'TrailerVideo'
        id: string
        video: {
          __typename?: 'Video'
          id: string
          media?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
          thumbnailPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
        }
      } | null
      currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
      currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
      channel?: {
        __typename?: 'TokenChannel'
        id: string
        channel: {
          __typename?: 'Channel'
          id: string
          title?: string | null
          description?: string | null
          createdAt: Date
          followsNum: number
          rewardAccount: string
          channelStateBloatBond: string
          cumulativeRevenue: string
          avatarPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
          creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
        }
      } | null
      avatar?:
        | {
            __typename?: 'TokenAvatarObject'
            avatarObject: {
              __typename?: 'StorageDataObject'
              id: string
              resolvedUrls: Array<string>
              createdAt: Date
              size: string
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type?:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            }
          }
        | { __typename?: 'TokenAvatarUri'; avatarUri: string }
        | null
    }
  }>
}

export type GetTopSellingTokensQueryVariables = Types.Exact<{
  periodDays: Types.Scalars['Int']
  volumeDesc?: Types.InputMaybe<Types.Scalars['Boolean']>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetTopSellingTokensQuery = {
  __typename?: 'Query'
  topSellingToken: Array<{
    __typename?: 'TopSellingTokensReturnType'
    ammVolume: string
    creatorToken: {
      __typename?: 'CreatorToken'
      id: string
      accountsNum: number
      symbol?: string | null
      isInviteOnly: boolean
      deissued: boolean
      status: Types.TokenStatus
      createdAt: Date
      lastPrice?: string | null
      totalSupply: string
      description?: string | null
      trailerVideo?: {
        __typename?: 'TrailerVideo'
        id: string
        video: {
          __typename?: 'Video'
          id: string
          media?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
          thumbnailPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
        }
      } | null
      currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
      currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
      channel?: {
        __typename?: 'TokenChannel'
        id: string
        channel: {
          __typename?: 'Channel'
          id: string
          title?: string | null
          description?: string | null
          createdAt: Date
          followsNum: number
          rewardAccount: string
          channelStateBloatBond: string
          cumulativeRevenue: string
          avatarPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type?:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
          creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
        }
      } | null
      avatar?:
        | {
            __typename?: 'TokenAvatarObject'
            avatarObject: {
              __typename?: 'StorageDataObject'
              id: string
              resolvedUrls: Array<string>
              createdAt: Date
              size: string
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type?:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            }
          }
        | { __typename?: 'TokenAvatarUri'; avatarUri: string }
        | null
    }
  }>
}

export type GetAmmTransactionsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.AmmTransactionWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.AmmTransactionOrderByInput> | Types.AmmTransactionOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetAmmTransactionsQuery = {
  __typename?: 'Query'
  ammTransactions: Array<{
    __typename?: 'AmmTransaction'
    id: string
    quantity: string
    pricePaid: string
    pricePerUnit: string
    transactionType: Types.AmmTransactionType
    createdIn: number
    amm: {
      __typename?: 'AmmCurve'
      id: string
      token: {
        __typename?: 'CreatorToken'
        id: string
        symbol?: string | null
        channel?: {
          __typename?: 'TokenChannel'
          channel: {
            __typename?: 'Channel'
            id: string
            avatarPhoto?: {
              __typename?: 'StorageDataObject'
              resolvedUrls: Array<string>
              storageBag: { __typename?: 'StorageBag'; id: string }
            } | null
          }
        } | null
      }
    }
    account: {
      __typename?: 'TokenAccount'
      member: {
        __typename?: 'Membership'
        id: string
        handle: string
        metadata?: {
          __typename?: 'MemberMetadata'
          about?: string | null
          avatar?:
            | {
                __typename?: 'AvatarObject'
                avatarObject: {
                  __typename?: 'StorageDataObject'
                  id: string
                  resolvedUrls: Array<string>
                  createdAt: Date
                  size: string
                  isAccepted: boolean
                  ipfsHash: string
                  storageBag: { __typename?: 'StorageBag'; id: string }
                  type?:
                    | { __typename: 'DataObjectTypeChannelAvatar' }
                    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                    | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
                }
              }
            | { __typename?: 'AvatarUri'; avatarUri: string }
            | null
        } | null
      }
    }
  }>
}

export const GetBasicCreatorTokensDocument = gql`
  query GetBasicCreatorTokens(
    $where: CreatorTokenWhereInput
    $orderBy: [CreatorTokenOrderByInput!]
    $limit: Int
    $offset: Int
  ) {
    creatorTokens(where: $where, orderBy: $orderBy, limit: $limit, offset: $offset) {
      ...BasicCreatorToken
    }
  }
  ${BasicCreatorTokenFragmentDoc}
`

/**
 * __useGetBasicCreatorTokensQuery__
 *
 * To run a query within a React component, call `useGetBasicCreatorTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicCreatorTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicCreatorTokensQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBasicCreatorTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicCreatorTokensQuery, GetBasicCreatorTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicCreatorTokensQuery, GetBasicCreatorTokensQueryVariables>(
    GetBasicCreatorTokensDocument,
    options
  )
}
export function useGetBasicCreatorTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicCreatorTokensQuery, GetBasicCreatorTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicCreatorTokensQuery, GetBasicCreatorTokensQueryVariables>(
    GetBasicCreatorTokensDocument,
    options
  )
}
export type GetBasicCreatorTokensQueryHookResult = ReturnType<typeof useGetBasicCreatorTokensQuery>
export type GetBasicCreatorTokensLazyQueryHookResult = ReturnType<typeof useGetBasicCreatorTokensLazyQuery>
export type GetBasicCreatorTokensQueryResult = Apollo.QueryResult<
  GetBasicCreatorTokensQuery,
  GetBasicCreatorTokensQueryVariables
>
export const GetFullCreatorTokenDocument = gql`
  query GetFullCreatorToken($id: String!) {
    creatorTokenById(id: $id) {
      ...FullCreatorToken
    }
  }
  ${FullCreatorTokenFragmentDoc}
`

/**
 * __useGetFullCreatorTokenQuery__
 *
 * To run a query within a React component, call `useGetFullCreatorTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullCreatorTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullCreatorTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFullCreatorTokenQuery(
  baseOptions: Apollo.QueryHookOptions<GetFullCreatorTokenQuery, GetFullCreatorTokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullCreatorTokenQuery, GetFullCreatorTokenQueryVariables>(
    GetFullCreatorTokenDocument,
    options
  )
}
export function useGetFullCreatorTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullCreatorTokenQuery, GetFullCreatorTokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullCreatorTokenQuery, GetFullCreatorTokenQueryVariables>(
    GetFullCreatorTokenDocument,
    options
  )
}
export type GetFullCreatorTokenQueryHookResult = ReturnType<typeof useGetFullCreatorTokenQuery>
export type GetFullCreatorTokenLazyQueryHookResult = ReturnType<typeof useGetFullCreatorTokenLazyQuery>
export type GetFullCreatorTokenQueryResult = Apollo.QueryResult<
  GetFullCreatorTokenQuery,
  GetFullCreatorTokenQueryVariables
>
export const GetCreatorTokensCountDocument = gql`
  query GetCreatorTokensCount($where: CreatorTokenWhereInput) {
    creatorTokensConnection(where: $where, orderBy: [id_ASC]) {
      totalCount
    }
  }
`

/**
 * __useGetCreatorTokensCountQuery__
 *
 * To run a query within a React component, call `useGetCreatorTokensCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreatorTokensCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreatorTokensCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetCreatorTokensCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCreatorTokensCountQuery, GetCreatorTokensCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCreatorTokensCountQuery, GetCreatorTokensCountQueryVariables>(
    GetCreatorTokensCountDocument,
    options
  )
}
export function useGetCreatorTokensCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCreatorTokensCountQuery, GetCreatorTokensCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCreatorTokensCountQuery, GetCreatorTokensCountQueryVariables>(
    GetCreatorTokensCountDocument,
    options
  )
}
export type GetCreatorTokensCountQueryHookResult = ReturnType<typeof useGetCreatorTokensCountQuery>
export type GetCreatorTokensCountLazyQueryHookResult = ReturnType<typeof useGetCreatorTokensCountLazyQuery>
export type GetCreatorTokensCountQueryResult = Apollo.QueryResult<
  GetCreatorTokensCountQuery,
  GetCreatorTokensCountQueryVariables
>
export const GetCreatorTokenHoldersDocument = gql`
  query GetCreatorTokenHolders(
    $where: TokenAccountWhereInput
    $orderBy: [TokenAccountOrderByInput!]
    $limit: Int
    $offset: Int
  ) {
    tokenAccounts(where: $where, orderBy: $orderBy, offset: $offset, limit: $limit) {
      ...BasicCreatorTokenHolder
    }
  }
  ${BasicCreatorTokenHolderFragmentDoc}
`

/**
 * __useGetCreatorTokenHoldersQuery__
 *
 * To run a query within a React component, call `useGetCreatorTokenHoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreatorTokenHoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreatorTokenHoldersQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetCreatorTokenHoldersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCreatorTokenHoldersQuery, GetCreatorTokenHoldersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCreatorTokenHoldersQuery, GetCreatorTokenHoldersQueryVariables>(
    GetCreatorTokenHoldersDocument,
    options
  )
}
export function useGetCreatorTokenHoldersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCreatorTokenHoldersQuery, GetCreatorTokenHoldersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCreatorTokenHoldersQuery, GetCreatorTokenHoldersQueryVariables>(
    GetCreatorTokenHoldersDocument,
    options
  )
}
export type GetCreatorTokenHoldersQueryHookResult = ReturnType<typeof useGetCreatorTokenHoldersQuery>
export type GetCreatorTokenHoldersLazyQueryHookResult = ReturnType<typeof useGetCreatorTokenHoldersLazyQuery>
export type GetCreatorTokenHoldersQueryResult = Apollo.QueryResult<
  GetCreatorTokenHoldersQuery,
  GetCreatorTokenHoldersQueryVariables
>
export const GetCreatorTokenHoldersCountDocument = gql`
  query GetCreatorTokenHoldersCount($where: TokenAccountWhereInput) {
    tokenAccountsConnection(where: $where, orderBy: [id_ASC]) {
      totalCount
    }
  }
`

/**
 * __useGetCreatorTokenHoldersCountQuery__
 *
 * To run a query within a React component, call `useGetCreatorTokenHoldersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreatorTokenHoldersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreatorTokenHoldersCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetCreatorTokenHoldersCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCreatorTokenHoldersCountQuery, GetCreatorTokenHoldersCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCreatorTokenHoldersCountQuery, GetCreatorTokenHoldersCountQueryVariables>(
    GetCreatorTokenHoldersCountDocument,
    options
  )
}
export function useGetCreatorTokenHoldersCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCreatorTokenHoldersCountQuery, GetCreatorTokenHoldersCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCreatorTokenHoldersCountQuery, GetCreatorTokenHoldersCountQueryVariables>(
    GetCreatorTokenHoldersCountDocument,
    options
  )
}
export type GetCreatorTokenHoldersCountQueryHookResult = ReturnType<typeof useGetCreatorTokenHoldersCountQuery>
export type GetCreatorTokenHoldersCountLazyQueryHookResult = ReturnType<typeof useGetCreatorTokenHoldersCountLazyQuery>
export type GetCreatorTokenHoldersCountQueryResult = Apollo.QueryResult<
  GetCreatorTokenHoldersCountQuery,
  GetCreatorTokenHoldersCountQueryVariables
>
export const GetChannelTokenBalanceDocument = gql`
  query GetChannelTokenBalance($currentBlockHeight: Int!, $memberId: String!, $tokenId: String!) {
    getAccountTransferrableBalance(currentBlockHeight: $currentBlockHeight, memberId: $memberId, tokenId: $tokenId) {
      transferrableCrtAmount
    }
  }
`

/**
 * __useGetChannelTokenBalanceQuery__
 *
 * To run a query within a React component, call `useGetChannelTokenBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelTokenBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelTokenBalanceQuery({
 *   variables: {
 *      currentBlockHeight: // value for 'currentBlockHeight'
 *      memberId: // value for 'memberId'
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useGetChannelTokenBalanceQuery(
  baseOptions: Apollo.QueryHookOptions<GetChannelTokenBalanceQuery, GetChannelTokenBalanceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelTokenBalanceQuery, GetChannelTokenBalanceQueryVariables>(
    GetChannelTokenBalanceDocument,
    options
  )
}
export function useGetChannelTokenBalanceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelTokenBalanceQuery, GetChannelTokenBalanceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelTokenBalanceQuery, GetChannelTokenBalanceQueryVariables>(
    GetChannelTokenBalanceDocument,
    options
  )
}
export type GetChannelTokenBalanceQueryHookResult = ReturnType<typeof useGetChannelTokenBalanceQuery>
export type GetChannelTokenBalanceLazyQueryHookResult = ReturnType<typeof useGetChannelTokenBalanceLazyQuery>
export type GetChannelTokenBalanceQueryResult = Apollo.QueryResult<
  GetChannelTokenBalanceQuery,
  GetChannelTokenBalanceQueryVariables
>
export const GetRevenueShareDividendDocument = gql`
  query GetRevenueShareDividend($stakingAmount: Int!, $tokenId: String!) {
    getShareDividend(stakingAmount: $stakingAmount, tokenId: $tokenId) {
      dividendJoyAmount
    }
  }
`

/**
 * __useGetRevenueShareDividendQuery__
 *
 * To run a query within a React component, call `useGetRevenueShareDividendQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRevenueShareDividendQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRevenueShareDividendQuery({
 *   variables: {
 *      stakingAmount: // value for 'stakingAmount'
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useGetRevenueShareDividendQuery(
  baseOptions: Apollo.QueryHookOptions<GetRevenueShareDividendQuery, GetRevenueShareDividendQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetRevenueShareDividendQuery, GetRevenueShareDividendQueryVariables>(
    GetRevenueShareDividendDocument,
    options
  )
}
export function useGetRevenueShareDividendLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRevenueShareDividendQuery, GetRevenueShareDividendQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetRevenueShareDividendQuery, GetRevenueShareDividendQueryVariables>(
    GetRevenueShareDividendDocument,
    options
  )
}
export type GetRevenueShareDividendQueryHookResult = ReturnType<typeof useGetRevenueShareDividendQuery>
export type GetRevenueShareDividendLazyQueryHookResult = ReturnType<typeof useGetRevenueShareDividendLazyQuery>
export type GetRevenueShareDividendQueryResult = Apollo.QueryResult<
  GetRevenueShareDividendQuery,
  GetRevenueShareDividendQueryVariables
>
export const GetHistoricalTokenAllocationDocument = gql`
  query GetHistoricalTokenAllocation($tokenId: String!) {
    getCumulativeHistoricalShareAllocation(tokenId: $tokenId) {
      cumulativeHistoricalAllocation
    }
  }
`

/**
 * __useGetHistoricalTokenAllocationQuery__
 *
 * To run a query within a React component, call `useGetHistoricalTokenAllocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHistoricalTokenAllocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHistoricalTokenAllocationQuery({
 *   variables: {
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useGetHistoricalTokenAllocationQuery(
  baseOptions: Apollo.QueryHookOptions<GetHistoricalTokenAllocationQuery, GetHistoricalTokenAllocationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetHistoricalTokenAllocationQuery, GetHistoricalTokenAllocationQueryVariables>(
    GetHistoricalTokenAllocationDocument,
    options
  )
}
export function useGetHistoricalTokenAllocationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHistoricalTokenAllocationQuery,
    GetHistoricalTokenAllocationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetHistoricalTokenAllocationQuery, GetHistoricalTokenAllocationQueryVariables>(
    GetHistoricalTokenAllocationDocument,
    options
  )
}
export type GetHistoricalTokenAllocationQueryHookResult = ReturnType<typeof useGetHistoricalTokenAllocationQuery>
export type GetHistoricalTokenAllocationLazyQueryHookResult = ReturnType<
  typeof useGetHistoricalTokenAllocationLazyQuery
>
export type GetHistoricalTokenAllocationQueryResult = Apollo.QueryResult<
  GetHistoricalTokenAllocationQuery,
  GetHistoricalTokenAllocationQueryVariables
>
export const GetFullAmmCurveDocument = gql`
  query GetFullAmmCurve($where: AmmCurveWhereInput, $orderBy: [AmmCurveOrderByInput!], $limit: Int, $offset: Int) {
    ammCurves(where: $where, orderBy: $orderBy, offset: $offset, limit: $limit) {
      ...FullAmmCurve
    }
  }
  ${FullAmmCurveFragmentDoc}
`

/**
 * __useGetFullAmmCurveQuery__
 *
 * To run a query within a React component, call `useGetFullAmmCurveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullAmmCurveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullAmmCurveQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetFullAmmCurveQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFullAmmCurveQuery, GetFullAmmCurveQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullAmmCurveQuery, GetFullAmmCurveQueryVariables>(GetFullAmmCurveDocument, options)
}
export function useGetFullAmmCurveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullAmmCurveQuery, GetFullAmmCurveQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullAmmCurveQuery, GetFullAmmCurveQueryVariables>(GetFullAmmCurveDocument, options)
}
export type GetFullAmmCurveQueryHookResult = ReturnType<typeof useGetFullAmmCurveQuery>
export type GetFullAmmCurveLazyQueryHookResult = ReturnType<typeof useGetFullAmmCurveLazyQuery>
export type GetFullAmmCurveQueryResult = Apollo.QueryResult<GetFullAmmCurveQuery, GetFullAmmCurveQueryVariables>
export const GetTokenRevenueSharesDocument = gql`
  query GetTokenRevenueShares($where: RevenueShareWhereInput, $limit: Int, $offset: Int) {
    revenueShares(where: $where, limit: $limit, offset: $offset) {
      ...BasicRevenueShare
    }
  }
  ${BasicRevenueShareFragmentDoc}
`

/**
 * __useGetTokenRevenueSharesQuery__
 *
 * To run a query within a React component, call `useGetTokenRevenueSharesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenRevenueSharesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenRevenueSharesQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetTokenRevenueSharesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTokenRevenueSharesQuery, GetTokenRevenueSharesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTokenRevenueSharesQuery, GetTokenRevenueSharesQueryVariables>(
    GetTokenRevenueSharesDocument,
    options
  )
}
export function useGetTokenRevenueSharesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTokenRevenueSharesQuery, GetTokenRevenueSharesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTokenRevenueSharesQuery, GetTokenRevenueSharesQueryVariables>(
    GetTokenRevenueSharesDocument,
    options
  )
}
export type GetTokenRevenueSharesQueryHookResult = ReturnType<typeof useGetTokenRevenueSharesQuery>
export type GetTokenRevenueSharesLazyQueryHookResult = ReturnType<typeof useGetTokenRevenueSharesLazyQuery>
export type GetTokenRevenueSharesQueryResult = Apollo.QueryResult<
  GetTokenRevenueSharesQuery,
  GetTokenRevenueSharesQueryVariables
>
export const GetTokenRevenueSharesCountDocument = gql`
  query GetTokenRevenueSharesCount($where: RevenueShareWhereInput) {
    revenueSharesConnection(where: $where, orderBy: [id_ASC]) {
      totalCount
    }
  }
`

/**
 * __useGetTokenRevenueSharesCountQuery__
 *
 * To run a query within a React component, call `useGetTokenRevenueSharesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenRevenueSharesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenRevenueSharesCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetTokenRevenueSharesCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTokenRevenueSharesCountQuery, GetTokenRevenueSharesCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTokenRevenueSharesCountQuery, GetTokenRevenueSharesCountQueryVariables>(
    GetTokenRevenueSharesCountDocument,
    options
  )
}
export function useGetTokenRevenueSharesCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTokenRevenueSharesCountQuery, GetTokenRevenueSharesCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTokenRevenueSharesCountQuery, GetTokenRevenueSharesCountQueryVariables>(
    GetTokenRevenueSharesCountDocument,
    options
  )
}
export type GetTokenRevenueSharesCountQueryHookResult = ReturnType<typeof useGetTokenRevenueSharesCountQuery>
export type GetTokenRevenueSharesCountLazyQueryHookResult = ReturnType<typeof useGetTokenRevenueSharesCountLazyQuery>
export type GetTokenRevenueSharesCountQueryResult = Apollo.QueryResult<
  GetTokenRevenueSharesCountQuery,
  GetTokenRevenueSharesCountQueryVariables
>
export const GetMarketplaceTokensCountDocument = gql`
  query GetMarketplaceTokensCount($where: MarketplaceTokenWhereInput) {
    getMarketplaceTokensCount(where: $where) {
      count
    }
  }
`

/**
 * __useGetMarketplaceTokensCountQuery__
 *
 * To run a query within a React component, call `useGetMarketplaceTokensCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketplaceTokensCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketplaceTokensCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMarketplaceTokensCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetMarketplaceTokensCountQuery, GetMarketplaceTokensCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMarketplaceTokensCountQuery, GetMarketplaceTokensCountQueryVariables>(
    GetMarketplaceTokensCountDocument,
    options
  )
}
export function useGetMarketplaceTokensCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMarketplaceTokensCountQuery, GetMarketplaceTokensCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMarketplaceTokensCountQuery, GetMarketplaceTokensCountQueryVariables>(
    GetMarketplaceTokensCountDocument,
    options
  )
}
export type GetMarketplaceTokensCountQueryHookResult = ReturnType<typeof useGetMarketplaceTokensCountQuery>
export type GetMarketplaceTokensCountLazyQueryHookResult = ReturnType<typeof useGetMarketplaceTokensCountLazyQuery>
export type GetMarketplaceTokensCountQueryResult = Apollo.QueryResult<
  GetMarketplaceTokensCountQuery,
  GetMarketplaceTokensCountQueryVariables
>
export const GetMarketplaceTokensDocument = gql`
  query GetMarketplaceTokens($where: MarketplaceTokenWhereInput, $limit: Int, $offset: Int, $orderBy: [id_ASC!]) {
    getMarketplaceTokens(where: $where, limit: $limit, orderBy: $orderBy, offset: $offset) {
      ammVolume
      liquidity
      cumulativeRevenue
      priceChange
      liquidityChange
      marketCap
      id
      accountsNum
      symbol
      isInviteOnly
      deissued
      status
      createdAt
      lastPrice
      totalSupply
      description
      currentAmmSaleId
      currentSaleId
      channelId
      avatar {
        ... on TokenAvatarObject {
          avatarObject {
            ...StorageDataObjectFields
          }
        }
        ... on TokenAvatarUri {
          avatarUri
        }
      }
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`

/**
 * __useGetMarketplaceTokensQuery__
 *
 * To run a query within a React component, call `useGetMarketplaceTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketplaceTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketplaceTokensQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetMarketplaceTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<GetMarketplaceTokensQuery, GetMarketplaceTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMarketplaceTokensQuery, GetMarketplaceTokensQueryVariables>(
    GetMarketplaceTokensDocument,
    options
  )
}
export function useGetMarketplaceTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMarketplaceTokensQuery, GetMarketplaceTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMarketplaceTokensQuery, GetMarketplaceTokensQueryVariables>(
    GetMarketplaceTokensDocument,
    options
  )
}
export type GetMarketplaceTokensQueryHookResult = ReturnType<typeof useGetMarketplaceTokensQuery>
export type GetMarketplaceTokensLazyQueryHookResult = ReturnType<typeof useGetMarketplaceTokensLazyQuery>
export type GetMarketplaceTokensQueryResult = Apollo.QueryResult<
  GetMarketplaceTokensQuery,
  GetMarketplaceTokensQueryVariables
>
export const GetHotAndColdTokensDocument = gql`
  query GetHotAndColdTokens(
    $where: CreatorTokenWhereInput
    $periodDays: Int!
    $priceDesc: Boolean
    $limit: Int
    $minVolume: BigInt
  ) {
    tokensWithPriceChange(
      periodDays: $periodDays
      orderByPriceDesc: $priceDesc
      limit: $limit
      minVolume: $minVolume
      where: $where
    ) {
      pricePercentageChange
      creatorToken {
        ...BasicCreatorToken
      }
    }
  }
  ${BasicCreatorTokenFragmentDoc}
`

/**
 * __useGetHotAndColdTokensQuery__
 *
 * To run a query within a React component, call `useGetHotAndColdTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHotAndColdTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHotAndColdTokensQuery({
 *   variables: {
 *      where: // value for 'where'
 *      periodDays: // value for 'periodDays'
 *      priceDesc: // value for 'priceDesc'
 *      limit: // value for 'limit'
 *      minVolume: // value for 'minVolume'
 *   },
 * });
 */
export function useGetHotAndColdTokensQuery(
  baseOptions: Apollo.QueryHookOptions<GetHotAndColdTokensQuery, GetHotAndColdTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetHotAndColdTokensQuery, GetHotAndColdTokensQueryVariables>(
    GetHotAndColdTokensDocument,
    options
  )
}
export function useGetHotAndColdTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetHotAndColdTokensQuery, GetHotAndColdTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetHotAndColdTokensQuery, GetHotAndColdTokensQueryVariables>(
    GetHotAndColdTokensDocument,
    options
  )
}
export type GetHotAndColdTokensQueryHookResult = ReturnType<typeof useGetHotAndColdTokensQuery>
export type GetHotAndColdTokensLazyQueryHookResult = ReturnType<typeof useGetHotAndColdTokensLazyQuery>
export type GetHotAndColdTokensQueryResult = Apollo.QueryResult<
  GetHotAndColdTokensQuery,
  GetHotAndColdTokensQueryVariables
>
export const GetTopSellingTokensDocument = gql`
  query GetTopSellingTokens($periodDays: Int!, $volumeDesc: Boolean, $limit: Int) {
    topSellingToken(periodDays: $periodDays, orderByPriceDesc: $volumeDesc, limit: $limit) {
      creatorToken {
        ...BasicCreatorToken
      }
      ammVolume
    }
  }
  ${BasicCreatorTokenFragmentDoc}
`

/**
 * __useGetTopSellingTokensQuery__
 *
 * To run a query within a React component, call `useGetTopSellingTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopSellingTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopSellingTokensQuery({
 *   variables: {
 *      periodDays: // value for 'periodDays'
 *      volumeDesc: // value for 'volumeDesc'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTopSellingTokensQuery(
  baseOptions: Apollo.QueryHookOptions<GetTopSellingTokensQuery, GetTopSellingTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTopSellingTokensQuery, GetTopSellingTokensQueryVariables>(
    GetTopSellingTokensDocument,
    options
  )
}
export function useGetTopSellingTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTopSellingTokensQuery, GetTopSellingTokensQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTopSellingTokensQuery, GetTopSellingTokensQueryVariables>(
    GetTopSellingTokensDocument,
    options
  )
}
export type GetTopSellingTokensQueryHookResult = ReturnType<typeof useGetTopSellingTokensQuery>
export type GetTopSellingTokensLazyQueryHookResult = ReturnType<typeof useGetTopSellingTokensLazyQuery>
export type GetTopSellingTokensQueryResult = Apollo.QueryResult<
  GetTopSellingTokensQuery,
  GetTopSellingTokensQueryVariables
>
export const GetAmmTransactionsDocument = gql`
  query GetAmmTransactions($where: AmmTransactionWhereInput, $orderBy: [AmmTransactionOrderByInput!], $limit: Int) {
    ammTransactions(where: $where, orderBy: $orderBy, limit: $limit) {
      ...BasicAmmTransaction
    }
  }
  ${BasicAmmTransactionFragmentDoc}
`

/**
 * __useGetAmmTransactionsQuery__
 *
 * To run a query within a React component, call `useGetAmmTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAmmTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAmmTransactionsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetAmmTransactionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAmmTransactionsQuery, GetAmmTransactionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAmmTransactionsQuery, GetAmmTransactionsQueryVariables>(GetAmmTransactionsDocument, options)
}
export function useGetAmmTransactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAmmTransactionsQuery, GetAmmTransactionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAmmTransactionsQuery, GetAmmTransactionsQueryVariables>(
    GetAmmTransactionsDocument,
    options
  )
}
export type GetAmmTransactionsQueryHookResult = ReturnType<typeof useGetAmmTransactionsQuery>
export type GetAmmTransactionsLazyQueryHookResult = ReturnType<typeof useGetAmmTransactionsLazyQuery>
export type GetAmmTransactionsQueryResult = Apollo.QueryResult<
  GetAmmTransactionsQuery,
  GetAmmTransactionsQueryVariables
>
