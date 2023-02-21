import { FC } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { useAsset } from '@/providers/assets/assets.hooks'

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
        <ChannelListItem
          key={channel.id}
          channel={channel}
          selected={selectedChannelId === channel.id}
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
      caption={channel ? `${channel?.followsNum} followers` : undefined}
      selected={selected}
    />
  )
}
