import React, { useEffect, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { useTransactionManagerStore } from './store'

const SNACKBAR_ID = 'transaction-snackbar'

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    dialogStep,
    pendingSigns,
    actions: { removeOldBlockActions, setDialogStep },
  } = useTransactionManagerStore((state) => state)

  const [lastIndexedBlock, setLastIndexedBlock] = useState(0)
  const { displaySnackbar, updateSnackbar, closeSnackbar } = useSnackbar()

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

  useEffect(() => {
    if (pendingSigns.length === 1) {
      displaySnackbar({
        customId: SNACKBAR_ID,
        title: 'Continue in Polkadot',
        description: 'To leave your comment you need to sign the transaction in Polkadot extension.',
        iconType: 'loading',
        sticked: true,
      })
    }
    if (pendingSigns.length > 1) {
      updateSnackbar(SNACKBAR_ID, {
        title: `Continue in Polkadot (${pendingSigns.length})`,
        description: `You have ${pendingSigns.length} transactions pending for you signature in Polkadot extension.`,
      })
    }
    if (!pendingSigns.length) {
      closeSnackbar(SNACKBAR_ID)
    }
  }, [closeSnackbar, dialogStep, displaySnackbar, pendingSigns, updateSnackbar])
  return <TransactionModal status={dialogStep} onClose={() => setDialogStep(null)} />
}
