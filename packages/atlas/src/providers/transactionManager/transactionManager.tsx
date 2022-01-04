import React from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { SentryLogger } from '@/utils/logs'

import { useTransactionManagerStore } from './store'

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    dialogStep,
    actions: { removeOldBlockActions, setDialogStep },
  } = useTransactionManagerStore((state) => state)

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) return

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      const syncedActions = blockActions.filter((action) => indexerHead >= action.targetBlock)
      syncedActions.forEach((action) => {
        try {
          action.callback()
        } catch (e) {
          SentryLogger.error('Failed to execute tx sync callback', 'TransactionManager', e)
        }
      })

      removeOldBlockActions(indexerHead)
    },
  })
  return <TransactionModal status={dialogStep} onClose={() => setDialogStep(null)} />
}
