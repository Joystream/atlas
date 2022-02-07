import React from 'react'

import { DesaturedText, MembershipHandle, OwnerPillWrapper } from './OwnerPill.styles'

import { Avatar } from '../Avatar'

export type OwnerPillProps = {
  handle?: string
  avatar?: string
  onClick?: (e: React.MouseEvent) => void
}

export const OwnerPill: React.FC<OwnerPillProps> = ({ handle, avatar, onClick }) => {
  return (
    <OwnerPillWrapper onClick={onClick}>
      <Avatar size="bid" assetUrl={avatar} />
      <DesaturedText variant="t100">Owner:</DesaturedText>
      <MembershipHandle variant="t100">{handle}</MembershipHandle>
    </OwnerPillWrapper>
  )
}
