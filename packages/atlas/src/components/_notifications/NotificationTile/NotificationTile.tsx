import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import { FC, useMemo, useRef } from 'react'

import { SvgActionCheck, SvgActionMore } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { KebabMenuButtonIcon } from '@/components/_nft/NftTile/NftTileDetails.styles'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { formatDateAgo } from '@/utils/time'

import { NoActorNotificationAvatar } from './NoActorNotificationAvatar'
import { IconContainer, IconWrapper, StyledLink, StyledListItem } from './NotificationTile.styles'
import {
  NotificationIconType,
  notificationIconMapper,
  useNotificationAction,
  useNotificationAvatar,
  useNotificationUX,
} from './NotificationTile.utils'

export type NotificationProps = {
  notification: NotificationRecord
  loading?: boolean
  onClick?: () => void
  className?: string
  onMarkAsRead?: () => void
}

export const NotificationTile: FC<NotificationProps> = ({
  notification,
  loading,
  onClick,
  className,
  onMarkAsRead,
}) => {
  const { icon, action, avatar, text } = useNotificationUX(notification)
  const { date, read } = notification
  const { link = '', clickAction } = useNotificationAction(action)
  const { avatarUrls } = useNotificationAvatar(avatar)
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
      to={link}
      onClick={() => {
        onClick?.()
        onMarkAsRead?.()
        clickAction?.()
      }}
      onPointerLeave={() => contextMenuInstanceRef.current?.hide()}
    >
      <StyledListItem
        loading={loading}
        read={read}
        variant="compact"
        className={className}
        nodeStart={<NotifactionIcon avatarUrls={avatarUrls} iconType={icon} />}
        caption={!loading ? formattedDate : <SkeletonLoader width="50%" height={19} />}
        label={
          !loading ? (
            <Text as="span" variant="t100">
              {text}
            </Text>
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
              items={read ? [] : [{ label: 'Mark as read', nodeStart: <SvgActionCheck />, onClick: onMarkAsRead }]}
              trigger={null}
              triggerTarget={ref.current}
            />
          </div>
        }
      />
    </StyledLink>
  )
}

type NotifactionIconProps = {
  avatarUrls?: string[]
  iconType: NotificationIconType
}

export const NotifactionIcon = ({ iconType, avatarUrls }: NotifactionIconProps) => {
  const [icon, color] = notificationIconMapper[iconType]
  return (
    <IconWrapper>
      {avatarUrls ? <Avatar size={40} assetUrls={avatarUrls} /> : <NoActorNotificationAvatar size="small" />}
      <IconContainer className="notification-icon-container" color={color}>
        {icon}
      </IconContainer>
    </IconWrapper>
  )
}
