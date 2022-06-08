import React, { useEffect, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { MintNftFirstTimeModal } from '@/components/_overlays/MintNftFirstTimeModal'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { ExtrinsicStatus } from '@/joystream-lib'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'

import { METAPROTOCOL_SNACKBAR_ID } from './transactions.config'
import { useTransactionManagerStore } from './transactions.store'

export const TransactionsManager: React.FC = () => {
  const {
    blockActions,
    transactions,
    showFirstMintDialog,
    actions: { removeOldBlockActions, setShowFistMintDialog, removeTransaction },
  } = useTransactionManagerStore((state) => state)

  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const [lastIndexedBlock, setLastIndexedBlock] = useState(0)
  const { displaySnackbar, closeSnackbar } = useSnackbar()

  const anyMinimizedTransactionsPendingSignature = Object.values(transactions).some(
    (tx) => tx.isMinimized && tx.status === ExtrinsicStatus.Unsigned
  )
  const [cachedAnyMinimizedTransactionPendingSignature, setCachedAnyMinimizedTransactionPendingSignature] =
    useState(false)

  const firstNonMinimizedTransaction = Object.values(transactions).find((tx) => !tx.isMinimized)

  // manage minimized signature snackbar
  useEffect(() => {
    if (anyMinimizedTransactionsPendingSignature === cachedAnyMinimizedTransactionPendingSignature) {
      return
    }
    setCachedAnyMinimizedTransactionPendingSignature(anyMinimizedTransactionsPendingSignature)

    if (anyMinimizedTransactionsPendingSignature) {
      displaySnackbar({
        customId: METAPROTOCOL_SNACKBAR_ID,
        title: 'Continue in Polkadot',
        description: 'To leave your comment or reaction you need to sign the transaction in Polkadot extension.',
        iconType: 'loading',
        sticked: true,
      })
    } else {
      closeSnackbar(METAPROTOCOL_SNACKBAR_ID)
    }
  }, [
    anyMinimizedTransactionsPendingSignature,
    cachedAnyMinimizedTransactionPendingSignature,
    closeSnackbar,
    displaySnackbar,
  ])

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) {
        return
      }

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      setLastIndexedBlock(indexerHead)
    },
  })

  // run block actions based on QN synced block height
  useEffect(() => {
    const syncedActions = blockActions.filter((action) => lastIndexedBlock >= action.targetBlock)

    if (!syncedActions.length) {
      return
    }

    syncedActions.forEach((action) => {
      try {
        action.callback()
      } catch (e) {
        SentryLogger.error('Failed to execute tx sync callback', 'TransactionsManager', e)
      }
    })

    removeOldBlockActions(lastIndexedBlock)
  }, [blockActions, lastIndexedBlock, removeOldBlockActions])

  const handleFirstMintDialogClose = () => {
    updateDismissedMessages('first-mint')
    setShowFistMintDialog(false)
  }

  return (
    <>
      <MintNftFirstTimeModal show={showFirstMintDialog} onClose={handleFirstMintDialogClose} />
      {firstNonMinimizedTransaction && (
        <TransactionModal
          status={firstNonMinimizedTransaction.status}
          onClose={() => removeTransaction(firstNonMinimizedTransaction.id)}
          errorCode={firstNonMinimizedTransaction.errorCode}
        />
      )}
    </>
  )
}
