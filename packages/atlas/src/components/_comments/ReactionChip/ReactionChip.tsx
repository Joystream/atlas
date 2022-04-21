import React from 'react'

export type ReactionChipProps = {
  active?: boolean
  reaction: 'amusment' | 'love' | 'laugh' | 'shock' | 'anger'
  // 	&#128077; | 2764 | 1f602 | 1f92f | 1f620
  state: 'default' | 'disabled' | 'processing'
}

export const ReactionChip: React.FC<ReactionChipProps> = () => {
  return <div>&#128077;</div>
}
