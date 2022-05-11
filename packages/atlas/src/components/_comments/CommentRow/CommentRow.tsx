import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContentWrapper, OutlineBox } from './CommentRow.styles'

export type CommentRowProps = {
  indented?: boolean
  highlighted?: boolean
  isMemberAvatarLoading?: boolean
  isMemberAvatarClickable?: boolean
  memberAvatarUrl?: string | null
  memberUrl?: string
  className?: string
  withoutOutlineBox?: boolean
}

export const CommentRow: React.FC<CommentRowProps> = ({
  indented,
  highlighted,
  children,
  memberAvatarUrl,
  isMemberAvatarLoading,
  isMemberAvatarClickable = true,
  memberUrl = '',
  className,
  withoutOutlineBox = false,
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
    <OutlineBox highlighted={!!highlighted} withoutOutlineBox={withoutOutlineBox}>
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
