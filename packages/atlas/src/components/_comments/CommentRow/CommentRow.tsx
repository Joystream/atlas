import { FC, MouseEvent, PropsWithChildren, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
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
              <Avatar assetUrls={memberAvatarUrls} size={avatarSize} loading={isMemberAvatarLoading} clickable />
            </Link>
          ) : (
            <Avatar assetUrls={memberAvatarUrls} size={avatarSize} loading={isMemberAvatarLoading} />
          )}
        </div>
        <div className={className}>{children}</div>
      </ContentWrapper>
    </OutlineBox>
  )
}
