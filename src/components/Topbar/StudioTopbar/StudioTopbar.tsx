import React, { useState, useEffect, useRef } from 'react'
import { useActiveUser } from '@/hooks'
import routes from '@/config/routes'
import { Text, Icon, Button } from '@/shared/components'
import {
  StyledTopbarBase,
  StudioContainer,
  DrawerButton,
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
  hasChannels?: boolean
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
  const { activeUser, setActiveChannel } = useActiveUser()
  // TODO Add member fetching
  const [currentChannel, setCurrentChannel] = useState(member.channels[0])

  const [isDrawerActive, setDrawerActive] = useState(false)

  const drawerRef = useRef<HTMLDivElement | null>(null)

  const handleCurrentChannelChange: (channel: Channel) => void = (channel) => {
    setCurrentChannel(channel)
    setDrawerActive(false)
  }

  const handleLogout = () => {
    // TODO add logic for Logout
    setDrawerActive(false)
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

  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioContainer>
          <Button icon="add-video" />
          {member.channels.length ? (
            <ChannelInfo channel={currentChannel} member={member.name} onClick={handleDrawerToggle} />
          ) : (
            <StyledLink to={routes.studioNewChannel()}>
              <ChannelInfoContainer>
                <Button icon="new-channel" variant="tertiary" size="large" />
                <TextContainer>
                  <Text>New Channel</Text>
                  <Text>{member.name}</Text>
                </TextContainer>
              </ChannelInfoContainer>
            </StyledLink>
          )}
          <DrawerButton isActive={isDrawerActive} icon="chevron-down" variant="tertiary" onClick={handleDrawerToggle} />
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

const MemberInfo: React.FC<MemberInfoProps> = ({ memberName, memberAvatar, hasChannels }) => {
  return (
    <MemberInfoContainer hasChannels={hasChannels}>
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
        {hasChannels && <Text variant="h6">My Channels</Text>}
        {hasChannels &&
          channels.map((channel) => (
            <ChannelInfo
              key={channel.name}
              channel={channel}
              member={memberName}
              active={channel.name === currentChannel.name}
              onClick={() => onCurrentChannelChange(channel)}
            />
          ))}
        {hasChannels && (
          <StyledLink to={routes.studio.newChannel()} onClick={handleClose}>
            <NewChannel>
              <NewChannelIconContainer>
                <Icon name="new-channel" />
              </NewChannelIconContainer>
              <Text>New Channel</Text>
            </NewChannel>
          </StyledLink>
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
