import React, { useState, useEffect, useRef } from 'react'
import { useActiveUser } from '@/hooks'
import { useMembership } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { Placeholder, Text, Button, ExpandButton, IconButton } from '@/shared/components'
import { SvgGlyphAddVideo, SvgGlyphCheck, SvgGlyphLogOut, SvgGlyphNewChannel } from '@/shared/icons'

import {
  StyledTopbarBase,
  StudioTopbarContainer,
  MemberInfoContainer,
  MemberTitleText,
  MemberTextContainer,
  ChannelInfoContainer,
  NewChannelAvatar,
  StyledAvatar,
  TextContainer,
  DrawerContainer,
  NewChannel,
  NewChannelIconContainer,
  StyledLink,
  AvatarPlaceholder,
} from './StudioTopbar.style'

type ChannelInfoProps = {
  active?: boolean
  memberName?: string
  channel?: BasicChannelFieldsFragment
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

type MemberInfoProps = {
  memberName?: string
  memberAvatar?: string
  hasChannels?: boolean
}

type NavDrawerProps = {
  active?: boolean
  channels?: BasicChannelFieldsFragment[]
  memberName?: string
  memberAvatar?: string
  currentChannel?: BasicChannelFieldsFragment
  onCurrentChannelChange: (channelId: string) => void
  onLogoutClick: () => void
  handleClose: () => void
}

const StudioTopbar: React.FC = () => {
  const { activeUser, setActiveChannel } = useActiveUser()
  const { membership, loading, error } = useMembership(
    {
      where: { id: activeUser?.memberId },
    },
    {
      skip: !activeUser?.memberId,
    }
  )

  const currentChannel = membership?.channels.find((channel) => channel.id === activeUser?.channelId)

  const [isDrawerActive, setDrawerActive] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  const handleCurrentChannelChange: (channelId: string) => void = (channelId) => {
    const channel = membership?.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      return
    }
    setActiveChannel(channelId)
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

  if (error) {
    throw error
  }

  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioTopbarContainer>
          <IconButton to={relativeRoutes.studio.uploadVideo()}>
            <SvgGlyphAddVideo />
          </IconButton>
          {loading ? (
            <ChannelInfoPlaceholder />
          ) : membership?.channels.length ? (
            <ChannelInfo channel={currentChannel} memberName={membership.handle} onClick={handleDrawerToggle} />
          ) : (
            <ChannelInfoContainer onClick={handleDrawerToggle}>
              <NewChannelAvatar newChannel size="small" />
              <TextContainer>
                <Text>New Channel</Text>
                <Text>{membership?.handle}</Text>
              </TextContainer>
            </ChannelInfoContainer>
          )}
          <ExpandButton expanded={isDrawerActive} onClick={handleDrawerToggle} />
        </StudioTopbarContainer>
      </StyledTopbarBase>
      <NavDrawer
        ref={drawerRef}
        active={isDrawerActive}
        memberName={membership?.handle}
        memberAvatar={membership?.avatarUri as string | undefined}
        channels={membership?.channels}
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
  ({ active = false, channel, memberName, onClick }, ref) => {
    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="small" imageUrl={channel?.avatarPhotoUrl} />
        <TextContainer>
          <Text>{channel ? channel.title : 'New Channel'}</Text>
          <Text>{memberName}</Text>
        </TextContainer>
        {active && <SvgGlyphCheck />}
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
    const hasChannels = !!channels?.length
    return (
      <DrawerContainer ref={ref} isActive={active} hasChannels={hasChannels}>
        {hasChannels && (
          <>
            <Text variant="h6">My Channels</Text>
            {channels?.map((channel) => (
              <ChannelInfo
                key={channel.id}
                channel={channel}
                memberName={memberName}
                active={channel.id === currentChannel?.id}
                onClick={() => onCurrentChannelChange(channel.id)}
              />
            ))}
            <StyledLink to={absoluteRoutes.studio.newChannel()} onClick={handleClose}>
              <NewChannel>
                <NewChannelIconContainer>
                  <SvgGlyphNewChannel />
                </NewChannelIconContainer>
                <Text>New Channel</Text>
              </NewChannel>
            </StyledLink>
          </>
        )}
        <MemberInfo memberName={memberName} memberAvatar={memberAvatar} hasChannels={hasChannels} />
        <Button icon={<SvgGlyphLogOut />} variant="secondary" onClick={onLogoutClick}>
          Log out as a member
        </Button>
      </DrawerContainer>
    )
  }
)
NavDrawer.displayName = 'NavDrawer'

const ChannelInfoPlaceholder = () => {
  return (
    <ChannelInfoContainer>
      <AvatarPlaceholder />
      <TextContainer>
        <Placeholder width="100%" height="15px" bottomSpace="6px" />
        <Placeholder width="70%" height="10px" />
      </TextContainer>
    </ChannelInfoContainer>
  )
}

export default StudioTopbar
