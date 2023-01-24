import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicChannelFieldsFragmentDoc, BasicVideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type SearchChannelsQueryVariables = Types.Exact<{
  query: Types.Scalars['String']
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type SearchChannelsQuery = {
  __typename?: 'Query'
  searchChannels: Array<{
    __typename?: 'ChannelsSearchResult'
    relevance: number
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        createdAt: Date
        size: string
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type?:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
    }
  }>
}

export type SearchVideosQueryVariables = Types.Exact<{
  query: Types.Scalars['String']
  where?: Types.InputMaybe<Types.VideoWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type SearchVideosQuery = {
  __typename?: 'Query'
  searchVideos: Array<{
    __typename?: 'VideosSearchResult'
    relevance: number
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
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type?:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
      thumbnailPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        createdAt: Date
        size: string
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type?:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
                            createdAt: Date
                            size: string
                            isAccepted: boolean
                            ipfsHash: string
                            storageBag: { __typename?: 'StorageBag'; id: string }
                            type?:
                              | { __typename: 'DataObjectTypeChannelAvatar' }
                              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
                  createdAt: Date
                  size: string
                  isAccepted: boolean
                  ipfsHash: string
                  storageBag: { __typename?: 'StorageBag'; id: string }
                  type?:
                    | { __typename: 'DataObjectTypeChannelAvatar' }
                    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
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
                          createdAt: Date
                          size: string
                          isAccepted: boolean
                          ipfsHash: string
                          storageBag: { __typename?: 'StorageBag'; id: string }
                          type?:
                            | { __typename: 'DataObjectTypeChannelAvatar' }
                            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
                              createdAt: Date
                              size: string
                              isAccepted: boolean
                              ipfsHash: string
                              storageBag: { __typename?: 'StorageBag'; id: string }
                              type?:
                                | { __typename: 'DataObjectTypeChannelAvatar' }
                                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
                              createdAt: Date
                              size: string
                              isAccepted: boolean
                              ipfsHash: string
                              storageBag: { __typename?: 'StorageBag'; id: string }
                              type?:
                                | { __typename: 'DataObjectTypeChannelAvatar' }
                                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
                              createdAt: Date
                              size: string
                              isAccepted: boolean
                              ipfsHash: string
                              storageBag: { __typename?: 'StorageBag'; id: string }
                              type?:
                                | { __typename: 'DataObjectTypeChannelAvatar' }
                                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
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
  }>
}

export const SearchChannelsDocument = gql`
  query SearchChannels($query: String!, $where: ChannelWhereInput, $limit: Int) {
    searchChannels(query: $query, where: $where, limit: $limit) {
      channel {
        ...BasicChannelFields
      }
      relevance
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useSearchChannelsQuery__
 *
 * To run a query within a React component, call `useSearchChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchChannelsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<SearchChannelsQuery, SearchChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchChannelsQuery, SearchChannelsQueryVariables>(SearchChannelsDocument, options)
}
export function useSearchChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchChannelsQuery, SearchChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchChannelsQuery, SearchChannelsQueryVariables>(SearchChannelsDocument, options)
}
export type SearchChannelsQueryHookResult = ReturnType<typeof useSearchChannelsQuery>
export type SearchChannelsLazyQueryHookResult = ReturnType<typeof useSearchChannelsLazyQuery>
export type SearchChannelsQueryResult = Apollo.QueryResult<SearchChannelsQuery, SearchChannelsQueryVariables>
export const SearchVideosDocument = gql`
  query SearchVideos($query: String!, $where: VideoWhereInput, $limit: Int) {
    searchVideos(query: $query, where: $where, limit: $limit) {
      video {
        ...BasicVideoFields
      }
      relevance
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useSearchVideosQuery__
 *
 * To run a query within a React component, call `useSearchVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchVideosQuery({
 *   variables: {
 *      query: // value for 'query'
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchVideosQuery(
  baseOptions: Apollo.QueryHookOptions<SearchVideosQuery, SearchVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchVideosQuery, SearchVideosQueryVariables>(SearchVideosDocument, options)
}
export function useSearchVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchVideosQuery, SearchVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchVideosQuery, SearchVideosQueryVariables>(SearchVideosDocument, options)
}
export type SearchVideosQueryHookResult = ReturnType<typeof useSearchVideosQuery>
export type SearchVideosLazyQueryHookResult = ReturnType<typeof useSearchVideosLazyQuery>
export type SearchVideosQueryResult = Apollo.QueryResult<SearchVideosQuery, SearchVideosQueryVariables>
