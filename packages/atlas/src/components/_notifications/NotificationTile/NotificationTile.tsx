import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { StyledLink } from '@/components/_video/VideoTileDetails/VideoTileDetails.styles'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'
import { NotificationRecord } from '@/providers/notifications'
import { formatNumberShort } from '@/utils/number'
import { formatDateAgo } from '@/utils/time'

import {
  AvatarWrapper,
  CheckboxSkeleton,
  Content,
  ContentLink,
  StyledListItem,
  Title,
  Wrapper,
} from './NotificationTile.styles'

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
      <StyledLink to={absoluteRoutes.viewer.video(notification.video.id)}>
        <StyledListItem
          loading={loading}
          read={read}
          variant="compact"
          onClick={onClick}
          nodeStart={
            !loading ? (
              <Link to={absoluteRoutes.viewer.member(notification.member.handle)}>
                <Avatar size="default" assetUrl={avatarUrl} loading={isLoadingAvatar} clickable />
              </Link>
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
      </StyledLink>
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
          <Link to={absoluteRoutes.viewer.member(notification.member.handle)}>
            <Avatar size="small" assetUrl={avatarUrl} loading={isLoadingAvatar} clickable />
          </Link>
        ) : (
          <SkeletonLoader width={40} height={40} rounded />
        )}
      </AvatarWrapper>
      {!loading ? (
        <ContentLink to={absoluteRoutes.viewer.video(notification.video.id)}>
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
        </ContentLink>
      ) : (
        <Content>
          <SkeletonLoader width="40%" height={24} bottomSpace={2} />
          <SkeletonLoader width="50%" height={20} />
        </Content>
      )}
    </Wrapper>
  )
}
