import React from 'react'

import { MemberBadgeWrapper, RemoveButton, StyledHandleText, StyledSVGCloseIcon } from './MemberBadge.styles'

import { Avatar } from '../Avatar'

export type MemberBadgeProps = {
  avatarUri?: string | null
  handle?: string | null
  onDeleteClick?: () => void
  className?: string
  isLoadingAvatar?: boolean
}
export const MemberBadge: React.FC<MemberBadgeProps> = ({
  avatarUri,
  handle,
  onDeleteClick,
  className,
  isLoadingAvatar,
}) => {
  return (
    <MemberBadgeWrapper className={className} withoutButton={!onDeleteClick}>
      <Avatar size="bid" assetUrl={avatarUri} loading={isLoadingAvatar} />
      <StyledHandleText variant="t100" as="p">
        {handle}
      </StyledHandleText>
      {onDeleteClick && (
        <RemoveButton type="button" onClick={onDeleteClick}>
          <StyledSVGCloseIcon />
        </RemoveButton>
      )}
    </MemberBadgeWrapper>
  )
}
