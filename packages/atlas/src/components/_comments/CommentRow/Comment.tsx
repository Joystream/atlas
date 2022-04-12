import React from 'react'

import { CommentInput } from './CommentInput'
import { CommentRow, CommentRowProps } from './CommentRow'

export type CommentProps = CommentRowProps

// Comment component and types are WIP
export const Comment: React.FC<CommentProps> = ({ ...props }) => {
  return (
    <CommentRow {...props}>
      <CommentInput />
    </CommentRow>
  )
}
