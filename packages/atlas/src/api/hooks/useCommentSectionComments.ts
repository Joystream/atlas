import { QueryHookOptions } from '@apollo/client'

import { UNCONFIRMED } from '@/hooks/useOptimisticActions'
import { createLookup } from '@/utils/data'

import {
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  useGetUserCommentsAndVideoCommentsConnectionQuery,
} from '../queries/__generated__/comments.generated'

export const useCommentSectionComments = (
  variables?: GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  opts?: QueryHookOptions<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >
) => {
  const { data, loading, ...rest } = useGetUserCommentsAndVideoCommentsConnectionQuery({ ...opts, variables })
  const userComments = data?.userComments
  const userCommentLookup = data?.userComments && createLookup(data?.userComments)
  const unconfirmedComments = data?.videoCommentsConnection.edges
    .map((edge) => edge.node)
    .filter((node) => node.id.includes(UNCONFIRMED))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const unconfirmedCommentLookup = unconfirmedComments && createLookup(unconfirmedComments)

  const videoComments = data?.videoCommentsConnection?.edges
    .map((edge) => edge.node)
    .filter((comment) => userCommentLookup && !userCommentLookup[comment.id] && !unconfirmedCommentLookup?.[comment.id])

  return {
    userComments,
    comments: data ? [...(unconfirmedComments || []), ...(userComments || []), ...(videoComments || [])] : undefined,
    loading: loading,
    pageInfo: data?.videoCommentsConnection?.pageInfo,
    ...rest,
  }
}
