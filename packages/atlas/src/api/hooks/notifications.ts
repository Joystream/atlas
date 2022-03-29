import { useGetNftNotificationsQuery } from '@/api/queries'

export const useRawNotifications = () => {
  const { data, ...rest } = useGetNftNotificationsQuery()

  return {
    notifications: data?.events || [],
    ...rest,
  }
}
