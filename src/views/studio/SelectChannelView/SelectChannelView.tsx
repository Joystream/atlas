import routes from '@/config/routes'
import { StudioCard, StudioHeader } from '@/shared/components'
import React, { useState } from 'react'
import { MemberChannelGrid, Wrapper } from './SelectChannelView.style'

type Channel = {
  id: number
  handle: string
  follows: number
  avatarPhotoUrl: string
}

const SelectChannelView = () => {
  const [channels, setChannels] = useState<Channel[] | null>(null)
  const hasChannels = !!channels?.length
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
        {channels?.map((channel) => (
          <StudioCard
            variant="channel"
            key={channel.id}
            avatarPhotoUrl={channel.avatarPhotoUrl}
            follows={channel.follows}
            handle={channel.handle}
          />
        ))}
        <StudioCard blank variant="channel" handle="Create a Channel" to={routes.newChannel()} />
      </MemberChannelGrid>
    </Wrapper>
  )
}

export default SelectChannelView
