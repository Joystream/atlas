import { FC, MouseEvent, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionAddVideo } from '@/assets/icons'
import { SvgAppLogoStudio } from '@/assets/logos'
import { AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { Button } from '@/components/_buttons/Button'
import { NotificationsButton } from '@/components/_navigation/NotificationsButton'
import { NotificationsWidget } from '@/components/_notifications/NotificationsWidget'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset, useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'

import { StudioTopbarContainer, StyledAvatarGroup, StyledTopbarBase } from './TopbarStudio.styles'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
}

export const TopbarStudio: FC<StudioTopbarProps> = ({ hideChannelInfo }) => {
  const { channelId, activeMembership, signIn } = useUser()
  const mdMatch = useMediaMatch('md')

  const { isWorkspaceOpen, setEditedVideo, setIsWorkspaceOpen } = useVideoWorkspace()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === channelId)

  const { url: channelAvatarUrl, isLoadingAsset: channelAvatarLoading } = useAsset(currentChannel?.avatarPhoto)
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(activeMembership)

  const [isMemberDropdownActive, setIsMemberDropdownActive] = useState(false)

  const handleDrawerToggle: (e: MouseEvent<HTMLElement>) => void = (e) => {
    e.stopPropagation()
    setIsMemberDropdownActive(!isMemberDropdownActive)
  }

  const handleChannelChange = (channelId: string) => {
    const channel = activeMembership?.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      return
    }
    setIsWorkspaceOpen(false)
  }

  const avatars: AvatarGroupUrlAvatar[] = channelId
    ? [
        {
          url: memberAvatarUrl,
          loading: memberAvatarLoading,
          onClick: handleDrawerToggle,
        },
        { url: channelAvatarUrl, loading: channelAvatarLoading, onClick: handleDrawerToggle },
      ]
    : [{ url: memberAvatarUrl, loading: memberAvatarLoading, onClick: handleDrawerToggle }]

  return (
    <>
      <StyledTopbarBase
        fullLogoNode={<SvgAppLogoStudio />}
        withoutHamburgerButton={hideChannelInfo}
        logoLinkUrl={absoluteRoutes.studio.index()}
      >
        {!hideChannelInfo ? (
          <StudioTopbarContainer>
            <CSSTransition
              in={!isWorkspaceOpen && !!channelId}
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
            <NotificationsWidget trigger={<NotificationsButton />} />
            <StyledAvatarGroup size="large" shouldHighlightEveryAvatar reverse avatars={avatars} clickable={false} />
          </StudioTopbarContainer>
        ) : (
          <Button size="medium" onClick={() => signIn()}>
            Set up membership
          </Button>
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
