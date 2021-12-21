import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { SvgActionAddVideo, SvgActionCheck } from '@/components/_icons'
import { SvgJoystreamLogoStudio } from '@/components/_illustrations'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { absoluteRoutes } from '@/config/routes'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'

import {
  AvatarSkeletonLoader,
  ChannelInfoContainer,
  GlyphCheckContainer,
  NewChannelAvatar,
  StudioTopbarContainer,
  StyledAvatar,
  StyledChannelInfoText,
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

export const TopbarStudio: React.FC<StudioTopbarProps> = ({ hideChannelInfo }) => {
  const { activeChannelId, activeMembership, activeMembershipLoading, setActiveUser } = useUser()
  const mdMatch = useMediaMatch('md')

  const { videoWorkspaceState, addVideoTab, setVideoWorkspaceState, anyVideoTabsCachedAssets } = useVideoWorkspace()
  const { openWarningDialog } = useDisplayDataLostWarning()

  const currentChannel = activeMembership?.channels.find((channel) => channel.id === activeChannelId)

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
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({
        onConfirm: () => {
          setActiveUser({ channelId })
          setVideoWorkspaceState('closed')
        },
      })
    } else {
      setActiveUser({ channelId })
      setVideoWorkspaceState('closed')
    }
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
              <Button
                to={absoluteRoutes.studio.videoWorkspace()}
                onClick={() => addVideoTab()}
                variant="secondary"
                icon={<SvgActionAddVideo />}
                iconPlacement="left"
              >
                {mdMatch && 'Upload video'}
              </Button>
            </CSSTransition>
            {activeMembershipLoading ? (
              <ChannelInfoSkeletonLoader />
            ) : activeMembership?.channels.length ? (
              <ChannelInfo channel={currentChannel} memberName={activeMembership.handle} onClick={handleDrawerToggle} />
            ) : (
              <ChannelInfoContainer onClick={handleDrawerToggle}>
                <NewChannelAvatar newChannel size="small" />
                <TextContainer>
                  <Text variant="t200">New channel</Text>
                  <Text variant="t200">{activeMembership?.handle}</Text>
                </TextContainer>
              </ChannelInfoContainer>
            )}
            <ExpandButton expanded={isMemberDropdownActive} onClick={handleDrawerToggle} />
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
          <StyledChannelInfoText variant="t300">{channel ? channel.title : 'New Channel'}</StyledChannelInfoText>
          {memberName && (
            <StyledChannelInfoText variant="t100" secondary>
              {memberName}
            </StyledChannelInfoText>
          )}
        </TextContainer>
        {active && (
          <GlyphCheckContainer>
            <SvgActionCheck />
          </GlyphCheckContainer>
        )}
      </ChannelInfoContainer>
    )
  }
)
ChannelInfo.displayName = 'ChannelInfo'

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
