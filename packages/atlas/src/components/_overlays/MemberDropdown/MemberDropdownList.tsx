import { FC } from 'react'
import { useNavigate } from 'react-router'

import { BasicChannelFieldsFragment, BasicMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { SvgActionChannel, SvgActionChevronL, SvgActionNewChannel } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useUser } from '@/providers/user'

import { SectionContainer, SwitchMemberItemListContainer } from './MemberDropdown.styles'

type DropdownType = 'member' | 'channel'

type MemberDropdownListProps = {
  closeDropdown?: () => void
  type: DropdownType
  onChannelChange?: (channelId: string) => void
  switchToNav: (type: DropdownType) => void
  publisher?: boolean
}
export const MemberDropdownList: FC<MemberDropdownListProps> = ({
  closeDropdown,
  type,
  switchToNav,
  publisher,
  onChannelChange,
}) => {
  const { channelId, activeMembership, memberships, setActiveUser } = useUser()
  const navigate = useNavigate()

  const handleAddNewMember = () => {
    // setSignInModalOpen(true)
    closeDropdown?.()
  }

  const handleMemberChange = (memberId: string, accountId: string, channelId: string | null) => {
    setActiveUser({ accountId, memberId, channelId })

    closeDropdown?.()

    if (publisher) {
      navigate(absoluteRoutes.studio.index())
    }
  }
  return (
    <>
      <SwitchMemberItemListContainer>
        <ListItem
          onClick={() => switchToNav(type)}
          nodeStart={<SvgActionChevronL />}
          label={type ? 'Switch channel' : 'Switch member'}
        />
      </SwitchMemberItemListContainer>
      <SectionContainer>
        {type === 'member'
          ? memberships?.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                selected={member.id === activeMembership?.id}
                onClick={() => handleMemberChange(member.id, member.controllerAccount, member.channels[0]?.id || null)}
              />
            ))
          : activeMembership?.channels.map((channel) => (
              <ChannelListItem
                key={channel.id}
                channel={channel}
                selected={channel.id === channelId}
                onClick={() => onChannelChange?.(channel.id)}
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
          onClick={() => (type === 'member' ? handleAddNewMember() : closeDropdown?.())}
          label={type === 'member' ? 'Add new member...' : 'Add new channel...'}
          to={type === 'channel' ? absoluteRoutes.studio.newChannel() : undefined}
        />
      </SectionContainer>
    </>
  )
}

type ChannelListItemProps = {
  channel: BasicChannelFieldsFragment
  selected: boolean
  onClick: () => void
}
const ChannelListItem: FC<ChannelListItemProps> = ({ channel, selected, onClick }) => {
  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={url} loading={isLoadingAsset} />}
      label={channel?.title ?? ''}
      caption={channel ? `${channel?.follows} followers` : undefined}
      selected={selected}
    />
  )
}

type MemberListItemProps = {
  member: BasicMembershipFieldsFragment
  selected: boolean
  onClick: () => void
}
const MemberListItem: FC<MemberListItemProps> = ({ member, selected, onClick }) => {
  const { url, isLoadingAsset } = useMemberAvatar(member)
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={url} loading={isLoadingAsset} />}
      label={member.handle ?? ''}
      selected={selected}
      asButton
    />
  )
}
