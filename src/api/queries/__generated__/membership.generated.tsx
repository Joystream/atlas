import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type BasicMembershipFieldsFragment = {
  __typename?: 'Membership'
  id: string
  handle: string
  avatarUri?: Types.Maybe<string>
  controllerAccount: string
}

export type GetMembershipQueryVariables = Types.Exact<{
  where: Types.MembershipWhereUniqueInput
}>

export type GetMembershipQuery = {
  __typename?: 'Query'
  membership?: Types.Maybe<{ __typename?: 'Membership' } & BasicMembershipFieldsFragment>
}

export const BasicMembershipFieldsFragmentDoc = gql`
  fragment BasicMembershipFields on Membership {
    id
    handle
    avatarUri
    controllerAccount
  }
`
export const GetMembershipDocument = gql`
  query GetMembership($where: MembershipWhereUniqueInput!) {
    membership(where: $where) {
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
  return Apollo.useQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, baseOptions)
}
export function useGetMembershipLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>
) {
  return Apollo.useLazyQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, baseOptions)
}
export type GetMembershipQueryHookResult = ReturnType<typeof useGetMembershipQuery>
export type GetMembershipLazyQueryHookResult = ReturnType<typeof useGetMembershipLazyQuery>
export type GetMembershipQueryResult = Apollo.QueryResult<GetMembershipQuery, GetMembershipQueryVariables>
