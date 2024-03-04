import { FC } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks/channel'
import { useGetChannelFollowsQuery } from '@/api/queries/__generated__/accounts.generated'
import { SvgActionNewChannel } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { IconWrapper } from '@/components/IconWrapper'
import { Text } from '@/components/Text'
import { NavItem, NavItemProps } from '@/components/_navigation/NavItem'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import {
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
    onCompleted: (data) => !data.channels.length && onChannelNotFound?.(id),
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelLink', error, { channel: { id } }),
  })

  return (
    <NavItem to={to} expanded={expanded} itemName={itemName} onClick={onClick} isSecondary={isSecondary}>
      <Avatar loading={!channel} size={32} assetUrls={channel?.avatarPhoto?.resolvedUrls} />
      {channel ? (
        <ChannelTitle as="p" variant="h300" color="colorText">
          {channel.title}
        </ChannelTitle>
      ) : (
        <StyledSkeletonLoader height={16} width={150} />
      )}
    </NavItem>
  )
}

type FollowedChannelsProps = {
  expanded: boolean
  onClick: () => void
  onChannelNotFound?: (id: string) => void
}

export const FollowedChannels: FC<FollowedChannelsProps> = ({ expanded, onClick, onChannelNotFound }) => {
  const { accountId } = useUser()
  const { data } = useGetChannelFollowsQuery({
    variables: {
      where: {
        user: {
          account: {
            id_eq: accountId,
          },
        },
      },
    },
    skip: !accountId,
  })
  return (
    <CSSTransition
      in={expanded}
      unmountOnExit
      timeout={parseInt(transitions.timings.loading)}
      classNames={transitions.names.fade}
    >
      <FollowedChannelsWrapper>
        <ChannelsTitle as="h4" variant="h100" color="colorText" margin={{ top: 6, bottom: 4 }}>
          Followed channels
        </ChannelsTitle>
        <ChannelsWrapper>
          <ChannelsList>
            {data?.channelFollows.map(({ channelId }) => (
              <ChannelNavItem
                id={channelId}
                to={absoluteRoutes.viewer.channel(channelId)}
                expanded={expanded}
                onClick={onClick}
                isSecondary={true}
                onChannelNotFound={onChannelNotFound}
                key={channelId}
              />
            ))}
          </ChannelsList>
        </ChannelsWrapper>
        <BrowseChannelsWrapper to={absoluteRoutes.viewer.channels()} onClick={onClick}>
          <IconWrapper icon={<SvgActionNewChannel />} />
          <Text as="span" variant="h300" margin={{ left: 4 }} color="inherit">
            Browse channels
          </Text>
        </BrowseChannelsWrapper>
      </FollowedChannelsWrapper>
    </CSSTransition>
  )
}
