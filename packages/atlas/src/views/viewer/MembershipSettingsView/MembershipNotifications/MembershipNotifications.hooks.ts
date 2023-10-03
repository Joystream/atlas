import { mapValues, omit, pick } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import {
  useGetMembershipNotificationPreferencesQuery,
  useSetMembershipNotificationPreferencesMutation,
} from '@/api/queries/__generated__/notifications.generated'
import { NotificationsState } from '@/components/NotificationsTable'

export const useMemberSettingsData = () => {
  const { refetch, data: queryData, loading: isLoading } = useGetMembershipNotificationPreferencesQuery()
  const [mutate, { data: mutationData, loading: isSubmitting }] = useSetMembershipNotificationPreferencesMutation()

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
