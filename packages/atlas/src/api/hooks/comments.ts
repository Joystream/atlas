import { QueryHookOptions } from '@apollo/client'

import {
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentsConnectionQuery,
  GetCommentsConnectionQueryVariables,
  GetCommentsQuery,
  GetCommentsQueryVariables,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  useGetCommentEditsQuery,
  useGetCommentsConnectionQuery,
  useGetCommentsQuery,
  useGetOriginalCommentQuery,
  useGetUserCommentsAndVideoCommentsConnectionQuery,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

export const useComments = (
  variables?: GetCommentsQueryVariables,
  opts?: QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentsQuery({ ...opts, variables })

  return {
    comments: data?.comments,
    ...rest,
  }
}

export const useCommentsConnection = (
  variables?: GetCommentsConnectionQueryVariables,
  opts?: QueryHookOptions<GetCommentsConnectionQuery, GetCommentsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentsConnectionQuery({ ...opts, variables })

  return {
    comments: data?.commentsConnection.edges.map((edge) => edge.node),
    totalCount: data?.commentsConnection.totalCount,
    ...rest,
  }
}

export const useCommentSectionComments = (
  variables?: GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  opts?: QueryHookOptions<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >
) => {
  const { data, ...rest } = useGetUserCommentsAndVideoCommentsConnectionQuery({ ...opts, variables })

  const userCommentLookup = data?.userComments && createLookup(data?.userComments)

  const userCommentReactionsLookup =
    data?.commentReactions &&
    data.commentReactions.reduce<Record<string, number[]>>((acc, item) => {
      if (item) {
        acc[item.commentId] = [...(acc[item.commentId] ? acc[item.commentId] : []), item.reactionId]
      }
      return acc
    }, {})

  const userComments = data?.userComments.map((userComment) => ({
    ...userComment,
    userReactions: userCommentReactionsLookup?.[userComment.id],
  }))

  const videoComments = data?.videoCommentsConnection.edges
    .map((edge) => edge.node)
    .map((userComment) => ({
      ...userComment,
      userReactions: userCommentReactionsLookup?.[userComment.id],
    }))
    .filter((comment) => userCommentLookup && !userCommentLookup[comment.id])

  return {
    userComments: userComments,
    comments: data ? [...(userComments || []), ...(videoComments || [])] : undefined,
    totalCount: data?.videoCommentsConnection.totalCount,
    ...rest,
  }
}

export const useCommentEdits = (
  commentId?: string,
  opts?: QueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) => {
  const { data: editedCommentsData, ...rest } = useGetCommentEditsQuery({
    ...opts,
    variables: { commentId: commentId || '' },
  })
  // we need to fetch the original comment separately.
  const { data: originalCommentData, loading: originalCommentLoading } = useGetOriginalCommentQuery({
    variables: { commentId: commentId || '' },
  })

  const originalComment = originalCommentData?.commentCreatedEvents.map((comment) => ({
    ...comment,
    newText: comment.text,
  }))[0]

  return {
    commentEdits: editedCommentsData?.commentTextUpdatedEvents &&
      originalComment && [originalComment, ...editedCommentsData.commentTextUpdatedEvents],
    ...rest,
    loading: rest.loading || originalCommentLoading,
  }
}
