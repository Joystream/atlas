import { CommentReactionsCountByReactionIdFieldsFragment } from '@/api/queries'
import { ReactionChipProps } from '@/components/_comments/ReactionChip'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'

type GetCommentReactionsArgs = {
  userReactionsIds?: number[]
  reactionsCount: CommentReactionsCountByReactionIdFieldsFragment[]
  processingReactionsIds: ReactionId[]
  deleted?: boolean
}

export const getCommentReactions = ({
  userReactionsIds,
  reactionsCount,
  processingReactionsIds,
  deleted,
}: GetCommentReactionsArgs): ReactionChipProps[] => {
  const defaultReactions: ReactionChipProps[] = Object.keys(REACTION_TYPE).map((reactionId) => ({
    reactionId: Number(reactionId) as ReactionId,
    state: 'processing' as const,
    count: 0,
  }))

  return defaultReactions.map((reaction) => {
    return {
      ...reaction,
      state: processingReactionsIds.includes(reaction.reactionId) ? 'processing' : deleted ? 'read-only' : 'default',
      count: reactionsCount.find((r) => r.reactionId === reaction.reactionId)?.count || 0,
      active: !!userReactionsIds?.find((r) => r === reaction.reactionId),
    }
  })
}
