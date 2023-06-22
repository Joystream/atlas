import { FC, useMemo } from 'react'

import {
  BasicMembershipFieldsFragment,
  FullMembershipFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChannel, SvgActionChevronL, SvgActionNewChannel } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { IconWrapper } from '@/components/IconWrapper'
import { ListItem } from '@/components/ListItem'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'

import { SectionContainer } from './MemberDropdown.styles'
import { SwitchMemberItemListContainer } from './MemberDropdownList.styles'

type DropdownType = 'member' | 'channel'

type MemberDropdownListProps = {
  type: DropdownType
  memberships: FullMembershipFieldsFragment[]
  activeMembership?: FullMembershipFieldsFragment | null
  channelId: string | null
  onAddNewChannel?: () => void
  onChannelChange?: (channelId: string) => void
  onSwitchToNav: (type: DropdownType) => void
  onMemberChange: (memberId: string, accountId: string, channelId: string | null) => void
  onAddNewMember: () => void
}
export const MemberDropdownList: FC<MemberDropdownListProps> = ({
  type,
  channelId,
  memberships,
  activeMembership,
  onAddNewChannel,
  onSwitchToNav,
  onChannelChange,
  onMemberChange,
  onAddNewMember,
}) => {
  const sortedMemberChannels = useMemo(() => {
    if (!activeMembership) {
      return []
    }
    return activeMembership.channels.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }, [activeMembership])

  return (
    <>
      <SwitchMemberItemListContainer>
        <ListItem
          onClick={() => onSwitchToNav(type)}
          nodeStart={<SvgActionChevronL />}
          label={type === 'channel' ? 'Switch channel' : 'Switch member'}
        />
      </SwitchMemberItemListContainer>
      <SectionContainer>
        {type === 'member'
          ? memberships?.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                selected={member.id === activeMembership?.id}
                onClick={() => onMemberChange(member.id, member.controllerAccount, member.channels[0]?.id || null)}
              />
            ))
          : sortedMemberChannels.map((channel) => (
              <ListItem
                key={channel.id}
                onClick={() => onChannelChange?.(channel.id)}
                nodeStart={<Avatar assetUrl={channel.avatarPhoto?.resolvedUrls} size={32} />}
                label={channel?.title ?? ''}
                caption={channel ? `${channel?.followsNum} followers` : undefined}
                selected={channel.id === channelId}
              />
            ))}
        <ListItem
          nodeStart={
            type === 'member' ? (
              <IconWrapper icon={<SvgActionNewChannel />} />
            ) : (
              <IconWrapper icon={<SvgActionChannel />} />
            )
          }
          onClick={() => (type === 'member' ? onAddNewMember() : onAddNewChannel?.())}
          label={type === 'member' ? 'Add new member...' : 'Add new channel...'}
          to={type === 'channel' ? absoluteRoutes.studio.newChannel() : undefined}
        />
      </SectionContainer>
    </>
  )
}

type MemberListItemProps = {
  member: BasicMembershipFieldsFragment
  selected: boolean
  onClick: () => void
}
const MemberListItem: FC<MemberListItemProps> = ({ member, selected, onClick }) => {
  const { urls, isLoadingAsset } = getMemberAvatar(member)
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={urls} loading={isLoadingAsset} />}
      label={member.handle ?? ''}
      selected={selected}
      asButton
    />
  )
}
