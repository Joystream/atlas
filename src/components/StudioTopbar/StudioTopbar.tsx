import React, { useState, useEffect, useRef } from 'react'
import { Text, Icon } from '@/shared/components'
import {
  StyledTopbarBase,
  StudioContainer,
  DrawerButton,
  AddVideoButton,
  MemberInfoContainer,
  MemberTitleText,
  MemberTextContainer,
  ChannelInfoContainer,
  StyledAvatar,
  TextContainer,
  DrawerContainer,
  NewChannel,
  NewChannelIconContainer,
  StyledLink,
  LogoutButton,
} from './StudioTopbar.style'

type Channel = {
  name: string
  avatar: string
}
type ChannelInfoProps = {
  active?: boolean
  member: string
  channel: Channel
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

type MemberInfoProps = {
  memberName: string
  memberAvatar: string
}

type NavDrawerProps = {
  active?: boolean
  memberName: string
  memberAvatar: string
  channels: Channel[]
  currentChannel: Channel
  onCurrentChannelChange: (channel: Channel) => void
  onLogoutClick: () => void
  handleClose: () => void
}

const member = {
  name: 'Mikael Cowan',
  avatar: 'https://picsum.photos/300/300',
  channels: [
    { name: 'Wild Crypto Fan16', avatar: 'https://picsum.photos/201/300' },
    { name: 'Mild Crypto Skeptic', avatar: 'https://picsum.photos/202/300' },
    { name: 'Average Cryptocurrency Enjoyer', avatar: 'https://picsum.photos/203/300' },
  ],
}

const StudioTopbar: React.FC = () => {
  const [isDrawerActive, setDrawerActive] = useState(false)
  // TODO Change that to use hook for saving/getting currently active channel
  const [currentChannel, setCurrentChannel] = useState(member.channels[0])

  const drawerRef = useRef<HTMLDivElement | null>(null)
  const channelInfoRef = useRef<HTMLDivElement | null>(null)
  const drawerButtonRef = useRef<HTMLButtonElement | null>(null)

  const handleCurrentChannelChange: (channel: Channel) => void = (channel) => {
    setCurrentChannel(channel)
    setDrawerActive(false)
  }

  const handleLogout = () => {
    // TODO add logic for Logout
    window.alert("You've been logged out")
  }

  const handleDrawerToggle: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    e.stopPropagation()
    setDrawerActive(!isDrawerActive)
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        channelInfoRef.current?.contains(event.target as Node) ||
        drawerButtonRef.current?.contains(event.target as Node)
      ) {
        return
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setDrawerActive(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioContainer>
          <AddVideoButton icon="add-video" />
          <ChannelInfo
            channel={currentChannel}
            member={member.name}
            onClick={handleDrawerToggle}
            ref={channelInfoRef}
          />
          <DrawerButton
            isActive={isDrawerActive}
            icon="chevron-down"
            variant="tertiary"
            onClick={handleDrawerToggle}
            ref={drawerButtonRef}
          />
        </StudioContainer>
      </StyledTopbarBase>
      <NavDrawer
        ref={drawerRef}
        active={isDrawerActive}
        memberName={member.name}
        memberAvatar={member.avatar}
        channels={member.channels}
        currentChannel={currentChannel}
        onCurrentChannelChange={handleCurrentChannelChange}
        onLogoutClick={handleLogout}
        handleClose={() => setDrawerActive(false)}
      />
    </>
  )
}

const MemberInfo: React.FC<MemberInfoProps> = ({ memberName, memberAvatar }) => {
  return (
    <MemberInfoContainer>
      <StyledAvatar imageUrl={memberAvatar} />
      <MemberTextContainer>
        <Text>{memberName}</Text>
        <MemberTitleText>Member</MemberTitleText>
      </MemberTextContainer>
    </MemberInfoContainer>
  )
}

const ChannelInfo = React.forwardRef<HTMLDivElement, ChannelInfoProps>(
  ({ active = false, channel, member, onClick }, ref) => {
    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="medium" imageUrl={channel.avatar} />
        <TextContainer>
          <Text>{channel.name}</Text>
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
    return (
      <DrawerContainer ref={ref} isActive={active}>
        <MemberInfo memberName={memberName} memberAvatar={memberAvatar} />
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
        <StyledLink to="channel/new" onClick={handleClose}>
          <NewChannel>
            <NewChannelIconContainer>
              <Icon name="new-channel" />
            </NewChannelIconContainer>
            <Text>New Channel</Text>
          </NewChannel>
        </StyledLink>
        <LogoutButton icon="logout" variant="secondary" onClick={onLogoutClick}>
          Log out as a member
        </LogoutButton>
      </DrawerContainer>
    )
  }
)
NavDrawer.displayName = 'NavDrawer'

export default StudioTopbar
