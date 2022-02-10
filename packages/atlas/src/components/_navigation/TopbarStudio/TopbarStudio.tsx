import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { AvatarGroupSingleAvatar } from '@/components/Avatar/AvatarGroup'
import { Button } from '@/components/_buttons/Button'
import { SvgActionAddVideo } from '@/components/_icons'
import { SvgJoystreamLogoStudio } from '@/components/_illustrations'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'

import { StudioTopbarContainer, StyledAvatarGroup, StyledTopbarBase } from './TopbarStudio.styles'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
}

export const TopbarStudio: React.FC<StudioTopbarProps> = ({ hideChannelInfo }) => {
  const { activeChannelId, activeMembership, setActiveUser } = useUser()
  const mdMatch = useMediaMatch('md')

  const { isWorkspaceOpen, setEditedVideo, setIsWorkspaceOpen } = useVideoWorkspace()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === activeChannelId)

  const { url: avatarPhotoUrl, isLoadingAsset } = useAsset(currentChannel?.avatarPhoto)

  const [isMemberDropdownActive, setIsMemberDropdownActive] = useState(false)

  const handleDrawerToggle: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    e.stopPropagation()
    setIsMemberDropdownActive(!isMemberDropdownActive)
  }

  const handleChannelChange = (channelId: string) => {
    const channel = activeMembership?.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      return
    }
    setActiveUser({ channelId })
    setIsWorkspaceOpen(false)
  }

  const avatars: AvatarGroupSingleAvatar[] = activeChannelId
    ? [
        {
          assetUrl: activeMembership?.avatarUri,
          onClick: handleDrawerToggle,
          loading: isLoadingAsset,
        },
        { assetUrl: avatarPhotoUrl, onClick: handleDrawerToggle },
      ]
    : [{ assetUrl: activeMembership?.avatarUri, onClick: handleDrawerToggle }]

  return (
    <>
      <StyledTopbarBase fullLogoNode={<SvgJoystreamLogoStudio />} logoLinkUrl={absoluteRoutes.studio.index()}>
        {!hideChannelInfo && (
          <StudioTopbarContainer>
            <CSSTransition
              in={!isWorkspaceOpen && !!activeChannelId}
              unmountOnExit
              mountOnEnter
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              <Button
                to={absoluteRoutes.studio.videoWorkspace()}
                onClick={() => setEditedVideo()}
                variant="secondary"
                icon={<SvgActionAddVideo />}
                iconPlacement="left"
              >
                {mdMatch && 'Upload video'}
              </Button>
            </CSSTransition>
            <StyledAvatarGroup size="large" shoulHighlightEveryAvatar reverse avatars={avatars} clickable={false} />
          </StudioTopbarContainer>
        )}
      </StyledTopbarBase>
      <MemberDropdown
        onChannelChange={handleChannelChange}
        isActive={isMemberDropdownActive}
        publisher
        closeDropdown={() => setIsMemberDropdownActive(false)}
      />
    </>
  )
}
