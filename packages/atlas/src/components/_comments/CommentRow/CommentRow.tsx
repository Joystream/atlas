import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContentWrapper, OutlineBox } from './CommentRow.styles'

export type CommentRowProps = {
  indented?: boolean
  processing?: boolean
  highlighted?: boolean
  isMemberAvatarLoading?: boolean
  isMemberAvatarClickable?: boolean
  memberAvatarUrl?: string | null
  memberUrl?: string
  className?: string
  withoutOutlineBox?: boolean
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void
}

export const CommentRow: React.FC<CommentRowProps> = ({
  indented,
  processing,
  highlighted,
  children,
  memberAvatarUrl,
  isMemberAvatarLoading,
  isMemberAvatarClickable = true,
  memberUrl = '',
  className,
  withoutOutlineBox = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const smMatch = useMediaMatch('sm')

  const getAvatarSize = useCallback((): AvatarSize => {
    if (smMatch) {
      if (indented) {
        return 'default'
      }
      return 'small'
    } else {
      if (indented) {
        return 'bid'
      }
      return 'default'
    }
  }, [indented, smMatch])

  const avatarSize = getAvatarSize()
  return (
    <OutlineBox
      processing={processing}
      highlighted={!!highlighted}
      withoutOutlineBox={withoutOutlineBox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ContentWrapper indented={!!indented}>
        <Link to={memberUrl}>
          <Avatar
            assetUrl={memberAvatarUrl}
            size={avatarSize}
            loading={isMemberAvatarLoading}
            clickable={isMemberAvatarClickable}
          />
        </Link>
        <div className={className}>{children}</div>
      </ContentWrapper>
    </OutlineBox>
  )
}
