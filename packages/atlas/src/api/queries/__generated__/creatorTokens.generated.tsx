import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicCreatorTokenFragmentDoc,
  BasicCreatorTokenHolderFragmentDoc,
  FullCreatorTokenFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetBasicCreatorTokenQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.CreatorTokenWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.CreatorTokenOrderByInput> | Types.CreatorTokenOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetBasicCreatorTokenQuery = {
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
    channel?: {
      __typename?: 'TokenChannel'
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
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
    description?: string | null
    revenueShareRatioPermill: number
    totalSupply: string
    id: string
    accountsNum: number
    symbol?: string | null
    isInviteOnly: boolean
    deissued: boolean
    status: Types.TokenStatus
    createdAt: Date
    ammCurves: Array<{
      __typename?: 'AmmCurve'
      id: string
      finalized: boolean
      ammInitPrice: string
      burnedByAmm: string
      mintedByAmm: string
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
        viewsNum: number
        createdAt: Date
        duration?: number | null
        reactionsCount: number
        commentsCount: number
        channel: {
          __typename?: 'Channel'
          id: string
          title?: string | null
          description?: string | null
          createdAt: Date
          followsNum: number
          rewardAccount: string
          channelStateBloatBond: string
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
        nft?: {
          __typename?: 'OwnedNft'
          id: string
          createdAt: Date
          creatorRoyalty?: number | null
          lastSaleDate?: Date | null
          lastSalePrice?: string | null
          owner:
            | {
                __typename: 'NftOwnerChannel'
                channel: {
                  __typename?: 'Channel'
                  id: string
                  title?: string | null
                  description?: string | null
                  createdAt: Date
                  followsNum: number
                  rewardAccount: string
                  channelStateBloatBond: string
                  ownerMember?: {
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
                  } | null
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
                  creatorToken?: {
                    __typename?: 'TokenChannel'
                    token: { __typename?: 'CreatorToken'; id: string }
                  } | null
                }
              }
            | {
                __typename: 'NftOwnerMember'
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
          transactionalStatus?:
            | {
                __typename: 'TransactionalStatusAuction'
                auction: {
                  __typename?: 'Auction'
                  id: string
                  isCompleted: boolean
                  buyNowPrice?: string | null
                  startingPrice: string
                  startsAtBlock: number
                  endedAtBlock?: number | null
                  auctionType:
                    | {
                        __typename: 'AuctionTypeEnglish'
                        duration: number
                        extensionPeriod: number
                        minimalBidStep: string
                        plannedEndAtBlock: number
                      }
                    | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                  topBid?: {
                    __typename?: 'Bid'
                    amount: string
                    createdAt: Date
                    isCanceled: boolean
                    createdInBlock: number
                    id: string
                    bidder: {
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
                  } | null
                  bids: Array<{
                    __typename?: 'Bid'
                    amount: string
                    createdAt: Date
                    isCanceled: boolean
                    createdInBlock: number
                    id: string
                    bidder: {
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
                  }>
                  whitelistedMembers: Array<{
                    __typename?: 'AuctionWhitelistedMember'
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
                  }>
                }
              }
            | { __typename: 'TransactionalStatusBuyNow'; price: string }
            | { __typename: 'TransactionalStatusIdle' }
            | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
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
      startingAt: number
      stakers: Array<{
        __typename?: 'RevenueShareParticipation'
        id: string
        stakedAmount: string
        earnings: string
        createdIn: number
        account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
      }>
    }>
    channel?: {
      __typename?: 'TokenChannel'
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
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
    vestingSchedules: Array<{
      __typename?: 'VestedAccount'
      totalVestingAmount: string
      vestingSource:
        | { __typename: 'InitialIssuanceVestingSource' }
        | { __typename: 'IssuerTransferVestingSource' }
        | { __typename: 'SaleVestingSource' }
      vesting: {
        __typename?: 'VestingSchedule'
        endsAt: number
        cliffBlock: number
        cliffDurationBlocks: number
        cliffRatioPermill: number
        vestingDurationBlocks: number
      }
    }>
  }>
}

export const GetBasicCreatorTokenDocument = gql`
  query GetBasicCreatorToken(
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
 * __useGetBasicCreatorTokenQuery__
 *
 * To run a query within a React component, call `useGetBasicCreatorTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicCreatorTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicCreatorTokenQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBasicCreatorTokenQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicCreatorTokenQuery, GetBasicCreatorTokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicCreatorTokenQuery, GetBasicCreatorTokenQueryVariables>(
    GetBasicCreatorTokenDocument,
    options
  )
}
export function useGetBasicCreatorTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicCreatorTokenQuery, GetBasicCreatorTokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicCreatorTokenQuery, GetBasicCreatorTokenQueryVariables>(
    GetBasicCreatorTokenDocument,
    options
  )
}
export type GetBasicCreatorTokenQueryHookResult = ReturnType<typeof useGetBasicCreatorTokenQuery>
export type GetBasicCreatorTokenLazyQueryHookResult = ReturnType<typeof useGetBasicCreatorTokenLazyQuery>
export type GetBasicCreatorTokenQueryResult = Apollo.QueryResult<
  GetBasicCreatorTokenQuery,
  GetBasicCreatorTokenQueryVariables
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
