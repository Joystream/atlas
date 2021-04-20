import React, { useState, useEffect, useRef } from 'react'
import { useActiveUser, useEditVideoSheet } from '@/hooks'
import { useMembership } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { Placeholder, Text, Button, ExpandButton, IconButton } from '@/shared/components'
import { SvgGlyphAddVideo, SvgGlyphCheck, SvgGlyphLogOut, SvgGlyphNewChannel } from '@/shared/icons'

import {
  StyledTopbarBase,
  StudioTopbarContainer,
  MemberInfoContainer,
  MemberInnerContainer,
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
  GlyphCheckContainer,
} from './StudioTopbar.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { createUrlFromAsset } from '@/utils/asset'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
}

type ChannelInfoProps = {
  active?: boolean
  memberName?: string
  channel?: BasicChannelFieldsFragment
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

type MemberInfoProps = {
  hasChannels?: boolean
} & Pick<NavDrawerProps, 'memberAvatar' | 'memberName' | 'onLogoutClick'>

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

const StudioTopbar: React.FC<StudioTopbarProps> = ({ hideChannelInfo }) => {
  const { activeUser, setActiveChannel } = useActiveUser()
  const { membership, loading, error } = useMembership(
    {
      where: { id: activeUser?.memberId },
    },
    {
      skip: !activeUser?.memberId,
    }
  )
  const { sheetState } = useEditVideoSheet()

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
        {!hideChannelInfo && (
          <StudioTopbarContainer>
            <CSSTransition
              in={sheetState !== 'open'}
              unmountOnExit
              mountOnEnter
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              <IconButton to={absoluteRoutes.studio.editVideo()}>
                <SvgGlyphAddVideo />
              </IconButton>
            </CSSTransition>
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
        )}
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

const MemberInfo: React.FC<MemberInfoProps> = ({ memberName, memberAvatar, hasChannels, onLogoutClick }) => {
  return (
    <MemberInfoContainer hasChannels={hasChannels}>
      <MemberInnerContainer>
        <StyledAvatar imageUrl={memberAvatar} />
        <MemberTextContainer>
          <Text>{memberName}</Text>
          <MemberTitleText variant="caption">Member</MemberTitleText>
        </MemberTextContainer>
      </MemberInnerContainer>
      <Button icon={<SvgGlyphLogOut />} variant="secondary" onClick={onLogoutClick}>
        Log out
      </Button>
    </MemberInfoContainer>
  )
}

const ChannelInfo = React.forwardRef<HTMLDivElement, ChannelInfoProps>(
  ({ active = false, channel, memberName, onClick }, ref) => {
    const avatarPhotoUrl = createUrlFromAsset(
      channel?.avatarPhotoAvailability,
      channel?.avatarPhotoUrls,
      channel?.avatarPhotoDataObject
    )

    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="small" imageUrl={avatarPhotoUrl} />
        <TextContainer>
          <Text variant="body1">{channel ? channel.title : 'New Channel'}</Text>
          {memberName && (
            <Text variant="caption" secondary>
              {memberName}
            </Text>
          )}
        </TextContainer>
        {active && (
          <GlyphCheckContainer>
            <SvgGlyphCheck />
          </GlyphCheckContainer>
        )}
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
            {channels?.map((channel) => (
              <ChannelInfo
                key={channel.id}
                channel={channel}
                active={channel.id === currentChannel?.id}
                onClick={() => onCurrentChannelChange(channel.id)}
              />
            ))}
            <StyledLink to={absoluteRoutes.studio.newChannel()} onClick={handleClose}>
              <NewChannel>
                <NewChannelIconContainer>
                  <SvgGlyphNewChannel />
                </NewChannelIconContainer>
                <Text>Add new Channel</Text>
              </NewChannel>
            </StyledLink>
          </>
        )}
        <MemberInfo
          memberName={memberName}
          memberAvatar={memberAvatar}
          hasChannels={hasChannels}
          onLogoutClick={onLogoutClick}
        />
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
