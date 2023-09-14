import { useEffect } from 'react'

import { NotificationsViewContent } from '@/components/_notifications/NotificationsViewContent'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

export const MemberNotificationsView = () => {
  const headTags = useHeadTags('Member notifications')

  const useNotificationsParams = useNotifications({
    notifyOnNetworkStatusChange: true,
  })

  const { notifications, setLastSeenNotificationDate } = useNotificationsParams
  const firstNotification = notifications[0]
  // set last seen notification block to first notification to manage the badge for notification button
  useEffect(() => {
    if (!firstNotification) return
    setLastSeenNotificationDate(firstNotification.date)
  }, [firstNotification, setLastSeenNotificationDate])

  const unreadNumber = notifications.filter((notification) => !notification.read).length

  return (
    <>
      {headTags}
      <NotificationsViewContent type="member" {...useNotificationsParams} unreadNumber={unreadNumber} />
    </>
  )
}
