import { FC, useMemo } from 'react'

import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionAddChannel, SvgActionChevronL } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { IconWrapper } from '@/components/IconWrapper'
import { ListItem } from '@/components/ListItem'

import { SectionContainer } from './MemberDropdown.styles'
import { SwitchMemberItemListContainer } from './MemberDropdownList.styles'
import { Badge } from './MemberDropdownNav.styles'

type DropdownType = 'member' | 'channel'

type MemberDropdownListProps = {
  type: DropdownType
  activeMembership?: FullMembershipFieldsFragment | null
  channelNotificationCounts?: Map<string, number>
  channelId: string | null
  onAddNewChannel?: () => void
  onChannelChange?: (channelId: string) => void
  onSwitchToNav: (type: DropdownType) => void
}
export const MemberDropdownList: FC<MemberDropdownListProps> = ({
  type,
  channelId,
  channelNotificationCounts,
  activeMembership,
  onAddNewChannel,
  onSwitchToNav,
  onChannelChange,
}) => {
  const sortedMemberChannels = useMemo(() => {
    if (!activeMembership) {
      return []
    }
    return activeMembership.channels.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }, [activeMembership])

  return (
    <div>
      <SwitchMemberItemListContainer>
        <ListItem
          onClick={() => onSwitchToNav(type)}
          nodeStart={<SvgActionChevronL />}
          label={type === 'channel' ? 'Switch channels' : 'My channels'}
        />
      </SwitchMemberItemListContainer>
      <SectionContainer>
        {sortedMemberChannels.map((channel) => {
          const isSelected = type === 'channel' ? channel.id === channelId : false
          return (
            <ListItem
              key={channel.id}
              onClick={() => onChannelChange?.(channel.id)}
              nodeStart={<Avatar assetUrls={channel.avatarPhoto?.resolvedUrls} size={32} />}
              label={channel?.title ?? ''}
              caption={channel ? `${channel?.followsNum} followers` : undefined}
              selected={isSelected}
              nodeEnd={
                type === 'channel' && !isSelected && <Badge data-badge={channelNotificationCounts?.get(channel.id)} />
              }
            />
          )
        })}
        <ListItem
          nodeStart={<IconWrapper icon={<SvgActionAddChannel />} />}
          onClick={() => onAddNewChannel?.()}
          label="Add new channel..."
        />
      </SectionContainer>
    </div>
  )
}
