import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgGlyphChevronDown, SvgGlyphChevronUp } from '@/components/icons'
import { FollowedChannel } from '@/providers/personalData/types'
import { transitions } from '@/theme'

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
        <ChannelsTitle variant="h6">Followed channels</ChannelsTitle>
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
