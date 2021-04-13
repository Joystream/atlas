import React, { useState } from 'react'
import {
  ChannelsWrapper,
  ChannelsTitle,
  ChannelsList,
  ChannelsItem,
  ShowMoreButton,
  StyledChannelLink,
  ShowMoreIconWrapper,
} from './FollowedChannels.style'
import { transitions } from '@/shared/theme'
import { CSSTransition } from 'react-transition-group'
import { FollowedChannel } from '@/hooks/usePersonalData/localStorageClient/types'
import { SvgGlyphChevronDown, SvgGlyphChevronUp } from '@/shared/icons'

const MAX_CHANNELS = 4

type FollowedChannelsProps = {
  followedChannels: FollowedChannel[]
  expanded: boolean
  onClick: () => void
}

const FollowedChannels: React.FC<FollowedChannelsProps> = ({ followedChannels, expanded, onClick }) => {
  const [isShowingMore, setIsShowingMore] = useState(false)

  const numberOfChannels = followedChannels.length
  const channelsToSlice = isShowingMore ? numberOfChannels : MAX_CHANNELS
  const channels = followedChannels.slice(0, channelsToSlice)
  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <ChannelsTitle variant="h6">Followed Channels</ChannelsTitle>
      </CSSTransition>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <ChannelsWrapper>
          <ChannelsList>
            {channels.map(({ id }) => (
              <ChannelsItem key={id} onClick={onClick}>
                <StyledChannelLink id={id} />
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
      </CSSTransition>
    </>
  )
}

export default FollowedChannels
