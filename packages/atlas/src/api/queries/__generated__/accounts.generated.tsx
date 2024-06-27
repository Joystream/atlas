import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {} as const
export type GetCurrentAccountQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetCurrentAccountQuery = {
  __typename?: 'Query'
  accountData: {
    __typename?: 'AccountData'
    email: string
    id: string
    joystreamAccountId?: string | null
    followedChannels: Array<{ __typename?: 'FollowedChannel'; channelId: string; timestamp: string }>
  }
}

export type GetChannelFollowsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelFollowWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetChannelFollowsQuery = {
  __typename?: 'Query'
  channelFollows: Array<{
    __typename?: 'ChannelFollow'
    id: string
    timestamp: Date
    channelId: string
    user: { __typename?: 'User'; id: string }
  }>
}

export type CreateAccountMembershipMutationVariables = Types.Exact<{
  about: Types.Scalars['String']
  avatar: Types.Scalars['String']
  handle: Types.Scalars['String']
  name: Types.Scalars['String']
}>

export type CreateAccountMembershipMutation = {
  __typename?: 'Mutation'
  createAccountMembership: { __typename?: 'CreateAccountMembershipResult'; accountId: string; memberId: number }
}

export const GetCurrentAccountDocument = gql`
  query GetCurrentAccount {
    accountData {
      email
      id
      joystreamAccountId
      followedChannels {
        channelId
        timestamp
      }
    }
  }
`

/**
 * __useGetCurrentAccountQuery__
 *
 * To run a query within a React component, call `useGetCurrentAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentAccountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentAccountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCurrentAccountQuery, GetCurrentAccountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCurrentAccountQuery, GetCurrentAccountQueryVariables>(GetCurrentAccountDocument, options)
}
export function useGetCurrentAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentAccountQuery, GetCurrentAccountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCurrentAccountQuery, GetCurrentAccountQueryVariables>(
    GetCurrentAccountDocument,
    options
  )
}
export type GetCurrentAccountQueryHookResult = ReturnType<typeof useGetCurrentAccountQuery>
export type GetCurrentAccountLazyQueryHookResult = ReturnType<typeof useGetCurrentAccountLazyQuery>
export type GetCurrentAccountQueryResult = Apollo.QueryResult<GetCurrentAccountQuery, GetCurrentAccountQueryVariables>
export const GetChannelFollowsDocument = gql`
  query GetChannelFollows($where: ChannelFollowWhereInput, $limit: Int) {
    channelFollows(where: $where, limit: $limit) {
      id
      timestamp
      channelId
      user {
        id
      }
    }
  }
`

/**
 * __useGetChannelFollowsQuery__
 *
 * To run a query within a React component, call `useGetChannelFollowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelFollowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelFollowsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetChannelFollowsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>(GetChannelFollowsDocument, options)
}
export function useGetChannelFollowsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>(
    GetChannelFollowsDocument,
    options
  )
}
export type GetChannelFollowsQueryHookResult = ReturnType<typeof useGetChannelFollowsQuery>
export type GetChannelFollowsLazyQueryHookResult = ReturnType<typeof useGetChannelFollowsLazyQuery>
export type GetChannelFollowsQueryResult = Apollo.QueryResult<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
export const CreateAccountMembershipDocument = gql`
  mutation CreateAccountMembership($about: String!, $avatar: String!, $handle: String!, $name: String!) {
    createAccountMembership(about: $about, avatar: $avatar, handle: $handle, name: $name) {
      accountId
      memberId
    }
  }
`
export type CreateAccountMembershipMutationFn = Apollo.MutationFunction<
  CreateAccountMembershipMutation,
  CreateAccountMembershipMutationVariables
>

/**
 * __useCreateAccountMembershipMutation__
 *
 * To run a mutation, you first call `useCreateAccountMembershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMembershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMembershipMutation, { data, loading, error }] = useCreateAccountMembershipMutation({
 *   variables: {
 *      about: // value for 'about'
 *      avatar: // value for 'avatar'
 *      handle: // value for 'handle'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateAccountMembershipMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateAccountMembershipMutation, CreateAccountMembershipMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateAccountMembershipMutation, CreateAccountMembershipMutationVariables>(
    CreateAccountMembershipDocument,
    options
  )
}
export type CreateAccountMembershipMutationHookResult = ReturnType<typeof useCreateAccountMembershipMutation>
export type CreateAccountMembershipMutationResult = Apollo.MutationResult<CreateAccountMembershipMutation>
export type CreateAccountMembershipMutationOptions = Apollo.BaseMutationOptions<
  CreateAccountMembershipMutation,
  CreateAccountMembershipMutationVariables
>
