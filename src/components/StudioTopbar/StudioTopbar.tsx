import React, { useState, useEffect } from 'react'
import { Button, Text, Icon } from '@/shared/components'
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
  handleCurrentChannelChange: (channel: Channel) => void
}

const member = {
  name: 'Mikael Cowan',
  avatar: 'https://picsum.photos/300/300',
  channels: [
    { name: 'Wild Crypto Fan16', avatar: 'https://picsum.photos/200/300' },
    { name: 'Mild Crypto Skeptic', avatar: 'https://picsum.photos/200/300' },
    { name: 'Average Cryptocurrency Enjoyer', avatar: 'https://picsum.photos/200/300' },
  ],
}

const StudioTopbar: React.FC = () => {
  const [isDrawerActive, setDrawerActive] = useState(false)

  const [currentChannel, setCurrentChannel] = useState(member.channels[0])
  const handleCurrentChannelChange: (channel: Channel) => void = (channel) => {
    setCurrentChannel(channel)
  }

  useEffect(() => {
    if (!isDrawerActive) {
      return
    }
    document.addEventListener('click', () => setDrawerActive(false), { once: true })
  }, [isDrawerActive])

  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioContainer>
          <Button icon="add-video" />
          <ChannelInfo channel={currentChannel} member={member.name} onClick={() => setDrawerActive(!isDrawerActive)} />
          <DrawerButton
            isActive={isDrawerActive}
            icon="chevron-down"
            variant="tertiary"
            onClick={() => setDrawerActive(!isDrawerActive)}
          />
        </StudioContainer>
      </StyledTopbarBase>
      <NavDrawer
        active={isDrawerActive}
        memberName={member.name}
        memberAvatar={member.avatar}
        channels={member.channels}
        currentChannel={currentChannel}
        handleCurrentChannelChange={handleCurrentChannelChange}
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

const ChannelInfo: React.FC<ChannelInfoProps> = ({ active = false, channel, member, onClick }) => {
  return (
    <ChannelInfoContainer onClick={onClick} active={active}>
      <StyledAvatar imageUrl={channel.avatar} />
      <TextContainer>
        <Text>{channel.name}</Text>
        <Text>{member}</Text>
      </TextContainer>
      {active && <Icon name="check" />}
    </ChannelInfoContainer>
  )
}

const NavDrawer: React.FC<NavDrawerProps> = ({
  active,
  memberName,
  memberAvatar,
  channels,
  currentChannel,
  handleCurrentChannelChange,
}) => {
  return (
    <DrawerContainer active={active}>
      <MemberInfo memberName={memberName} memberAvatar={memberAvatar} />
      <Text variant="h6">My Channels</Text>
      {channels.map((channel) => (
        <ChannelInfo
          key={channel.name}
          channel={channel}
          member={memberName}
          active={channel.name === currentChannel.name}
          onClick={() => handleCurrentChannelChange(channel)}
        />
      ))}
      <StyledLink to="studio/channel/new">
        <NewChannel>
          <NewChannelIconContainer>
            <Icon name="new-channel" />
          </NewChannelIconContainer>
          <Text>New Channel</Text>
        </NewChannel>
      </StyledLink>
      <LogoutButton icon="logout" variant="secondary">
        Log out as a member
      </LogoutButton>
    </DrawerContainer>
  )
}

export default StudioTopbar
