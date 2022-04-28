import { QueryHookOptions } from '@apollo/client'

import {
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentsQuery,
  GetCommentsQueryVariables,
  useGetCommentEditsQuery,
  useGetCommentsQuery,
} from '@/api/queries'

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

export const useCommentEdits = (
  commentId?: string,
  opts?: QueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentEditsQuery({ ...opts, variables: { commentId: commentId || '' } })

  return {
    commentEdits: data?.commentTextUpdatedEvents,
    ...rest,
  }
}
