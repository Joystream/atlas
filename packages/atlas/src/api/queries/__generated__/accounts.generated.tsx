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
    isEmailConfirmed: boolean
    joystreamAccount: string
    membershipId: string
  }
}

export const GetCurrentAccountDocument = gql`
  query GetCurrentAccount {
    accountData {
      email
      id
      isEmailConfirmed
      joystreamAccount
      membershipId
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
