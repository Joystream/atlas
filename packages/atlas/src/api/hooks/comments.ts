import { QueryHookOptions } from '@apollo/client'

import {
  CommentFieldsFragment,
  CommentOrderByInput,
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentQuery,
  GetCommentQueryVariables,
  GetCommentsConnectionQuery,
  GetCommentsConnectionQueryVariables,
  GetCommentsQuery,
  GetCommentsQueryVariables,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  useGetCommentEditsQuery,
  useGetCommentQuery,
  useGetCommentsConnectionQuery,
  useGetCommentsQuery,
  useGetOriginalCommentQuery,
  useGetUserCommentsAndVideoCommentsConnectionQuery,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

export const useComment = (
  variables: GetCommentQueryVariables,
  opts?: QueryHookOptions<GetCommentQuery, GetCommentQueryVariables>
) => {
  const { data, ...rest } = useGetCommentQuery({ ...opts, variables })

  const { comments: replies } = useComments({
    where: { parentComment: { id_eq: variables.commentId } },
    orderBy: CommentOrderByInput.CreatedAtAsc,
    ...opts,
  })

  const userCommentReactionsLookup = data?.commentReactions && getUserCommentReactionsLookup(data.commentReactions)

  const comment = data?.commentByUniqueInput
    ? {
        ...data.commentByUniqueInput,
        userReactions: userCommentReactionsLookup?.[variables.commentId],
        replies,
      }
    : undefined

  return {
    comment,
    ...rest,
  }
}

type CommentReaction = {
  commentId: string
  reactionId: number
}

const getUserCommentReactionsLookup = (commentReactions: CommentReaction[]) =>
  commentReactions.reduce<Record<string, number[]>>((acc, item) => {
    if (item) {
      acc[item.commentId] = [...(acc[item.commentId] ? acc[item.commentId] : []), item.reactionId]
    }
    return acc
  }, {})

export const useComments = (
  variables?: GetCommentsQueryVariables,
  opts?: QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentsQuery({ ...opts, variables })

  const userCommentReactionsLookup = data?.commentReactions && getUserCommentReactionsLookup(data.commentReactions)

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

  const userCommentReactionsLookup = data?.commentReactions && getUserCommentReactionsLookup(data.commentReactions)

  const videoCommentThreadsIds = data?.videoCommentsConnection
    ? data.videoCommentsConnection.edges
        .filter((comment) => !!comment.node.repliesCount)
        .map((comment) => comment.node.id)
    : undefined
  const { comments: replies } = useComments(
    {
      where: { parentComment: { id_in: videoCommentThreadsIds } },
      memberId: variables?.memberId,
      orderBy: CommentOrderByInput.CreatedAtAsc,
    },
    { skip: !videoCommentThreadsIds || !videoCommentThreadsIds.length }
  )

  const matchReplies = (videoComment: CommentFieldsFragment) =>
    replies ? replies?.filter((comment) => comment.parentCommentId === videoComment.id) : null

  const userComments = data?.userComments
    ? data?.userComments.map((userComment) => ({
        ...userComment,
        replies: matchReplies(userComment),
        userReactions: userCommentReactionsLookup?.[userComment.id],
      }))
    : undefined

  const videoComments = data?.videoCommentsConnection
    ? data.videoCommentsConnection.edges
        .map((edge) => edge.node)
        .map((userComment) => ({
          ...userComment,
          replies: matchReplies(userComment),
          userReactions: userCommentReactionsLookup?.[userComment.id],
        }))
        .filter((comment) => userCommentLookup && !userCommentLookup[comment.id])
    : undefined

  return {
    userComments,
    comments: data ? [...(userComments || []), ...(videoComments || [])] : undefined,
    totalCount: data?.videoCommentsConnection && data.videoCommentsConnection.totalCount,
    loading: loading,
    pageInfo: data?.videoCommentsConnection && data.videoCommentsConnection.pageInfo,
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
