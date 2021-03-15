import { ChannelCard, StudioHeader } from '@/shared/components'
import Spinner from '@/shared/components/Spinner/Spinner'
import React from 'react'
import { MemberChannelGrid, Wrapper } from './SelectChannelView.style'

const channels = [
  {
    id: 1,
    handle: 'My awesome channel',
    follows: 2331,
    avatarPhotoUrl: 'https://picsum.photos/300/300',
  },
  {
    id: 2,
    handle: 'My second awesome channel',
    follows: 2331,
    avatarPhotoUrl: 'https://picsum.photos/300/300',
  },
  {
    id: 3,
    handle: 'My third awesome channe',
    follows: 23,
    avatarPhotoUrl: 'https://picsum.photos/300/300',
  },
]

const SelectChannelView = () => {
  const hasChannels = !!channels.length
  return (
    <Wrapper>
      <StudioHeader
        title={hasChannels ? 'Select Channel' : 'Create first channel'}
        subtitle={
          hasChannels
            ? 'Select a channel from the list of your channels. Click create a Channel to create and publish a brand new channel.'
            : 'You have no channels yet. Click Craeate a Channel to start your very first channel.'
        }
      />

      <MemberChannelGrid>
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            avatarPhotoUrl={channel.avatarPhotoUrl}
            follows={channel.follows}
            handle={channel.handle}
          />
        ))}
        <ChannelCard createCard />
      </MemberChannelGrid>
    </Wrapper>
  )
}

export default SelectChannelView
