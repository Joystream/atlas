import { FC, useState } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { useAsset } from '@/providers/assets/assets.hooks'

import { ListItemsWrapper, StyledListItem } from './YppAuthorizationSelectChannelStep.styles'

type YppAuthorizationSelectChannelStepProps = {
  channels: BasicChannelFieldsFragment[]
}

export const YppAuthorizationSelectChannelStep: FC<YppAuthorizationSelectChannelStepProps> = ({ channels }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  return (
    <ListItemsWrapper>
      {channels?.map((channel) => (
        <ChannelListItem
          key={channel.id}
          channel={channel}
          selected={selectedChannel === channel.id}
          onClick={() => setSelectedChannel(channel.id)}
        />
      ))}
    </ListItemsWrapper>
  )
}

type ChannelListItemProps = {
  channel: BasicChannelFieldsFragment
  selected: boolean
  onClick: () => void
}
const ChannelListItem: FC<ChannelListItemProps> = ({ channel, selected, onClick }) => {
  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)
  return (
    <StyledListItem
      onClick={onClick}
      nodeStart={<Avatar size="small" assetUrl={url} loading={isLoadingAsset} />}
      label={channel?.title ?? ''}
      caption={channel ? `${channel?.follows} followers` : undefined}
      selected={selected}
    />
  )
}
