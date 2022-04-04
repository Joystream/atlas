import React, { useEffect, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { ExtrinsicStatus } from '@/joystream-lib'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { useTransactionManagerStore } from './store'

const SNACKBAR_ID = 'transaction-snackbar'
const MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT = 7000

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    dialogStep,
    minimized,
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
    if (!minimized) {
      return
    }
    if (dialogStep === ExtrinsicStatus.Unsigned) {
      if (pendingSigns.length === 1) {
        displaySnackbar({
          customId: SNACKBAR_ID,
          title: 'Continue in Polkadot',
          description: minimized.signMessage,
          iconType: 'loading',
          sticked: true,
        })
      }
    }
    if (pendingSigns.length > 1 || (pendingSigns.length === 1 && dialogStep !== ExtrinsicStatus.Unsigned)) {
      updateSnackbar(SNACKBAR_ID, {
        title: `Continue in Polkadot ${pendingSigns.length === 1 ? '' : `(${pendingSigns.length})`}`,
        description:
          pendingSigns.length === 1
            ? minimized.signMessage
            : `You have ${pendingSigns.length} transactions pending for you signature in Polkadot extension.`,
      })
    }
    if (
      dialogStep === ExtrinsicStatus.Signed ||
      (dialogStep === ExtrinsicStatus.Error && !pendingSigns.length) ||
      (!dialogStep && !pendingSigns.length)
    ) {
      closeSnackbar(SNACKBAR_ID)
    }
    if (dialogStep === ExtrinsicStatus.Error) {
      displaySnackbar({
        title: 'Something went wrong',
        description: minimized.signErrorMessage,
        iconType: 'error',
        timeout: MINIMIZED_SIGN_CANCELLED_SNACKBAR_TIMEOUT,
      })
    }
  }, [closeSnackbar, dialogStep, displaySnackbar, minimized, pendingSigns, updateSnackbar])

  if (minimized) {
    return null
  }

  return <TransactionModal status={dialogStep} onClose={() => setDialogStep(null)} />
}
