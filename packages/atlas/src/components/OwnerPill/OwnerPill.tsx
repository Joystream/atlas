import { FC, MouseEvent } from 'react'

import { DesaturedText, MembershipHandle, OwnerPillWrapper } from './OwnerPill.styles'

import { Avatar } from '../Avatar'

export type OwnerPillProps = {
  handle?: string
  avatar?: {
    assetUrls?: string[] | null
    loading?: boolean
  }
  title?: string
  onClick?: (e: MouseEvent) => void
}

export const OwnerPill: FC<OwnerPillProps> = ({ handle, avatar, onClick, title }) => {
  return (
    <OwnerPillWrapper onClick={onClick} title={title}>
      <Avatar size={24} {...avatar} />
      <DesaturedText as="span" variant="t100">
        Owner:
      </DesaturedText>
      <MembershipHandle as="span" variant="t100">
        {handle}
      </MembershipHandle>
    </OwnerPillWrapper>
  )
}
