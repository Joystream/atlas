import { FC, MouseEvent, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionAddVideo } from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { Button } from '@/components/_buttons/Button'
import { NotificationsButton } from '@/components/_navigation/NotificationsButton'
import { NotificationsWidget } from '@/components/_notifications/NotificationsWidget'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'

import { StudioTopbarContainer, StyledAvatarGroup, StyledTopbarBase } from './TopbarStudio.styles'

type StudioTopbarProps = {
  hideChannelInfo?: boolean
  isMembershipLoaded?: boolean
}

export const TopbarStudio: FC<StudioTopbarProps> = ({ hideChannelInfo, isMembershipLoaded }) => {
  const { channelId, activeMembership } = useUser()
  const mdMatch = useMediaMatch('md')
  const hasAtLeastOneChannel = !!activeMembership?.channels.length && activeMembership?.channels.length >= 1

  const { isWorkspaceOpen, setIsWorkspaceOpen, uploadVideoButtonProps } = useVideoWorkspace()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === channelId)

  const channelAvatarUrl = currentChannel?.avatarPhoto?.resolvedUrl

  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)

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
        { url: channelAvatarUrl, loading: false, onClick: handleDrawerToggle },
      ]
    : [{ url: memberAvatarUrl, loading: memberAvatarLoading, onClick: handleDrawerToggle }]

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
              <StyledAvatarGroup size="large" shouldHighlightEveryAvatar reverse avatars={avatars} clickable={false} />
            </StudioTopbarContainer>
          ) : (
            // todo: add handler
            <Button size="medium" onClick={() => undefined}>
              Set up membership
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
