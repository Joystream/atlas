import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import { ChangeEvent, FC, ReactNode, useMemo } from 'react'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { formatDateAgo } from '@/utils/time'

import { NoActorNotificationAvatar } from './NoActorNotificationAvatar'
import {
  AvatarWrapper,
  CheckboxSkeleton,
  Content,
  IconWrapper,
  StyledIcon,
  StyledLink,
  StyledListItem,
  Title,
  Wrapper,
} from './NotificationTile.styles'

const getNotificationText = (notification: NotificationRecord): ReactNode => {
  switch (notification.type) {
    case 'bid-made':
      return (
        <>
          bid on your NFT for <NumberFormat as="span" value={notification.bidAmount} format="short" withToken />
        </>
      )
    case 'got-outbid':
      return (
        <>
          outbid you at <NumberFormat as="span" value={notification.bidAmount} format="short" withToken />
        </>
      )
    case 'bought':
      return (
        <>
          purchased your NFT for <NumberFormat as="span" value={notification.price} format="short" withToken />
        </>
      )
    case 'bid-accepted':
      return (
        <>
          has accepted your bid of <NumberFormat as="span" value={notification.bidAmount} format="short" withToken />
        </>
      )
    case 'auction-settled-owner':
      return 'Your auction has been settled'
    case 'auction-settled-winner':
      return 'Auction you have won has been settled'
    case 'auction-ended':
      return 'Auction you participated in has ended'
    case 'video-commented':
      return `commented on your video`
    case 'comment-reply':
      return `replied to your comment`
  }
}

export type NotificationProps = {
  notification: NotificationRecord
  loading?: boolean
  onCheckboxChange?: (selected: boolean, e: ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'compact'
  className?: string
}

export const NotificationTile: FC<NotificationProps> = ({
  notification,
  loading,
  onCheckboxChange,
  onClick,
  selected = false,
  variant = 'default',
  className,
}) => {
  const { date, video, member, read } = notification
  const { urls: avatarUrls } = getMemberAvatar(member)

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
      <StyledLink
        to={absoluteRoutes.viewer.video(notification.video.id, {
          ...(notification.type === 'video-commented' || notification.type === 'comment-reply'
            ? { commentId: notification.commentId }
            : {}),
        })}
        onClick={onClick}
      >
        <StyledListItem
          loading={loading}
          read={read}
          variant="compact"
          nodeStart={
            member ? (
              <NotifactionIcon avatarUrls={avatarUrls ?? []} iconType="nft" />
            ) : (
              <NoActorNotificationAvatar size="small" />
            )
          }
          caption={!loading ? formattedDate : <SkeletonLoader width="50%" height={19} />}
          label={
            !loading ? (
              <>
                {member && (
                  <Text as="span" variant="t100">
                    {`${member.handle} `}
                  </Text>
                )}
                <Text as="span" variant="t100">
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
      to={absoluteRoutes.viewer.video(notification.video.id)}
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
        {member ? (
          <NotifactionIcon avatarUrls={avatarUrls ?? []} iconType="nft" />
        ) : (
          <NoActorNotificationAvatar size="regular" />
        )}
      </AvatarWrapper>
      {!loading ? (
        <Content>
          <Title>
            {member && (
              <Text as="span" variant="h300" color="colorText">
                {`${member.handle} `}
              </Text>
            )}
            <Text as="span" variant="h300">
              {getNotificationText(notification)}
            </Text>
          </Title>
          <Text as="span" variant="t200" color="colorText">
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

type NotificationIconType = 'like' | 'dislike' | 'follow' | 'warning' | 'bell' | 'nft' | 'payout'

type NotifactionIconProps = {
  avatarUrls: string[]
  iconType: NotificationIconType
}

const notificationIconMapper: Record<NotificationIconType, any> = {
  bell: '',
  dislike: '',
  follow: '',
  like: '',
  nft: '',
  payout: '',
  warning: '',
}
export const NotifactionIcon = ({ iconType, avatarUrls }: NotifactionIconProps) => {
  return (
    <IconWrapper>
      <Avatar size={40} assetUrls={avatarUrls} />
      <StyledIcon />
    </IconWrapper>
  )
}
