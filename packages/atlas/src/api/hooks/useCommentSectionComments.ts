import { QueryHookOptions } from '@apollo/client'

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

  const userCommentLookup = data?.userComments && createLookup(data?.userComments)

  const userComments = data?.userComments

  const videoComments = data?.videoCommentsConnection?.edges
    .map((edge) => edge.node)
    .filter((comment) => userCommentLookup && !userCommentLookup[comment.id])

  return {
    userComments,
    comments: data ? [...(userComments || []), ...(videoComments || [])] : undefined,
    loading: loading,
    pageInfo: data?.videoCommentsConnection?.pageInfo,
    ...rest,
  }
}
