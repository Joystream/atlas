import React, { useState } from 'react'
import {
  FollowingChannelsWrapper,
  FollowingChannelsTitle,
  FollowingChannelsList,
  FollowingChannelsItem,
  ShowMoreButton,
  StyledChannelLink,
} from './SideNavbar.style'
import { transitions } from '@/shared/theme'
import { CSSTransition } from 'react-transition-group'
import Icon from '../Icon'

const MAX_CHANNELS = 4
type FollowingChannels = {
  channelIDs: string[]
  expanded: boolean
}

const FollowingChannels: React.FC<FollowingChannels> = ({ channelIDs, expanded }) => {
  const [isShowingMore, setIsShowingMore] = useState(false)
  const numberOfChannels = isShowingMore ? channelIDs.length : MAX_CHANNELS
  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <FollowingChannelsTitle variant="h6">
          {numberOfChannels ? 'Following Channels' : 'No Following Channels'}
        </FollowingChannelsTitle>
      </CSSTransition>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <FollowingChannelsWrapper>
          <FollowingChannelsList>
            {channelIDs.slice(0, numberOfChannels).map((id) => (
              <FollowingChannelsItem key={id}>
                <StyledChannelLink id={id} avatarSize="default" />
              </FollowingChannelsItem>
            ))}
          </FollowingChannelsList>
          <ShowMoreButton onClick={() => setIsShowingMore(!isShowingMore)}>
            <Icon name={isShowingMore ? 'chevron-up' : 'chevron-down'} />
            {isShowingMore ? <span>Show Less</span> : <span>Show {channelIDs.length - MAX_CHANNELS} More</span>}
          </ShowMoreButton>
        </FollowingChannelsWrapper>
      </CSSTransition>
    </>
  )
}

export default FollowingChannels
