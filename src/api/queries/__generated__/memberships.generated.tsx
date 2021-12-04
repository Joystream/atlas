import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicChannelFieldsFragmentDoc } from './channels.generated'

const defaultOptions = {}
export type BasicMembershipFieldsFragment = {
  __typename?: 'Membership'
  id: string
  handle: string
  avatarUri?: Types.Maybe<string>
  about?: Types.Maybe<string>
  controllerAccount: string
  channels: Array<{
    __typename?: 'Channel'
    id: string
    title?: Types.Maybe<string>
    createdAt: Date
    avatarPhoto?: Types.Maybe<{
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: number
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | { __typename: 'DataObjectTypeUnknown' }
    }>
  }>
}

export type GetMembershipQueryVariables = Types.Exact<{
  where: Types.MembershipWhereUniqueInput
}>

export type GetMembershipQuery = {
  __typename?: 'Query'
  membershipByUniqueInput?: Types.Maybe<{
    __typename?: 'Membership'
    id: string
    handle: string
    avatarUri?: Types.Maybe<string>
    about?: Types.Maybe<string>
    controllerAccount: string
    channels: Array<{
      __typename?: 'Channel'
      id: string
      title?: Types.Maybe<string>
      createdAt: Date
      avatarPhoto?: Types.Maybe<{
        __typename?: 'StorageDataObject'
        id: string
        createdAt: Date
        size: number
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | { __typename: 'DataObjectTypeUnknown' }
      }>
    }>
  }>
}

export type GetMembershipsQueryVariables = Types.Exact<{
  where: Types.MembershipWhereInput
}>

export type GetMembershipsQuery = {
  __typename?: 'Query'
  memberships: Array<{
    __typename?: 'Membership'
    id: string
    handle: string
    avatarUri?: Types.Maybe<string>
    about?: Types.Maybe<string>
    controllerAccount: string
    channels: Array<{
      __typename?: 'Channel'
      id: string
      title?: Types.Maybe<string>
      createdAt: Date
      avatarPhoto?: Types.Maybe<{
        __typename?: 'StorageDataObject'
        id: string
        createdAt: Date
        size: number
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | { __typename: 'DataObjectTypeUnknown' }
      }>
    }>
  }>
}

export const BasicMembershipFieldsFragmentDoc = gql`
  fragment BasicMembershipFields on Membership {
    id
    handle
    avatarUri
    about
    controllerAccount
    channels {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`
export const GetMembershipDocument = gql`
  query GetMembership($where: MembershipWhereUniqueInput!) {
    membershipByUniqueInput(where: $where) {
      ...BasicMembershipFields
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetMembershipQuery__
 *
 * To run a query within a React component, call `useGetMembershipQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMembershipQuery(
  baseOptions: Apollo.QueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, options)
}
export function useGetMembershipLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, options)
}
export type GetMembershipQueryHookResult = ReturnType<typeof useGetMembershipQuery>
export type GetMembershipLazyQueryHookResult = ReturnType<typeof useGetMembershipLazyQuery>
export type GetMembershipQueryResult = Apollo.QueryResult<GetMembershipQuery, GetMembershipQueryVariables>
export const GetMembershipsDocument = gql`
  query GetMemberships($where: MembershipWhereInput!) {
    memberships(where: $where) {
      ...BasicMembershipFields
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetMembershipsQuery__
 *
 * To run a query within a React component, call `useGetMembershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMembershipsQuery(
  baseOptions: Apollo.QueryHookOptions<GetMembershipsQuery, GetMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipsQuery, GetMembershipsQueryVariables>(GetMembershipsDocument, options)
}
export function useGetMembershipsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipsQuery, GetMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMembershipsQuery, GetMembershipsQueryVariables>(GetMembershipsDocument, options)
}
export type GetMembershipsQueryHookResult = ReturnType<typeof useGetMembershipsQuery>
export type GetMembershipsLazyQueryHookResult = ReturnType<typeof useGetMembershipsLazyQuery>
export type GetMembershipsQueryResult = Apollo.QueryResult<GetMembershipsQuery, GetMembershipsQueryVariables>
