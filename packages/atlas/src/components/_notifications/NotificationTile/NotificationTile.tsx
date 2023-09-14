import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import { FC, ReactElement, ReactNode, useMemo, useRef } from 'react'

import {
  SvgActionAddVideo,
  SvgActionCheck,
  SvgActionCouncil,
  SvgActionDislikeOutline,
  SvgActionInformative,
  SvgActionLikeOutline,
  SvgActionMore,
  SvgActionNft,
  SvgActionNotifications,
  SvgActionPlaceholder,
  SvgActionRevenueShare,
} from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { KebabMenuButtonIcon } from '@/components/_nft/NftTile/NftTileDetails.styles'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { formatDateAgo } from '@/utils/time'

import { NoActorNotificationAvatar } from './NoActorNotificationAvatar'
import { IconContainer, IconWrapper, StyledLink, StyledListItem } from './NotificationTile.styles'

const getNotificationText = (notification: NotificationRecord): ReactNode => {
  switch (notification.type) {
    case 'bid-made':
      return (
        <>
          bid on your NFT for{' '}
          <NumberFormat as="span" value={notification.bidAmount} format="short" withToken withDenomination="before" />
        </>
      )
    case 'got-outbid':
      return (
        <>
          outbid you at{' '}
          <NumberFormat as="span" value={notification.bidAmount} format="short" withToken withDenomination="before" />
        </>
      )
    case 'bought':
      return (
        <>
          purchased your NFT for{' '}
          <NumberFormat as="span" value={notification.price} format="short" withToken withDenomination="before" />
        </>
      )
    case 'bid-accepted':
      return (
        <>
          has accepted your bid of{' '}
          <NumberFormat as="span" value={notification.bidAmount} format="short" withToken withDenomination="before" />
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
  onClick?: () => void
  className?: string
  onMarkAsRead?: () => void
  onMarkAsUnread?: () => void
}

export const NotificationTile: FC<NotificationProps> = ({
  notification,
  loading,
  onClick,
  className,
  onMarkAsRead,
  onMarkAsUnread,
}) => {
  const { date, member, read } = notification
  const { urls: avatarUrls } = getMemberAvatar(member)
  const ref = useRef<HTMLButtonElement>(null)
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
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

  return (
    <StyledLink
      to={absoluteRoutes.viewer.video(notification.video.id, {
        ...(notification.type === 'video-commented' || notification.type === 'comment-reply'
          ? { commentId: notification.commentId }
          : {}),
      })}
      onClick={() => {
        onClick?.()
        onMarkAsRead?.()
      }}
      onPointerLeave={() => contextMenuInstanceRef.current?.hide()}
    >
      <StyledListItem
        loading={loading}
        read={read}
        variant="compact"
        className={className}
        nodeStart={
          member ? (
            <NotifactionIcon avatarUrls={avatarUrls ?? []} iconType={getNotificationIcon(notification)} />
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
        nodeEnd={
          <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <KebabMenuButtonIcon
              ref={ref}
              icon={<SvgActionMore />}
              variant="tertiary"
              size="small"
              isActive={!loading}
              className="kebab-button"
            />
            <ContextMenu
              ref={contextMenuInstanceRef}
              appendTo={ref.current ?? undefined}
              placement="bottom-end"
              flipEnabled={false}
              disabled={loading}
              items={[
                read
                  ? {
                      label: 'Mark as unread',
                      nodeStart: <SvgActionCheck />,
                      onClick: onMarkAsUnread,
                    }
                  : {
                      label: 'Mark as read',
                      nodeStart: <SvgActionCheck />,
                      onClick: onMarkAsRead,
                    },
              ]}
              trigger={null}
              triggerTarget={ref.current}
            />
          </div>
        }
      />
    </StyledLink>
  )
}

type NotificationIconType = 'like' | 'dislike' | 'follow' | 'warning' | 'bell' | 'nft' | 'payout' | 'reaction' | 'video'

type NotifactionIconProps = {
  avatarUrls: string[]
  iconType: NotificationIconType
}

const notificationIconMapper: Record<NotificationIconType, [ReactElement, 'red' | 'blue' | 'green' | 'gray']> = {
  bell: [<SvgActionNotifications key={1} />, 'gray'],
  dislike: [<SvgActionDislikeOutline key={1} />, 'red'],
  follow: [<SvgActionCouncil key={1} />, 'blue'],
  reaction: [<SvgActionPlaceholder key={1} />, 'blue'],
  like: [<SvgActionLikeOutline key={1} />, 'blue'],
  nft: [<SvgActionNft key={1} />, 'green'],
  payout: [<SvgActionRevenueShare key={1} />, 'green'],
  warning: [<SvgActionInformative key={1} />, 'gray'],
  video: [<SvgActionAddVideo key={1} />, 'blue'],
}

const getNotificationIcon = (notification: NotificationRecord): NotificationIconType => {
  switch (notification.type) {
    case 'bought':
    case 'bid-accepted':
    case 'got-outbid':
    case 'auction-settled-winner':
    case 'auction-ended':
    case 'auction-settled-owner':
    case 'bid-made':
      return 'nft'
    case 'video-commented':
    case 'comment-reply':
      return 'reaction'
    default:
      return 'bell'
  }
}
export const NotifactionIcon = ({ iconType, avatarUrls }: NotifactionIconProps) => {
  const [icon, color] = notificationIconMapper[iconType]
  return (
    <IconWrapper>
      <Avatar size={40} assetUrls={avatarUrls} />
      <IconContainer className="notification-icon-container" color={color}>
        {icon}
      </IconContainer>
    </IconWrapper>
  )
}
