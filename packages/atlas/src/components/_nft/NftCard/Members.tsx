import { FC } from 'react'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar } from '@/styles'

import {
  AvatarGroupWrapper,
  AvatarWrapper,
  Caption,
  MemberName,
  MembersWrapper,
  StyledAvatar,
  StyledAvatarGroup,
} from './NftCard.styles'

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

export const Members: FC<MembersProps> = ({ caption, members, loading }) => {
  const avatars =
    members && Array.isArray(members)
      ? members.map((member) => ({ assetUrl: member.assetUrl, ...(member.name ? { tooltipText: member.name } : {}) }))
      : null
  const isArray = Array.isArray(members)
  return (
    <MembersWrapper>
      <Caption variant="t200" color="default">
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
          <Text variant="t100" color="default">
            {avatars.length > 3 && `+${avatars.length - 3}`}
          </Text>
        </AvatarGroupWrapper>
      )}
      {!isArray && (
        <AvatarWrapper>
          <StyledAvatar size="bid" assetUrl={members.assetUrl} loading={loading} />
          {loading ? <SkeletonLoader width={64} height={24} /> : <MemberName variant="h300">{members.name}</MemberName>}
        </AvatarWrapper>
      )}
    </MembersWrapper>
  )
}
