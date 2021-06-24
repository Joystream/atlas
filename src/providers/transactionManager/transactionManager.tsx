import React from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { Logger } from '@/utils/logger'

import { useTransactionManagerStore } from './store'

export const TransactionManager: React.FC = () => {
  const {
    syncCallbacks,
    dialogStep,
    actions: { removeOldCallbacks, setDialogStep },
  } = useTransactionManagerStore((state) => state)

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) return

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      const syncedCallbacks = syncCallbacks.filter((cb) => indexerHead >= cb.targetBlock)
      syncedCallbacks.forEach((cb) => {
        try {
          cb.callback()
        } catch (e) {
          Logger.error('Failed to execute tx sync callback', e)
        }
      })

      removeOldCallbacks(indexerHead)
    },
  })

  return <TransactionDialog status={dialogStep} onClose={() => setDialogStep(null)} />
}
