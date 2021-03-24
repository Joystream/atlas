import React, { useState, useEffect, useRef } from 'react'
import { useActiveUser } from '@/hooks'
import { useMemberships } from '@/api/hooks'
import { BasicChannelFieldsFragment, BasicMembershipFieldsFragment } from '@/api/queries'
import routes from '@/config/routes'
import { Text, Icon, Button } from '@/shared/components'
import {
  StyledTopbarBase,
  StudioTopbarContainer,
  DrawerButton,
  MemberInfoContainer,
  MemberTitleText,
  MemberTextContainer,
  ChannelInfoContainer,
  NewChannelIcon,
  StyledAvatar,
  TextContainer,
  DrawerContainer,
  NewChannel,
  NewChannelIconContainer,
  StyledLink,
} from './StudioTopbar.style'

type ChannelInfoProps = {
  active?: boolean
  memberName?: string
  channel: BasicChannelFieldsFragment | undefined
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

type MemberInfoProps = {
  member: BasicMembershipFieldsFragment | undefined
}

type NavDrawerProps = {
  active?: boolean
  channels: BasicChannelFieldsFragment[] | undefined
  currentChannel: BasicChannelFieldsFragment | undefined
  onCurrentChannelChange: (channelId: string) => void
  onLogoutClick: () => void
  handleClose: () => void
} & MemberInfoProps

const StudioTopbar: React.FC = () => {
  const { activeUser, setActiveChannel } = useActiveUser()
  const { memberships, loading, error } = useMemberships(
    {
      where: { controllerAccount_eq: activeUser?.accountId as string },
    },
    {
      skip: activeUser?.accountId === undefined,
      onCompleted: () => {
        const member = memberships?.find((member) => member.id === activeUser?.memberId)
        const channel = member?.channels.find((channel) => channel.id === activeUser?.channelId)
        setCurrentMember(member)
        setCurrentChannel(channel)
      },
    }
  )
  const [currentMember, setCurrentMember] = useState<BasicMembershipFieldsFragment>()
  const [currentChannel, setCurrentChannel] = useState<BasicChannelFieldsFragment>()
  const [isDrawerActive, setDrawerActive] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  const handleCurrentChannelChange: (channelId: string) => void = (channelId) => {
    const channel = currentMember?.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      return
    }
    setActiveChannel(channelId)
    setCurrentChannel(channel)
    setDrawerActive(false)
  }

  const handleLogout = () => {
    // TODO add logic for Logout
    setDrawerActive(false)
  }

  const handleAddVideoViewOpen = () => {
    // TODO add logic for opening Add Video View
  }

  const handleDrawerToggle: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    e.stopPropagation()
    setDrawerActive(!isDrawerActive)
  }

  useEffect(() => {
    if (!isDrawerActive) {
      return
    }
    const handleClickOutside = (event: Event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        // stop propagation so drawer doesn't get triggered again on button click
        // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
        event.preventDefault()
        event.stopPropagation()
        setDrawerActive(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isDrawerActive])

  if (error) {
    throw error
  }

  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioTopbarContainer>
          <Button icon="add-video" onClick={handleAddVideoViewOpen} />
          {member.channels.length ? (
            <ChannelInfo channel={currentChannel} member={member.name} onClick={handleDrawerToggle} />
          ) : (
            <ChannelInfoContainer onClick={handleDrawerToggle}>
              <NewChannelIcon name="new-channel" />
              <TextContainer>
                <Text>New Channel</Text>
                <Text>{member.name}</Text>
              </TextContainer>
            </ChannelInfoContainer>
          )}
          <DrawerButton isActive={isDrawerActive} icon="chevron-down" variant="tertiary" onClick={handleDrawerToggle} />
        </StudioTopbarContainer>
      </StyledTopbarBase>
      <NavDrawer
        ref={drawerRef}
        active={isDrawerActive}
        member={currentMember}
        channels={currentMember?.channels}
        currentChannel={currentChannel}
        onCurrentChannelChange={handleCurrentChannelChange}
        onLogoutClick={handleLogout}
        handleClose={() => setDrawerActive(false)}
      />
    </>
  )
}

const MemberInfo: React.FC<MemberInfoProps> = ({ member }) => {
  return (
    <MemberInfoContainer>
      <StyledAvatar imageUrl={member?.avatarUri} />
      <MemberTextContainer>
        <Text>{member?.handle}</Text>
        <MemberTitleText>Member</MemberTitleText>
      </MemberTextContainer>
    </MemberInfoContainer>
  )
}

const ChannelInfo = React.forwardRef<HTMLDivElement, ChannelInfoProps>(
  ({ active = false, channel, memberName, onClick }, ref) => {
    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="medium" imageUrl={channel?.avatarPhotoUrl} />
        <TextContainer>
          <Text>{channel ? channel.name : 'New Channel'}</Text>
          <Text>{member}</Text>
        </TextContainer>
        {active && <Icon name="check" />}
      </ChannelInfoContainer>
    )
  }
)
ChannelInfo.displayName = 'ChannelInfo'

const NavDrawer = React.forwardRef<HTMLDivElement, NavDrawerProps>(
  (
    { active, memberName, memberAvatar, channels, currentChannel, onCurrentChannelChange, onLogoutClick, handleClose },
    ref
  ) => {
    const hasChannels = !!channels.length
    return (
      <DrawerContainer ref={ref} isActive={active} hasChannels={hasChannels}>
        {hasChannels && (
          <>
            <Text variant="h6">My Channels</Text>
            {channels.map((channel) => (
              <ChannelInfo
                key={channel.name}
                channel={channel}
                member={memberName}
                active={channel.name === currentChannel.name}
                onClick={() => onCurrentChannelChange(channel)}
              />
            ))}
            <StyledLink to={routes.studio.newChannel()} onClick={handleClose}>
              <NewChannel>
                <NewChannelIconContainer>
                  <Icon name="new-channel" />
                </NewChannelIconContainer>
                <Text>New Channel</Text>
              </NewChannel>
            </StyledLink>
          </>
        )}
        <MemberInfo memberName={memberName} memberAvatar={memberAvatar} hasChannels={hasChannels} />
        <Button icon="logout" variant="secondary" onClick={onLogoutClick}>
          Log out as a member
        </Button>
      </DrawerContainer>
    )
  }
)
NavDrawer.displayName = 'NavDrawer'

export default StudioTopbar
