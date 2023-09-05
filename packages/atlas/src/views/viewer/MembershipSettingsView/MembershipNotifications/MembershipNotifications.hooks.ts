import { mapValues, omit, pick } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import {
  useMembershipNotificationPreferencesQuery,
  useSetMembershipNotificationPreferencesMutation,
} from '@/api/queries/__generated__/notifications.generated'
import { NotificationsState } from '@/components/NotificationsTable'

export const useMemberSettingsData = () => {
  const { refetch, data: queryData, loading: isLoading } = useMembershipNotificationPreferencesQuery()
  const [mutate, { data: mutationData, loading: isSubmitting }] = useSetMembershipNotificationPreferencesMutation()

  const data = useMemo(() => {
    if (mutationData?.setAccountNotificationPreferences) {
      return omit(mutationData?.setAccountNotificationPreferences, '__typename')
    }
    if (queryData?.accountData.notificationPreferences) {
      return mapValues(omit(queryData.accountData.notificationPreferences, '__typename'), (pref) =>
        pick(pref, 'emailEnabled', 'inAppEnabled')
      )
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
