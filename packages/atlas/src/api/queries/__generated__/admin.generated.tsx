import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {} as const
export type GetKillSwitchQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetKillSwitchQuery = { __typename?: 'Query'; admin: { __typename?: 'Admin'; isKilled: boolean } }

export type SetKillSwitchMutationVariables = Types.Exact<{
  isKilled: Types.Scalars['Boolean']
}>

export type SetKillSwitchMutation = {
  __typename?: 'Mutation'
  setKillSwitch: { __typename?: 'Admin'; isKilled: boolean }
}

export const GetKillSwitchDocument = gql`
  query GetKillSwitch {
    admin {
      isKilled
    }
  }
`

/**
 * __useGetKillSwitchQuery__
 *
 * To run a query within a React component, call `useGetKillSwitchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKillSwitchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKillSwitchQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetKillSwitchQuery(
  baseOptions?: Apollo.QueryHookOptions<GetKillSwitchQuery, GetKillSwitchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetKillSwitchQuery, GetKillSwitchQueryVariables>(GetKillSwitchDocument, options)
}
export function useGetKillSwitchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetKillSwitchQuery, GetKillSwitchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetKillSwitchQuery, GetKillSwitchQueryVariables>(GetKillSwitchDocument, options)
}
export type GetKillSwitchQueryHookResult = ReturnType<typeof useGetKillSwitchQuery>
export type GetKillSwitchLazyQueryHookResult = ReturnType<typeof useGetKillSwitchLazyQuery>
export type GetKillSwitchQueryResult = Apollo.QueryResult<GetKillSwitchQuery, GetKillSwitchQueryVariables>
export const SetKillSwitchDocument = gql`
  mutation SetKillSwitch($isKilled: Boolean!) {
    setKillSwitch(isKilled: $isKilled) {
      isKilled
    }
  }
`
export type SetKillSwitchMutationFn = Apollo.MutationFunction<SetKillSwitchMutation, SetKillSwitchMutationVariables>

/**
 * __useSetKillSwitchMutation__
 *
 * To run a mutation, you first call `useSetKillSwitchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetKillSwitchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setKillSwitchMutation, { data, loading, error }] = useSetKillSwitchMutation({
 *   variables: {
 *      isKilled: // value for 'isKilled'
 *   },
 * });
 */
export function useSetKillSwitchMutation(
  baseOptions?: Apollo.MutationHookOptions<SetKillSwitchMutation, SetKillSwitchMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SetKillSwitchMutation, SetKillSwitchMutationVariables>(SetKillSwitchDocument, options)
}
export type SetKillSwitchMutationHookResult = ReturnType<typeof useSetKillSwitchMutation>
export type SetKillSwitchMutationResult = Apollo.MutationResult<SetKillSwitchMutation>
export type SetKillSwitchMutationOptions = Apollo.BaseMutationOptions<
  SetKillSwitchMutation,
  SetKillSwitchMutationVariables
>
