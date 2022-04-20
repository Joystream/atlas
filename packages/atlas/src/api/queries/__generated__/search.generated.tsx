import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllChannelFieldsFragmentDoc, BasicVideoFieldsFragmentDoc, VideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type SearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String']
  whereVideo?: Types.InputMaybe<Types.VideoWhereInput>
  whereChannel?: Types.InputMaybe<Types.ChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type SearchQuery = {
  __typename?: 'Query'
  search: Array<{
    __typename?: 'SearchFTSOutput'
    item:
      | {
          __typename?: 'Channel'
          activeVideosCounter: number
          description?: string | null
          isPublic?: boolean | null
          isCensored: boolean
          id: string
          title?: string | null
          createdAt: Date
          views: number
          follows: number
          language?: { __typename?: 'Language'; id: string; iso: string } | null
          ownerMember?: {
            __typename?: 'Membership'
            id: string
            handle: string
            metadata: {
              __typename?: 'MemberMetadata'
              about?: string | null
              avatar?:
                | {
                    __typename?: 'AvatarObject'
                    avatarObject?: {
                      __typename?: 'StorageDataObject'
                      id: string
                      createdAt: Date
                      size: string
                      isAccepted: boolean
                      ipfsHash: string
                      storageBag: { __typename?: 'StorageBag'; id: string }
                      type:
                        | { __typename: 'DataObjectTypeChannelAvatar' }
                        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                        | { __typename: 'DataObjectTypeUnknown' }
                        | { __typename: 'DataObjectTypeVideoMedia' }
                        | { __typename: 'DataObjectTypeVideoThumbnail' }
                    } | null
                  }
                | { __typename?: 'AvatarUri'; avatarUri: string }
                | null
            }
          } | null
          coverPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
          avatarPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      | {
          __typename?: 'Video'
          id: string
          title?: string | null
          description?: string | null
          views: number
          duration?: number | null
          createdAt: Date
          isPublic?: boolean | null
          isExplicit?: boolean | null
          isFeatured: boolean
          hasMarketing?: boolean | null
          isCensored: boolean
          publishedBeforeJoystream?: Date | null
          category?: { __typename?: 'VideoCategory'; id: string } | null
          language?: { __typename?: 'Language'; iso: string } | null
          mediaMetadata?: {
            __typename?: 'VideoMediaMetadata'
            id: string
            pixelHeight?: number | null
            pixelWidth?: number | null
          } | null
          media?: {
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
          thumbnailPhoto?: {
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: string
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
          channel: {
            __typename?: 'Channel'
            id: string
            title?: string | null
            createdAt: Date
            views: number
            follows: number
            avatarPhoto?: {
              __typename?: 'StorageDataObject'
              id: string
              createdAt: Date
              size: string
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeUnknown' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
            } | null
            ownerMember?: {
              __typename?: 'Membership'
              id: string
              handle: string
              metadata: {
                __typename?: 'MemberMetadata'
                about?: string | null
                avatar?:
                  | {
                      __typename?: 'AvatarObject'
                      avatarObject?: {
                        __typename?: 'StorageDataObject'
                        id: string
                        createdAt: Date
                        size: string
                        isAccepted: boolean
                        ipfsHash: string
                        storageBag: { __typename?: 'StorageBag'; id: string }
                        type:
                          | { __typename: 'DataObjectTypeChannelAvatar' }
                          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                          | { __typename: 'DataObjectTypeUnknown' }
                          | { __typename: 'DataObjectTypeVideoMedia' }
                          | { __typename: 'DataObjectTypeVideoThumbnail' }
                      } | null
                    }
                  | { __typename?: 'AvatarUri'; avatarUri: string }
                  | null
              }
            } | null
          }
          license?: {
            __typename?: 'License'
            id: string
            code?: number | null
            attribution?: string | null
            customText?: string | null
          } | null
          nft?: {
            __typename?: 'OwnedNft'
            id: string
            createdAt: Date
            creatorRoyalty?: number | null
            lastSaleDate?: Date | null
            lastSalePrice?: string | null
            ownerMember?: {
              __typename?: 'Membership'
              id: string
              handle: string
              metadata: {
                __typename?: 'MemberMetadata'
                about?: string | null
                avatar?:
                  | {
                      __typename?: 'AvatarObject'
                      avatarObject?: {
                        __typename?: 'StorageDataObject'
                        id: string
                        createdAt: Date
                        size: string
                        isAccepted: boolean
                        ipfsHash: string
                        storageBag: { __typename?: 'StorageBag'; id: string }
                        type:
                          | { __typename: 'DataObjectTypeChannelAvatar' }
                          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                          | { __typename: 'DataObjectTypeUnknown' }
                          | { __typename: 'DataObjectTypeVideoMedia' }
                          | { __typename: 'DataObjectTypeVideoThumbnail' }
                      } | null
                    }
                  | { __typename?: 'AvatarUri'; avatarUri: string }
                  | null
              }
            } | null
            creatorChannel: {
              __typename?: 'Channel'
              id: string
              title?: string | null
              createdAt: Date
              views: number
              follows: number
              avatarPhoto?: {
                __typename?: 'StorageDataObject'
                id: string
                createdAt: Date
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
              ownerMember?: {
                __typename?: 'Membership'
                id: string
                handle: string
                metadata: {
                  __typename?: 'MemberMetadata'
                  about?: string | null
                  avatar?:
                    | {
                        __typename?: 'AvatarObject'
                        avatarObject?: {
                          __typename?: 'StorageDataObject'
                          id: string
                          createdAt: Date
                          size: string
                          isAccepted: boolean
                          ipfsHash: string
                          storageBag: { __typename?: 'StorageBag'; id: string }
                          type:
                            | { __typename: 'DataObjectTypeChannelAvatar' }
                            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                            | { __typename: 'DataObjectTypeUnknown' }
                            | { __typename: 'DataObjectTypeVideoMedia' }
                            | { __typename: 'DataObjectTypeVideoThumbnail' }
                        } | null
                      }
                    | { __typename?: 'AvatarUri'; avatarUri: string }
                    | null
                }
              } | null
            }
            transactionalStatusAuction?: {
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
                    minimalBidStep: number
                    plannedEndAtBlock: number
                  }
                | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
              initialOwner?: {
                __typename?: 'Membership'
                id: string
                handle: string
                metadata: {
                  __typename?: 'MemberMetadata'
                  about?: string | null
                  avatar?:
                    | {
                        __typename?: 'AvatarObject'
                        avatarObject?: {
                          __typename?: 'StorageDataObject'
                          id: string
                          createdAt: Date
                          size: string
                          isAccepted: boolean
                          ipfsHash: string
                          storageBag: { __typename?: 'StorageBag'; id: string }
                          type:
                            | { __typename: 'DataObjectTypeChannelAvatar' }
                            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                            | { __typename: 'DataObjectTypeUnknown' }
                            | { __typename: 'DataObjectTypeVideoMedia' }
                            | { __typename: 'DataObjectTypeVideoThumbnail' }
                        } | null
                      }
                    | { __typename?: 'AvatarUri'; avatarUri: string }
                    | null
                }
              } | null
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
                  metadata: {
                    __typename?: 'MemberMetadata'
                    about?: string | null
                    avatar?:
                      | {
                          __typename?: 'AvatarObject'
                          avatarObject?: {
                            __typename?: 'StorageDataObject'
                            id: string
                            createdAt: Date
                            size: string
                            isAccepted: boolean
                            ipfsHash: string
                            storageBag: { __typename?: 'StorageBag'; id: string }
                            type:
                              | { __typename: 'DataObjectTypeChannelAvatar' }
                              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                              | { __typename: 'DataObjectTypeUnknown' }
                              | { __typename: 'DataObjectTypeVideoMedia' }
                              | { __typename: 'DataObjectTypeVideoThumbnail' }
                          } | null
                        }
                      | { __typename?: 'AvatarUri'; avatarUri: string }
                      | null
                  }
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
                  metadata: {
                    __typename?: 'MemberMetadata'
                    about?: string | null
                    avatar?:
                      | {
                          __typename?: 'AvatarObject'
                          avatarObject?: {
                            __typename?: 'StorageDataObject'
                            id: string
                            createdAt: Date
                            size: string
                            isAccepted: boolean
                            ipfsHash: string
                            storageBag: { __typename?: 'StorageBag'; id: string }
                            type:
                              | { __typename: 'DataObjectTypeChannelAvatar' }
                              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                              | { __typename: 'DataObjectTypeUnknown' }
                              | { __typename: 'DataObjectTypeVideoMedia' }
                              | { __typename: 'DataObjectTypeVideoThumbnail' }
                          } | null
                        }
                      | { __typename?: 'AvatarUri'; avatarUri: string }
                      | null
                  }
                }
              }>
              whitelistedMembers: Array<{
                __typename?: 'Membership'
                id: string
                handle: string
                metadata: {
                  __typename?: 'MemberMetadata'
                  about?: string | null
                  avatar?:
                    | {
                        __typename?: 'AvatarObject'
                        avatarObject?: {
                          __typename?: 'StorageDataObject'
                          id: string
                          createdAt: Date
                          size: string
                          isAccepted: boolean
                          ipfsHash: string
                          storageBag: { __typename?: 'StorageBag'; id: string }
                          type:
                            | { __typename: 'DataObjectTypeChannelAvatar' }
                            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                            | { __typename: 'DataObjectTypeUnknown' }
                            | { __typename: 'DataObjectTypeVideoMedia' }
                            | { __typename: 'DataObjectTypeVideoThumbnail' }
                        } | null
                      }
                    | { __typename?: 'AvatarUri'; avatarUri: string }
                    | null
                }
              }>
            } | null
            transactionalStatus?:
              | { __typename: 'TransactionalStatusBuyNow'; price: number }
              | { __typename: 'TransactionalStatusIdle'; dummy?: number | null }
              | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
              | null
            video: {
              __typename?: 'Video'
              id: string
              title?: string | null
              views: number
              createdAt: Date
              duration?: number | null
              isPublic?: boolean | null
              media?: {
                __typename?: 'StorageDataObject'
                id: string
                createdAt: Date
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
              channel: {
                __typename?: 'Channel'
                id: string
                title?: string | null
                createdAt: Date
                views: number
                follows: number
                avatarPhoto?: {
                  __typename?: 'StorageDataObject'
                  id: string
                  createdAt: Date
                  size: string
                  isAccepted: boolean
                  ipfsHash: string
                  storageBag: { __typename?: 'StorageBag'; id: string }
                  type:
                    | { __typename: 'DataObjectTypeChannelAvatar' }
                    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                    | { __typename: 'DataObjectTypeUnknown' }
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                } | null
                ownerMember?: {
                  __typename?: 'Membership'
                  id: string
                  handle: string
                  metadata: {
                    __typename?: 'MemberMetadata'
                    about?: string | null
                    avatar?:
                      | {
                          __typename?: 'AvatarObject'
                          avatarObject?: {
                            __typename?: 'StorageDataObject'
                            id: string
                            createdAt: Date
                            size: string
                            isAccepted: boolean
                            ipfsHash: string
                            storageBag: { __typename?: 'StorageBag'; id: string }
                            type:
                              | { __typename: 'DataObjectTypeChannelAvatar' }
                              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                              | { __typename: 'DataObjectTypeUnknown' }
                              | { __typename: 'DataObjectTypeVideoMedia' }
                              | { __typename: 'DataObjectTypeVideoThumbnail' }
                          } | null
                        }
                      | { __typename?: 'AvatarUri'; avatarUri: string }
                      | null
                  }
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
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
              nft?: {
                __typename?: 'OwnedNft'
                id: string
                createdAt: Date
                creatorRoyalty?: number | null
                ownerMember?: {
                  __typename?: 'Membership'
                  id: string
                  handle: string
                  metadata: {
                    __typename?: 'MemberMetadata'
                    about?: string | null
                    avatar?:
                      | {
                          __typename?: 'AvatarObject'
                          avatarObject?: {
                            __typename?: 'StorageDataObject'
                            id: string
                            createdAt: Date
                            size: string
                            isAccepted: boolean
                            ipfsHash: string
                            storageBag: { __typename?: 'StorageBag'; id: string }
                            type:
                              | { __typename: 'DataObjectTypeChannelAvatar' }
                              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                              | { __typename: 'DataObjectTypeUnknown' }
                              | { __typename: 'DataObjectTypeVideoMedia' }
                              | { __typename: 'DataObjectTypeVideoThumbnail' }
                          } | null
                        }
                      | { __typename?: 'AvatarUri'; avatarUri: string }
                      | null
                  }
                } | null
                transactionalStatus?:
                  | { __typename: 'TransactionalStatusBuyNow' }
                  | { __typename: 'TransactionalStatusIdle' }
                  | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
                  | null
              } | null
            }
          } | null
        }
  }>
}

export const SearchDocument = gql`
  query Search($text: String!, $whereVideo: VideoWhereInput, $whereChannel: ChannelWhereInput, $limit: Int) {
    search(text: $text, whereVideo: $whereVideo, whereChannel: $whereChannel, limit: $limit) {
      item {
        ... on Video {
          ...VideoFields
        }
        ... on Channel {
          ...AllChannelFields
        }
      }
    }
  }
  ${VideoFieldsFragmentDoc}
  ${AllChannelFieldsFragmentDoc}
`

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      text: // value for 'text'
 *      whereVideo: // value for 'whereVideo'
 *      whereChannel: // value for 'whereChannel'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options)
}
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options)
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>
