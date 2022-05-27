import { FC } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { SvgActionNewChannel } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { NavItem, NavItemProps } from '@/components/_navigation/NavItem'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { FollowedChannel } from '@/providers/personalData/types'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import {
  BrowseChannelsText,
  BrowseChannelsWrapper,
  ChannelTitle,
  ChannelsList,
  ChannelsTitle,
  ChannelsWrapper,
  FollowedChannelsWrapper,
  StyledSkeletonLoader,
} from './FollowedChannels.styles'

type ChannelNavItemProps = {
  id: string
  onChannelNotFound?: (id: string) => void
}

export const ChannelNavItem: FC<NavItemProps & ChannelNavItemProps> = ({
  id,
  to,
  expanded,
  itemName,
  isSecondary,
  onChannelNotFound,
  onClick,
}) => {
  const { channel } = useBasicChannel(id ?? '', {
    skip: !id,
    onCompleted: (data) => !data.channelByUniqueInput && onChannelNotFound?.(id),
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelLink', error, { channel: { id } }),
  })
  const { url: avatarPhotoUrl } = useAsset(channel?.avatarPhoto)

  return (
    <NavItem to={to} expanded={expanded} itemName={itemName} onClick={onClick} isSecondary={isSecondary}>
      <Avatar loading={!channel} size="default" assetUrl={avatarPhotoUrl} />
      {channel ? (
        <ChannelTitle variant="h300" secondary={true}>
          {channel.title}
        </ChannelTitle>
      ) : (
        <StyledSkeletonLoader height={16} width={150} />
      )}
    </NavItem>
  )
}

type FollowedChannelsProps = {
  followedChannels: FollowedChannel[]
  expanded: boolean
  onClick: () => void
  onChannelNotFound?: (id: string) => void
}

export const FollowedChannels: FC<FollowedChannelsProps> = ({
  followedChannels,
  expanded,
  onClick,
  onChannelNotFound,
}) => {
  return (
    <CSSTransition
      in={expanded}
      unmountOnExit
      timeout={parseInt(transitions.timings.loading)}
      classNames={transitions.names.fade}
    >
      <FollowedChannelsWrapper>
        <ChannelsTitle variant="h100" secondary>
          Followed channels
        </ChannelsTitle>
        <ChannelsWrapper>
          <ChannelsList>
            {followedChannels.map(({ id }) => (
              <ChannelNavItem
                id={id}
                to={absoluteRoutes.viewer.channel(id)}
                expanded={expanded}
                onClick={onClick}
                isSecondary={true}
                onChannelNotFound={onChannelNotFound}
                key={id}
              />
            ))}
          </ChannelsList>
        </ChannelsWrapper>
        <BrowseChannelsWrapper to={absoluteRoutes.viewer.channels()} onClick={onClick}>
          <IconWrapper icon={<SvgActionNewChannel />} />
          <BrowseChannelsText variant="h300">Browse channels</BrowseChannelsText>
        </BrowseChannelsWrapper>
      </FollowedChannelsWrapper>
    </CSSTransition>
  )
}
