import { FC } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { useAsset } from '@/providers/assets/assets.hooks'

import { ListItemsWrapper, StyledListItem } from './YppAuthorizationSelectChannelStep.styles'

type YppAuthorizationSelectChannelStepProps = {
  channels?: BasicChannelFieldsFragment[]
  selectedChannel: string | null
  onSelectChannel: (channel: string) => void
}

export const YppAuthorizationSelectChannelStep: FC<YppAuthorizationSelectChannelStepProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
}) => {
  return (
    <ListItemsWrapper>
      {channels?.map((channel) => (
        <ChannelListItem
          key={channel.id}
          channel={channel}
          selected={selectedChannel === channel.id}
          onClick={() => onSelectChannel(channel.id)}
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
