import { FC, MouseEvent, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionAddVideo } from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
import { NotificationsButton } from '@/components/_navigation/NotificationsButton'
import { NotificationsWidget } from '@/components/_notifications/NotificationsWidget'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'

import { StudioTopbarContainer, StyledAvatar, StyledTopbarBase } from './TopbarStudio.styles'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
  isMembershipLoaded?: boolean
}

export const TopbarStudio: FC<StudioTopbarProps> = ({ hideChannelInfo, isMembershipLoaded }) => {
  const { channelId, activeMembership } = useUser()
  const mdMatch = useMediaMatch('md')
  const hasAtLeastOneChannel = !!activeMembership?.channels.length && activeMembership?.channels.length >= 1
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const { isWorkspaceOpen, setIsWorkspaceOpen, uploadVideoButtonProps } = useVideoWorkspace()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === channelId)

  const channelAvatarUrls = currentChannel?.avatarPhoto?.resolvedUrls

  const { urls: memberAvatarUrls, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)

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
          urls: memberAvatarUrls,
          loading: memberAvatarLoading,
          onClick: handleDrawerToggle,
        },
        { urls: channelAvatarUrls, loading: isAuthLoading, onClick: handleDrawerToggle },
      ]
    : [{ urls: memberAvatarUrls, loading: memberAvatarLoading, onClick: handleDrawerToggle }]

  return (
    <>
      <StyledTopbarBase
        fullLogoNode={<AppLogo variant="studio" height={32} width={undefined} />}
        withoutHamburgerButton={hideChannelInfo}
        logoLinkUrl={absoluteRoutes.studio.index()}
      >
        {isMembershipLoaded &&
          (!hideChannelInfo ? (
            <StudioTopbarContainer>
              <CSSTransition
                in={!isWorkspaceOpen && !!channelId}
                unmountOnExit
                mountOnEnter
                timeout={parseInt(transitions.timings.loading)}
                classNames={transitions.names.fade}
              >
                <Button
                  variant="secondary"
                  icon={<SvgActionAddVideo />}
                  iconPlacement="left"
                  {...uploadVideoButtonProps}
                >
                  {mdMatch && 'Upload video'}
                </Button>
              </CSSTransition>
              <NotificationsWidget trigger={<NotificationsButton />} />
              <StyledAvatar size={40} assetUrl={channelAvatarUrl} onClick={handleDrawerToggle} />
            </StudioTopbarContainer>
          ) : (
            <Button size="medium" onClick={() => setAuthModalOpenName(getCorrectLoginModal())}>
              Log in
            </Button>
          ))}
      </StyledTopbarBase>
      <MemberDropdown
        onChannelChange={handleChannelChange}
        isActive={isMemberDropdownActive}
        publisher={!!hasAtLeastOneChannel}
        closeDropdown={() => setIsMemberDropdownActive(false)}
      />
    </>
  )
}
