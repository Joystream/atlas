import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { useChannel } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import {
  SvgActionAddVideo,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionJoyToken,
  SvgActionMember,
  SvgActionNewChannel,
  SvgActionPlay,
  SvgActionPlus,
} from '@/components/_icons'
import { SvgActionSwitchMember } from '@/components/_icons/ActionSwitchMember'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { cVar } from '@/styles'

import {
  BalanceContainer,
  BlurredBG,
  ChannelsSectionTitle,
  Container,
  Divider,
  Filter,
  LearnAboutTjoyLink,
  MemberInfoContainer,
  SectionContainer,
  StyledAvatar,
  SwitchMemberItemListContainer,
  TjoyContainer,
} from './MemberDropdown.styles'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown: React.FC<MemberDropdownProps> = ({
  publisher,
  isActive,
  closeDropdown,
  onChannelChange,
}) => {
  const [isSwitchingMember, setIsSwitchingMember] = useState(false)
  const navigate = useNavigate()
  const { activeChannelId, activeMembership, setActiveUser, memberships, signIn } = useUser()
  const containerRef = useRef<HTMLDivElement>(null)

  const hasOneMember = memberships?.length === 1

  const handleAddNewChannel = () => {
    navigate(absoluteRoutes.studio.newChannel())
    closeDropdown?.()
  }
  const handleGoToJoystream = () => {
    navigate(absoluteRoutes.viewer.index())
    closeDropdown?.()
  }
  const handleGoToStudio = () => {
    navigate(absoluteRoutes.studio.index())
    closeDropdown?.()
  }
  // TODO: add navigation
  const handleGoToMyProfile = () => {
    closeDropdown?.()
  }
  const handleAddNewMember = () => {
    signIn()
    closeDropdown?.()
    setIsSwitchingMember(false)
  }
  const handleMemberChange = (memberId: string) => {
    setActiveUser({ memberId, channelId: null })
    closeDropdown?.()
    setIsSwitchingMember(false)
  }

  useEffect(() => {
    if (!isActive) {
      return
    }
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // stop propagation so drawer doesn't get triggered again on button click
        // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
        event.preventDefault()
        event.stopPropagation()
        closeDropdown?.()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [closeDropdown, isActive])

  return (
    <Container isActive={isActive} ref={containerRef}>
      {isSwitchingMember ? (
        <div>
          <SwitchMemberItemListContainer>
            <ListItem
              onClick={() => setIsSwitchingMember(false)}
              nodeStart={<SvgActionChevronL />}
              label="Switch member"
              applyIconStylesNodeStart
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
                  <LearnAboutTjoyLink
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
                  </LearnAboutTjoyLink>
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
              nodeEnd={hasOneMember === false && <SvgActionChevronR />}
              applyIconStylesNodeEnd
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
                  onClick={() => onChannelChange?.(channel.id)}
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
}

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
