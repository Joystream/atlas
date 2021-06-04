import React, { useState, useEffect, useRef } from 'react'
import { useUser, useDisplayDataLostWarning, useEditVideoSheet, useAsset } from '@/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { Placeholder, Text, Button, ExpandButton, IconButton } from '@/shared/components'
import { SvgGlyphAddVideo, SvgGlyphCheck, SvgGlyphLogOut, SvgGlyphNewChannel } from '@/shared/icons'

import {
  StyledTopbarBase,
  StudioTopbarContainer,
  MemberInfoContainer,
  MemberInnerContainer,
  DrawerMemberText,
  DrawerMemberTitleText,
  StyledChannelInfoText,
  MemberTextContainer,
  ChannelInfoContainer,
  NewChannelAvatar,
  StyledAvatar,
  TextContainer,
  DrawerContainer,
  DrawerChannelsContainer,
  NewChannel,
  NewChannelIconContainer,
  StyledLink,
  AvatarPlaceholder,
  GlyphCheckContainer,
} from './StudioTopbar.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { useNavigate } from 'react-router'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
  fullWidth?: boolean
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
  memberAvatar?: string | null
  currentChannel?: BasicChannelFieldsFragment
  onCurrentChannelChange: (channelId: string) => void
  onLogoutClick: () => void
  handleClose: () => void
}

const StudioTopbar: React.FC<StudioTopbarProps> = ({ hideChannelInfo, fullWidth }) => {
  const {
    activeChannelId,
    setActiveUser,
    resetActiveUser,
    activeMembership,
    activeMembershipLoading,
    memberships,
    activeAccountId,
  } = useUser()

  const navigate = useNavigate()

  const { sheetState, setSheetState, anyVideoTabsCachedAssets } = useEditVideoSheet()
  const { openWarningDialog } = useDisplayDataLostWarning()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === activeChannelId)

  const [isDrawerActive, setDrawerActive] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  const handleCurrentChannelChange: (channelId: string) => void = (channelId) => {
    const channel = activeMembership?.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      return
    }
    setDrawerActive(false)
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => changeChannel(channelId) })
    } else {
      changeChannel(channelId)
    }
  }

  const changeChannel = (channelId: string) => {
    setActiveUser({ channelId })
    setSheetState('closed')
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

  const handleLogout = () => {
    setDrawerActive(false)
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => logout() })
    } else {
      logout()
    }
  }

  const logout = () => {
    setSheetState('closed')
    resetActiveUser()
    navigate(absoluteRoutes.studio.index())
  }

  const channelSet = !!activeAccountId && !!activeChannelId && !!memberships?.length

  return (
    <>
      <StyledTopbarBase variant="studio" fullWidth={fullWidth} isHamburgerButtonPresent={!!channelSet}>
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
            {activeMembershipLoading ? (
              <ChannelInfoPlaceholder />
            ) : activeMembership?.channels.length ? (
              <ChannelInfo channel={currentChannel} memberName={activeMembership.handle} onClick={handleDrawerToggle} />
            ) : (
              <ChannelInfoContainer onClick={handleDrawerToggle}>
                <NewChannelAvatar newChannel size="small" />
                <TextContainer>
                  <Text>New channel</Text>
                  <Text>{activeMembership?.handle}</Text>
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
        memberName={activeMembership?.handle}
        memberAvatar={activeMembership?.avatarUri}
        channels={activeMembership?.channels}
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
          <DrawerMemberText>{memberName}</DrawerMemberText>
          <DrawerMemberTitleText variant="caption">Member</DrawerMemberTitleText>
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
    const { getAssetUrl } = useAsset()
    const avatarPhotoUrl = getAssetUrl(
      channel?.avatarPhotoAvailability,
      channel?.avatarPhotoUrls,
      channel?.avatarPhotoDataObject
    )

    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="small" imageUrl={avatarPhotoUrl} />
        <TextContainer>
          <StyledChannelInfoText variant="body1">{channel ? channel.title : 'New Channel'}</StyledChannelInfoText>
          {memberName && (
            <StyledChannelInfoText variant="caption" secondary>
              {memberName}
            </StyledChannelInfoText>
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
            <DrawerChannelsContainer>
              {channels?.map((channel) => (
                <ChannelInfo
                  key={channel.id}
                  channel={channel}
                  active={channel.id === currentChannel?.id}
                  onClick={() => onCurrentChannelChange(channel.id)}
                />
              ))}
            </DrawerChannelsContainer>
            <StyledLink to={absoluteRoutes.studio.newChannel()} onClick={handleClose}>
              <NewChannel>
                <NewChannelIconContainer>
                  <SvgGlyphNewChannel />
                </NewChannelIconContainer>
                <Text>Add new channel</Text>
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
