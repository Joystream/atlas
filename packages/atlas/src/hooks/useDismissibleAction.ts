import { useCallback } from 'react'

import { usePersonalDataStore } from '@/providers/personalData'

export const useDismissibleAction = (id: string) => {
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === id)
  )
  const _updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const updateDismissedMessages = useCallback(
    (value: boolean) => _updateDismissedMessages(id, value),
    [_updateDismissedMessages, id]
  )

  return [isDismissedMessage, updateDismissedMessages] as const
}
