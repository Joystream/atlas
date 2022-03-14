import React from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import {
  AvatarGroupWrapper,
  AvatarWrapper,
  Caption,
  MembersWrapper,
  StyledAvatar,
  StyledAvatarGroup,
} from './NftCard.styles'

import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type Member = {
  assetUrl?: string | null
  name?: string | null
}

type MembersProps =
  | {
      loading?: boolean
      caption: 'Creator' | 'Owner'
      members: Member
    }
  | { caption: 'Supporters'; members: Member[]; loading?: boolean }

export const Members: React.FC<MembersProps> = ({ caption, members, loading }) => {
  const avatars =
    members && Array.isArray(members)
      ? members.map((member) => ({ assetUrl: member.assetUrl, ...(member.name ? { tooltipText: member.name } : {}) }))
      : null
  const isArray = Array.isArray(members)
  return (
    <MembersWrapper>
      <Caption variant="t200" secondary>
        {caption}
      </Caption>
      {isArray && avatars && (
        <AvatarGroupWrapper>
          <StyledAvatarGroup
            loading={loading}
            avatars={avatars.slice(0, 3)}
            size="small"
            avatarStrokeColor={cVar('colorBackgroundStrong', true)}
          />
          <Text variant="t100" secondary>
            {avatars.length > 3 && `+${avatars.length - 3}`}
          </Text>
        </AvatarGroupWrapper>
      )}
      {!isArray && (
        <AvatarWrapper>
          <StyledAvatar size="bid" assetUrl={members.assetUrl} loading={loading} />
          {loading ? <SkeletonLoader width={64} height={24} /> : <Text variant="h300">{members.name}</Text>}
        </AvatarWrapper>
      )}
    </MembersWrapper>
  )
}
