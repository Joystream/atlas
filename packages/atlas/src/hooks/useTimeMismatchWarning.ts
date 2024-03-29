import { useEffect } from 'react'

import { axiosInstance } from '@/api/axios'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSnackbar } from '@/providers/snackbars'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

const TIME_MISMATCH_ID = 'time-mismatch'

export const useTimeMismatchWarning = () => {
  const { displaySnackbar } = useSnackbar()
  const timeMismatchDisabled = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === TIME_MISMATCH_ID)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  useEffect(() => {
    if (!timeMismatchDisabled) {
      axiosInstance
        .get('https://worldtimeapi.org/api/ip')
        .then((response) => {
          const serverTime = response.data.unixtime * 1000
          const clientTime = Date.now()
          const timeDiff = serverTime - clientTime
          if (Math.abs(timeDiff) > 1000 * 60 * 5) {
            displaySnackbar({
              title: `Time mismatch detected`,
              description: `Set your system time to automatic matching your actual timezone to prevent errors with transactions.`,
              iconType: 'warning',
            })
            SentryLogger.error(`Time mismatch detected`, 'UseTimeMismatchWarning', ``, {
              details: {
                serverTime,
                clientTime,
              },
            })
          }
        })
        .catch(() => {
          ConsoleLogger.error('Failed to fetch global timestamp')
        })
    }
    updateDismissedMessages(TIME_MISMATCH_ID)
  }, [displaySnackbar, timeMismatchDisabled, updateDismissedMessages])
}
