import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { Button } from '@/components/Button'
import { ExpandButton } from '@/components/ExpandButton'
import { IconButton } from '@/components/IconButton'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Text } from '@/components/Text'
import { SvgGlyphAddVideo, SvgGlyphCheck, SvgGlyphLogOut, SvgGlyphNewChannel } from '@/components/icons'
import { SvgJoystreamLogoStudio } from '@/components/illustrations'
import { absoluteRoutes } from '@/config/routes'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/theme'

import {
  AvatarSkeletonLoader,
  ChannelInfoContainer,
  DrawerChannelsContainer,
  DrawerContainer,
  DrawerMemberText,
  DrawerMemberTitleText,
  GlyphCheckContainer,
  MemberInfoContainer,
  MemberInnerContainer,
  MemberTextContainer,
  NewChannel,
  NewChannelAvatar,
  NewChannelIconContainer,
  StudioTopbarContainer,
  StyledAvatar,
  StyledChannelInfoText,
  StyledLink,
  StyledTopbarBase,
  TextContainer,
} from './TopbarStudio.styles'

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
  memberAvatar?: string | null
  currentChannel?: BasicChannelFieldsFragment
  onCurrentChannelChange: (channelId: string) => void
  onLogoutClick: () => void
  handleClose: () => void
}

export const TopbarStudio: React.FC<StudioTopbarProps> = ({ hideChannelInfo }) => {
  const { activeChannelId, setActiveUser, resetActiveUser, activeMembership, activeMembershipLoading } = useUser()

  const navigate = useNavigate()

  const { videoWorkspaceState, setVideoWorkspaceState, anyVideoTabsCachedAssets, addVideoTab } = useVideoWorkspace()
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
    setVideoWorkspaceState('closed')
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
    setVideoWorkspaceState('closed')
    resetActiveUser()
    navigate(absoluteRoutes.studio.index())
  }

  return (
    <>
      <StyledTopbarBase fullLogoNode={<SvgJoystreamLogoStudio />} logoLinkUrl={absoluteRoutes.studio.index()}>
        {!hideChannelInfo && (
          <StudioTopbarContainer>
            <CSSTransition
              in={videoWorkspaceState !== 'open' && !!activeChannelId}
              unmountOnExit
              mountOnEnter
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              <IconButton to={absoluteRoutes.studio.videoWorkspace()} onClick={() => addVideoTab()}>
                <SvgGlyphAddVideo />
              </IconButton>
            </CSSTransition>
            {activeMembershipLoading ? (
              <ChannelInfoSkeletonLoader />
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
        <StyledAvatar assetUrl={memberAvatar} />
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
    const { url: avatarPhotoUrl } = useAsset({
      entity: channel,
      assetType: AssetType.AVATAR,
    })

    return (
      <ChannelInfoContainer onClick={onClick} isActive={active} ref={ref}>
        <StyledAvatar size="small" assetUrl={avatarPhotoUrl} />
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

const ChannelInfoSkeletonLoader = () => {
  return (
    <ChannelInfoContainer>
      <AvatarSkeletonLoader />
      <TextContainer>
        <SkeletonLoader width="100%" height="15px" bottomSpace="6px" />
        <SkeletonLoader width="70%" height="10px" />
      </TextContainer>
    </ChannelInfoContainer>
  )
}
