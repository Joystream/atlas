import React from 'react'

import { MemberBadgeWrapper, RemoveButton, StyledHandleText, StyledSVGCloseIcon } from './MemberBadge.styles'

import { Avatar } from '../Avatar'

export type MemberBadgeProps = {
  avatarUri?: string | null
  handle?: string | null
  onDeleteClick?: () => void
  className?: string
}
export const MemberBadge: React.FC<MemberBadgeProps> = ({ avatarUri, handle, onDeleteClick, className }) => {
  return (
    <MemberBadgeWrapper className={className}>
      <Avatar size="bid" assetUrl={avatarUri} />
      <StyledHandleText variant="t100" as="p">
        {handle}
      </StyledHandleText>
      <RemoveButton onClick={onDeleteClick}>
        <StyledSVGCloseIcon />
      </RemoveButton>
    </MemberBadgeWrapper>
  )
}
