import React, { useEffect, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { MintNftFirstTimeModal } from '@/components/_overlays/MintNftFirstTimeModal'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { SentryLogger } from '@/utils/logs'

import { useTransactionManagerStore } from './store'

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    dialogStep,
    showFirstMintDialog,
    errorCode,
    actions: { removeOldBlockActions, setDialogStep, setShowFistMintDialog, setErrorCode },
  } = useTransactionManagerStore((state) => state)
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const [lastIndexedBlock, setLastIndexedBlock] = useState(0)

  const handleFirstMintDialogClose = () => {
    updateDismissedMessages('first-mint')
    setShowFistMintDialog(false)
  }

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) {
        return
      }

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

  return (
    <>
      <MintNftFirstTimeModal show={showFirstMintDialog} onClose={handleFirstMintDialogClose} />
      <TransactionModal
        status={dialogStep}
        onClose={() => {
          setErrorCode(null)
          setDialogStep(null)
        }}
        errorCode={errorCode}
      />
    </>
  )
}
