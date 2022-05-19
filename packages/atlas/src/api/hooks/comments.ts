import { QueryHookOptions } from '@apollo/client'

import {
  CommentOrderByInput,
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

  const userCommentReactionsLookup =
    data?.commentReactions &&
    data.commentReactions.reduce<Record<string, number[]>>((acc, item) => {
      if (item) {
        acc[item.commentId] = [...(acc[item.commentId] ? acc[item.commentId] : []), item.reactionId]
      }
      return acc
    }, {})

  const mappedComments = data?.comments.map((comment) => ({
    ...comment,
    userReactions: userCommentReactionsLookup?.[comment.id],
  }))

  return {
    comments: data ? [...(mappedComments || [])] : undefined,
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
  const { data, loading, ...rest } = useGetUserCommentsAndVideoCommentsConnectionQuery({ ...opts, variables })

  const userCommentLookup = data?.userComments && createLookup(data?.userComments)

  const userCommentReactionsLookup =
    data?.commentReactions &&
    data.commentReactions.reduce<Record<string, number[]>>((acc, item) => {
      if (item) {
        acc[item.commentId] = [...(acc[item.commentId] ? acc[item.commentId] : []), item.reactionId]
      }
      return acc
    }, {})

  const videoCommentThreadsIds = data?.videoCommentsConnection.edges
    .filter((comment) => !!comment.node.repliesCount)
    .map((comment) => comment.node.id)
  const { comments: replies, loading: repliesLoading } = useComments(
    { where: { parentComment: { id_in: videoCommentThreadsIds } }, orderBy: CommentOrderByInput.CreatedAtAsc },
    { skip: !videoCommentThreadsIds || !videoCommentThreadsIds.length }
  )

  const userComments = data?.userComments.map((userComment) => ({
    ...userComment,
    replies: replies ? replies?.filter((comment) => comment.parentCommentId === userComment.id) : null,
    userReactions: userCommentReactionsLookup?.[userComment.id],
  }))

  const videoComments = data?.videoCommentsConnection.edges
    .map((edge) => edge.node)
    .map((userComment) => ({
      ...userComment,
      replies: replies ? replies?.filter((comment) => comment.parentCommentId === userComment.id) : null,
      userReactions: userCommentReactionsLookup?.[userComment.id],
    }))
    .filter((comment) => userCommentLookup && !userCommentLookup[comment.id])

  return {
    userComments: userComments,
    comments: data && replies ? [...(userComments || []), ...(videoComments || [])] : undefined,
    totalCount: data?.videoCommentsConnection.totalCount,
    loading: loading || repliesLoading,
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
