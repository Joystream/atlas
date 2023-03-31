import { FC, useEffect, useRef, useState } from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks/queryNode'
import { MintNftFirstTimeModal } from '@/components/_overlays/MintNftFirstTimeModal'
import { TransactionModal } from '@/components/_overlays/TransactionModal'
import { ExtrinsicStatus } from '@/joystream-lib/types'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSnackbar } from '@/providers/snackbars'
import { useUserStore } from '@/providers/user/user.store'
import { SentryLogger } from '@/utils/logs'

import { METAPROTOCOL_SNACKBAR_ID } from './transactions.config'
import { useTransactionManagerStore } from './transactions.store'

export const TransactionsManager: FC = () => {
  const {
    transactions,
    showFirstMintDialog,
    actions: { removeOldBlockActions, setShowFistMintDialog, removeTransaction },
  } = useTransactionManagerStore((state) => state)

  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const userWalletName = useUserStore((state) => state.wallet?.title)

  const lastProcessedQnBlockRef = useRef(0)
  const { displaySnackbar, closeSnackbar } = useSnackbar()

  const anyMinimizedTransactionsPendingSignature = Object.values(transactions).find(
    (tx) => tx.isMinimized && tx.status === ExtrinsicStatus.Unsigned
  )

  const [cachedAnyMinimizedTransactionPendingSignature, setCachedAnyMinimizedTransactionPendingSignature] =
    useState(false)

  const firstNonMinimizedTransaction = Object.values(transactions).find((tx) => !tx.isMinimized)

  // manage minimized signature snackbar
  useEffect(() => {
    if (!!anyMinimizedTransactionsPendingSignature === cachedAnyMinimizedTransactionPendingSignature) {
      return
    }
    setCachedAnyMinimizedTransactionPendingSignature(!!anyMinimizedTransactionsPendingSignature)

    if (anyMinimizedTransactionsPendingSignature) {
      displaySnackbar({
        customId: METAPROTOCOL_SNACKBAR_ID,
        title: `Continue in ${userWalletName}`,
        description: `${anyMinimizedTransactionsPendingSignature.unsignedMessage} you need to sign the transaction in ${userWalletName} extension.`,
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
    userWalletName,
  ])

  const handleNewLastProcessedBlockRef = useRef(async (lastProcessedBlock: number) => {
    if (lastProcessedBlock === lastProcessedQnBlockRef.current) {
      return
    }
    lastProcessedQnBlockRef.current = lastProcessedBlock

    const blockActions = useTransactionManagerStore.getState().blockActions
    const syncedActions = blockActions.filter((action) => lastProcessedBlock >= action.targetBlock)

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

    removeOldBlockActions(lastProcessedBlock)
  })

  useQueryNodeStateSubscription({
    onData: ({ data: subscriptionData }) => {
      if (!subscriptionData.data) {
        return
      }
      const lastProcessedBlock = subscriptionData.data.processorState?.lastProcessedBlock
      handleNewLastProcessedBlockRef.current(lastProcessedBlock)
    },
  })

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
