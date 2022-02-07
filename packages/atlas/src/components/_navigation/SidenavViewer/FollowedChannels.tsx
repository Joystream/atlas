import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { FollowedChannel } from '@/providers/personalData/types'
import { transitions } from '@/styles'

import {
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
        <ChannelsWrapper>
          <ChannelsList>
            {followedChannels.map(({ id }) => (
              <ChannelsItem key={id} onClick={onClick}>
                <StyledChannelLink
                  id={id}
                  textSecondary
                  textVariant="h300"
                  onNotFound={() => onChannelNotFound?.(id)}
                />
              </ChannelsItem>
            ))}
          </ChannelsList>
        </ChannelsWrapper>
      </FollowedChannelsWrapper>
    </CSSTransition>
  )
}
