import { omit } from 'lodash-es'
import { useMemo } from 'react'

import { useMembershipNotificationPreferencesQuery } from '@/api/queries/__generated__/notifications.generated'

export const useMemberSettingsData = () => {
  const { data, loading } = useMembershipNotificationPreferencesQuery()

  const notificationData = useMemo(() => {
    if (data?.accountData.notificationPreferences) {
      return omit(data.accountData.notificationPreferences, '__typename')
    }
  }, [data])

  return { isLoading: loading, data: notificationData }
}
