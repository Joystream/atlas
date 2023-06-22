import { FC } from 'react'

import { Avatar } from '@/components/Avatar'

import { ListItemsWrapper, StyledListItem } from './YppAuthorizationSelectChannelStep.styles'

import { MemberChannel } from '../../YppAuthorizationModal.types'

type YppAuthorizationSelectChannelStepProps = {
  channels?: MemberChannel[]
  selectedChannelId: string | null
  onSelectChannel: (channelId: string) => void
}

export const YppAuthorizationSelectChannelStep: FC<YppAuthorizationSelectChannelStepProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
}) => {
  return (
    <ListItemsWrapper>
      {channels?.map((channel) => (
        <StyledListItem
          key={channel.id}
          onClick={() => onSelectChannel(channel.id)}
          nodeStart={<Avatar size={40} assetUrl={channel.avatarPhoto?.resolvedUrls} />}
          label={channel?.title ?? ''}
          caption={channel ? `${channel?.followsNum} followers` : undefined}
          selected={selectedChannelId === channel.id}
        />
      ))}
    </ListItemsWrapper>
  )
}
