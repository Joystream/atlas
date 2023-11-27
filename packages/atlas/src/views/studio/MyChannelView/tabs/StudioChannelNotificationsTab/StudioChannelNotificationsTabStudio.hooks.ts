import { mapValues, omit, pick } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import {
  useGetChannelNotificationPreferencesQuery,
  useSetChannelNotificationPreferencesMutation,
} from '@/api/queries/__generated__/notifications.generated'
import { NotificationsState } from '@/components/NotificationsTable'

export const useChannelSettingsData = () => {
  const { refetch, data: queryData, loading: isLoading } = useGetChannelNotificationPreferencesQuery()
  const [mutate, { data: mutationData, loading: isSubmitting }] = useSetChannelNotificationPreferencesMutation()

  const data = useMemo(() => {
    const data = mutationData?.setAccountNotificationPreferences ?? queryData?.accountData.preferences
    if (data) {
      return mapValues(omit(data, '__typename'), (pref) => pick(pref, 'emailEnabled', 'inAppEnabled'))
    }
  }, [queryData, mutationData])

  const submit = useCallback(
    async (notificationPreferences: NotificationsState) => {
      const res = await mutate({ variables: { notificationPreferences } })
      refetch() // Invalidate the cache by refetching
      return res
    },
    [mutate, refetch]
  )

  return { isLoading, isSubmitting, data, submit }
}
