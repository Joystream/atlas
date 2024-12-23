import { QueryHookOptions } from '@apollo/client'
import { omit } from 'lodash-es'
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
  useGetTipTiersQuery,
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
    comment: data?.commentById,
    ...rest,
  }
}

export type UserCommentReactions = Record<string, { reactionId: number; reactionServerId: string }[]>
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
      userReactions: data?.commentReactions.reduce<UserCommentReactions>((acc, item) => {
        if (item) {
          acc[item.comment.id] = [
            ...(acc[item.comment.id] ? acc[item.comment.id] : []),
            {
              reactionId: item.reactionId,
              reactionServerId: item.id,
            },
          ]
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
    loading: loading,
    pageInfo: data?.videoCommentsConnection?.pageInfo,
    ...rest,
  }
}

type OriginalCommentEvent = Omit<GetCommentEditsQuery['events'][number], 'data'> & {
  data: { __typename?: 'CommentCreatedEventData'; text: string }
}

type EditedCommentEvent = Omit<GetCommentEditsQuery['events'][number], 'data'> & {
  data: { __typename?: 'CommentTextUpdatedEventData'; newText: string }
}

export const useCommentEdits = (
  commentId?: string,
  opts?: QueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentEditsQuery({
    ...opts,
    variables: { commentId: commentId || '' },
  })

  const originalComment = data?.events
    .filter((event): event is OriginalCommentEvent => event.data.__typename === 'CommentCreatedEventData')
    .map((event) => ({ ...event, data: { ...event.data, text: event.data.text } }))[0]

  const commentEdits = data?.events
    .filter((event): event is EditedCommentEvent => event.data.__typename === 'CommentTextUpdatedEventData')
    .map((event) => ({ ...event, data: { ...event.data, text: event.data.newText } }))

  return {
    commentEdits: commentEdits && originalComment && [originalComment, ...commentEdits],
    ...rest,
  }
}

export const useGetTipTiers = () => {
  const { data, ...rest } = useGetTipTiersQuery()

  return {
    tipTiers: data ? omit(data.tipTiers, ['__typename']) : undefined,
    ...rest,
  }
}
