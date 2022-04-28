import React from 'react'

import { DesaturedText, MembershipHandle, OwnerPillWrapper } from './OwnerPill.styles'

import { Avatar } from '../Avatar'

export type OwnerPillProps = {
  handle?: string
  avatar?: {
    assetUrl?: string | null
    loading?: boolean
  }
  title?: string
  onClick?: (e: React.MouseEvent) => void
}

export const OwnerPill: React.FC<OwnerPillProps> = ({ handle, avatar, onClick, title }) => {
  return (
    <OwnerPillWrapper onClick={onClick} title={title}>
      <Avatar size="bid" {...avatar} />
      <DesaturedText variant="t100">Owner:</DesaturedText>
      <MembershipHandle variant="t100">{handle}</MembershipHandle>
    </OwnerPillWrapper>
  )
}
