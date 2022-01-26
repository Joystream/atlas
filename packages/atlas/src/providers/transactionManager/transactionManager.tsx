import React, { useEffect, useState } from 'react'

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

  const [lastIndexedBlock, setLastIndexedBlock] = useState(0)

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) return

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      setLastIndexedBlock(indexerHead)
    },
  })

  // run due actions
  useEffect(() => {
    const syncedActions = blockActions.filter((action) => lastIndexedBlock >= action.targetBlock)

    if (!syncedActions.length) {
      return
    }

    syncedActions.forEach((action) => {
      try {
        action.callback()
      } catch (e) {
        SentryLogger.error('Failed to execute tx sync callback', 'TransactionManager', e)
      }
    })

    removeOldBlockActions(lastIndexedBlock)
  }, [blockActions, lastIndexedBlock, removeOldBlockActions])

  return <TransactionModal status={dialogStep} onClose={() => setDialogStep(null)} />
}
