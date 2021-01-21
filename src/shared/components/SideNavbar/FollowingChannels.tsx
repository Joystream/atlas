import React, { useState } from 'react'
import {
  ChannelsWrapper,
  ChannelsTitle,
  ChannelsList,
  ChannelsItem,
  ShowMoreButton,
  StyledChannelLink,
} from './FollowingChannels.style'
import { transitions } from '@/shared/theme'
import { CSSTransition } from 'react-transition-group'
import Icon from '../Icon'

const MAX_CHANNELS = 4

type FollowingChannels = {
  channelIDs: string[]
  expanded: boolean
  onClick: () => void
}

const FollowingChannels: React.FC<FollowingChannels> = ({ channelIDs, expanded, onClick }) => {
  const [isShowingMore, setIsShowingMore] = useState(false)
  const numberOfChannels = isShowingMore ? channelIDs.length : MAX_CHANNELS
  const channels = channelIDs.slice(0, numberOfChannels)
  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <ChannelsTitle variant="h6">{numberOfChannels ? 'Following Channels' : 'No Following Channels'}</ChannelsTitle>
      </CSSTransition>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <ChannelsWrapper>
          <ChannelsList>
            {channels.map((id) => (
              <ChannelsItem key={id} onClick={onClick}>
                <StyledChannelLink id={id} />
              </ChannelsItem>
            ))}
          </ChannelsList>
          <ShowMoreButton onClick={() => setIsShowingMore(!isShowingMore)}>
            <Icon name={isShowingMore ? 'chevron-up' : 'chevron-down'} />
            {isShowingMore ? <span>Show Less</span> : <span>Show {channelIDs.length - MAX_CHANNELS} More</span>}
          </ShowMoreButton>
        </ChannelsWrapper>
      </CSSTransition>
    </>
  )
}

export default FollowingChannels
