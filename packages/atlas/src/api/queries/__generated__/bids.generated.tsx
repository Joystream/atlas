import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { FullBidFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetBidsQueryVariables = Types.Exact<{
  where: Types.BidWhereInput
}>

export type GetBidsQuery = {
  __typename?: 'Query'
  bids: Array<{
    __typename?: 'Bid'
    amount: string
    createdAt: Date
    isCanceled: boolean
    createdInBlock: number
    id: string
    auction: {
      __typename?: 'Auction'
      isCompleted: boolean
      id: string
      auctionType: { __typename: 'AuctionTypeEnglish' } | { __typename: 'AuctionTypeOpen' }
      winningMember?: { __typename?: 'Membership'; id: string } | null
    }
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
                resolvedUrl?: string | null
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

export const GetBidsDocument = gql`
  query GetBids($where: BidWhereInput!) {
    bids(where: $where, orderBy: [createdAt_ASC]) {
      ...FullBidFields
    }
  }
  ${FullBidFieldsFragmentDoc}
`

/**
 * __useGetBidsQuery__
 *
 * To run a query within a React component, call `useGetBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBidsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetBidsQuery(baseOptions: Apollo.QueryHookOptions<GetBidsQuery, GetBidsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBidsQuery, GetBidsQueryVariables>(GetBidsDocument, options)
}
export function useGetBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBidsQuery, GetBidsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBidsQuery, GetBidsQueryVariables>(GetBidsDocument, options)
}
export type GetBidsQueryHookResult = ReturnType<typeof useGetBidsQuery>
export type GetBidsLazyQueryHookResult = ReturnType<typeof useGetBidsLazyQuery>
export type GetBidsQueryResult = Apollo.QueryResult<GetBidsQuery, GetBidsQueryVariables>
