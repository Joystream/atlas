import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { FollowedChannel } from '@/hooks/usePersonalData/localStorageClient/types'
import { SvgGlyphChevronDown, SvgGlyphChevronUp } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ChannelsWrapper,
  ChannelsTitle,
  ChannelsList,
  ChannelsItem,
  ShowMoreButton,
  StyledChannelLink,
  ShowMoreIconWrapper,
  FollowedChannelsWrapper,
} from './FollowedChannels.style'

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
  const [isShowingMore, setIsShowingMore] = useState(false)

  const numberOfChannels = followedChannels.length
  const channelsToSlice = isShowingMore ? numberOfChannels : MAX_CHANNELS
  const channels = followedChannels.slice(0, channelsToSlice)
  return (
    <CSSTransition
      in={expanded}
      unmountOnExit
      timeout={parseInt(transitions.timings.loading)}
      classNames={transitions.names.fade}
    >
      <FollowedChannelsWrapper>
        <ChannelsTitle variant="h6">Followed Channels</ChannelsTitle>
        <ChannelsWrapper>
          <ChannelsList>
            {channels.map(({ id }) => (
              <ChannelsItem key={id} onClick={onClick}>
                <StyledChannelLink id={id} onNotFound={() => onChannelNotFound?.(id)} />
              </ChannelsItem>
            ))}
          </ChannelsList>
          {numberOfChannels > MAX_CHANNELS && (
            <ShowMoreButton onClick={() => setIsShowingMore(!isShowingMore)}>
              <ShowMoreIconWrapper>
                {isShowingMore ? <SvgGlyphChevronUp /> : <SvgGlyphChevronDown />}
              </ShowMoreIconWrapper>
              {isShowingMore ? <span>Show Less</span> : <span>Show {numberOfChannels - MAX_CHANNELS} More</span>}
            </ShowMoreButton>
          )}
        </ChannelsWrapper>
      </FollowedChannelsWrapper>
    </CSSTransition>
  )
}
