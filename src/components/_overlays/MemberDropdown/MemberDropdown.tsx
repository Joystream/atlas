import React from 'react'

import { useMemberships } from '@/api/hooks'
import { Channel } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { AssetType, useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'

import {
  ActionsContainer,
  BlurredBG,
  ChannelsContainer,
  Container,
  MemberInfoContainer,
  StyledAvatar,
} from './MemberDropdown.styles'

export type MemberDropdownProps = {
  // joyAmount: number
}

export const MemberDropdown: React.FC<MemberDropdownProps> = () => {
  const { activeAccountId, activeMemberId, activeChannelId, activeMembership, setActiveUser, resetActiveUser } =
    useUser()

  // const { url: avatarPhotoUrl } = useAsset({
  //   entity: activeMembership,
  //   assetType: AssetType.AVATAR,
  // })

  // const {
  //   memberships,
  //   loading: membershipsLoading,
  //   error: membershipsError,
  // } = useMemberships({
  //   where: { controllerAccount_eq: account },
  // })

  console.log({ channels: activeMembership?.channels })

  return (
    <Container>
      <BlurredBG url={activeMembership?.avatarUri}>
        <MemberInfoContainer>
          <StyledAvatar size="fill" assetUrl={activeMembership?.avatarUri}></StyledAvatar>
          <Text variant="h400">{activeMembership?.handle}</Text>
        </MemberInfoContainer>
      </BlurredBG>

      <ActionsContainer>click clock</ActionsContainer>
      <ChannelsContainer>
        {activeMembership?.channels.map((channel) => (
          <ChannelListItem key={channel.id} channel={channel} activeChannelId={activeChannelId} />
        ))}
      </ChannelsContainer>
    </Container>
  )
}

const ChannelListItem: React.FC<{ channel: Channel; activeChannelId: string | null }> = ({
  activeChannelId,
  channel,
}) => {
  const { url: avatarPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })
  return (
    <ListItem
      nodeStart={<Avatar assetUrl={avatarPhotoUrl} />}
      label={channel.title ?? ''}
      caption={`${channel.follows} followers`}
      selected={activeChannelId === channel.id}
    />
  )
}
