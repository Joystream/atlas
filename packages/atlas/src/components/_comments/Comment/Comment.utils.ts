import { CommentReactionsCountByReactionIdFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { ReactionChipProps } from '@/components/_comments/ReactionChip'
import { atlasConfig } from '@/config'
import { CommentReaction } from '@/joystream-lib/types'

type GetCommentReactionsArgs = {
  userReactionsIds?: number[]
  reactionsCount: CommentReactionsCountByReactionIdFieldsFragment[]
  processingReactionsIds: CommentReaction[]
  deleted?: boolean
}

export const getCommentReactions = ({
  userReactionsIds,
  reactionsCount,
  processingReactionsIds,
  deleted,
}: GetCommentReactionsArgs): ReactionChipProps[] => {
  const defaultReactions: ReactionChipProps[] = atlasConfig.features.comments.reactions.map(({ id }) => ({
    reactionId: id,
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
