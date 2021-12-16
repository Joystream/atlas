import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { useChannel } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import {
  SvgActionAddVideo,
  SvgActionJoyToken,
  SvgActionMember,
  SvgActionNewChannel,
  SvgActionPlay,
  SvgActionPlus,
} from '@/components/_icons'
import { SvgActionSwitchMember } from '@/components/_icons/ActionSwitchMember'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { cVar } from '@/styles'

import {
  BalanceContainer,
  BlurredBG,
  ChannelsSectionTitle,
  Container,
  Divider,
  Filter,
  MemberInfoContainer,
  SectionContainer,
  StyledAvatar,
  StyledSvgActionChevronL,
  StyledSvgActionChevronR,
  SwitchMemberItemListContainer,
  TjoyContainer,
} from './MemberDropdown.styles'

export type MemberDropdownProps = { isActive: boolean; publisher?: boolean }

export const MemberDropdown = React.forwardRef<HTMLDivElement, MemberDropdownProps>(({ publisher, isActive }, ref) => {
  const [isSwitchingMember, setIsSwitchingMember] = useState(false)
  const navigate = useNavigate()
  const { activeChannelId, activeMembership, setActiveUser, memberships } = useUser()
  const { setVideoWorkspaceState, anyVideoTabsCachedAssets } = useVideoWorkspace()
  const { openWarningDialog } = useDisplayDataLostWarning()

  const hasOneMember = memberships?.length === 1

  const handleAddNewMember = () => {
    navigate(absoluteRoutes.studio.newMembership())
  }
  const handleAddNewChannel = () => {
    navigate(absoluteRoutes.studio.newChannel())
  }
  const handleGoToJoystream = () => {
    navigate(absoluteRoutes.viewer.index())
  }
  const handleGoToStudio = () => {
    navigate(absoluteRoutes.studio.index())
  }
  const handleGoToMyProfile = () => null
  const handleMemberChange = (memberId: string) => {
    setActiveUser({ memberId })
    setIsSwitchingMember(false)
  }
  const handleChannelChange = (channelId: string) => {
    if (publisher) {
      const channel = activeMembership?.channels.find((channel) => channel.id === channelId)
      if (!channel) {
        return
      }
      // setMemberDropdownActive(false)
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
  }

  return (
    <Container isActive={isActive} ref={ref}>
      {isSwitchingMember ? (
        <div>
          <SwitchMemberItemListContainer>
            <ListItem
              onClick={() => setIsSwitchingMember(false)}
              nodeStart={<StyledSvgActionChevronL />}
              label="Switch member"
            />
          </SwitchMemberItemListContainer>

          <SectionContainer>
            {memberships?.map((member) => (
              <ListItem
                key={member.id}
                onClick={() => handleMemberChange(member.id)}
                nodeStart={<Avatar assetUrl={member.avatarUri} />}
                label={member.handle ?? ''}
                selected={member.id === activeMembership?.id}
              />
            ))}
            <ListItem
              nodeStart={<IconWrapper icon={<SvgActionNewChannel />} />}
              onClick={() => handleAddNewMember()}
              label="Add new member..."
            />
          </SectionContainer>
        </div>
      ) : (
        <>
          <BlurredBG url={activeMembership?.avatarUri}>
            <Filter />
            <MemberInfoContainer>
              <StyledAvatar size="fill" assetUrl={activeMembership?.avatarUri} />
              <div>
                {/* Using invisible unicode character ZERO WIDTH NON-JOINER (U+200C) 
                \ to preserve the space while member handle loads */}
                <Text variant="h400">{activeMembership?.handle ?? '‌‌ '}</Text>
                <TjoyContainer>
                  <BalanceContainer>
                    <SvgActionJoyToken />
                    <Text variant="t200-strong">12.5K</Text>
                  </BalanceContainer>
                  <Divider />
                  <Text
                    variant="t100"
                    as="a"
                    // @ts-ignore our types don't allow this but its fine here
                    href="https://www.joystream.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    secondary
                    color={cVar('colorCoreNeutral200Lighten')}
                  >
                    Learn about tJOY
                  </Text>
                </TjoyContainer>
              </div>
            </MemberInfoContainer>
          </BlurredBG>
          <SectionContainer>
            {publisher ? (
              <ListItem
                onClick={handleGoToJoystream}
                nodeStart={<IconWrapper icon={<SvgActionPlay />} />}
                label="Go to Joystream"
              />
            ) : (
              <>
                <ListItem
                  onClick={handleGoToStudio}
                  nodeStart={<IconWrapper icon={<SvgActionAddVideo />} />}
                  label="Go to Studio"
                />
                <ListItem
                  onClick={handleGoToMyProfile}
                  nodeStart={<IconWrapper icon={<SvgActionMember />} />}
                  label="My profile"
                />
              </>
            )}
            <ListItem
              nodeStart={<IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />}
              onClick={() => (hasOneMember ? handleAddNewMember() : setIsSwitchingMember(true))}
              label={hasOneMember ? 'Add new member...' : 'Switch member'}
              nodeEnd={hasOneMember === false && <StyledSvgActionChevronR />}
            />
          </SectionContainer>
          {publisher && (
            <SectionContainer>
              <ChannelsSectionTitle variant="t100" secondary>
                Your channels
              </ChannelsSectionTitle>
              {activeMembership?.channels.map((channel) => (
                <ChannelListItem
                  key={channel.id}
                  onClick={() => handleChannelChange(channel.id)}
                  channelId={channel.id}
                  activeChannelId={activeChannelId}
                />
              ))}
              <ListItem
                onClick={handleAddNewChannel}
                nodeStart={<IconWrapper icon={<SvgActionPlus />} />}
                label="Add new channel..."
              />
            </SectionContainer>
          )}
        </>
      )}
    </Container>
  )
})
MemberDropdown.displayName = 'MemberDropdown'

const ChannelListItem: React.FC<{ channelId: string; activeChannelId: string | null; onClick: () => void }> = ({
  activeChannelId,
  channelId,
  onClick,
}) => {
  const { channel } = useChannel(channelId)
  const { url: avatarPhotoUrl, isLoadingAsset } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={avatarPhotoUrl} loading={isLoadingAsset} />}
      label={channel?.title ?? ''}
      caption={channel ? `${channel?.follows} followers` : undefined}
      selected={activeChannelId === channel?.id}
    />
  )
}
