import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {} as const
export type GetKillSwitchQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetKillSwitchQuery = {
  __typename?: 'Query'
  getKillSwitch: { __typename?: 'KillSwitch'; isKilled: boolean }
}

export type SetKillSwitchMutationVariables = Types.Exact<{
  isKilled: Types.Scalars['Boolean']
}>

export type SetKillSwitchMutation = {
  __typename?: 'Mutation'
  setKillSwitch: { __typename?: 'KillSwitch'; isKilled: boolean }
}

export type GetAppActionSignatureMutationVariables = Types.Exact<{
  assets: Types.Scalars['String']
  actionType: Types.AppActionActionType
  creatorId: Types.Scalars['String']
  nonce: Types.Scalars['Float']
  rawAction: Types.Scalars['String']
}>

export type GetAppActionSignatureMutation = {
  __typename?: 'Mutation'
  signAppActionCommitment: { __typename?: 'GeneratedSignature'; signature: string }
}

export type GetMostInteractedEntityByTypeQueryVariables = Types.Exact<{
  type: Types.Scalars['String']
  period: Types.Scalars['Int']
}>

export type GetMostInteractedEntityByTypeQuery = {
  __typename?: 'Query'
  getTopInteractedEnities: Array<{ __typename?: 'TopInteractedEntity'; entityId: string; interactionCount: number }>
}

export const GetKillSwitchDocument = gql`
  query GetKillSwitch {
    getKillSwitch {
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
export const GetAppActionSignatureDocument = gql`
  mutation GetAppActionSignature(
    $assets: String!
    $actionType: AppActionActionType!
    $creatorId: String!
    $nonce: Float!
    $rawAction: String!
  ) {
    signAppActionCommitment(
      assets: $assets
      actionType: $actionType
      creatorId: $creatorId
      nonce: $nonce
      rawAction: $rawAction
    ) {
      signature
    }
  }
`
export type GetAppActionSignatureMutationFn = Apollo.MutationFunction<
  GetAppActionSignatureMutation,
  GetAppActionSignatureMutationVariables
>

/**
 * __useGetAppActionSignatureMutation__
 *
 * To run a mutation, you first call `useGetAppActionSignatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetAppActionSignatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getAppActionSignatureMutation, { data, loading, error }] = useGetAppActionSignatureMutation({
 *   variables: {
 *      assets: // value for 'assets'
 *      actionType: // value for 'actionType'
 *      creatorId: // value for 'creatorId'
 *      nonce: // value for 'nonce'
 *      rawAction: // value for 'rawAction'
 *   },
 * });
 */
export function useGetAppActionSignatureMutation(
  baseOptions?: Apollo.MutationHookOptions<GetAppActionSignatureMutation, GetAppActionSignatureMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<GetAppActionSignatureMutation, GetAppActionSignatureMutationVariables>(
    GetAppActionSignatureDocument,
    options
  )
}
export type GetAppActionSignatureMutationHookResult = ReturnType<typeof useGetAppActionSignatureMutation>
export type GetAppActionSignatureMutationResult = Apollo.MutationResult<GetAppActionSignatureMutation>
export type GetAppActionSignatureMutationOptions = Apollo.BaseMutationOptions<
  GetAppActionSignatureMutation,
  GetAppActionSignatureMutationVariables
>
export const GetMostInteractedEntityByTypeDocument = gql`
  query GetMostInteractedEntityByType($type: String!, $period: Int!) {
    getTopInteractedEnities(type: $type, period: $period) {
      entityId
      interactionCount
    }
  }
`

/**
 * __useGetMostInteractedEntityByTypeQuery__
 *
 * To run a query within a React component, call `useGetMostInteractedEntityByTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostInteractedEntityByTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostInteractedEntityByTypeQuery({
 *   variables: {
 *      type: // value for 'type'
 *      period: // value for 'period'
 *   },
 * });
 */
export function useGetMostInteractedEntityByTypeQuery(
  baseOptions: Apollo.QueryHookOptions<GetMostInteractedEntityByTypeQuery, GetMostInteractedEntityByTypeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostInteractedEntityByTypeQuery, GetMostInteractedEntityByTypeQueryVariables>(
    GetMostInteractedEntityByTypeDocument,
    options
  )
}
export function useGetMostInteractedEntityByTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostInteractedEntityByTypeQuery,
    GetMostInteractedEntityByTypeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostInteractedEntityByTypeQuery, GetMostInteractedEntityByTypeQueryVariables>(
    GetMostInteractedEntityByTypeDocument,
    options
  )
}
export type GetMostInteractedEntityByTypeQueryHookResult = ReturnType<typeof useGetMostInteractedEntityByTypeQuery>
export type GetMostInteractedEntityByTypeLazyQueryHookResult = ReturnType<
  typeof useGetMostInteractedEntityByTypeLazyQuery
>
export type GetMostInteractedEntityByTypeQueryResult = Apollo.QueryResult<
  GetMostInteractedEntityByTypeQuery,
  GetMostInteractedEntityByTypeQueryVariables
>
