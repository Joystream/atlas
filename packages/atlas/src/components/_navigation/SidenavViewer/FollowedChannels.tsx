import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

// TODO put this in its own file
import { useBasicChannel } from '@/api/hooks'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgActionChevronB, SvgActionChevronT, SvgActionNewChannel } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NavItem, NavItemProps } from '@/components/_navigation/NavItem'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { FollowedChannel } from '@/providers/personalData/types'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import {
  BrowseChannelsIcon,
  BrowseChannelsText,
  BrowseChannelsWrapper,
  ChannelTitle,
  ChannelsItem,
  ChannelsList,
  ChannelsTitle,
  ChannelsWrapper,
  FollowedChannelsWrapper,
  ShowMoreButton,
  ShowMoreIconWrapper,
  StyledChannelLink,
} from './FollowedChannels.styles'

const MAX_CHANNELS = 4

type ChannelIdProps = {
  id: string
}

// TODO put in its own file
export const ChannelNavItem: React.FC<NavItemProps & ChannelIdProps> = ({
  id,
  to,
  expanded,
  itemName,
  isSecondary,
  onClick,
}) => {
  const { channel } = useBasicChannel(id || '', {
    skip: !id,
    onCompleted: (data) => !data && SentryLogger.error('Channel not found', 'ChannelLink', { channel: { id } }),
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
        <SkeletonLoader height={16} width={150} />
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

export const FollowedChannels: React.FC<FollowedChannelsProps> = ({
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
        {followedChannels.length > 0 ? (
          <ChannelsWrapper>
            <ChannelsList>
              {followedChannels.map(({ id }) => (
                <ChannelNavItem
                  id={id}
                  to={absoluteRoutes.viewer.channel(id)}
                  expanded={expanded}
                  itemName={id}
                  onClick={() => onClick()}
                  isSecondary={true}
                  key={id}
                >
                  {id}
                </ChannelNavItem>
              ))}
            </ChannelsList>
          </ChannelsWrapper>
        ) : (
          <BrowseChannelsWrapper to={absoluteRoutes.viewer.channels()}>
            <BrowseChannelsIcon>
              <SvgActionNewChannel />
            </BrowseChannelsIcon>
            <BrowseChannelsText variant="h300">Browse channels</BrowseChannelsText>
          </BrowseChannelsWrapper>
        )}
      </FollowedChannelsWrapper>
    </CSSTransition>
  )
}
/*
                <ChannelsItem key={id} onClick={onClick}>
                  <StyledChannelLink
                    id={id}
                    textSecondary
                    textVariant="h300"
                    onNotFound={() => onChannelNotFound?.(id)}
                  />
                </ChannelsItem>
*/
