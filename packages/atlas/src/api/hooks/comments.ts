import { QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import {
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentQuery,
  GetCommentQueryVariables,
  GetCommentRepliesConnectionQuery,
  GetCommentRepliesConnectionQueryVariables,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  useGetCommentEditsQuery,
  useGetCommentQuery,
  useGetCommentRepliesConnectionQuery,
  useGetUserCommentsAndVideoCommentsConnectionQuery,
  useGetUserCommentsReactionsQuery,
} from '@/api/queries/__generated__/comments.generated'
import { createLookup } from '@/utils/data'

export const useComment = (
  variables: GetCommentQueryVariables,
  opts?: QueryHookOptions<GetCommentQuery, GetCommentQueryVariables>
) => {
  const { data, ...rest } = useGetCommentQuery({ ...opts, variables })

  return {
    comment: data?.commentByUniqueInput,
    ...rest,
  }
}

export type UserCommentReactions = Record<string, number[]>
export const useUserCommentsReactions = (videoId?: string | null, memberId?: string | null) => {
  const { data } = useGetUserCommentsReactionsQuery({
    variables: {
      videoId: videoId || '',
      memberId: memberId || '',
    },
    skip: !videoId || !memberId,
  })

  return useMemo(
    () => ({
      userReactions: data?.commentReactions.reduce<Record<string, number[]>>((acc, item) => {
        if (item) {
          acc[item.commentId] = [...(acc[item.commentId] ? acc[item.commentId] : []), item.reactionId]
        }
        return acc
      }, {}),
    }),
    [data?.commentReactions]
  )
}

export const useCommentRepliesConnection = (
  opts?: QueryHookOptions<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetCommentRepliesConnectionQuery({ ...opts })

  const mappedComments = data?.commentsConnection?.edges.map((edge) => edge.node)

  return {
    replies: mappedComments || [],
    totalCount: data?.commentsConnection.totalCount || 0,
    pageInfo: data?.commentsConnection.pageInfo,
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

  const userComments = data?.userComments

  const videoComments = data?.videoCommentsConnection?.edges
    .map((edge) => edge.node)
    .filter((comment) => userCommentLookup && !userCommentLookup[comment.id])

  return {
    userComments,
    comments: data ? [...(userComments || []), ...(videoComments || [])] : undefined,
    totalCount: data?.videoCommentsConnection?.totalCount,
    loading: loading,
    pageInfo: data?.videoCommentsConnection?.pageInfo,
    ...rest,
  }
}

export const useCommentEdits = (
  commentId?: string,
  opts?: QueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentEditsQuery({
    ...opts,
    variables: { commentId: commentId || '' },
  })

  const originalComment = data?.commentCreatedEvents.map((comment) => ({
    ...comment,
    newText: comment.text,
  }))[0]

  return {
    commentEdits: data?.commentTextUpdatedEvents &&
      originalComment && [originalComment, ...data.commentTextUpdatedEvents],
    ...rest,
  }
}
