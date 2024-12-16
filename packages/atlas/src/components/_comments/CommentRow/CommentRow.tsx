import { FC, MouseEvent, PropsWithChildren, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { CommentTipTier } from '@/api/queries/__generated__/baseTypes.generated'
import { Avatar, AvatarSize } from '@/components/Avatar'
import { AvatarContainer } from '@/components/_comments/Comment/Comment.styles'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContentWrapper, OutlineBox } from './CommentRow.styles'

export type CommentRowProps = PropsWithChildren<{
  indented?: boolean
  processing?: boolean
  highlighted?: boolean
  isMemberAvatarLoading?: boolean
  memberAvatarUrls?: string[] | null
  memberUrl?: string
  className?: string
  isInput?: boolean
  tipTier?: CommentTipTier | null
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void
}>

export const CommentRow: FC<CommentRowProps> = ({
  indented,
  processing,
  highlighted,
  children,
  memberAvatarUrls,
  isMemberAvatarLoading,
  memberUrl = '',
  className,
  isInput = false,
  tipTier,
  onMouseEnter,
  onMouseLeave,
}) => {
  const smMatch = useMediaMatch('sm')

  const getAvatarSize = useCallback((): AvatarSize => {
    if (smMatch) {
      if (indented) {
        return 32
      }
      return 40
    } else {
      if (indented) {
        return 24
      }
      return 32
    }
  }, [indented, smMatch])

  const avatarSize = getAvatarSize()
  return (
    <OutlineBox
      processing={processing}
      highlighted={!!highlighted}
      isInput={isInput}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ContentWrapper indented={!!indented}>
        <div>
          {memberUrl ? (
            <Link to={memberUrl}>
              <AvatarContainer tier={tipTier}>
                <Avatar assetUrls={memberAvatarUrls} size={avatarSize} loading={isMemberAvatarLoading} clickable />
              </AvatarContainer>
            </Link>
          ) : (
            <AvatarContainer tier={tipTier}>
              <Avatar assetUrls={memberAvatarUrls} size={avatarSize} loading={isMemberAvatarLoading} />
            </AvatarContainer>
          )}
        </div>
        <div className={className}>{children}</div>
      </ContentWrapper>
    </OutlineBox>
  )
}
