export const REACTION_TYPE = {
  1: { emoji: '👍', name: 'like' },
  2: { emoji: '❤️', name: 'love' },
  3: { emoji: '😂', name: 'laugh' },
  4: { emoji: '🤯', name: 'shock' },
  5: { emoji: '😠', name: 'anger' },
} as const

export type ReactionId = keyof typeof REACTION_TYPE
