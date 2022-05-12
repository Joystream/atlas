export type ReactionId = 1 | 2 | 3 | 4 | 5

export const REACTION_TYPE = {
  1: { emoji: '👍', name: 'like' },
  2: { emoji: '❤️', name: 'love' },
  3: { emoji: '😂', name: 'laugh' },
  4: { emoji: '🤯', name: 'shock' },
  5: { emoji: '😠', name: 'anger' },
} as const
