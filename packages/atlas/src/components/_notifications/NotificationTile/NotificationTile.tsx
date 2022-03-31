import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import React, { useMemo } from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMemberAvatar } from '@/providers/assets'
import { NotificationRecord } from '@/providers/notifications'
import { formatNumberShort } from '@/utils/number'
import { formatDateAgo } from '@/utils/time'

import { AvatarWrapper, CheckboxSkeleton, Content, StyledListItem, Title, Wrapper } from './NotificationTile.styles'

const getNotificationText = (notification: NotificationRecord): string => {
  switch (notification.type) {
    case 'bid-made':
      return `bid on NFT for ${formatNumberShort(notification.bidAmount)} tJOY`
    case 'bought':
      return 'purchased NFT'
    case 'open-auction-ended':
      return 'finished NFT sale'
  }
}

export type NotificationProps = {
  notification: NotificationRecord
  loading?: boolean
  onCheckboxChange?: (selected: boolean) => void
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'compact'
  className?: string
}

export const NotificationTile: React.FC<NotificationProps> = ({
  notification,
  loading,
  onCheckboxChange,
  onClick,
  selected = false,
  variant = 'default',
  className,
}) => {
  const { date, video, member, read } = notification
  const { url: avatarUrl, isLoadingAsset: isLoadingAvatar } = useMemberAvatar(member)

  const formattedDate = useMemo(() => {
    const differenceDays = differenceInDays(new Date(), date)
    const differenceYears = differenceInCalendarYears(new Date(), date)
    if (differenceYears >= 1) {
      return format(date, 'dd LLL yyyy')
    }
    if (differenceDays > 3) {
      return format(date, 'LLL d')
    }
    return formatDateAgo(date)
  }, [date])

  if (variant === 'compact') {
    return (
      <StyledListItem
        loading={loading}
        read={read}
        variant="compact"
        onClick={onClick}
        nodeStart={
          !loading ? (
            <Avatar size="default" assetUrl={avatarUrl} loading={isLoadingAvatar} />
          ) : (
            <SkeletonLoader width={32} height={32} rounded />
          )
        }
        caption={!loading ? `${formattedDate} • ${video.title}` : <SkeletonLoader width="50%" height={19} />}
        label={
          !loading ? (
            <>
              <Text as="span" variant="t200-strong" secondary>
                {`${member.handle} `}
              </Text>
              <Text as="span" variant="t200-strong">
                {getNotificationText(notification)}
              </Text>
            </>
          ) : (
            <SkeletonLoader width="40%" height={20} bottomSpace={2} />
          )
        }
      />
    )
  }

  return (
    <Wrapper
      read={read}
      selected={selected}
      loading={loading}
      className={className}
      variant="default"
      onClick={onClick}
    >
      {!loading ? (
        <Checkbox onChange={onCheckboxChange} value={selected} />
      ) : (
        <CheckboxSkeleton width={16} height={16} />
      )}
      <AvatarWrapper>
        {!loading ? (
          <Avatar size="small" assetUrl={avatarUrl} loading={isLoadingAvatar} />
        ) : (
          <SkeletonLoader width={40} height={40} rounded />
        )}
      </AvatarWrapper>
      {!loading ? (
        <Content>
          <Title>
            <Text as="span" variant="h300" secondary>
              {`${member.handle} `}
            </Text>
            <Text as="span" variant="h300">
              {getNotificationText(notification)}
            </Text>
          </Title>
          <Text variant="t200" secondary>
            {formattedDate} • {video.title}
          </Text>
        </Content>
      ) : (
        <Content>
          <SkeletonLoader width="40%" height={24} bottomSpace={2} />
          <SkeletonLoader width="50%" height={20} />
        </Content>
      )}
    </Wrapper>
  )
}
