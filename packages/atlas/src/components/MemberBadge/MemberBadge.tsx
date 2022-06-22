import { FC } from 'react'

import { Text } from '@/components/Text'

import { MemberBadgeWrapper, RemoveButton, StyledSVGCloseIcon } from './MemberBadge.styles'

import { Avatar } from '../Avatar'

export type MemberBadgeProps = {
  avatarUri?: string | null
  handle?: string | null
  onDeleteClick?: () => void
  className?: string
  isLoadingAvatar?: boolean
}
export const MemberBadge: FC<MemberBadgeProps> = ({ avatarUri, handle, onDeleteClick, className, isLoadingAvatar }) => {
  return (
    <MemberBadgeWrapper className={className} withoutButton={!onDeleteClick}>
      <Avatar size="bid" assetUrl={avatarUri} loading={isLoadingAvatar} />
      <Text variant="t100" as="p" margin={{ left: 2 }}>
        {handle}
      </Text>
      {onDeleteClick && (
        <RemoveButton type="button" onClick={onDeleteClick}>
          <StyledSVGCloseIcon />
        </RemoveButton>
      )}
    </MemberBadgeWrapper>
  )
}
